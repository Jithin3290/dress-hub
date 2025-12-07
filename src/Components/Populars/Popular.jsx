// src/Components/Popular/Popular.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../Redux/Slices/productsSlice";

const PLACEHOLDER = "/product/placeholder.png";

function Popular() {
  const dispatch = useDispatch();
  const { items = [], loading = false } = useSelector((state) => state.products || {});

  useEffect(() => {
    // Correct parameter
    dispatch(fetchProducts({ limit: 8, category: "women" }));
  }, [dispatch]);

  const products = (items || []).slice(0, 8);

  if (loading) {
    return (
      <div className="py-16 px-6 sm:px-10 lg:px-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
          <div className="h-1 bg-gray-300 rounded w-32 mx-auto mb-12"></div>
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
    <div className="py-16 px-6 sm:px-10 lg:px-20 bg-gradient-to-br from-purple-50 to-pink-50">

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 shadow-sm mb-6">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-purple-700 tracking-widest uppercase">
            Trending Now
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
          POPULAR IN{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            WOMEN
          </span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover the most loved styles that are making waves in women's fashion
        </p>

        <div className="flex justify-center mt-8">
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((item, index) => {
          const imageSrc = item?.image || PLACEHOLDER;
          const avgRating = Number(item?.avg_rating ?? 0);
          const reviewCount = Number(item?.review_count ?? 0);
          const newPrice = Number(item?.new_price ?? 0);
          const oldPrice = Number(item?.old_price ?? 0);

          return (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-200"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
              }}
            >
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                  TRENDING
                </span>
              </div>

              <Link to={`/product/${item.id}`}>
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={imageSrc}
                    alt={item?.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                    className="w-full h-110 object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </Link>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300 min-h-[3.5rem]">
                  {item?.name}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-900">
                      ₹{newPrice.toFixed(2)}
                    </span>
                    {oldPrice > newPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {oldPrice > newPrice && (
                    <div className="text-right">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                        Save {Math.round(((oldPrice - newPrice) / oldPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({reviewCount})</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <div className="w-4 h-4 bg-pink-400 rounded-full border-2 border-white shadow"></div>
                  <div className="w-4 h-4 bg-purple-400 rounded-full border-2 border-white shadow"></div>
                  <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow"></div>
                  <div className="w-4 h-4 bg-black rounded-full border-2 border-white shadow"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Popular;
