import React, { useState, useEffect } from "react";
import { Camera, Lock } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const ProfileSection = () => {
  const [loading, setloading] = useState(true);
  const [existingProfileData, setExistingProfileData] = useState({
    name: "",
    email: "",
    Phone: "",
    Role: "",
    currentPassword: "",
    newPassword: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${VITE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.image) {
        response.data.image = null;
      }
      setExistingProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data. Please try again.");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExistingProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    const loadingToast = toast.loading("Updating profile...");
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to update your profile.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", existingProfileData.name);
      formData.append("email", existingProfileData.email);
      formData.append("Phone", existingProfileData.Phone);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const response = await axios.put(
        `${VITE_URL}/api/users/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (existingProfileData.newPassword) {
        if (!existingProfileData.currentPassword) {
          toast.dismiss(loadingToast);
          return toast.error(
            "Please enter your current password to set a new password.",
          );
        }
        const response = await axios.put(
          `${VITE_URL}/api/users/profile/updatepassword`,
          {
            currentPassword: existingProfileData.currentPassword,
            newPassword: existingProfileData.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setExistingProfileData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
      }
      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully.");
      fetchProfileData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
      toast.dismiss(loadingToast);
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500 animate-pulse">
        Loading profile...
      </div>
    );
  }
  const inputStyle =
    "w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all text-gray-900 bg-white shadow-sm font-sans";
  const labelStyle =
    "text-xs font-semibold text-gray-800 uppercase tracking-widest mb-1";

  return (
    <div className="font-serif space-y-12 animate-in fade-in duration-300 max-w-5xl mx-auto pb-10">
      {/* Profile Header Area */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-8 border-b border-gray-200 pb-10">
        <div className="relative group cursor-pointer shrink-0">
          <label className="cursor-pointer">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-200 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
              {imagePreview || existingProfileData.image ? (
                <img
                  src={imagePreview || existingProfileData.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-light text-gray-800">
                  {existingProfileData.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="text-white" size={28} />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="mt-2 sm:mt-6">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">
            {existingProfileData.name}
          </h2>
          <p className="text-gray-500 italic text-lg tracking-wide">
            Update your photo and personal details here.
          </p>
        </div>
      </div>

      {/* Personal Details Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className={labelStyle}>Full Name</label>
          <input
            type="text"
            name="name"
            defaultValue={existingProfileData.name}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* 2. Role Input */}
        <div className="flex flex-col gap-1.5">
          <label className={labelStyle}>Role</label>
          <input
            type="text"
            value={existingProfileData.Role}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed outline-none transition-all font-sans italic"
          />
        </div>

        {/* 3. Email Address Input */}
        <div className="flex flex-col gap-1.5">
          <label className={labelStyle}>Email Address</label>
          <input
            type="email"
            name="email"
            defaultValue={existingProfileData.email}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* 4. Phone Number Input */}
        <div className="flex flex-col gap-1.5">
          <label className={labelStyle}>Phone Number</label>
          <input
            type="tel"
            name="Phone"
            defaultValue={existingProfileData.Phone}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Security / Password Section */}
      <div className="pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center justify-center sm:justify-start gap-3">
          <Lock size={24} className="text-amber-500" /> Security Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1.5">
            <label className={labelStyle}>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelStyle}>New Password</label>
            <input
              type="password"
              name="newPassword"
              onChange={handleChange}
              placeholder="Enter new password"
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex justify-center sm:justify-end pt-8">
        <button
          className="px-10 py-3.5 bg-black text-white rounded-full text-lg tracking-wider hover:bg-amber-500 hover:text-black transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
export default ProfileSection;
