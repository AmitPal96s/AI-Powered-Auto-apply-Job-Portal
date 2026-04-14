const axios = require("axios");
const User = require("../models/User");
const Job = require("../models/job");
const { getSkillSuggestions } = require("../services/skillSuggestionService");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const GEMINI_CHAT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const normalizeList = (items = []) =>
  [...new Set(items.map((item) => `${item}`.trim().toLowerCase()).filter(Boolean))];

const titleCase = (value = "") =>
  `${value}`
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatSkills = (skills = [], emptyLabel = "your current skills") => {
  if (!skills.length) {
    return emptyLabel;
  }

  if (skills.length === 1) {
    return skills[0];
  }

  if (skills.length === 2) {
    return `${skills[0]} and ${skills[1]}`;
  }

  return `${skills.slice(0, 2).join(", ")}, and ${skills[2]}${skills.length > 3 ? " more" : ""}`;
};

const stripCodeFences = (value = "") =>
  `${value}`.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();

const buildChatSystemPrompt = (context = {}) => {
  const { skills = [], preferences = {}, profile = {}, name = "" } = context;

  return [
    "You are JobGenie AI, a career assistant inside a job portal.",
    "Answer the user's latest question directly and naturally.",
    "Tailor advice to careers, resume writing, interview prep, job search strategy, skill gaps, and profile improvement.",
    "If the user asks for steps, use a short numbered list.",
    "If the user asks a question that needs clarification, ask one clear follow-up question.",
    "Keep answers concise, practical, and specific.",
    `User name: ${name || "not provided"}.`,
    `User skills: ${formatSkills(skills, "not provided")}.`,
    `Preferred role: ${preferences.jobTitle || profile.preferredRole || "not provided"}.`,
    `Preferred location: ${preferences.location || profile.preferredLocation || "not provided"}.`,
    `Profile headline: ${profile.headline || "not provided"}.`,
  ].join(" ");
};

const buildInsightsSystemPrompt = (context = {}) => {
  const { skills = [], preferences = {}, profile = {} } = context;

  return [
    "You are an AI career insights engine for a job portal.",
    "Return JSON only with this exact shape:",
    '{"insights":["short actionable insight"],"suggestedSkills":["skill1","skill2","skill3"]}',
    "Do not include markdown, code fences, or extra keys.",
    "Make the insights personalized, concise, and practical.",
    `Current skills: ${formatSkills(skills, "none")}.`,
    `Preferred role: ${preferences.jobTitle || profile.preferredRole || "not provided"}.`,
    `Preferred location: ${preferences.location || profile.preferredLocation || "not provided"}.`,
    `Headline: ${profile.headline || "not provided"}.`,
    `Bio: ${profile.bio || "not provided"}.`,
  ].join(" ");
};

const buildGeminiContents = (messages = []) =>
  (Array.isArray(messages) ? messages : [])
    .slice(-12)
    .filter(
      (message) =>
        message &&
        typeof message.content === "string" &&
        ["user", "assistant", "model"].includes(message.role)
    )
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

const extractGeminiText = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => `${part?.text || ""}`.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
};

const callGeminiChat = async ({
  messages,
  systemPrompt,
  maxTokens = 500,
  temperature = 0.7,
}) => {
  if (!GEMINI_API_KEY) {
    return null;
  }

  const contents = buildGeminiContents(messages);

  if (!contents.length) {
    return null;
  }

  const response = await axios.post(
    GEMINI_CHAT_URL,
    {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
    }
  );

  return extractGeminiText(response.data);
};

const parseInsightsPayload = (rawText) => {
  const cleaned = stripCodeFences(rawText);

  try {
    const parsed = JSON.parse(cleaned);
    const insights = Array.isArray(parsed.insights)
      ? parsed.insights.map((item) => `${item}`.trim()).filter(Boolean)
      : [];
    const suggestedSkills = Array.isArray(parsed.suggestedSkills)
      ? parsed.suggestedSkills.map((item) => `${item}`.trim()).filter(Boolean)
      : [];

    return { insights, suggestedSkills };
  } catch (error) {
    const lines = cleaned
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
      .filter(Boolean);

    return {
      insights: lines.length ? lines : [cleaned].filter(Boolean),
      suggestedSkills: [],
    };
  }
};

const getUserContext = async (req) => {
  const user = req.user?._id
    ? await User.findById(req.user._id).select("-password")
    : null;

  return {
    skills: user?.skills || [],
    preferences: user?.preferences || {},
    profile: user?.profile || {},
    name: user?.name || "",
  };
};

const buildCareerInsights = async ({ skills = [], preferences = {}, profile = {} }) => {
  const normalizedSkills = normalizeList(skills);
  const suggestedSkills = await getSkillSuggestions(normalizedSkills);
  const normalizedSuggestions = normalizeList(suggestedSkills);

  const insights = [];
  const targetRole = preferences.jobTitle || profile.preferredRole || "";
  const targetLocation = preferences.location || profile.preferredLocation || "";

  if (targetRole) {
    insights.push(
      `You're shaping your profile toward ${titleCase(targetRole)}${targetLocation ? ` in ${titleCase(targetLocation)}` : ""}.`
    );
  }

  if (normalizedSkills.length) {
    insights.push(`Your strongest skills right now are ${formatSkills(normalizedSkills)}.`);
  } else {
    insights.push("Add at least 3 current skills so I can generate stronger match insights.");
  }

  if (normalizedSuggestions.length) {
    insights.push(
      `The best next skills to learn are ${formatSkills(normalizedSuggestions.slice(0, 3))}.`
    );
  }

  if (!profile.headline && !profile.bio) {
    insights.push(
      "Add a headline and short bio so recruiters can understand your value faster."
    );
  }

  if (!profile.resumeUrl && !profile.resumeName) {
    insights.push("Upload a resume link or filename to improve application readiness.");
  }

  const marketSignal = await Job.countDocuments();
  insights.push(
    `We scanned ${marketSignal} stored jobs to keep these insights aligned with your current market.`
  );

  return {
    insights,
    suggestedSkills: normalizedSuggestions,
  };
};

