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
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const selectedFiles = Array.from(files);
      setFormData((prev) => ({ ...prev, images: selectedFiles }));
      setPreviewImages(selectedFiles.map((file) => URL.createObjectURL(file)));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImagesToCloudinary = async (images) => {
    const urls = [];
    for (const img of images) {
      const data = new FormData();
      data.append("file", img);
      data.append("upload_preset", UPLOAD_PRESET);
      const res = await axios.post(CLOUDINARY_UPLOAD_URL, data);
      urls.push(res.data.secure_url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrls = [];

      if (formData.images.length > 0) {
        imageUrls = await uploadImagesToCloudinary(formData.images);
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
      existingHarvest ? onUpdate?.(response.data) : onPost?.(response.data);
      if (!existingHarvest) resetForm();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit harvest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 text-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Crop Name */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faSeedling}
          className="absolute left-3 top-3 text-green-400"
        />
        <input
          type="text"
          name="cropName"
          placeholder="Crop Name"
          value={formData.cropName}
          onChange={handleChange}
          required
          className="w-full pl-10 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
        />
      </div>

      {/* Crop Type */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faSeedling}
          className="absolute left-3 top-3 text-green-400"
        />
        <select
          name="cropType"
          value={formData.cropType}
          onChange={handleChange}
          required
          className="w-full pl-10 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
        >
          <option value="">Select Crop Type</option>
          {cropTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Planting Date */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faCalendarAlt}
          className="absolute left-3 top-3 text-green-400"
        />
        <input
          type="date"
          name="plantingDate"
          value={formData.plantingDate}
          onChange={handleChange}
          className="w-full pl-10 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
        />
      </div>

      {/* Expected Harvest Date */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faCalendarAlt}
          className="absolute left-3 top-3 text-green-400"
        />
        <input
          type="date"
          name="expectedHarvestDate"
          value={formData.expectedHarvestDate}
          onChange={handleChange}
          className="w-full pl-10 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
        />
      </div>

      {/* Estimated Quantity */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faWeightHanging}
          className="absolute left-3 top-3 text-green-400"
        />
        <input
          type="number"
          name="estimatedQuantity"
          placeholder="Quantity"
          value={formData.estimatedQuantity}
          onChange={handleChange}
          className="w-full pl-10 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
        />
      </div>

      {/* Unit */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faWeightHanging}
          className="absolute left-3 top-3 text-green-400"
        />
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          required
          className="w-full pl-10 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
        >
          <option value="">Select Unit</option>
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      {/* Price Per Unit */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faDollarSign}
          className="absolute left-3 top-3 text-green-400"
        />
        <input
          type="number"
          name="pricePerUnit"
          placeholder="Price per Unit"
          value={formData.pricePerUnit}
          onChange={handleChange}
          className="w-full pl-10 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
        />
      </div>

      {/* Currency */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faMoneyBill}
          className="absolute left-3 top-3 text-green-400"
        />
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          required
          className="w-full pl-10 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
        >
          <option value="">Select Currency</option>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label
          htmlFor="description"
          className="block mb-1 font-semibold text-green-300"
        >
          <FontAwesomeIcon icon={faPen} className="mr-2" />
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Optional description"
          className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:ring-green-500"
        />
      </div>

      {/* Image Upload */}
      <div className="md:col-span-2">
        <label
          htmlFor="imageUpload"
          className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded cursor-pointer"
        >
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          Upload Images
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
      </div>

      {/* Preview Images */}
      {previewImages.length > 0 && (
        <div className="md:col-span-2 flex flex-wrap gap-2">
          {previewImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Preview ${i}`}
              className="w-24 h-24 object-cover rounded border border-green-500"
            />
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="md:col-span-2 flex justify-between items-center mt-4">
        {existingHarvest && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faXmark} />
            Cancel Edit
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded transition"
        >
          <FontAwesomeIcon icon={existingHarvest ? faPen : faUpload} />
          {loading
            ? existingHarvest
              ? "Updating..."
              : "Posting..."
            : existingHarvest
            ? "Update Harvest"
            : "Post Harvest"}
        </button>
      </div>

      {message && (
        <p className="col-span-2 text-center text-sm text-green-300 mt-2">
          {message}
        </p>
      )}
    </form>
  );
};

export default HarvestForm;
