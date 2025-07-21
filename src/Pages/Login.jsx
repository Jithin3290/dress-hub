import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../Context/AuthContext';
import useProtectedLoginRedirect from '../Components/ProtectedRoute/useProtectedLoginRedirect';
function Login() {
  useProtectedLoginRedirect()
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

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
      const [userRes, adminRes] = await Promise.all([
        axios.get(`http://localhost:3000/user?email=${email}`),
        axios.get(`http://localhost:3000/admin?email=${email}`)
      ]);

      const user = userRes.data[0];
      const admin = adminRes.data[0];

      // ✅ Admin login logic
      if (admin && admin.password === password) {
        await axios.patch(`http://localhost:3000/admin/${admin.id}`, { login: true });

        // Set user with admin flag
        const adminWithRole = { ...admin, isAdmin: true };
        setUser(adminWithRole);

        toast.success("Admin login successful");

        // Clear history and go to /admin
        setTimeout(() => {
          window.location.href = "/admin";
        }, 100);

        return;
      }

      // ✅ User login logic
      if (!user || user.password !== password) {
        toast.error("Invalid email or password");
        return;
      }

      if (user.blocked) {
        toast.error("User account is blocked");
        return;
      }

      const u = await axios.patch(`http://localhost:3000/user/${user.id}`, { login: true });
      setUser({ ...user, isAdmin: false });
      toast.success("Login successful");
      setTimeout(() => navigate("/"), 500);

    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <Toaster position="top-center" reverseOrder={false} />
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
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-3 border rounded focus:outline-pink-400"
        />

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Login
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
