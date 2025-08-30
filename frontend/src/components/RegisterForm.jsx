import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faEyeSlash, 
  faArrowLeft, 
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faLock,
  faSeedling,
  faLeaf,
  faUserPlus,
  faSignInAlt,
  faChartLine,
  faTractor // Replaced faFarm with faTractor which is more commonly available
} from "@fortawesome/free-solid-svg-icons";

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
  const [animateText, setAnimateText] = useState(false);
  const [error, setError] = useState("");
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
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimateText(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!name || !phone || !location || !password) {
      setError("Please fill in all required fields (Name, Phone, Location, Password).");
      return;
    }

    if (!/^\+250\d{9}$/.test(phone)) {
      setError("Please enter a valid Rwandan phone number (e.g. +25078XXXXXXX)");
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
        navigate("/dashboard");
      } else {
        setError("Registration succeeded but no token received.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Floating leaves */}
        <div className="absolute top-10 left-10 animate-float-slow">
          <FontAwesomeIcon icon={faLeaf} className="text-green-400/20 text-4xl rotate-45" />
        </div>
        <div className="absolute top-20 right-20 animate-float-medium">
          <FontAwesomeIcon icon={faLeaf} className="text-emerald-400/20 text-3xl -rotate-12" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-fast">
          <FontAwesomeIcon icon={faLeaf} className="text-lime-400/20 text-5xl rotate-30" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float-slow">
          <FontAwesomeIcon icon={faLeaf} className="text-green-400/20 text-2xl -rotate-20" />
        </div>
      </div>

      <div className="w-full max-w-6xl bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-green-700/30 relative z-10">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image/Graphics */}
          <div className="md:w-2/5 bg-gradient-to-br from-green-800 to-emerald-900 p-8 flex flex-col justify-center items-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-green-600/20"></div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-emerald-500/20"></div>
            
            <div className="text-center mb-8 z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-700/30 mb-4">
                <FontAwesomeIcon icon={faSeedling} className="text-green-300 text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-green-100 mb-2">
                Join Our Farming Community
              </h2>
              
              {/* Animated text with icons */}
              <div className="mt-6 p-4 bg-green-900/40 rounded-lg border border-green-700/30">
                <div className="flex items-center justify-center mb-2">
                  <FontAwesomeIcon icon={faChartLine} className="text-green-300 mr-2" />
                  <span className="text-green-200 font-medium">Dashboard Access</span>
                </div>
                <p className={`text-green-200/80 text-sm transition-all duration-1000 ease-in-out transform ${animateText ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  Create an account to access your dashboard.
                </p>
              </div>
            </div>
            <div className="w-full max-w-xs z-10 mt-4">
              <div className="bg-green-700/30 p-6 rounded-2xl shadow-inner border border-green-600/30">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Farming in Rwanda"
                  className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-500/50 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-500/50 rounded-br-2xl"></div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-3/5 p-8 md:p-10 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '120px'
              }}></div>
            </div>
            
            {/* Back Link */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-green-400 hover:text-green-300 font-medium flex items-center gap-2 transition-all duration-200 hover:gap-3 group"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Home
              </button>
            </div>
            
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-bold text-green-400 mb-2 flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faUserPlus} className="text-green-500" />
                Create Account
              </h2>
              <p className="text-gray-300">
                Fill in your details to get started
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-lg relative z-10">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Image */}
                <div className="md:col-span-2 flex flex-col items-center">
                  <div className="relative mb-4">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile Preview"
                        className="w-24 h-24 object-cover rounded-full border-4 border-green-800 shadow-sm transition-all duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-700/50 border-4 border-green-800 flex items-center justify-center transition-all duration-300 hover:scale-105">
                        <FontAwesomeIcon icon={faUser} className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 cursor-pointer hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 pl-10 text-sm rounded-lg border border-gray-600 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700/50 text-gray-200 placeholder-gray-400 shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+25078XXXXXXX"
                      value={phone}
                      onChange={handlePhoneChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 pl-10 text-sm rounded-lg border border-gray-600 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700/50 text-gray-200 placeholder-gray-400 shadow-inner"
                      maxLength={13}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 pl-10 text-sm rounded-lg border border-gray-600 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700/50 text-gray-200 placeholder-gray-400 shadow-inner"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Farm Location *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 pl-10 text-sm rounded-lg border border-gray-600 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700/50 text-gray-200 placeholder-gray-400 shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Farm Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Farm Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faTractor} className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter farm name"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 pl-10 text-sm rounded-lg border border-gray-600 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700/50 text-gray-200 placeholder-gray-400 shadow-inner"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 pl-10 pr-10 text-sm rounded-lg border border-gray-600 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700/50 text-gray-200 placeholder-gray-400 shadow-inner"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-300 transition-colors duration-200 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 pl-10 pr-10 text-sm rounded-lg border border-gray-600 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700/50 text-gray-200 placeholder-gray-400 shadow-inner"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-300 transition-colors duration-200 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
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
                      <label key={crop} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCrops.includes(crop)}
                          onChange={() => toggleCrop(crop)}
                          disabled={isLoading}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-500 rounded bg-gray-600"
                        />
                        <span className="text-gray-300 text-sm">{crop}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 shadow-lg ${
                      isLoading
                        ? "bg-green-800 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5"
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
                <div className="md:col-span-2 text-center pt-4 border-t border-gray-700/50">
                  <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-green-400 hover:text-green-300 hover:underline font-medium transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;