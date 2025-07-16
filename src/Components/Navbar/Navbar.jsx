import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import CartContext from '../../Context/CartContext';
import WishlistContext from '../../Context/WishlistContext';

function Navbar() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { wish, setWish } = useContext(WishlistContext);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(authUser?.login ? authUser : null);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setCartItems({});   // 🧹 Clear cart
    setWish([]);        // 🧹 Clear wishlist
    setUser(null);
    navigate("/");
  };

  const activeClass = 'text-pink-600 border-b-2 border-pink-600';

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src="/product/logo.png" alt="logo" className="w-10 h-10" />
        <p className="text-2xl font-bold text-pink-600">DressHub</p>
      </div>

      <ul className="flex items-center gap-6 text-gray-700 font-medium">
        <li><NavLink to="/" end className={({ isActive }) => (isActive ? activeClass : '')}>Shop</NavLink></li>
        <li><NavLink to="/mens" className={({ isActive }) => (isActive ? activeClass : '')}>Men</NavLink></li>
        <li><NavLink to="/womens" className={({ isActive }) => (isActive ? activeClass : '')}>Women</NavLink></li>
        <li><NavLink to="/kids" className={({ isActive }) => (isActive ? activeClass : '')}>Kids</NavLink></li>
      </ul>

      <div className="flex items-center gap-4 relative">
        <NavLink to="/order" className={({ isActive }) => (isActive ? activeClass : '')}>
          Orders
        </NavLink>

        <Link to="/wish" className="relative text-xl">
          ❤️
          {wish.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full px-1">
              {wish.length}
            </span>
          )}
        </Link>

        <Link to="/cart" className="relative">
          <img src="/product/cart_icon.png" alt="cart" className="w-6 h-6" />
          {Object.keys(cartItems).length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full px-1">
              {Object.keys(cartItems).length}
            </span>
          )}
        </Link>

        {!user ? (
          <Link to="/Signup">
            <button className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700">
              Login
            </button>
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
            >
              Profile
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg text-sm z-10">
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
