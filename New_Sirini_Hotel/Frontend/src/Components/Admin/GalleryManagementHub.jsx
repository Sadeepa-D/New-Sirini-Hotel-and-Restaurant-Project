import React, { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Trash2,
  Upload,
  Plus,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const GalleryManagementHub = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState("Reception");
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
      e.dataTransfer.clearData();
    }
  };
  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting image...");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${VITE_URL}/api/gallery/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
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
    if (selectedFiles.length === 0) {
      toast.error("Please select At least one image to upload.");
      return;
    }
    setUploading(true);
    const loadingToast = toast.loading(
      `Publishing ${selectedFiles.length} images...`,
    );
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("category", activeCategory);
      const response = await axios.post(
        `${VITE_URL}/api/gallery/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.dismiss(loadingToast);
      toast.success("Image added to gallery!");
      setPreviewImages([]);
      setSelectedFiles([]);
      fetchGalleryImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const filteredImages = galleryImages.filter(
    (img) => img.category === activeCategory,
  );

  const openPreview = (index) => {
    setSelectedImageIndex(index);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
        <div className="bg-white w-full max-w-6xl my-auto min-h-fit max-h-[85vh] overflow-hidden rounded-2xl sm:rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <ImageIcon className="text-amber-500 shrink-0" />
                <span className="truncate">Media Management</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Manage your hotel gallery and upload new event photos.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-gray-50/50">
            {/* LEFT: Image Gallery Section */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:border-r border-gray-200 order-2 lg:order-1">
              <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{ borderRadius: "9999px" }}
                    className={`px-5 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 ease-out border-2 hover:scale-105 active:scale-95 cursor-pointer ${
                      activeCategory === cat
                        ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                        : "bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-500"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {filteredImages.map((img, idx) => (
                  <div
                    key={img._id}
                    className="relative group aspect-square rounded-lg sm:rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => openPreview(idx)}
                  >
                    <img
                      src={img.image}
                      alt="Gallery"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(img._id);
                      }}
                      className="absolute top-1 sm:top-2 left-1 sm:left-2 p-1 sm:p-2 bg-white/90 backdrop-blur-md text-rose-500 rounded-lg shadow-lg hover:bg-rose-500 hover:text-white transition-all transform -translate-y-2 group-hover:translate-y-0"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[380px] bg-white p-4 sm:p-6 flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] overflow-y-auto order-1 lg:order-2 border-t lg:border-t-0 lg:border-l border-gray-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <Upload size={18} className="text-amber-500 shrink-0" />
                <span className="truncate">Upload Photo</span>
              </h3>

              <div className="mb-4 sm:mb-6">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Target Category
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Select or Drag Files
                </label>
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`group relative flex flex-col h-24 sm:h-32 w-full cursor-pointer items-center justify-center pt-2 sm:pt-4 rounded-lg sm:rounded-2xl border-2 border-dashed transition-all duration-300 ${
                    isDragging
                      ? "border-amber-500 bg-amber-100 scale-[1.02] shadow-inner"
                      : "border-amber-200 bg-amber-50/30 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <div
                      className={`flex items-center justify-center rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-white shadow-lg transition-all duration-300 ${
                        isDragging
                          ? "bg-amber-600 scale-110 animate-bounce"
                          : "bg-amber-500 shadow-amber-200"
                      }`}
                    >
                      <Upload
                        size={16}
                        className="sm:w-5 sm:h-5"
                        strokeWidth={3}
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-black tracking-wide text-amber-900 block">
                        {isDragging ? "Drop to Upload" : "Select Images"}
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(Array.from(e.target.files))}
                    accept="image/*"
                  />
                </label>
              </div>

              {/* Preview Box */}
              <div className="flex-1 min-h-[120px] sm:min-h-[180px] max-h-[180px] sm:max-h-[280px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-2 overflow-y-auto">
                {previewImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {previewImages.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden group"
                      >
                        <img
                          src={url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setPreviewImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                            setSelectedFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-3 sm:p-4">
                    <ImageIcon
                      size={32}
                      className="sm:w-10 sm:h-10 text-gray-200 mb-2"
                    />
                    <p className="text-[10px] text-gray-400 font-medium">
                      No images selected
                    </p>
                  </div>
                )}
              </div>
              <div className="pt-2 sm:pt-3">
                <button
                  onClick={handleUpload}
                  disabled={previewImages.length === 0 || uploading}
                  style={{ borderRadius: "14px" }}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 sm:py-3.5 px-4 sm:px-6 transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:shadow-orange-500/20 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed uppercase tracking-wider text-xs flex items-center justify-center gap-2 sm:gap-3 group hover:scale-[1.03] active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={15}
                        className="text-white transition-colors duration-300 shrink-0"
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

      {isPreviewOpen && filteredImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl my-auto min-h-fit max-h-[95vh] flex flex-col">
            <button
              onClick={closePreview}
              className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-amber-500 transition-colors p-2 z-10"
            >
              <X size={28} className="sm:w-8 sm:h-8" />
            </button>

            <div className="relative flex-1 flex items-center justify-center bg-black/50 rounded-lg sm:rounded-2xl overflow-hidden">
              <img
                src={filteredImages[selectedImageIndex]?.image}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain"
              />
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500 text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 z-20"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500 text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 z-20"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="mt-3 sm:mt-4 flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide">
              {filteredImages.map((item, idx) => (
                <button
                  key={item._id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-12 sm:w-16 h-12 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedImageIndex
                      ? "border-amber-500 ring-2 ring-amber-500/50"
                      : "border-gray-600 hover:border-amber-500"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryManagementHub;
