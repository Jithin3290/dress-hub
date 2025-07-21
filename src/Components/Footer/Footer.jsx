import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      // Optionally send email to backend here
    }
  };

  return (
    <footer className="bg-gradient-to-r from-pink-100 via-purple-100 to-green-100 text-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo Section */}
        <div className="flex flex-col gap-3 items-start">
          <img src="/product/logo_big.png" alt="DressHub Logo" className="w-16 h-16" />
          <p className="text-2xl font-bold">DressHub</p>
          <p className="text-sm text-gray-600">Fashion for every moment.</p>
        </div>

        {/* Navigation Section */}
        <div>
          <h4 className="font-semibold text-lg mb-2">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-purple-600 transition">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-purple-600 transition">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-purple-600 transition">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-2">Shop</h4>
          <ul className="space-y-2">
            <li><Link to="/mens" className="hover:text-purple-600 transition">Men</Link></li>
            <li><Link to="/womens" className="hover:text-purple-600 transition">Women</Link></li>
            <li><Link to="/kids" className="hover:text-purple-600 transition">Kids</Link></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h4 className="font-semibold text-lg mb-2">Subscribe to Newsletter</h4>
          <p className="text-sm mb-3 text-gray-600">Get exclusive offers on your email</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Your Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleSubscribe}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                subscribed ? 'bg-green-500 cursor-default' : 'bg-purple-600 hover:bg-purple-700'
              } transition`}
              disabled={subscribed}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-10 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
        &copy; {new Date().getFullYear()} DressHub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
