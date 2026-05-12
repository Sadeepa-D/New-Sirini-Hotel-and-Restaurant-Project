import React, { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Trash2,
  Upload,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const GalleryManagementHub = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState("Reception");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchGalleryImages = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/gallery/view`);
      setGalleryImages(response.data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const categories = ["Reception", "Rooms", "Restaurant"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting image...");
    try {
      const response = await axios.delete(
        `${VITE_URL}/api/gallery/delete/${id}`,
      );
      toast.dismiss(loadingToast);
      toast.success("Image deleted successfully.");
      fetchGalleryImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload.");
      return;
    }
    setUploading(true);
    const loadingToast = toast.loading("Publishing to gallery...");
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("category", activeCategory);
      const response = await axios.post(
        `${VITE_URL}/api/gallery/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.dismiss(loadingToast);
      toast.success("Image added to gallery!");
      setPreviewImage(null);
      setSelectedFile(null);
      fetchGalleryImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ImageIcon className="text-amber-500" />
              Media Management
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Manage your hotel gallery and upload new event photos.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-gray-50/50">
          {/* LEFT: Image Gallery Section */}
          <div className="flex-1 overflow-y-auto p-6 lg:border-r border-gray-200">
            {/* Category Tabs (Top center in sketch) */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-2xl flex gap-1 border border-gray-200">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                      activeCategory === cat
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Images Grid (Delete btn on top left as per sketch) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryImages
                .filter((img) => img.category === activeCategory)
                .map((img) => (
                  <div
                    key={img._id}
                    className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <img
                      src={img.image}
                      alt="Gallery"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <button
                      onClick={() => handleDelete(img._id)}
                      className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-md text-rose-500 rounded-lg shadow-lg hover:bg-rose-500 hover:text-white transition-all transform -translate-y-2 group-hover:translate-y-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* RIGHT: Upload Section (Side panel in sketch) */}
          <div className="w-full lg:w-[380px] bg-white p-6 flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Upload size={18} className="text-amber-500" />
              Upload Photo
            </h3>

            {/* Category Select Box */}
            <div className="mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Target Category
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Upload Button/Input */}
            <div className="mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Select File
              </label>
              <label className="flex items-center justify-center w-full h-14 bg-amber-50/50 border-2 border-dashed border-amber-200 text-amber-600 rounded-2xl cursor-pointer hover:bg-amber-100/50 hover:border-amber-400 transition-all duration-300 group">
                <div className="flex items-center gap-3 align-middle">
                  <div className="bg-amber-500 text-white p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                  <span className="font-bold text-sm tracking-wide">
                    Select Image
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>

            {/* Preview Box (Bottom right in sketch) */}
            <div className="flex-1 flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Preview
              </label>
              <div className="flex-1 min-h-[180px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center relative group">
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon
                      size={40}
                      className="text-gray-200 mx-auto mb-2"
                    />
                    <p className="text-[10px] text-gray-400 font-medium">
                      No image selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3">
              <button
                onClick={handleUpload}
                disabled={!previewImage || uploading}
                className="mt-auto w-full relative overflow-hidden bg-[#121826] hover:bg-[#1a2335] disabled:bg-gray-100 disabled:text-gray-400 text-white font-black py-4 sm:py-5 px-6 rounded-[1.25rem] transition-all duration-300 shadow-xl shadow-gray-200 uppercase tracking-[0.2em] text-[10px] sm:text-xs flex items-center justify-center gap-3 group active:scale-[0.98] disabled:active:scale-100"
              >
                {/* Shine Effect Layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />

                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      size={18}
                      className="text-amber-500 group-hover:text-white transition-colors duration-300"
                    />
                    <span>Publish to Gallery</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryManagementHub;
