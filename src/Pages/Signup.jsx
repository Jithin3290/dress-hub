import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!agree) {
      toast.error("You must agree to the terms");
      return;
    }

    try {
      const existing = await axios.get(`http://localhost:3000/user?email=${email}`);
      if (existing.data.length > 0) {
        toast.error("Email already registered");
        return;
      }

      await axios.post("http://localhost:3000/user", {
        name,
        email,
        password,
        login: false,
        cart: {},       
        wish: []
      });

      toast.success("Signed up successfully!");
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      toast.error("Signup failed. Please try again.");
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
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-3 border rounded focus:outline-pink-400"
        />

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

        <div className="flex items-center gap-2 text-sm mb-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label>I agree to the terms and conditions</label>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Sign Up
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
