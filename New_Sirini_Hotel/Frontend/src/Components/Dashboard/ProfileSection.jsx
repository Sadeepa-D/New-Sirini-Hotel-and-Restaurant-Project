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

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${VITE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const handleSaveChanges = async () => {
    const loadingToast = toast.loading("Updating profile...");
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to update your profile.");
      return;
    }
    try {
      const response = await axios.put(
        `${VITE_URL}/api/users/profile/update`,
        {
          name: existingProfileData.name,
          email: existingProfileData.email,
          Phone: existingProfileData.Phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            <span className="text-3xl font-bold text-indigo-700">JD</span>
            {/* Replace span with img tag when backend is connected */}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" size={24} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {existingProfileData.name}
          </h2>
          <p className="text-gray-500">
            Update your photo and personal details here.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={existingProfileData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-gray-900 bg-white"
          />
        </div>

        {/* 2. Role Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            value={existingProfileData.Role}
            disabled
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed outline-none transition-all"
          />
        </div>

        {/* 3. Email Address Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            defaultValue={existingProfileData.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-gray-900 bg-white"
          />
        </div>

        {/* 4. Phone Number Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="Phone"
            defaultValue={existingProfileData.Phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={20} className="text-gray-400" /> Change Password
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-gray-900 bg-white"
          />
          <input
            type="password"
            name="newPassword"
            onChange={handleChange}
            placeholder="New Password"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
export default ProfileSection;