const buildFallbackChatReply = async ({ prompt, context }) => {
  const { skills = [], preferences = {}, profile = {} } = context;
  const suggestedSkills = await getSkillSuggestions(skills);
  const topSkill = suggestedSkills[0] || skills[0] || "career growth";
  const role = preferences.jobTitle || profile.preferredRole || "your target role";

  if (prompt.includes("resume") || prompt.includes("cv")) {
    return "Keep your resume focused on one role, lead with measurable impact, and make sure your latest project is easy to scan.";
  }

  if (prompt.includes("interview")) {
    return "For interviews, prepare one project story, one challenge you solved, and one clear reason you fit the role.";
  }

  if (prompt.includes("salary") || prompt.includes("pay")) {
    return "Salary depends on location, experience, and role scope. Compare similar roles, then negotiate with a range in mind.";
  }

  if (prompt.includes("skill") || prompt.includes("learn") || prompt.includes("roadmap")) {
    return `A good next step is to improve ${topSkill} and connect it to ${role} through a project or portfolio update.`;
  }

  if (prompt.includes("job") || prompt.includes("apply")) {
    return `For ${role}, apply where your current skills overlap strongly, and highlight ${topSkill} near the top of your profile.`;
  }

  if (prompt.includes("project") || prompt.includes("portfolio")) {
    return "Pick one solid project, explain the problem, the tools you used, and the result in numbers if possible.";
  }

  if (prompt.includes("hello") || prompt.includes("hi") || prompt.includes("help")) {
    return "I can help with resume advice, interview prep, skill gaps, job matching, and career planning. Ask me anything.";
  }

  return `I'm still in fallback mode. Set your Gemini API key in backend/.env so I can answer freely. Meanwhile, a useful next step is to strengthen ${topSkill} for ${role}.`;
};

const buildChatReply = async ({ messages = [], context }) => {
  const latestMessage =
    [...messages]
      .reverse()
      .find((message) => typeof message?.content === "string" && message.content.trim()) ||
    {};

  const prompt = `${latestMessage.content || ""}`.toLowerCase();

  if (GEMINI_API_KEY) {
    try {
      const geminiReply = await callGeminiChat({
        messages,
        systemPrompt: buildChatSystemPrompt(context),
        maxTokens: 500,
        temperature: 0.7,
      });

      if (geminiReply) {
        return geminiReply;
      }
    } catch (error) {
      console.warn("Gemini chat request failed, trying fallback reply.");
    }
  }

  return buildFallbackChatReply({ prompt, context });
};

exports.chat = async (req, res, next) => {
  try {
    const context = await getUserContext(req);
    const reply = await buildChatReply({
      messages: req.body?.messages || [],
      context,
    });

    res.status(200).json({ reply });
  } catch (error) {
    next(error);
  }
};

exports.getSuggestions = async (req, res, next) => {
  try {
    const context = await getUserContext(req);
    const payload = {
      skills: req.body?.skills?.length ? req.body.skills : context.skills,
      preferences: req.body?.profile?.preferences || context.preferences,
      profile: req.body?.profile || context.profile,
    };

    let insightsPayload = await buildCareerInsights(payload);

    if (GEMINI_API_KEY) {
      try {
        const aiResponse = await callGeminiChat({
          messages: [
            {
              role: "user",
              content: JSON.stringify({
                task: "Generate personalized career insights and next skills.",
                profile: payload,
              }),
            },
          ],
          systemPrompt: buildInsightsSystemPrompt(payload),
          maxTokens: 350,
          temperature: 0.4,
        });

        if (aiResponse) {
          const parsed = parseInsightsPayload(aiResponse);
          if (parsed.insights.length) {
            insightsPayload = {
              insights: parsed.insights,
              suggestedSkills:
                parsed.suggestedSkills.length > 0
                  ? parsed.suggestedSkills
                  : insightsPayload.suggestedSkills,
            };
          }
        }
      } catch (error) {
        console.warn("Gemini insights request failed, trying fallback provider.");
      }
    }

    res.status(200).json({
      suggestions: insightsPayload.insights,
      suggestedSkills: insightsPayload.suggestedSkills,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSkillGap = async (req, res, next) => {
  try {
    const userSkills = normalizeList(req.body?.userSkills || []);
    const jobSkills = normalizeList(req.body?.jobSkills || []);

    const missingSkills = jobSkills.filter((skill) => !userSkills.includes(skill));

    res.status(200).json({ missingSkills });
  } catch (error) {
    next(error);
  }
};

exports.getRejectionFeedback = async (req, res, next) => {
  try {
    const jobTitle = req.body?.jobTitle || "this role";
    const company = req.body?.company || "the company";
    const userSkills = normalizeList(req.body?.userSkills || []);

    const suggestedSkills = await getSkillSuggestions(userSkills);
    const focusSkill = suggestedSkills[0] || "portfolio depth";

    res.status(200).json({
      feedback: `You were close for ${jobTitle} at ${company}. Strengthen ${focusSkill}, add one measurable project result, and tailor your summary so it maps directly to the role requirements.`,
    });
  } catch (error) {
    next(error);
  }
};
