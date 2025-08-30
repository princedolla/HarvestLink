import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faEyeSlash, 
  faArrowLeft, 
  faEnvelope, 
  faPhone, 
  faLock,
  faUser,
  faSeedling,
  faChartLine,
  faSignInAlt,
  faLeaf
} from "@fortawesome/free-solid-svg-icons";

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const navigate = useNavigate();

  const animatedTexts = [
    "Please log in to view your dashboard.",
    "Access real-time farming insights.",
    "Connect with buyers directly.",
    "Track your crop performance."
  ];

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimateText(true);
    }, 300);
    
    // Text rotation animation
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { phone: identifier, password };

      const res = await axios.post(`${API_URL}/login`, payload);
      const { token, farmer } = res.data;

      if (!token || !farmer) {
        throw new Error("Invalid response from server.");
      }

      // Save token & farmer either in localStorage (remember me) or sessionStorage
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("farmer", JSON.stringify(farmer));
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("farmer");
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("farmer", JSON.stringify(farmer));
        localStorage.removeItem("token");
        localStorage.removeItem("farmer");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-teal-500/15 rounded-full blur-xl animate-pulse delay-1500"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '120px'
          }}></div>
        </div>
        
        {/* Floating leaves with enhanced animation */}
        <div className="absolute top-10 left-10 animate-float-slow">
          <FontAwesomeIcon icon={faLeaf} className="text-green-400/30 text-4xl rotate-45" />
        </div>
        <div className="absolute top-20 right-20 animate-float-medium">
          <FontAwesomeIcon icon={faLeaf} className="text-emerald-400/30 text-3xl -rotate-12" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-fast">
          <FontAwesomeIcon icon={faLeaf} className="text-lime-400/30 text-5xl rotate-30" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float-slow">
          <FontAwesomeIcon icon={faLeaf} className="text-green-400/30 text-2xl -rotate-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-medium">
          <FontAwesomeIcon icon={faLeaf} className="text-teal-400/25 text-3xl rotate-15" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-fast">
          <FontAwesomeIcon icon={faLeaf} className="text-yellow-400/20 text-4xl -rotate-30" />
        </div>
        
        {/* Subtle moving particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full animate-float-particles"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${15 + i * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-4xl bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-green-700/30 relative z-10">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image/Graphics */}
          <div className="md:w-2/5 bg-gradient-to-br from-green-800 to-emerald-900 p-8 flex flex-col justify-center items-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-green-600/30"></div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-emerald-500/30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-yellow-500/10 blur-xl"></div>
            
            <div className="text-center mb-8 z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-700/40 mb-4 shadow-lg">
                <FontAwesomeIcon icon={faSeedling} className="text-green-300 text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-green-100 mb-2">
                Welcome Back
              </h2>
              
              {/* Enhanced animated text with icons */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-900/50 to-emerald-900/40 rounded-xl border border-green-700/30 shadow-inner relative overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>
                
                <div className="flex items-center justify-center mb-2 relative z-10">
                  <FontAwesomeIcon icon={faChartLine} className="text-green-300 mr-2" />
                  <span className="text-green-200 font-medium">Dashboard Access</span>
                </div>
                <div className="h-8 overflow-hidden relative">
                  {animatedTexts.map((text, index) => (
                    <p 
                      key={index}
                      className={`text-green-200/80 text-sm transition-all duration-1000 ease-in-out absolute w-full text-center ${
                        textIndex === index 
                          ? 'translate-y-0 opacity-100' 
                          : index < textIndex 
                            ? '-translate-y-full opacity-0' 
                            : 'translate-y-full opacity-0'
                      }`}
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full max-w-xs z-10 mt-4">
              <div className="bg-green-700/40 p-6 rounded-2xl shadow-inner border border-green-600/30 transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Farming in Rwanda"
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-500/50 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-500/50 rounded-br-2xl"></div>
            
            {/* Animated dots */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-green-400/40 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-emerald-400/40 rounded-full animate-pulse delay-700"></div>
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
                <FontAwesomeIcon icon={faSignInAlt} className="text-green-500" />
                Sign In
              </h2>
              <p className="text-gray-300">
                Enter your credentials to continue
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
              {/* Identifier */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone or Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon 
                      icon={identifier.includes("@") ? faEnvelope : faPhone} 
                      className="h-5 w-5 text-gray-400" 
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Phone (+250...) or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pl-10 text-sm rounded-lg border border-gray-600 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700/50 text-gray-200 placeholder-gray-400 shadow-inner"
                    required
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pl-10 pr-10 text-sm rounded-lg border border-gray-600 focus:ring-2 outline-none focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700/50 text-gray-200 placeholder-gray-400 shadow-inner"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-500 rounded bg-gray-700/50"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-green-400 hover:text-green-300 transition-colors duration-200 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
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
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-700/50">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-green-400 hover:text-green-300 hover:underline font-medium transition-colors duration-200"
                  >
                    Create Account
                  </Link>
                </p>
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
        @keyframes float-particles {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
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
        .animate-float-particles {
          animation: float-particles linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;