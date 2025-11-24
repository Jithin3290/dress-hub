import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import useProtectedLoginRedirect from '../Components/ProtectedRoutes/useProtectedLoginRedirect';
import { signupUser } from "../Redux/Slices/authSlice.jsx"; 

function Signup() {
  useProtectedLoginRedirect();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password1: '',
    password2: '',
    profile_picture: null
  });
  const [agree, setAgree] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name.trim() || formData.name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (!formData.phone_number.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (formData.password1.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password1 !== formData.password2) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agree) {
      toast.error("You must agree to the terms");
      return;
    }

    try {
      const result = await dispatch(signupUser(formData)).unwrap();
      toast.success("Signed up successfully!");
      navigate('/login');
    } catch (err) {
      // Handle specific error cases from Django serializer
      if (err?.email) {
        toast.error(err.email[0]);
      } else if (err?.phone_number) {
        toast.error(err.phone_number[0]);
      } else if (err?.password1) {
        toast.error(err.password1[0]);
      } else if (err?.password2) {
        toast.error(err.password2[0]);
      } else if (err?.non_field_errors) {
        toast.error(err.non_field_errors[0]);
      } else {
        toast.error(err?.detail || "Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <Toaster position="top-center" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-md"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded focus:outline-pink-400"
          disabled={loading}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded focus:outline-pink-400"
          disabled={loading}
        />

        <input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded focus:outline-pink-400"
          disabled={loading}
        />

        <input
          type="password"
          name="password1"
          placeholder="Password"
          value={formData.password1}
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded focus:outline-pink-400"
          disabled={loading}
        />

        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded focus:outline-pink-400"
          disabled={loading}
        />

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

        <div className="flex items-center gap-2 text-sm mb-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            disabled={loading}
          />
          <label>I agree to the terms and conditions</label>
        </div>

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