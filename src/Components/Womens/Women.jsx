// src/Components/Women/Women.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Footer/Footer";
import { fetchProducts } from "../../Redux/Slices/productsSlice";
import { fetchWishlist, toggleWishlist as toggleWishlistThunk } from "../../Redux/Slices/wishlistSlice";

const ProductCard = React.memo(({ product, isWished, toggleWishlist, style }) => (
  <div
    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-pink-200"
    style={style}
  >
    {/* Wishlist Button */}
    <button
      onClick={() => toggleWishlist(product.id)}
      className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transform transition-all duration-300"
      aria-pressed={isWished}
      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWished ? (
        // Filled heart (red)
        <svg
          className="w-5 h-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        // Outline heart (gray, turns red on hover)
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>

    {/* Women's Collection Badge */}
    <div className="absolute top-4 left-4 z-10">
      <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21.4 9.6L13.5 15.7C12.7 16.3 11.6 16.3 10.8 15.7L2.9 9.6C2.3 9.2 2 8.6 2 8C2 6.9 2.9 6 4 6H20C21.1 6 22 6.9 22 8C22 8.6 21.7 9.2 21.4 9.6Z" />
        </svg>
        WOMEN
      </span>
    </div>

    {/* Product Image */}
    <Link to={`/product/${product.id}`}>
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={product.image ?? "/placeholder.png"}
          alt={product.name ?? "Product image"}
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold rounded-full shadow-lg">
            Quick View
          </span>
        </div>
      </div>
    </Link>

    {/* Product Info */}
    <div className="p-6">
      <Link to={`/product/${product.id}`}>
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-pink-700 transition-colors duration-300 min-h-[3.5rem]">
          {product.name ?? `Product ${product.id}`}
        </h2>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-gray-900">
            ${product.new_price ?? product.price ?? "—"}
          </span>
          {product.old_price > (product.new_price ?? product.price) && (
            <span className="text-sm text-gray-500 line-through">
              ${product.old_price}
            </span>
          )}
        </div>

        {product.old_price > (product.new_price ?? product.price) && (
          <div className="text-right">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
              Save{" "}
              {Math.round(
                ((product.old_price - (product.new_price ?? product.price)) / product.old_price) *
                  100
              )}
              %
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
          ✨ Premium
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
          🎀 Elegant
        </span>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-500 font-medium">4.8</span>
        <span className="text-xs text-gray-400">(256)</span>
      </div>
    </div>

    <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-300 rounded-2xl transition-all duration-500 pointer-events-none"></div>
  </div>
));

function Women() {
  const dispatch = useDispatch();

  // products from productsSlice
  const products = useSelector((state) => state.products?.items ?? []);
  
  // wishlist from your slice structure
  const wishItems = useSelector((state) => (state.wishlist?.items ?? []).map(String));
  const wishlistLoading = useSelector((state) => state.wishlist?.loading ?? false);
  const wishlistError = useSelector((state) => state.wishlist?.error ?? null);
  
  // auth slice
  const user = useSelector((state) => state.auth?.user ?? null);

  const [priceFilter, setPriceFilter] = useState("all");

  // fetch products (once)
  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  // fetch wishlist when user is logged in
  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [dispatch, user]);

  const toggleWishlist = useCallback(async (id) => {
    if (!user) {
      toast.error("Please login");
      return;
    }
    try {
      const idStr = String(id);
      const currently = wishItems.includes(idStr);
      await dispatch(toggleWishlistThunk(id)).unwrap();
      toast.success(currently ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message ?? "Wishlist action failed");
    }
  }, [user, wishItems, dispatch]);

  // robust category check: accept category.slug or category.name or category string
  const womenProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((item) => {
      const cat = item?.category;
      if (!cat) return false;
      // category might be string, object with slug/name, or id
      if (typeof cat === "string") {
        return cat.toLowerCase() === "women" || cat.toLowerCase() === "women's";
      }
      const slug = (cat.slug || "").toString().toLowerCase();
      const name = (cat.name || "").toString().toLowerCase();
      return slug === "women" || name === "women" || name === "women's";
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    return womenProducts.filter((product) => {
      const price = Number(product.new_price ?? product.price ?? 0);
      if (priceFilter === "below100") return price < 100;
      if (priceFilter === "above100") return price >= 100;
      return true;
    });
  }, [priceFilter, womenProducts]);

  return (
    <div>
      <Toaster position="top-center" toastOptions={{ duration: 600 }} reverseOrder={false} />

      {/* Header & Filter Section */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-pink-200 shadow-sm mb-6">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-pink-700 tracking-widest uppercase">Elegant Styles</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              WOMEN'S{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">COLLECTION</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover sophisticated fashion that celebrates femininity and elegance
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 shadow-sm px-6 py-4">
              <select
                className="bg-transparent border-none text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-lg px-4 py-2"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="below100">Under $100</option>
                <option value="above100">$100 & Above</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* optional wishlist loading hint */}
        {wishlistLoading && (
          <div className="text-sm text-gray-500 mb-4">Loading wishlist…</div>
        )}
        {wishlistError && (
          <div className="text-sm text-red-500 mb-4">Wishlist error: {String(wishlistError)}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => {
            const idStr = String(product.id);
            const isWished = Array.isArray(wishItems) && wishItems.includes(idStr);
            
            return (
              <ProductCard
                key={product.id}
                product={product}
                isWished={isWished}
                toggleWishlist={toggleWishlist}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
                }}
              />
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">👗</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>

      <div className="pt-10">
        <Footer />
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

export default Women;