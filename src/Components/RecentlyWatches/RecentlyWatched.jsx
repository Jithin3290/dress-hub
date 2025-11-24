import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import RecentlyWatchedContext from "../../Context/RecentlyWatchedContext";
import AuthContext from "../../Context/AuthContext";

function RecentlyWatched() {
  const { recentlyWatched } = useContext(RecentlyWatchedContext);
  const navigate = useNavigate();

  if (!recentlyWatched || recentlyWatched.length === 0) {
    return null; // Return nothing if no recently watched items
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl my-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600 tracking-widest uppercase">
            Your Recent Views
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
          RECENTLY <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">WATCHED</span>
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Continue exploring styles you recently viewed
        </p>
        
        <div className="flex justify-center mt-6">
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {recentlyWatched.map((item, index) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-amber-200 cursor-pointer"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
            }}
            onClick={() => navigate(`/product/${item.id}`)}
          >
            {/* Recently Viewed Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                </svg>
                RECENT
              </span>
            </div>

            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Quick View Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold rounded-full shadow-lg">
                  View Again
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300 min-h-[3.5rem]">
                {item.name}
              </h2>
              
              {/* Price Section */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-gray-900">
                    ₹{item.new_price}
                  </span>
                  {item.old_price > item.new_price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{item.old_price}
                    </span>
                  )}
                </div>
                
                {/* View Count Indicator */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <span>Viewed</span>
                  </div>
                </div>
              </div>

              {/* Category Tag */}
              <div className="flex items-center gap-2 mt-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {item.category || "Fashion"}
                </span>
              </div>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-300 rounded-2xl transition-all duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>

      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default RecentlyWatched;