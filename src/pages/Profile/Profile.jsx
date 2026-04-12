import { useState, useEffect } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    headline: "",
    bio: "",
    dob: "",
    email: "",
    phone: "",
    institute: "",
    degree: "",
    graduationYear: "",
    experience: "",
    preferredRole: "",
    preferredLocation: "",
    skills: "",
    linkedin: "",
    github: "",
    portfolio: "",
    profilePic: "",
    resume: "",
  });

  // Load saved profile data
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle resume upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, resume: file.name });
    }
  };

  // Save profile
  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("skills", profile.skills);
    alert("Profile saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Cover Section */}
        <div className="h-40 bg-gradient-to-r from-blue-600 to-pink-500 relative">
          <div className="absolute -bottom-16 left-8">
            <label className="cursor-pointer">
              <img
                src={
                  profile.profilePic ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8 pt-20">
          {/* Name & Headline */}
          <div className="mb-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={profile.name}
              onChange={handleChange}
              className="text-3xl font-bold w-full outline-none mb-2"
            />
            <input
              type="text"
              name="headline"
              placeholder="Professional Headline"
              value={profile.headline}
              onChange={handleChange}
              className="text-gray-600 w-full outline-none"
            />
          </div>

          {/* Bio Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <textarea
              name="bio"
              placeholder="Write a short bio about yourself..."
              value={profile.bio}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              rows="4"
            />
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InputField label="Date of Birth" name="dob" type="date" value={profile.dob} onChange={handleChange} />
            <InputField label="Email" name="email" value={profile.email} onChange={handleChange} />
            <InputField label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
            <InputField label="Institute / University" name="institute" value={profile.institute} onChange={handleChange} />
            <InputField label="Degree" name="degree" value={profile.degree} onChange={handleChange} />
            <InputField label="Graduation Year" name="graduationYear" value={profile.graduationYear} onChange={handleChange} />
          </div>

          {/* Professional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InputField label="Experience Level" name="experience" placeholder="e.g., Fresher, 2 Years" value={profile.experience} onChange={handleChange} />
            <InputField label="Preferred Job Role" name="preferredRole" value={profile.preferredRole} onChange={handleChange} />
            <InputField label="Preferred Location" name="preferredLocation" value={profile.preferredLocation} onChange={handleChange} />
            <InputField label="Skills (comma separated)" name="skills" placeholder="React, Node.js, SQL" value={profile.skills} onChange={handleChange} />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <InputField label="LinkedIn URL" name="linkedin" value={profile.linkedin} onChange={handleChange} />
            <InputField label="GitHub URL" name="github" value={profile.github} onChange={handleChange} />
            <InputField label="Portfolio URL" name="portfolio" value={profile.portfolio} onChange={handleChange} />
          </div>

          {/* Resume Upload */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Upload Resume</label>
            <input type="file" onChange={handleResumeUpload} />
            {profile.resume && (
              <p className="text-green-600 mt-2">{profile.resume}</p>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-pink-500 text-white px-8 py-3 rounded-xl hover:opacity-90"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Field Component
function InputField({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border p-3 rounded-xl"
      />
    </div>
  );
}

export default Profile;