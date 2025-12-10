import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Redux/Slices/authSlice';
import useProtectedLoginRedirect from '../Components/ProtectedRoutes/useProtectedLoginRedirect';
function Login() {
  useProtectedLoginRedirect
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth || {});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // errors: { email: '', password: '', non_field: '' }
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

    // clear previous errors
    setErrors({});

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      // preserve your behavior: redirect and admin check
      if (result.user.is_staff || result.user.is_superuser) {
        setTimeout(() => {
            navigate("/admin", { replace: true });
        }, 100);
      } else {
        setTimeout(() => navigate('/'), 500);
      }
    } catch (err) {
      // Normalize common Django/DRF shapes
      const apiErr = {};
      if (err?.detail) apiErr.non_field = err.detail;
      if (err?.non_field_errors) apiErr.non_field = err.non_field_errors[0];
      if (err?.email) apiErr.email = err.email[0];
      if (err?.password) apiErr.password = err.password[0];

      // axios-like nesting
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
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-md"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        {errors.non_field && (
          <p className="text-red-500 text-sm mb-2 text-center">{errors.non_field}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
          className="w-full p-3 mb-1 border rounded focus:outline-pink-400"
          disabled={loading}
        />
        {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: '' }));
          }}
          className="w-full p-3 mb-1 border rounded focus:outline-pink-400"
          disabled={loading}
        />
        {errors.password && <p className="text-red-500 text-sm mb-3">{errors.password}</p>}

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
