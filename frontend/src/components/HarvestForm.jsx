import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faWeightHanging,
  faCalendarAlt,
  faDollarSign,
  faMoneyBill,
  faPen,
  faXmark,
  faUpload,
  faTrash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const cropTypes = ["Maize", "Beans", "Wheat", "Rice", "Cassava"];
const units = ["kg", "tons", "bags"];
const currencies = ["RWF", "USD", "KES"];

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/druklfvdr/image/upload";
const UPLOAD_PRESET = "harvest_link";

const HarvestForm = ({
  farmerId,
  token,
  onPost,
  existingHarvest,
  onUpdate,
  onCancel,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: "",
    cropType: "",
    plantingDate: "",
    expectedHarvestDate: "",
    estimatedQuantity: "",
    unit: "",
    pricePerUnit: "",
    currency: "",
    description: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (existingHarvest) {
      setFormData({
        cropName: existingHarvest.cropName || "",
        cropType: existingHarvest.cropType || "",
        plantingDate: existingHarvest.plantingDate?.substring(0, 10) || "",
        expectedHarvestDate:
          existingHarvest.expectedHarvestDate?.substring(0, 10) || "",
        estimatedQuantity: existingHarvest.estimatedQuantity || "",
        unit: existingHarvest.unit || "",
        pricePerUnit: existingHarvest.pricePerUnit || "",
        currency: existingHarvest.currency || "",
        description: existingHarvest.description || "",
        images: [],
      });
      setPreviewImages(existingHarvest.imageUrls || []);
    } else {
      resetForm();
    }
    setMessage("");
    setErrors({});
  }, [existingHarvest]);

  const resetForm = () => {
    setFormData({
      cropName: "",
      cropType: "",
      plantingDate: "",
      expectedHarvestDate: "",
      estimatedQuantity: "",
      unit: "",
      pricePerUnit: "",
      currency: "",
      description: "",
      images: [],
    });
    setPreviewImages([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cropName.trim()) newErrors.cropName = "Crop name is required";
    if (!formData.cropType) newErrors.cropType = "Crop type is required";
    if (!formData.plantingDate) newErrors.plantingDate = "Planting date is required";
    if (!formData.expectedHarvestDate) newErrors.expectedHarvestDate = "Expected harvest date is required";
    if (!formData.estimatedQuantity || formData.estimatedQuantity <= 0) 
      newErrors.estimatedQuantity = "Valid quantity is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) 
      newErrors.pricePerUnit = "Valid price is required";
    if (!formData.currency) newErrors.currency = "Currency is required";
    
    // Date validation
    if (formData.plantingDate && formData.expectedHarvestDate) {
      const planting = new Date(formData.plantingDate);
      const harvest = new Date(formData.expectedHarvestDate);
      
      if (harvest <= planting) {
        newErrors.expectedHarvestDate = "Harvest date must be after planting date";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name === "images") {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length + previewImages.length > 5) {
        setMessage("❌ Maximum 5 images allowed");
        return;
      }
      
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...selectedFiles] }));
      setPreviewImages(prev => [...prev, ...selectedFiles.map((file) => URL.createObjectURL(file))]);
      setMessage("");
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev, 
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uploadImagesToCloudinary = async (images) => {
    const urls = [];
    for (const [index, img] of images.entries()) {
      const data = new FormData();
      data.append("file", img);
      data.append("upload_preset", UPLOAD_PRESET);
      
      try {
        const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              ((index + progressEvent.loaded / progressEvent.total) / images.length) * 100
            );
            setUploadProgress(percentCompleted);
          }
        });
        urls.push(res.data.secure_url);
      } catch (err) {
        console.error("Image upload failed:", err);
        throw new Error("Image upload failed");
      }
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage("❌ Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    setMessage("");
    setUploadProgress(0);

    try {
      let imageUrls = existingHarvest?.imageUrls || [];

      if (formData.images.length > 0) {
        const newImageUrls = await uploadImagesToCloudinary(formData.images);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const harvestPayload = {
        ...formData,
        imageUrls,
        farmerId: existingHarvest ? undefined : farmerId,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = existingHarvest
        ? await axios.put(
            `${API_URL}/harvests/${existingHarvest._id}`,
            harvestPayload,
            config
          )
        : await axios.post(`${API_URL}/harvests`, harvestPayload, config);

      setMessage(
        `✅ Harvest ${existingHarvest ? "updated" : "posted"} successfully!`
      );
      setTimeout(() => {
        existingHarvest ? onUpdate?.(response.data) : onPost?.(response.data);
        if (!existingHarvest) resetForm();
        setUploadProgress(0);
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit harvest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-green-400 border-b border-green-700 pb-2">
          {existingHarvest ? "Edit Harvest" : "Add New Harvest"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Crop Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faSeedling} className="mr-2" />
              Crop Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="cropName"
                placeholder="e.g., Golden Maize"
                value={formData.cropName}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg bg-gray-800 text-white border ${
                  errors.cropName ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              <FontAwesomeIcon
                icon={faSeedling}
                className="absolute left-3 top-3.5 text-green-400"
              />
            </div>
            {errors.cropName && (
              <p className="text-red-400 text-xs flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                {errors.cropName}
              </p>
            )}
          </div>

          {/* Crop Type */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faSeedling} className="mr-2" />
              Crop Type
            </label>
            <div className="relative">
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg bg-gray-800 text-white border ${
                  errors.cropType ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value="">Select Crop Type</option>
                {cropTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon
                icon={faSeedling}
                className="absolute left-3 top-3.5 text-green-400"
              />
            </div>
            {errors.cropType && (
              <p className="text-red-400 text-xs flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                {errors.cropType}
              </p>
            )}
          </div>

          {/* Planting Date */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Planting Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="plantingDate"
                value={formData.plantingDate}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg bg-gray-800 text-white border ${
                  errors.plantingDate ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute left-3 top-3.5 text-green-400"
              />
            </div>
            {errors.plantingDate && (
              <p className="text-red-400 text-xs flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                {errors.plantingDate}
              </p>
            )}
          </div>

          {/* Expected Harvest Date */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Expected Harvest Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="expectedHarvestDate"
                value={formData.expectedHarvestDate}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg bg-gray-800 text-white border ${
                  errors.expectedHarvestDate ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute left-3 top-3.5 text-green-400"
              />
            </div>
            {errors.expectedHarvestDate && (
              <p className="text-red-400 text-xs flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                {errors.expectedHarvestDate}
              </p>
            )}
          </div>

          {/* Estimated Quantity */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faWeightHanging} className="mr-2" />
              Estimated Quantity
            </label>
            <div className="relative">
              <input
                type="number"
                name="estimatedQuantity"
                placeholder="e.g., 100"
                min="0"
                step="0.01"
                value={formData.estimatedQuantity}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg bg-gray-800 text-white border ${
                  errors.estimatedQuantity ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              <FontAwesomeIcon
                icon={faWeightHanging}
                className="absolute left-3 top-3.5 text-green-400"
              />
            </div>
            {errors.estimatedQuantity && (
              <p className="text-red-400 text-xs flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                {errors.estimatedQuantity}
              </p>
            )}
          </div>

          {/* Unit */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faWeightHanging} className="mr-2" />
              Unit
            </label>
            <div className="relative">
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg bg-gray-800 text-white border ${
                  errors.unit ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon
                icon={faWeightHanging}
                className="absolute left-3 top-3.5 text-green-400"
              />
            </div>
            {errors.unit && (
              <p className="text-red-400 text-xs flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                {errors.unit}
              </p>
            )}
          </div>

          {/* Price Per Unit */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
              Price Per Unit
            </label>
            <div className="relative">
              <input
                type="number"
                name="pricePerUnit"
                placeholder="e.g., 1500"
                min="0"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg bg-gray-800 text-white border ${
                  errors.pricePerUnit ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              <FontAwesomeIcon
                icon={faDollarSign}
                className="absolute left-3 top-3.5 text-green-400"
              />
            </div>
            {errors.pricePerUnit && (
              <p className="text-red-400 text-xs flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                {errors.pricePerUnit}
              </p>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
              Currency
            </label>
            <div className="relative">
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg bg-gray-800 text-white border ${
                  errors.currency ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value="">Select Currency</option>
                {currencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="absolute left-3 top-3.5 text-green-400"
              />
            </div>
            {errors.currency && (
              <p className="text-red-400 text-xs flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                {errors.currency}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faPen} className="mr-2" />
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add details about your crop, quality, farming methods, etc."
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-green-300">
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Upload Images (Max 5)
            </label>
            <label
              htmlFor="imageUpload"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors"
            >
              <FontAwesomeIcon icon={faUpload} />
              Select Images
            </label>
            <input
              id="imageUpload"
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="hidden"
            />
            <p className="text-gray-400 text-sm">Upload high-quality images of your crops</p>
          </div>

          {/* Preview Images */}
          {previewImages.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-green-300 mb-2">Image Previews</h3>
              <div className="flex flex-wrap gap-3">
                {previewImages.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${i}`}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="md:col-span-2">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-green-300 mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-700">
            <div className="flex gap-3">
              {existingHarvest && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white py-2.5 px-5 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} />
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-5 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} />
                Reset
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-medium py-2.5 px-6 rounded-lg transition-colors min-w-[160px] justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {existingHarvest ? "Updating..." : "Posting..."}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={existingHarvest ? faPen : faUpload} />
                  {existingHarvest ? "Update Harvest" : "Post Harvest"}
                </>
              )}
            </button>
          </div>

          {message && (
            <div className={`md:col-span-2 text-center p-3 rounded-lg mt-2 ${
              message.includes("✅") ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default HarvestForm;