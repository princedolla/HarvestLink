import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+250");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [farmName, setFarmName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedCrops, setSelectedCrops] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const cropOptions = [
    "Maize",
    "Beans",
    "Tomatoes",
    "Potatoes",
    "Bananas",
    "Rice",
  ];

  useEffect(() => {
    if (phone && !phone.startsWith("+250")) {
      setPhone("+250" + phone.replace(/^\+250/, ""));
    }
  }, [phone]);

  const toggleCrop = (crop) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value.startsWith("+250") && /^\+?\d*$/.test(value))) {
      setPhone(value);
    }
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!name || !phone || !location || !password) {
      alert(
        "Please fill in all required fields (Name, Phone, Location, Password)."
      );
      return;
    }

    if (!/^\+250\d{9}$/.test(phone)) {
      alert("Please enter a valid Rwandan phone number (e.g. +25078XXXXXXX)");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("location", location);
    formData.append("password", password);
    formData.append("farmName", farmName);
    formData.append("crops", JSON.stringify(selectedCrops));
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, formData);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Registration successful!");
        navigate("/dashboard");
      } else {
        alert("Registration succeeded but no token received.");
      }
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image/Graphics */}
          <div className="md:w-1/2 bg-green-900 p-8 flex flex-col justify-center items-center">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-300 mb-2">
                Join Our Farming Community
              </h2>
              <p className="text-green-200">
                Connect with farmers across Rwanda and grow your business
              </p>
            </div>
            <div className="w-full max-w-xs">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Farming in Rwanda"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-8 md:p-10">
            {/* Back Link */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-300">
                Fill in your details to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile Image */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="relative mb-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="w-24 h-24 object-cover rounded-full border-4 border-green-800 shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-700 border-4 border-green-800 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-1 cursor-pointer hover:bg-green-700 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">+250</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="78XXXXXXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`${inputClass} pl-16`}
                    maxLength={13}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Farm Location *
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {/* Farm Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Farm Name
                </label>
                <input
                  type="text"
                  placeholder="Enter farm name"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-10`}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputClass} pr-10`}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>

              {/* Crops */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Crops You Grow
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cropOptions.map((crop) => (
                    <label key={crop} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCrops.includes(crop)}
                        onChange={() => toggleCrop(crop)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-500 rounded bg-gray-700"
                      />
                      <span className="text-gray-300 text-sm">{crop}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
                    isLoading
                      ? "bg-green-800 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Register Now"
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="md:col-span-2 text-center mt-4">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-green-400 hover:text-green-300 hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputClass =
  "w-full px-4 py-2 text-sm rounded-lg border border-gray-600 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700 text-gray-200 placeholder-gray-400";

export default RegisterForm;
