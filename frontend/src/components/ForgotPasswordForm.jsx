import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiMail, 
  FiKey, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiEye, 
  FiEyeOff,
  FiLock
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api";

const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    return null;
  };

  // Start countdown timer for OTP resend
  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    setError("");
    setMessage("");
    
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      setMessage("Verification code sent to your email");
      setStep(2);
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      setMessage("Verification code resent to your email");
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:shadow-3xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                aria-label="Go back"
              >
                <FiArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-white flex-1 text-center">
              {step === 1 ? "Reset Your Password" : "Create New Password"}
            </h2>
            {step === 2 && <div className="w-10"></div>}
          </div>

          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center">
                <FiLock className="text-blue-400 text-2xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">{step}/2</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-center mb-8">
            {step === 1 
              ? "Enter your email address and we'll send you a verification code" 
              : "Enter the verification code and your new password"
            }
          </p>

          {(error || message) && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 animate-fadeIn ${
                error 
                  ? "bg-red-900/30 border border-red-700/50 text-red-300" 
                  : "bg-green-900/30 border border-green-700/50 text-green-300"
              }`}
            >
              {error ? <FiAlertCircle size={20} className="mt-0.5 flex-shrink-0" /> : <FiCheckCircle size={20} className="mt-0.5 flex-shrink-0" />}
              <span>{error || message}</span>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-medium">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your registered email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={loading || !email}
                className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  loading || !email
                    ? "bg-blue-700 cursor-not-allowed opacity-75"
                    : "bg-blue-600 hover:bg-blue-500 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Code...
                  </>
                ) : (
                  <>
                    <FiMail />
                    Send Verification Code
                  </>
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-medium">Verification Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors tracking-widest"
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleResendOTP}
                    disabled={countdown > 0}
                    className={`text-sm ${countdown > 0 ? 'text-gray-500' : 'text-blue-400 hover:text-blue-300'}`}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-medium">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {newPassword && validatePassword(newPassword) && (
                  <p className="mt-2 text-xs text-red-400">{validatePassword(newPassword)}</p>
                )}
              </div>

              <div className="mb-8">
                <label className="block text-gray-300 mb-3 font-medium">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-2 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading || !otp || !newPassword || !confirmPassword || newPassword !== confirmPassword || validatePassword(newPassword)}
                className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  loading || !otp || !newPassword || !confirmPassword || newPassword !== confirmPassword || validatePassword(newPassword)
                    ? "bg-blue-700 cursor-not-allowed opacity-75"
                    : "bg-blue-600 hover:bg-blue-500 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Reset Password
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <div className="px-8 py-4 bg-gray-700/30 border-t border-gray-700">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors group"
          >
            <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordForm;