// backend/services/applicationExecutors.js
const axios = require("axios");
const FormData = require("form-data");

const GREENHOUSE_API_BASE_URL = "https://boards-api.greenhouse.io/v1";
const LEVER_API_BASE_URL = "https://api.lever.co/v1";

/* -------------------------------------------------------
   Platform Detection
------------------------------------------------------- */
const detectPlatform = (jobLink = "") => {
  const link = `${jobLink}`.toLowerCase();

  if (link.includes("greenhouse.io")) return "Greenhouse";
  if (link.includes("lever.co")) return "Lever";
  if (link.includes("workday")) return "Workday";
  if (link.includes("linkedin.com")) return "LinkedIn";

  return "Unknown";
};

const detectApplyStrategy = (jobLink = "") => {
  const platform = detectPlatform(jobLink);

  if (platform === "Greenhouse" || platform === "Lever") {
    return {
      platform,
      applyStrategy: "api_supported",
      externalApplySupported: true,
    };
  }

  if (platform === "Workday" || platform === "LinkedIn") {
    return {
      platform,
      applyStrategy: "browser_required",
      externalApplySupported: false,
    };
  }

  return {
    platform,
    applyStrategy: "manual_redirect",
    externalApplySupported: false,
  };
};

/* -------------------------------------------------------
   Greenhouse Integration
------------------------------------------------------- */
const splitCandidateName = (fullName = "") => {
  const parts = `${fullName}`.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "Applicant",
  };
};

const parseGreenhouseJobLink = (jobLink = "") => {
  try {
    const url = new URL(jobLink);
    const segments = url.pathname.split("/").filter(Boolean);
    const jobsIndex = segments.indexOf("jobs");

    return {
      boardToken: segments[0],
      jobPostId:
        url.searchParams.get("gh_jid") ||
        (jobsIndex >= 0 ? segments[jobsIndex + 1] : undefined),
      mappedUrlToken: url.searchParams.get("gh_src"),
    };
  } catch {
    return {};
  }
};

const submitToGreenhouse = async ({ job, user }) => {
  const apiKey = process.env.GREENHOUSE_JOB_BOARD_API_KEY;

  if (!apiKey) {
    return {
      submissionType: "external_api",
      submissionStatus: "manual_required",
      notes: "Greenhouse detected but API key is missing.",
    };
  }

  const { boardToken, jobPostId, mappedUrlToken } =
    parseGreenhouseJobLink(job.link);

  if (!boardToken || !jobPostId) {
    return {
      submissionType: "external_api",
      submissionStatus: "manual_required",
      notes: "Unable to extract Greenhouse identifiers.",
    };
  }

  try {
    const { firstName, lastName } = splitCandidateName(user.name);

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      phone: user.profile?.phone,
      resume_url: user.profile?.resumeUrl,
      resume_url_filename: user.profile?.resumeName || "resume.pdf",
      mapped_url_token: mappedUrlToken,
    };

    const response = await axios.post(
      `${GREENHOUSE_API_BASE_URL}/boards/${boardToken}/jobs/${jobPostId}`,
      payload,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      submissionType: "external_api",
      submissionStatus: "submitted",
      externalSubmissionId: response.data?.id,
      notes: "Submitted to Greenhouse successfully.",
    };
  } catch (error) {
    return {
      submissionType: "external_api",
      submissionStatus: "failed",
      lastSubmissionError:
        error.response?.data?.message || error.message,
      notes: "Greenhouse submission failed.",
    };
  }
};

/* -------------------------------------------------------
   Lever Integration
------------------------------------------------------- */
const parseLeverJobLink = (jobLink = "") => {
  try {
    const url = new URL(jobLink);
    const segments = url.pathname.split("/").filter(Boolean);

    if (
      (url.hostname === "jobs.lever.co" || url.hostname.endsWith(".lever.co")) &&
      segments.length >= 2
    ) {
      return { postingId: segments[1] };
    }
    return {};
  } catch {
    return {};
  }
};

const buildLeverAuthHeader = (apiKey) =>
  `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;

const uploadResumeToLever = async ({ apiKey, resumeUrl, resumeName }) => {
  const fileResponse = await axios.get(resumeUrl, {
    responseType: "arraybuffer",
  });

  const formData = new FormData();
  formData.append("file", fileResponse.data, resumeName || "resume.pdf");

  const response = await axios.post(
    `${LEVER_API_BASE_URL}/uploads`,
    formData,
    {
      headers: {
        Authorization: buildLeverAuthHeader(apiKey),
        ...formData.getHeaders(),
      },
    }
  );

  return response.data?.data?.uri;
};

const submitToLever = async ({ job, user }) => {
  const apiKey = process.env.LEVER_API_KEY;

  if (!apiKey) {
    return {
      submissionType: "external_api",
      submissionStatus: "manual_required",
      notes: "Lever detected but API key is missing.",
    };
  }

  const { postingId } = parseLeverJobLink(job.link);

  if (!postingId) {
    return {
      submissionType: "external_api",
      submissionStatus: "manual_required",
      notes: "Unable to extract Lever posting ID.",
    };
  }

  try {
    const resumeUri = await uploadResumeToLever({
      apiKey,
      resumeUrl: user.profile?.resumeUrl,
      resumeName: user.profile?.resumeName,
    });

    const payload = {
      personalInformation: [
        { name: "fullName", value: user.name },
        { name: "email", value: user.email },
        { name: "phone", value: user.profile?.phone },
        { name: "resume", value: resumeUri },
      ],
      urls: [
        { name: "LinkedIn", value: user.profile?.linkedin },
        { name: "GitHub", value: user.profile?.github },
        { name: "Portfolio", value: user.profile?.portfolio },
      ],
      source: "JobGenie Auto Apply",
    };

    const response = await axios.post(
      `${LEVER_API_BASE_URL}/postings/${postingId}/apply`,
      payload,
      {
        headers: {
          Authorization: buildLeverAuthHeader(apiKey),
          "Content-Type": "application/json",
        },
      }
    );

    return {
      submissionType: "external_api",
      submissionStatus: "submitted",
      externalSubmissionId:
        response.data?.data?.applicationId,
      notes: "Submitted to Lever successfully.",
    };
  } catch (error) {
    return {
      submissionType: "external_api",
      submissionStatus: "failed",
      lastSubmissionError:
        error.response?.data?.error || error.message,
      notes: "Lever submission failed.",
    };
  }
};

/* -------------------------------------------------------
   Main Executor
------------------------------------------------------- */
const executeExternalSubmission = async ({ job, user }) => {
  const platform = job.platform || detectPlatform(job.link);
  const strategy =
    job.applyStrategy || detectApplyStrategy(job.link).applyStrategy;

  if (platform === "Greenhouse") {
    return submitToGreenhouse({ job, user });
  }

  if (platform === "Lever") {
    return submitToLever({ job, user });
  }

  if (strategy === "api_supported") {
    return {
      submissionType: "external_api",
      submissionStatus: "manual_required",
      notes:
        "API-supported platform detected, but adapter not implemented yet.",
    };
  }

  if (strategy === "browser_required") {
    return {
      submissionType: "browser_automation",
      submissionStatus: "manual_required",
      notes:
        "Requires browser automation and login to complete submission.",
    };
  }

  return {
    submissionType: "manual_redirect",
    submissionStatus: "manual_required",
    notes:
      "Open the job link and complete the application manually.",
  };
};

module.exports = {
  detectPlatform,
  detectApplyStrategy,
  executeExternalSubmission,
  parseGreenhouseJobLink,
  parseLeverJobLink,
};