import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import CartContext from '../Context/CartContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/user?email=${email}&password=${password}`);

      if (res.data.length > 0) {
        const user = res.data[0];

        // Mark as logged in in the DB
        await axios.patch(`http://localhost:3000/user/${user.id}`, { login: true });

        // Sync cart to context if exists
        const userCart = user.cart || {};
        setCartItems(userCart);

        // Save to sessionStorage
        sessionStorage.setItem("user", JSON.stringify({ ...user, login: true, cart: userCart }));

        toast.success("Logged in successfully!");
        navigate('/');
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      toast.error("Login failed. Try again.");
      console.error(err);
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
          Don't have an account? Sign up
        </Link>
      </form>
    </div>
  );
}

export default Login;
