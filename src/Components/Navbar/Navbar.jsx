// src/Components/Navbar/EditProfiles/EditProfileNavbar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../../Redux/Slices/authSlice"; // adjust path if needed
import { buildImageUrl } from "../../utils/image"; // adjust path if needed

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux sources
  const user = useSelector((state) => state.auth?.user ?? null);
  const cartItems = useSelector((state) => state.cart?.items ?? []);
  const wish = useSelector((state) => state.wishlist?.items ?? []);

  // compute counts (no local state for counts)
  const cartcount = React.useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    // server shape: items with "quantity"
    if (cartItems.length > 0 && Object.prototype.hasOwnProperty.call(cartItems[0], "quantity")) {
      return cartItems.reduce((s, it) => s + Number(it.quantity || 0), 0);
    }
    // fallback: array length
    return cartItems.length;
  }, [cartItems]);

  const wishcount = Array.isArray(wish) ? wish.length : 0;

  // local UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // hydrate redux user from sessionStorage if missing
  useEffect(() => {
    if (!user) {
      try {
        const raw = sessionStorage.getItem("user");
        if (raw) {
          const ssUser = JSON.parse(raw);
          if (ssUser) dispatch(setUser(ssUser));
        }
      } catch {
        // ignore parse errors
      }
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    toast.success("Logged out");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("recentlyWatched");
    dispatch(clearUser());
    setShowDropdown(false);
    navigate("/login", { replace: true });
  };

  const activeClass =
    "text-amber-600 font-bold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-600 after:animate-slideIn";

  const avatarUrl = buildImageUrl(user?.profile_picture);

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 px-4 sm:px-8 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/product/logo.png"
              alt="logo"
              className="w-12 h-12 transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -inset-1 bg-amber-500/20 rounded-full blur-sm group-hover:bg-amber-500/30 transition-colors duration-300"></div>
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-gray-800 to-amber-600 bg-clip-text text-transparent">
            DressHub
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-gray-700 font-semibold items-center">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `py-2 px-1 transition-all duration-300 hover:text-amber-600 ${
                  isActive ? activeClass : ""
                }`
              }
            >
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mens"
              className={({ isActive }) =>
                `py-2 px-1 transition-all duration-300 hover:text-amber-600 ${
                  isActive ? activeClass : ""
                }`
              }
            >
              Men
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/womens"
              className={({ isActive }) =>
                `py-2 px-1 transition-all duration-300 hover:text-amber-600 ${
                  isActive ? activeClass : ""
                }`
              }
            >
              Women
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/kids"
              className={({ isActive }) =>
                `py-2 px-1 transition-all duration-300 hover:text-amber-600 ${
                  isActive ? activeClass : ""
                }`
              }
            >
              Kids
            </NavLink>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {/* Wishlist */}
          <Link
            to="/wish"
            className="relative group p-2 rounded-lg hover:bg-amber-50 transition-colors duration-300"
          >
            <div className="relative">
              <svg
                className="w-6 h-6 text-gray-700 group-hover:text-amber-600 transition-colors duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {wishcount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {wishcount}
                </span>
              )}
            </div>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative group p-2 rounded-lg hover:bg-amber-50 transition-colors duration-300"
          >
            <div className="relative">
              <svg
                className="w-6 h-6 text-gray-700 group-hover:text-amber-600 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h9"
                />
              </svg>
              {cartcount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {cartcount}
                </span>
              )}
            </div>
          </Link>

          {/* Profile/Login */}
          {!user ? (
            <Link to="/login">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold shadow-md">
                Login
              </button>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold shadow-md"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
                Profile
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl text-sm z-30 overflow-hidden">
                  <div className="flex justify-between items-center border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100">
                    <div className="flex items-center gap-3">
                      {avatarUrl && (
                        <img
                          src={avatarUrl}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-gray-600 text-xs mt-1">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDropdown(false)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <Link
                    to="/order"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-amber-50 text-gray-700 border-b border-gray-100 transition-colors duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    My Orders
                  </Link>

                  <Link
                    to="/edit"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-amber-50 text-gray-700 border-b border-gray-100 transition-colors duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Edit Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 transition-colors duration-200 font-semibold"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-2xl text-gray-700 hover:text-amber-600 transition-colors duration-300 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-6 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-6 animate-slideDown">
          <ul className="space-y-4 text-gray-700 font-semibold">
            <li>
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-xl transition-all duration-300 hover:bg-amber-50 hover:text-amber-600 ${
                    isActive ? "bg-amber-50 text-amber-600 font-bold" : ""
                  }`
                }
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mens"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-xl transition-all duration-300 hover:bg-amber-50 hover:text-amber-600 ${
                    isActive ? "bg-amber-50 text-amber-600 font-bold" : ""
                  }`
                }
              >
                Men
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/womens"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-xl transition-all duration-300 hover:bg-amber-50 hover:text-amber-600 ${
                    isActive ? "bg-amber-50 text-amber-600 font-bold" : ""
                  }`
                }
              >
                Women
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/kids"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-xl transition-all duration-300 hover:bg-amber-50 hover:text-amber-600 ${
                    isActive ? "bg-amber-50 text-amber-600 font-bold" : ""
                  }`
                }
              >
                Kids
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
