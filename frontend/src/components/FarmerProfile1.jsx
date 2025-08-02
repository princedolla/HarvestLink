import React, { useState, useEffect } from "react";
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
  const [message, setMessage] = useState("");

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
    }
  }, [farmer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await axios.post(CLOUDINARY_UPLOAD_URL, data);
    return res.data.secure_url;
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
    setMessage("");
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ You must be logged in to update your profile.");
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

      setMessage("✅ Profile updated successfully!");
      setEditMode(false);
      setSelectedImageFile(null);
      onUpdate?.(response.data);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!farmer) {
    return (
      <p className="text-center text-gray-400">No farmer data available.</p>
    );
  }

  return (
    <div className="bg-gray-900 text-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center">
        <img
          src={previewImage || "images/default-profile.jpg"}
          alt="Farmer Profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "images/default-profile.jpg";
          }}
          className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-green-400"
        />

        {!editMode ? (
          <>
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-green-400" />
              {formData.name}
              <button
                onClick={() => setEditMode(true)}
                title="Edit Profile"
                className="text-green-300 hover:text-green-500"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </h2>
            <p className="text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-green-400"
              />
              {formData.location}
            </p>
          </>
        ) : (
          <form className="w-full mt-2" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-green-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
              />
            </div>

            <div className="mb-3">
              <label className="block text-green-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
              />
            </div>

            <div className="mb-3">
              <label className="block text-green-300 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="^\+?\d{7,15}$"
                title="Include country code, e.g., +2507XXXXXXX"
                required
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
              />
            </div>

            <div className="mb-3">
              <label className="block text-green-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 text-white font-medium cursor-pointer transition-colors duration-200">
                <FontAwesomeIcon icon={faUpload} className="text-green-400" />
                <span>Upload Profile Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} />
                {loading ? "Saving..." : "Save"}
              </button>
            </div>

            {message && (
              <p className="mt-2 text-center text-sm text-green-300">
                {message}
              </p>
            )}
          </form>
        )}
      </div>

      {!editMode && (
        <div className="mt-4 text-sm text-gray-300">
          <p className="mb-1 flex items-center gap-2">
            <FontAwesomeIcon icon={faPhone} className="text-green-400" />
            {formData.phone.startsWith("+250")
              ? formData.phone
              : `+250 ${formData.phone}`}
          </p>
          {formData.email && (
            <p className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-green-400" />
              {formData.email}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;
