import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/auth/authService";

const initialProfileState = {
  name: "",
  email: "",
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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();

        setProfile({
          name: data.name || "",
          email: data.email || "",
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-pink-500" />

        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-gray-600">
              Complete this profile so the auto-apply system can match and apply to relevant jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InputField label="Full Name" name="name" value={profile.name} onChange={handleChange} />
            <InputField label="Email" name="email" value={profile.email} disabled />
            <InputField label="Professional Headline" name="headline" value={profile.headline} onChange={handleChange} />
            <InputField label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-1">About</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="4"
              className="w-full border p-3 rounded-xl"
              placeholder="Write a short summary about yourself"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InputField label="Institute / University" name="institute" value={profile.institute} onChange={handleChange} />
            <InputField label="Degree" name="degree" value={profile.degree} onChange={handleChange} />
            <InputField label="Graduation Year" name="graduationYear" value={profile.graduationYear} onChange={handleChange} />
            <InputField label="Experience" name="experience" value={profile.experience} onChange={handleChange} placeholder="e.g. Fresher, 2 years" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InputField label="Preferred Job Role" name="preferredRole" value={profile.preferredRole} onChange={handleChange} />
            <InputField label="Preferred Location" name="preferredLocation" value={profile.preferredLocation} onChange={handleChange} />
            <InputField label="Minimum Match Score" name="minMatchScore" type="number" value={profile.minMatchScore} onChange={handleChange} />
            <InputField label="Skills (comma separated)" name="skills" value={profile.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
          </div>

          <div className="mb-6 flex items-center gap-3">
            <input
              id="autoApplyEnabled"
              name="autoApplyEnabled"
              type="checkbox"
              checked={profile.autoApplyEnabled}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="autoApplyEnabled" className="font-medium">
              Enable auto apply for matching jobs
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <InputField label="LinkedIn URL" name="linkedin" value={profile.linkedin} onChange={handleChange} />
            <InputField label="GitHub URL" name="github" value={profile.github} onChange={handleChange} />
            <InputField label="Portfolio URL" name="portfolio" value={profile.portfolio} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <InputField label="Resume URL" name="resumeUrl" value={profile.resumeUrl} onChange={handleChange} placeholder="https://..." />
            <InputField label="Resume File Name" name="resumeName" value={profile.resumeName} onChange={handleChange} placeholder="resume.pdf" />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-pink-500 text-white px-8 py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
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
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border p-3 rounded-xl disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  );
}

export default Profile;
