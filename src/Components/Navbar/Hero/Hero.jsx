import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex flex-col lg:flex-row items-center justify-center px-6 lg:px-24 py-8 lg:py-12 transition-all duration-300 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-24 h-24 bg-teal-500/10 rounded-full mix-blend-overlay filter blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-amber-500/10 rounded-full mix-blend-overlay filter blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-emerald-500/10 rounded-full mix-blend-overlay filter blur-2xl animate-pulse delay-500"></div>

        {/* Geometric patterns */}
        <div className="absolute top-16 right-20 w-12 h-12 border-2 border-amber-400/20 rotate-45"></div>
        <div className="absolute bottom-20 left-20 w-10 h-10 border-2 border-teal-400/20 rotate-12"></div>
      </div>

      {/* Text Block */}
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start gap-6 text-center lg:text-left z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
          <h2 className="text-slate-300 text-xs font-medium tracking-widest uppercase">
            New Season Arrivals
          </h2>
        </div>

        <div className="space-y-3">
          <div className="text-[36px] sm:text-[52px] lg:text-[64px] xl:text-[72px] font-black leading-[0.9]">
            <div className="flex flex-col lg:flex-row flex-wrap justify-center lg:justify-start items-center lg:items-end gap-2 mb-1">
              <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                ELEVATE
              </span>
              <span className="text-slate-100 text-[0.8em]">YOUR</span>
            </div>
            <div className="text-slate-100 text-[0.9em]">STYLE</div>
          </div>

          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
            Discover our exclusive collection crafted for the modern individual.
            Where sophistication meets contemporary fashion.
          </p>
        </div>

        {/* Single CTA Button */}
        <div className="flex justify-center lg:justify-start mt-4">
          <Link
            to="/mens"
            className="group relative inline-flex items-center justify-center gap-2 h-12 sm:h-14 w-48 sm:w-56 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 text-base sm:text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Latest Collections
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Stats - Made more compact */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8">
          <div className="text-center lg:text-left">
            <div className="text-xl font-bold text-amber-400">200+</div>
            <div className="text-xs text-slate-400">New Styles</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-xl font-bold text-teal-400">50%</div>
            <div className="text-xs text-slate-400">Exclusive Discount</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-xl font-bold text-emerald-400">24h</div>
            <div className="text-xs text-slate-400">Fast Delivery</div>
          </div>
        </div>
      </div>

      {/* Hero Image - Optimized Size */}
      <div className="flex-1 flex justify-center items-center mt-8 lg:mt-0 relative z-10">
        <div className="relative group">
          {/* Main Image Container */}
          <div className="relative w-[280px] sm:w-[360px] lg:w-[420px] xl:w-[480px]">
            <img
              src="/product/fi1.png"
              alt="Premium Fashion Collection"
              className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl"
            />

            {/* Floating Elements - Smaller */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl rotate-12 transform group-hover:rotate-45 transition-transform duration-500 shadow-xl flex items-center justify-center">
              <span className="text-slate-900 font-bold text-xs">NEW</span>
            </div>

            <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full transform group-hover:scale-110 transition-transform duration-500 shadow-xl flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">TRENDING</span>
            </div>
          </div>

          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 to-teal-500/15 rounded-full blur-2xl -z-10 group-hover:blur-3xl transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
