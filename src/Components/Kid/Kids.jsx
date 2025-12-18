// src/Components/Kid/Kid.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Footer/Footer";
import { fetchProducts } from "../../Redux/Slices/productsSlice";
import { fetchWishlist, toggleWishlist as toggleWishlistThunk } from "../../Redux/Slices/wishlistSlice";

const ProductCard = React.memo(({ product, isWished, toggleWishlist, style }) => (
  <div
    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-200"
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
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
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

    {/* Kid-Friendly Badge */}
    <div className="absolute top-4 left-4 z-10">
      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 10.5V12L3 13.5V15.5L9 14V16L3 17.5V19.5L9 18V22H15V18L21 19.5V17.5L15 16V14L21 15.5V13.5L15 12V10.5L21 9Z" />
        </svg>
        KIDS
      </span>
    </div>

    {/* Product Image */}
    <Link to={`/product/${product.id}`}>
      <div className="relative overflow-hidden bg-gray-100">
        {/* changed h-80 to h-112 to match Men/Women pages */}
        <img 
          src={product.image ?? "/placeholder.png"} 
          alt={product.name ?? "Product image"} 
          className="w-full h-112 object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-600 text-sm font-semibold rounded-full shadow-lg">👶 Perfect Fit!</span>
        </div>
      </div>
    </Link>

    {/* Product Info */}
    <div className="p-6">
      <Link to={`/product/${product.id}`}>
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300 min-h-[3.5rem]">
          {product.name ?? `Product ${product.id}`}
        </h2>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-gray-900">
            ${product.new_price ?? product.price ?? "—"}
          </span>
          {product.old_price > (product.new_price ?? product.price) && (
            <span className="text-sm text-gray-500 line-through">${product.old_price}</span>
          )}
        </div>

        {product.old_price > (product.new_price ?? product.price) && (
          <div className="text-right">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
              Save {Math.round(((product.old_price - (product.new_price ?? product.price)) / product.old_price) * 100)}%
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">👶 2-4 Years</span>
        <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">🧸 Soft Fabric</span>
      </div>


    </div>

    <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-300 rounded-2xl transition-all duration-500 pointer-events-none"></div>
  </div>
));

function Kid() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products?.items ?? []);
  const wishItems = useSelector((state) => (state.wishlist?.items ?? []).map(String));
  const wishlistLoading = useSelector((state) => state.wishlist?.loading ?? false);
  const wishlistError = useSelector((state) => state.wishlist?.error ?? null);
  const user = useSelector((state) => state.auth?.user ?? null);

  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

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

  const kidsProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((item) => {
      const cat = item?.category;
      if (!cat) return false;
      if (typeof cat === "string") {
        const c = cat.toLowerCase();
        return c === "kid" || c === "kids" || c === "child";
      }
      const slug = (cat.slug || "").toString().toLowerCase();
      const name = (cat.name || "").toString().toLowerCase();
      return slug === "kid" || slug === "kids" || name === "kid" || name === "kids" || name === "child";
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    return kidsProducts.filter((product) => {
      const price = Number(product.new_price ?? product.price ?? 0);
      if (priceFilter === "below100") return price < 100;
      if (priceFilter === "above100") return price >= 100;
      return true;
    });
  }, [kidsProducts, priceFilter]);

  return (
    <div>
      <Toaster position="top-center" toastOptions={{ duration: 600 }} reverseOrder={false} />

      {/* Header & Filter Section */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 shadow-sm mb-6">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700 tracking-widest uppercase">Fun & Playful</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              KID'S <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">COLLECTION</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Adorable styles for your little ones to play, learn, and grow in comfort
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm px-6 py-4">
              <select 
                className="bg-transparent border-none text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg px-4 py-2" 
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
            <div className="text-gray-400 text-6xl mb-4">🧸</div>
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

export default Kid;
