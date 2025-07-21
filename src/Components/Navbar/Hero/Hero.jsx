import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e4e1ff] to-[#e1ffea22] flex flex-col lg:flex-row items-center px-6 lg:px-24 py-12">
      
      {/* Text Block */}
      <div className="flex-1 flex flex-col justify-center gap-6 text-center lg:text-left">
        <h2 className="text-black text-xl sm:text-2xl font-medium">NEW ARRIVALS</h2>

        <div className="text-[40px] sm:text-[60px] lg:text-[80px] xl:text-[100px] text-[#271e1e] font-bold leading-tight space-y-2">
          <div className="flex justify-center lg:justify-start items-center gap-4">
            <p>New</p>
            <img
              src="/product/hand_icon.png"
              alt="hand"
              className="w-12 sm:w-16 lg:w-20"
            />
          </div>
          <p>Collections</p>
          <p>for everyone</p>
        </div>

        {/* Button */}
        <Link
          to="/mens"
          className="inline-flex items-center justify-center gap-3 h-14 sm:h-16 w-52 sm:w-72 rounded-full bg-red-600 text-white text-base sm:text-lg font-semibold mt-6 hover:bg-red-700 transition"
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
          className="w-[80%] max-w-[500px] object-contain"
        />
      </div>
    </div>
  );
}

export default Hero;
