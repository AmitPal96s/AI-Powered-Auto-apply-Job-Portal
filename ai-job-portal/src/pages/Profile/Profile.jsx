import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/auth/authService";

const initialProfileState = {
  name: "",
  email: "",
  avatarUrl: "",
  headline: "",
  bio: "",
  phone: "",
  institute: "",
  degree: "",
  graduationYear: "",
  experience: "",
  preferredRole: "",
  preferredLocation: "",
  minMatchScore: 70,
  autoApplyEnabled: false,
  skills: "",
  linkedin: "",
  github: "",
  portfolio: "",
  resumeUrl: "",
  resumeName: "",
};

function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(initialProfileState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();

        setProfile({
          name: data.name || "",
          email: data.email || "",
          avatarUrl: data.profile?.avatarUrl || "",
          headline: data.profile?.headline || "",
          bio: data.profile?.bio || "",
          phone: data.profile?.phone || "",
          institute: data.profile?.institute || "",
          degree: data.profile?.degree || "",
          graduationYear: data.profile?.graduationYear || "",
          experience: data.profile?.experience || "",
          preferredRole: data.preferences?.jobTitle || "",
          preferredLocation: data.preferences?.location || "",
          minMatchScore: data.preferences?.minMatchScore ?? 70,
          autoApplyEnabled: Boolean(data.preferences?.autoApplyEnabled),
          skills: (data.skills || []).join(", "),
          linkedin: data.profile?.linkedin || "",
          github: data.profile?.github || "",
          portfolio: data.profile?.portfolio || "",
          resumeUrl: data.profile?.resumeUrl || "",
          resumeName: data.profile?.resumeName || "",
        });
      } catch (error) {
        toast.error(error.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        avatarUrl: reader.result?.toString() || "",
      }));
    };
    reader.onerror = () => {
      toast.error("Could not read the selected image.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfile((prev) => ({
      ...prev,
      avatarUrl: "",
    }));

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const skills = profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const updatedProfile = await updateUserProfile({
        name: profile.name,
        skills,
        preferences: {
          jobTitle: profile.preferredRole,
          location: profile.preferredLocation,
          minMatchScore: Number(profile.minMatchScore) || 70,
          autoApplyEnabled: profile.autoApplyEnabled,
        },
        profile: {
          avatarUrl: profile.avatarUrl,
          headline: profile.headline,
          bio: profile.bio,
          phone: profile.phone,
          institute: profile.institute,
          degree: profile.degree,
          graduationYear: profile.graduationYear,
          experience: profile.experience,
          linkedin: profile.linkedin,
          github: profile.github,
          portfolio: profile.portfolio,
          resumeUrl: profile.resumeUrl,
          resumeName: profile.resumeName,
        },
      });

      updateUser({
        ...user,
        name: updatedProfile.name,
        email: updatedProfile.email,
        skills: updatedProfile.skills,
        preferences: updatedProfile.preferences,
        profile: updatedProfile.profile,
      });

      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-pink-500 sm:h-32" />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              Profile Settings
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              Complete this profile so the auto-apply system can match and apply to relevant jobs.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:rounded-3xl sm:p-6">
            <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-pink-100 shadow-lg sm:h-28 sm:w-28">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-blue-700">
                    {profile.name
                      ? profile.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0]?.toUpperCase())
                          .join("")
                      : "U"}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  Profile Picture
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Add a photo so your profile feels more personal and easier to recognize.
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
                    Upload Photo
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white"
                  >
                    Remove Photo
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Supports JPG, PNG, GIF, and other common image formats.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <InputField label="Full Name" name="name" value={profile.name} onChange={handleChange} />
            <InputField label="Email" name="email" value={profile.email} disabled />
            <InputField label="Professional Headline" name="headline" value={profile.headline} onChange={handleChange} />
            <InputField label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700 sm:text-base">
              About
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-xl border border-gray-200 p-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:text-base"
              placeholder="Write a short summary about yourself"
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <InputField label="Institute / University" name="institute" value={profile.institute} onChange={handleChange} />
            <InputField label="Degree" name="degree" value={profile.degree} onChange={handleChange} />
            <InputField label="Graduation Year" name="graduationYear" value={profile.graduationYear} onChange={handleChange} />
            <InputField label="Experience" name="experience" value={profile.experience} onChange={handleChange} placeholder="e.g. Fresher, 2 years" />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <InputField label="Preferred Job Role" name="preferredRole" value={profile.preferredRole} onChange={handleChange} />
            <InputField label="Preferred Location" name="preferredLocation" value={profile.preferredLocation} onChange={handleChange} />
            <InputField label="Minimum Match Score" name="minMatchScore" type="number" value={profile.minMatchScore} onChange={handleChange} />
            <InputField label="Skills (comma separated)" name="skills" value={profile.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
          </div>

          <div className="mb-6 flex items-start gap-3">
            <input
              id="autoApplyEnabled"
              name="autoApplyEnabled"
              type="checkbox"
              checked={profile.autoApplyEnabled}
              onChange={handleChange}
              className="mt-1 h-4 w-4 shrink-0"
            />
            <label htmlFor="autoApplyEnabled" className="text-sm font-medium text-gray-700 sm:text-base">
              Enable auto apply for matching jobs
            </label>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            <InputField label="LinkedIn URL" name="linkedin" value={profile.linkedin} onChange={handleChange} />
            <InputField label="GitHub URL" name="github" value={profile.github} onChange={handleChange} />
            <InputField label="Portfolio URL" name="portfolio" value={profile.portfolio} onChange={handleChange} />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <InputField label="Resume URL" name="resumeUrl" value={profile.resumeUrl} onChange={handleChange} placeholder="https://..." />
            <InputField label="Resume File Name" name="resumeName" value={profile.resumeName} onChange={handleChange} placeholder="resume.pdf" />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 px-8 py-3 text-white transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 sm:text-base">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-gray-200 p-3 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 disabled:text-gray-500 sm:text-base"
      />
    </div>
  );
}

export default Profile;
