import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Redux/Slices/authSlice';
import useProtectedLoginRedirect from '../Components/ProtectedRoutes/useProtectedLoginRedirect';
import { FiMail, FiLock, FiArrowRight, FiShoppingBag } from 'react-icons/fi';

function Login() {
  useProtectedLoginRedirect();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth || {});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      if (result.user.is_staff || result.user.is_superuser) {
        setTimeout(() => {
            navigate("/admin", { replace: true });
        }, 100);
      }
      else if (result.user.is_banned) {
        newErrors.non_field = 'Your account has been banned';
        setErrors(newErrors);
      }
       else {
        setTimeout(() => navigate('/'), 500);
      }
    } catch (err) {
      const apiErr = {};
      if (err?.detail) apiErr.non_field = err.detail;
      if (err?.non_field_errors) apiErr.non_field = err.non_field_errors[0];
      if (err?.email) apiErr.email = err.email[0];
      if (err?.password) apiErr.password = err.password[0];

      if (!Object.keys(apiErr).length) {
        if (err?.response?.data) {
          const d = err.response.data;
          if (d.detail) apiErr.non_field = d.detail;
          if (d.non_field_errors) apiErr.non_field = d.non_field_errors[0];
          if (d.email) apiErr.email = d.email[0];
          if (d.password) apiErr.password = d.password[0];
        }
      }

      if (!Object.keys(apiErr).length) {
        apiErr.non_field = 'Login failed. Please try again.';
      }

      setErrors(apiErr);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left side - Brand/Info */}
        <div className="md:w-2/5 bg-gradient-to-br from-pink-600 to-purple-600 p-8 md:p-10 text-white flex flex-col justify-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FiShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">FashionStore</h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 leading-tight">Welcome Back!</h2>
            <p className="text-pink-100 opacity-90 mb-8">
              Sign in to your account to continue your fashion journey. Access your wishlist, track orders, and discover new styles.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-200 rounded-full"></div>
                <span className="text-sm">Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-200 rounded-full"></div>
                <span className="text-sm">Exclusive member discounts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-200 rounded-full"></div>
                <span className="text-sm">Fast & secure checkout</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/20">
              <p className="text-sm opacity-80 mb-3">New to FashionStore?</p>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 font-medium group"
              >
                Create Account
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="md:w-3/5 bg-white p-8 md:p-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sign In to Your Account</h3>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {errors.non_field && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fadeIn">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.non_field}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="inline w-4 h-4 mr-2 text-gray-500" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email 
                    ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                } transition-colors placeholder-gray-400`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiLock className="inline w-4 h-4 mr-2 text-gray-500" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password 
                    ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                } transition-colors placeholder-gray-400`}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.password}
                </p>
              )}
              
            
          
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                loading 
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-[0.99]'
              } group`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Sign In
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>


            {/* Mobile Signup Link */}
            <div className="pt-6 border-t border-gray-200 md:hidden">
              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-pink-600 hover:underline font-medium">
                  Create Account
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

export default Login;