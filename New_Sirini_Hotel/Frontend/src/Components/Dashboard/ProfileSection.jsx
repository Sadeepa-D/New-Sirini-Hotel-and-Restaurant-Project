import React, { useState, useEffect } from "react";
import { Camera, Lock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import ConfirmDialog from "../ConfrimDialog";

const ProfileSection = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchProfileData = async () => {
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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm animate-pulse">Loading profile…</p>
      </div>
    );
  }

  const confrimDeactivate = () => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      title: "Confirm Account Deactivation",
      message:
        "Are you sure you want to deactivate your account? This action can be reversed by contacting support.",
    });
  };

  const deactivateAccount = async () => {
    setConfirmDialog({ isOpen: false, id: null });
    const loadingToast = toast.loading("Deactivating account...");
    try {
      const response = await axios.put(
        `${VITE_URL}/api/users/deactivate/account`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.dismiss(loadingToast);
      toast.success(
        "Account deactivated successfully. Please contact support to reactivate.",
      );
      localStorage.removeItem("token");

      navigate("/login");
      fetchProfileData();
    } catch (error) {
      console.error("Error deactivating account:", error);
      toast.error("Failed to deactivate account. Please try again.");
    }
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all text-gray-900 bg-gray-50 font-sans text-sm placeholder:text-gray-400";
  const labelStyle =
    "text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1";

  return (
    <div className="font-sans space-y-6 max-w-3xl mx-auto pb-8">
      {/* ── Profile Header ── */}
      <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-amber-50 via-white to-gray-50 border border-amber-100 px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-50 transition-colors"
            onClick={confrimDeactivate}
          >
            <Trash2
              size={25}
              className="text-gray-400 hover:text-red-500 transition-colors"
            />
          </button>
          {/* Avatar */}
          <div className="relative group cursor-pointer shrink-0">
            <label className="cursor-pointer">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-amber-200 ring-offset-2 shadow-lg bg-amber-100 flex items-center justify-center">
                {imagePreview || existingProfileData.image ? (
                  <img
                    src={imagePreview || existingProfileData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-amber-600">
                    {existingProfileData.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="text-white" size={24} />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name & subtitle */}
          <div className="text-center sm:text-left mt-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {existingProfileData.name}
            </h2>
            <p className="text-gray-400 text-sm mt-1 italic">
              Update your photo and personal details here.
            </p>
            {existingProfileData.Role && (
              <span className="inline-block mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                {existingProfileData.Role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Personal Details ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
          <span className="w-4 h-px bg-amber-400"></span>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              value={existingProfileData.name}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              value={existingProfileData.email}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelStyle}>Phone Number</label>
            <input
              type="tel"
              name="Phone"
              value={existingProfileData.Phone}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* ── Security Settings ── */}
      {existingProfileData.authProvider !== "google" && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-4 h-px bg-amber-400"></span>
            <Lock size={13} className="text-amber-500" />
            Security Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      )}

      {/* ── Save Button ── */}
      <div className="flex justify-end">
        <button
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full text-sm tracking-wider transition-all duration-200 shadow-md shadow-amber-500/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={deactivateAccount}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default ProfileSection;
