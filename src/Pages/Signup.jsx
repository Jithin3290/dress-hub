import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useProtectedLoginRedirect from '../Components/ProtectedRoutes/useProtectedLoginRedirect';
import { signupUser } from "../Redux/Slices/authSlice.jsx"; 

function Signup() {
  useProtectedLoginRedirect();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password1: '',
    password2: '',
    profile_picture: null
  });
  
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear inline error when typing
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};

    // Frontend validation
    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    }

    if (formData.password1.length < 6) {
      newErrors.password1 = "Password must be at least 6 characters";
    }

    if (formData.password1 !== formData.password2) {
      newErrors.password2 = "Passwords do not match";
    }

    if (!agree) {
      newErrors.agree = "You must agree to the terms";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await dispatch(signupUser(formData)).unwrap();
      navigate('/login');
    } catch (err) {
      // Django backend errors
      const apiErrors = {};

      if (err?.email) apiErrors.email = err.email[0];
      if (err?.phone_number) apiErrors.phone_number = err.phone_number[0];
      if (err?.password1) apiErrors.password1 = err.password1[0];
      if (err?.password2) apiErrors.password2 = err.password2[0];
      if (err?.non_field_errors) apiErrors.non_field = err.non_field_errors[0];
      if (err?.detail) apiErrors.non_field = err.detail;

      setErrors(apiErrors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-md"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>

        {errors.non_field && (
          <p className="text-red-500 text-sm mb-2 text-center">{errors.non_field}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 mb-1 border rounded focus:outline-pink-400"
          disabled={loading}
        />
        {errors.name && <p className="text-red-500 text-sm mb-3">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-1 border rounded focus:outline-pink-400"
          disabled={loading}
        />
        {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

        <input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full p-3 mb-1 border rounded focus:outline-pink-400"
          disabled={loading}
        />
        {errors.phone_number && <p className="text-red-500 text-sm mb-3">{errors.phone_number}</p>}

        <input
          type="password"
          name="password1"
          placeholder="Password"
          value={formData.password1}
          onChange={handleChange}
          className="w-full p-3 mb-1 border rounded focus:outline-pink-400"
          disabled={loading}
        />
        {errors.password1 && <p className="text-red-500 text-sm mb-3">{errors.password1}</p>}

        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={handleChange}
          className="w-full p-3 mb-1 border rounded focus:outline-pink-400"
          disabled={loading}
        />
        {errors.password2 && <p className="text-red-500 text-sm mb-3">{errors.password2}</p>}

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-2">Profile Picture (Optional)</label>
          <input
            type="file"
            name="profile_picture"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-pink-400"
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-2 text-sm mb-1">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            disabled={loading}
          />
          <label>I agree to the terms and conditions</label>
        </div>
        {errors.agree && <p className="text-red-500 text-sm mb-3">{errors.agree}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        <Link
          to="/login"
          className="block text-center text-sm text-pink-600 mt-4 hover:underline"
        >
          Already have an account?
        </Link>
      </form>
    </div>
  );
}

export default Signup;
