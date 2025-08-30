import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { FiLogIn, FiUser, FiLock, FiAlertCircle } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("adminToken", token);
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-blue-500 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 15}s`,
              transform: `scale(${0.5 + Math.random() * 2})`,
            }}
          ></div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 relative z-10 transform transition-all duration-300 hover:shadow-blue-500/10"
      >
        <div className="flex flex-col items-center mb-8">
          {/* Back Link */}
          <div className="self-start mb-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition-all duration-200 hover:gap-3"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl mb-5 shadow-lg">
            <FiLogIn className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
          <p className="text-gray-400 text-center">
            Enter your credentials to access the admin dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-300 flex items-center gap-3 animate-fadeIn">
            <FiAlertCircle className="flex-shrink-0 text-lg" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-3 font-medium">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiUser className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-3 font-medium">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="text-gray-400 text-lg" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3.5 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none p-2 rounded-full hover:bg-gray-600/30 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 mt-8 ${
            loading
              ? "bg-blue-700 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/20"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Authenticating...
            </>
          ) : (
            <>
              <FiLogIn className="text-lg" />
              Sign In to Dashboard
            </>
          )}
        </button>
        
        <div className="mt-6 text-center">
          <a href="#" className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200">
            Forgot your password?
          </a>
        </div>
      </form>
      
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;