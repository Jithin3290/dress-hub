// src/pages/Signup.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../Redux/Slices/authSlice"; 
import { requestSignupOtp } from "../Redux/Slices/authSlice"; 
import useProtectedLoginRedirect from "../Components/ProtectedRoutes/useProtectedLoginRedirect";
import { FiUser, FiMail, FiPhone, FiLock, FiCamera, FiCheckCircle } from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi";

export default function Signup() {
  useProtectedLoginRedirect();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password1: "",
    password2: "",
    profile_picture: null,
  });

  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  // OTP UI state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const resendRef = useRef(null);

  useEffect(() => {
    return () => {
      if (resendRef.current) clearInterval(resendRef.current);
    };
  }, []);

  const startResendCountdown = (seconds = 60) => {
    setResendTimer(seconds);
    if (resendRef.current) clearInterval(resendRef.current);
    resendRef.current = setInterval(() => {
      setResendTimer((s) => {
        if (s <= 1) {
          clearInterval(resendRef.current);
          resendRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture") {
      setFormData((p) => ({ ...p, [name]: files[0] || null }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleRequestOtp = async () => {
    if (!validateEmail(formData.email)) {
      setErrors((p) => ({ ...p, email: "Enter a valid email to receive OTP" }));
      return;
    }

    setOtpLoading(true);
    setErrors((p) => ({ ...p, otp: "" }));

    try {
      await dispatch(requestSignupOtp({ email: formData.email })).unwrap();
      setOtpSent(true);
      startResendCountdown(60);
    } catch (err) {
      console.error("OTP request failed", err);
      setErrors((p) => ({ ...p, otp: err?.detail || "Failed to send OTP" }));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim() || formData.name.length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email address";
    if (!formData.phone_number.trim()) newErrors.phone_number = "Phone number is required";
    if (formData.password1.length < 6) newErrors.password1 = "Password must be at least 6 characters";
    if (formData.password1 !== formData.password2) newErrors.password2 = "Passwords do not match";
    if (!agree) newErrors.agree = "You must agree to the terms";

    if (otpSent && !String(otpCode).trim()) newErrors.otp = "Enter the OTP sent to your email";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        if (k === "profile_picture" && v instanceof File) {
          payload.append(k, v);
        } else {
          payload.append(k, v);
        }
      }
    });

    if (otpCode) payload.append("otp", otpCode);

    try {
      await dispatch(signupUser(payload)).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Signup error", err);
      const apiErrors = {};
      if (err?.email) apiErrors.email = err.email[0];
      if (err?.phone_number) apiErrors.phone_number = err.phone_number[0];
      if (err?.password1) apiErrors.password1 = err.password1[0];
      if (err?.password2) apiErrors.password2 = err.password2[0];
      if (err?.otp) apiErrors.otp = err.otp[0] || err.otp;
      if (err?.non_field_errors) apiErrors.non_field = err.non_field_errors[0];
      if (err?.detail) apiErrors.non_field = err.detail;
      setErrors(apiErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left side - Brand/Info */}
        <div className="md:w-2/5 bg-gradient-to-br from-pink-600 to-purple-600 p-8 text-white flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <HiOutlineShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">FashionStore</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">Join Our Fashion Community</h2>
            <p className="text-pink-100 opacity-90">
              Create an account to explore exclusive collections, track orders, and get personalized style recommendations.
            </p>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-pink-200" />
              <span className="text-sm">Exclusive member discounts</span>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-pink-200" />
              <span className="text-sm">Fast checkout & order tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-pink-200" />
              <span className="text-sm">Personalized style recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-pink-200" />
              <span className="text-sm">Early access to new collections</span>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/20">
            <p className="text-sm opacity-80">Already have an account?</p>
            <Link to="/login" className="inline-block mt-2 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors font-medium">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="md:w-3/5 bg-white p-8 md:p-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Create Account</h3>
            <p className="text-gray-600 mt-2">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.non_field && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm">{errors.non_field}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors`}
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{errors.name}</p>}
            </div>

            {/* Email & OTP Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="inline w-4 h-4 mr-2" />
                Email Address
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`flex-1 px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpLoading || resendTimer > 0}
                  className={`px-4 py-3 rounded-lg border font-medium transition-all ${otpLoading || resendTimer > 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'}`}
                >
                  {otpLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></span>
                      Sending
                    </span>
                  ) : resendTimer > 0 ? (
                    `${resendTimer}s`
                  ) : otpSent ? (
                    "Resend OTP"
                  ) : (
                    "Get OTP"
                  )}
                </button>
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{errors.email}</p>}
            </div>

            {/* OTP Field (when sent) */}
            {otpSent && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <HiOutlineShieldCheck className="inline w-4 h-4 mr-2" />
                  Verification Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                  disabled={loading}
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{errors.otp}</p>}
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="inline w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className={`w-full px-4 py-3 rounded-lg border ${errors.phone_number ? 'border-red-500' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors`}
                disabled={loading}
              />
              {errors.phone_number && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{errors.phone_number}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiLock className="inline w-4 h-4 mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  name="password1"
                  value={formData.password1}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password1 ? 'border-red-500' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors`}
                  disabled={loading}
                />
                {errors.password1 && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{errors.password1}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiLock className="inline w-4 h-4 mr-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password2 ? 'border-red-500' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors`}
                  disabled={loading}
                />
                {errors.password2 && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{errors.password2}</p>}
              </div>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCamera className="inline w-4 h-4 mr-2" />
                Profile Picture <span className="text-gray-500 text-sm font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
                    disabled={loading}
                  />
                </div>
                {formData.profile_picture && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-200">
                    <img 
                      src={URL.createObjectURL(formData.profile_picture)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  disabled={loading}
                  className="mt-1 w-4 h-4 text-pink-600 rounded focus:ring-pink-500 border-gray-300"
                />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  I agree to the <a href="#" className="text-pink-600 hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-pink-600 hover:underline font-medium">Privacy Policy</a>. I understand that my data will be processed in accordance with these terms.
                </label>
              </div>
              {errors.agree && <p className="text-red-500 text-sm mt-2 flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{errors.agree}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 rounded-lg font-semibold text-white transition-all ${loading 
                ? 'bg-pink-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Already have account link (mobile) */}
            <div className="pt-4 border-t border-gray-200 md:hidden">
              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-pink-600 hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}