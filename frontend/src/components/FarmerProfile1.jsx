import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faEdit,
  faSave,
  faTimes,
  faUpload,
  faCamera,
  faInfoCircle,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_URL } from "../config";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/druklfvdr/image/upload";
const UPLOAD_PRESET = "harvest_link";

const FarmerProfile = ({ farmer, token, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    profileImage: "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (farmer) {
      setFormData({
        name: farmer.name || "",
        location: farmer.location || "",
        phone: farmer.phone || "",
        email: farmer.email || "",
        profileImage: farmer.profileImage || "",
      });
      setPreviewImage(farmer.profileImage || "");
      setSelectedImageFile(null);
      setValidationErrors({});
    }
  }, [farmer]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^(\+?\d{7,15})$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setMessage({ text: "Please select an image file", type: "error" });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ text: "Image size must be less than 5MB", type: "error" });
        return;
      }
      
      setSelectedImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setMessage({ text: "", type: "" });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadImageToCloudinary = async (imageFile) => {
    try {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", UPLOAD_PRESET);
      
      const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      return res.data.secure_url;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: farmer.name || "",
      location: farmer.location || "",
      phone: farmer.phone || "",
      email: farmer.email || "",
      profileImage: farmer.profileImage || "",
    });
    setPreviewImage(farmer.profileImage || "");
    setSelectedImageFile(null);
    setMessage({ text: "", type: "" });
    setValidationErrors({});
    setEditMode(false);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ text: "Please fix the errors below", type: "error" });
      return;
    }
    
    setLoading(true);
    setMessage({ text: "", type: "" });
    setUploadProgress(0);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ text: "You must be logged in to update your profile", type: "error" });
      setLoading(false);
      return;
    }

    try {
      let profileImageUrl = formData.profileImage;

      if (selectedImageFile) {
        profileImageUrl = await uploadImageToCloudinary(selectedImageFile);
      }

      const updatePayload = {
        ...formData,
        profileImage: profileImageUrl,
      };

      const response = await axios.put(
        `${API_URL}/farmers/${farmer._id}`,
        updatePayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({ text: "Profile updated successfully!", type: "success" });
      setUploadProgress(100);
      
      setTimeout(() => {
        setEditMode(false);
        setSelectedImageFile(null);
        setMessage({ text: "", type: "" });
        setUploadProgress(0);
      }, 2000);
      
      onUpdate?.(response.data);
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data?.message || "Failed to update profile";
      setMessage({ text: errorMsg, type: "error" });
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    
    // Remove any non-digit characters except leading +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it already starts with +250, format as +250 XX XXX XXX
    if (cleaned.startsWith("+250") && cleaned.length === 13) {
      return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
    }
    
    // If it starts with 0, replace with +250
    if (cleaned.startsWith("0") && cleaned.length === 10) {
      const rest = cleaned.substring(1);
      return `+250 ${rest.substring(0, 2)} ${rest.substring(2, 5)} ${rest.substring(5)}`;
    }
    
    // If it's 9 digits, assume it's a Rwanda number
    if (cleaned.length === 9 && !isNaN(cleaned)) {
      return `+250 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
    }
    
    // Otherwise return as is
    return phone;
  };

  if (!farmer) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading farmer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white shadow-xl rounded-2xl p-6 w-full max-w-md mx-auto border border-gray-800">
      <div className="flex flex-col items-center">
        {/* Profile Image Section */}
        <div className="relative mb-6 group">
          <div className="relative">
            <img
              src={previewImage || "/images/default-profile.jpg"}
              alt="Farmer Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/default-profile.jpg";
              }}
              className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
            />
            {editMode && (
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={loading}
                className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-md transition-all duration-200 transform group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Change profile photo"
              >
                <FontAwesomeIcon icon={faCamera} size="sm" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={loading}
            />
          </div>
          
          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="absolute -bottom-2 left-0 right-0">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-300 mt-1 text-center">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {!editMode ? (
          // View Mode
          <>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-green-400" />
              {formData.name}
            </h2>
            
            {formData.location && (
              <p className="text-gray-300 flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-400" />
                {formData.location}
              </p>
            )}
            
            <div className="w-full mt-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPhone} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="font-medium">{formatPhoneNumber(formData.phone)}</p>
                </div>
              </div>
              
              {formData.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelope} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="mt-8 flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-600 rounded-lg transition-colors duration-200 font-medium"
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit Profile
            </button>
          </>
        ) : (
          // Edit Mode
          <form className="w-full mt-2 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-green-300 mb-2 font-medium flex items-center gap-1">
                <span>Full Name</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3.5 rounded-lg bg-gray-800 text-white border ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-600 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {validationErrors.name && (
                <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-xs" />
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-green-300 mb-2 font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3.5 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Enter your location"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-green-300 mb-2 font-medium flex items-center gap-1">
                <span>Phone Number</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3.5 rounded-lg bg-gray-800 text-white border ${
                  validationErrors.phone ? 'border-red-500' : 'border-gray-600 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
                placeholder="e.g., +250788123456"
                disabled={loading}
              />
              {validationErrors.phone && (
                <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-xs" />
                  {validationErrors.phone}
                </p>
              )}
              <p className="text-gray-400 text-xs mt-1.5">
                Include country code (e.g., +250 for Rwanda)
              </p>
            </div>

            <div>
              <label className="block text-green-300 mb-2 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3.5 rounded-lg bg-gray-800 text-white border ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-600 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
                placeholder="Enter your email address"
                disabled={loading}
              />
              {validationErrors.email && (
                <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-xs" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faUpload} className="text-green-400" />
                <span>{selectedImageFile ? "Change Profile Image" : "Upload Profile Image"}</span>
              </button>
              <p className="text-gray-400 text-xs mt-2 text-center">Max 5MB. JPG, PNG or WEBP.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 pt-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            {/* Status Message */}
            {message.text && (
              <div className={`p-4 rounded-lg border ${
                message.type === "error" 
                  ? "bg-red-900/20 text-red-300 border-red-800" 
                  : "bg-green-900/20 text-green-300 border-green-800"
              }`}>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon 
                    icon={message.type === "error" ? faInfoCircle : faCheckCircle} 
                  />
                  <span>{message.text}</span>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default FarmerProfile;