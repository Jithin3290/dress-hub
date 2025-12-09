// src/Components/NewCollections/NewCollections.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer"; // keep if you render footer elsewhere
const PLACEHOLDER = "/product/placeholder.png";

function NewCollections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const url =
      "http://localhost:8000/api/v1/products/?page_size=8&ordering=-created_at&category__slug=men";

    async function load() {
      if (!mounted) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Request failed ${res.status}: ${text}`);
        }
        const data = await res.json();

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : [];

        if (mounted) setProducts(items.slice(0, 8));
      } catch (err) {
        // No AbortController here, so just report real errors
        console.error("Failed to load new collections:", err);
        if (mounted) setError(err.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-16 px-6 sm:px-10 lg:px-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
          <div className="h-1 bg-gray-300 rounded w-24 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4">
                <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 sm:px-10 lg:px-20 bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600 tracking-widest uppercase">
            Fresh Arrivals
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
          NEW{" "}
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            COLLECTIONS
          </span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover the latest trends and elevate your style with our exclusive new arrivals
        </p>

        <div className="flex justify-center mt-8">
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="text-center text-red-600 mb-8">
          <p>Error loading products: {error}</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((item, index) => {
          const imageSrc = item.image || PLACEHOLDER;
          const newPrice = Number(item.new_price ?? item.price ?? 0);
          const oldPrice = Number(item.old_price ?? 0);
          const reviewCount = Number(item.review_count ?? 0);

          return (
            <div
              key={item.id || index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-amber-300"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
              }}
            >
              {/* New Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-lg">
                  NEW 
                </span>
              </div>

              {/* Discount Badge */}
              {oldPrice > newPrice && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                    -{Math.round(((oldPrice - newPrice) / oldPrice) * 100)}%
                  </span>
                </div>
              )}

              {/* Image */}
                <Link to={"/mens"} state={{formList: true}}>
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className="w-full h-112 object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:bg-amber-50">
                      Quick View
                    </button>
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-gray-900">₹{newPrice}</span>
                    {oldPrice > newPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{oldPrice}</span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({reviewCount})</span>
                </div>
              </div>
            </div>
          );
        })}
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

export default NewCollections;
