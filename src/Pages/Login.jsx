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

      // ✅ Step 1: Check if admin by email/password
      const isAdmin = email === 'admin@gmail.com' && password === '123454321';

      // ✅ Step 2: Update login & admin status on server
      await axios.patch(`http://localhost:3000/user/${user.id}`, {
        login: true,
        isAdmin: isAdmin,
      });

      // ✅ Step 3: Save in sessionStorage
      const updatedUser = { ...user, login: true, isAdmin: isAdmin };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Login successful!");

      // ✅ Step 4: Navigate based on isAdmin
      if (isAdmin) {
        navigate('/admin',{ replace: true });
      } else {
        navigate('/',{ replace: true });
      }

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
