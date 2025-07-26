import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#ffffff] to-[#e4ffe7] flex flex-col lg:flex-row items-center px-6 lg:px-24 py-16 transition-all duration-300">
      
      {/* Text Block */}
      <div className="flex-1 flex flex-col justify-center gap-6 text-center lg:text-left">
        <h2 className="text-gray-800 text-xl sm:text-2xl font-medium tracking-wide uppercase">
          New Arrivals
        </h2>

        <div className="text-[42px] sm:text-[60px] lg:text-[80px] xl:text-[96px] font-extrabold leading-tight space-y-1 text-gray-900">
          <div className="flex justify-center lg:justify-start items-center gap-4">
            <p className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              New
            </p>
            <img
              src="/product/hand_icon.png"
              alt="hand"
              className="w-12 sm:w-16 lg:w-20 animate-pulse"
            />
          </div>
          <p className="text-[#271e1e]">Collections</p>
          <p className="text-[#6b7280] text-opacity-90 text-[0.9em] tracking-wide">
            for everyone
          </p>
        </div>

        {/* Button */}
        <Link
          to="/mens"
          className="inline-flex items-center justify-center gap-3 h-14 sm:h-16 w-52 sm:w-72 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white text-base sm:text-lg font-semibold mt-8 hover:scale-105 hover:shadow-lg transition-transform duration-300"
        >
          Latest Collections
          <img
            src="/product/arrow.png"
            alt="arrow"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        </Link>
      </div>

      {/* Hero Image */}
      <div className="flex-1 flex justify-center mt-12 lg:mt-0">
        <img
          src="/product/NH2.png"
          alt="hero"
          className="w-[80%] max-w-[500px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
}

export default Hero;
