import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiKey, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const API_URL = "http://localhost:5000/api";

const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      setMessage("OTP sent to your email address");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-white flex-1 text-center">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h2>
            {step === 2 && <div className="w-5"></div>} {/* Spacer for alignment */}
          </div>

          {(error || message) && (
            <div
              className={`mb-6 p-3 rounded-lg flex items-center gap-3 ${
                error ? "bg-red-900/50 border border-red-700 text-red-300" : 
                "bg-green-900/50 border border-green-700 text-green-300"
              }`}
            >
              {error ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
              <span>{error || message}</span>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your registered email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={loading || !email}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                  loading || !email
                    ? "bg-blue-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <FiMail />
                    Send OTP
                  </>
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">OTP Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading || !otp || !newPassword}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                  loading || !otp || !newPassword
                    ? "bg-blue-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
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

        <div className="px-8 py-4 bg-gray-700/50 border-t border-gray-700">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
          >
            <FiArrowLeft size={14} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;