import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartContext from '../../Context/CartContext';
import WishlistContext from '../../Context/WishlistContext';

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { wish } = useContext(WishlistContext);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src="/product/logo.png" alt="logo" className="w-10 h-10" />
        <p className="text-2xl font-bold text-pink-600">DressHub</p>
      </div>

      <ul className="flex items-center gap-6 text-gray-700 font-medium">
        <li className={currentPath === '/' ? 'text-pink-600 border-b-2 border-pink-600' : ''}>
          <Link to="/">Shop</Link>
        </li>
        <li className={currentPath === '/mens' ? 'text-pink-600 border-b-2 border-pink-600' : ''}>
          <Link to="/mens">Men</Link>
        </li>
        <li className={currentPath === '/womens' ? 'text-pink-600 border-b-2 border-pink-600' : ''}>
          <Link to="/womens">Women</Link>
        </li>
        <li className={currentPath === '/kids' ? 'text-pink-600 border-b-2 border-pink-600' : ''}>
          <Link to="/kids">Kids</Link>
        </li>
      </ul>

      <div className="flex items-center gap-4">
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

        <Link to="/Signup">
          <button className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
