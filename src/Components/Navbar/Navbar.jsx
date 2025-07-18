import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import CartContext from '../../Context/CartContext';
import WishlistContext from '../../Context/WishlistContext';

function Navbar() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { wish, setWish } = useContext(WishlistContext);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch user on mount
  useEffect(() => {
    const authUser = JSON.parse(sessionStorage.getItem('user'));
    setUser(authUser?.login ? authUser : null);
  }, []);

  // ✅ Logout logic
  const handleLogout = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
            toast.success("Logged out");
      setUser(null);
      setCartItems({});
      sessionStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  };

  const activeClass = 'text-pink-600 border-b-2 border-pink-600';

  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/product/logo.png" alt="logo" className="w-10 h-10" />
        <p className="text-2xl font-bold text-pink-600">DressHub</p>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="sm:hidden text-gray-700 text-2xl"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        ☰
      </button>

      {/* Navigation Links */}
      <ul
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } sm:flex flex-col sm:flex-row sm:items-center gap-6 text-gray-700 font-medium w-full sm:w-auto mt-4 sm:mt-0`}
      >
        <li><NavLink to="/" end className={({ isActive }) => (isActive ? activeClass : '')}>Shop</NavLink></li>
        <li><NavLink to="/mens" className={({ isActive }) => (isActive ? activeClass : '')}>Men</NavLink></li>
        <li><NavLink to="/womens" className={({ isActive }) => (isActive ? activeClass : '')}>Women</NavLink></li>
        <li><NavLink to="/kids" className={({ isActive }) => (isActive ? activeClass : '')}>Kids</NavLink></li>
      </ul>

      {/* Icons and Profile/Login */}
      <div className="flex items-center gap-4 mt-4 sm:mt-0 relative">
        <NavLink to="/order" className={({ isActive }) => (isActive ? activeClass : '')}>Orders</NavLink>

        {/* Wishlist */}
        <Link to="/wish" className="relative text-xl">
          ❤️
          {wish?.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full px-1">
              {wish.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src="/product/cart_icon.png" alt="cart" className="w-6 h-6" />
          {Object.keys(cartItems).length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full px-1">
              {Object.keys(cartItems).length}
            </span>
          )}
        </Link>

        {/* Login / Profile */}
        {!user ? (
          <Link to="/login">
            <button className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 text-sm sm:text-base">
              Login
            </button>
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 text-sm sm:text-base"
            >
              Profile
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg text-sm z-20">
                <div className="px-4 py-2 border-b">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-600 text-xs">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
