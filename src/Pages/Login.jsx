import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import useProtectedLoginRedirect from '../Components/ProtectedRoutes/useProtectedLoginRedirect';
import { loginUser } from '../Redux/Slices/authSlice'; 
function Login() {
  useProtectedLoginRedirect();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Enter a valid email");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      // dispatch(fetchRecentlyWatched());
      toast.success("Login successful");
      
      // Check if user is admin based on the response
      if (result.user?.is_staff || result.user?.is_superuser || result.isAdmin) {
        // Admin user - redirect to admin panel
        setTimeout(() => {
          window.location.href = "/admin";
        }, 100);
      } else {
        // Regular user - redirect to home
        setTimeout(() => navigate("/"), 500);
      }

    } catch (err) {
      // Handle specific error cases from Django
      if (err?.detail) {
        toast.error(err.detail);
      } else if (err?.non_field_errors) {
        toast.error(err.non_field_errors[0]);
      } else if (err?.email) {
        toast.error(err.email[0]);
      } else if (err?.password) {
        toast.error(err.password[0]);
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <Toaster position="top-center" toastOptions={{ duration: 800 }} reverseOrder={false} />
      
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-md"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 border rounded focus:outline-pink-400"
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-3 border rounded focus:outline-pink-400"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <Link
          to="/signup"
          className="block text-center text-sm text-pink-600 mt-4 hover:underline"
        >
          Don't have an account? Sign Up
        </Link>
      </form>
    </div>
  );
}

export default Login;