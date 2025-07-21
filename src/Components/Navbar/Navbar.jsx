import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CartContext from "../../Context/CartContext";
import WishlistContext from "../../Context/WishlistContext";
import AuthContext from "../../Context/AuthContext";

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { wish } = useContext(WishlistContext);
  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [cartcount, setcartcount] = useState(0);
  const [wishcount, setwishcount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setcartcount(Object.keys(cartItems).length);
  }, [cartItems]);

  useEffect(() => {
    setwishcount(wish.length);
  }, [wish]);

  const handleLogout = () => {
    toast.success("Logged out");
    sessionStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false)
    navigate("/login", { replace: true });
  };

  const activeClass = "text-pink-600 border-b-2 border-pink-600";

  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between flex-wrap">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/product/logo.png" alt="logo" className="w-10 h-10" />
          <span className="text-2xl font-bold text-pink-600">DressHub</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? "✖" : "☰"}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-6 text-gray-700 font-medium items-center">
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? activeClass : "")}>
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/mens" className={({ isActive }) => (isActive ? activeClass : "")}>
              Men
            </NavLink>
          </li>
          <li>
            <NavLink to="/womens" className={({ isActive }) => (isActive ? activeClass : "")}>
              Women
            </NavLink>
          </li>
          <li>
            <NavLink to="/kids" className={({ isActive }) => (isActive ? activeClass : "")}>
              Kids
            </NavLink>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link to="/wish" className="relative text-xl">
            ❤️
            {wishcount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full px-1">
                {wishcount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img src="/product/cart_icon.png" alt="cart" className="w-6 h-6" />
            {cartcount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full px-1">
                {cartcount}
              </span>
            )}
          </Link>

          {/* Profile/Login */}
          {!user ? (
            <Link to="/login">
              <button className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 text-sm">
                Login
              </button>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 text-sm"
              >
                Profile
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg text-sm z-30">
                  <div className="flex justify-between items-center border-b px-4 py-2">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-gray-600 text-xs">{user.email}</p>
                    </div>
                    <button
                      onClick={() => setShowDropdown(false)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      ❌
                    </button>
                  </div>
                  <Link
                    to="/order"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Orders
                  </Link>
                    <Link
                    to="/edit"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    Edit Profile
                    </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu (below icons) */}
      {mobileMenuOpen && (
        <ul className="sm:hidden mt-4 space-y-3 text-gray-700 font-medium">
          <li>
            <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => (isActive ? activeClass : "")}>
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/mens" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => (isActive ? activeClass : "")}>
              Men
            </NavLink>
          </li>
          <li>
            <NavLink to="/womens" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => (isActive ? activeClass : "")}>
              Women
            </NavLink>
          </li>
          <li>
            <NavLink to="/kids" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => (isActive ? activeClass : "")}>
              Kids
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
