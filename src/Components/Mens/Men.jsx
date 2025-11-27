import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Footer/Footer";
import { fetchProducts } from "../../Redux/Slices/productsSlice";
import { fetchWishlist, toggleWishlist as toggleWishlistThunk } from "../../Redux/Slices/wishlistSlice";

function Men() {
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

  const toggleWishlist = async (id) => {
    if (!user) {
      toast.error("Please login");
      return;
    }
    try {
      const idStr = String(id);
      const currently = wishItems.includes(idStr);
      await dispatch(toggleWishlistThunk(id)).unwrap();
      // Show correct toast based on prior state
      toast.success(currently ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message ?? "Wishlist action failed");
    }
  };

  const menProducts = (products || []).filter((item) => {
    const cat = item?.category;
    if (!cat) return false;
    const slug = (cat.slug || "").toString().toLowerCase();
    const name = (cat.name || "").toString().toLowerCase();
    return slug === "men" || name === "men";
  });

  const filteredProducts = menProducts.filter((product) => {
    const newPrice = Number(product?.new_price ?? product?.price ?? 0) || 0;
    if (priceFilter === "below100") return newPrice < 100;
    if (priceFilter === "above100") return newPrice >= 100;
    return true;
  });

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 600 }}
        reverseOrder={false}
      />

      {/* Header & Filter Section */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600 tracking-widest uppercase">
                Premium Collection
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              MEN'S{" "}
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                COLLECTION
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover sophisticated styles crafted for the modern gentleman
            </p>
          </div>

          {/* Filter */}
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm px-6 py-4">
              <select
                className="bg-transparent border-none text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg px-4 py-2"
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
            const id = product.id;
            const idStr = String(id); // Convert to string for consistent comparison
            const isWished = Array.isArray(wishItems) && wishItems.includes(idStr);
            const newPrice = Number(product?.new_price ?? product?.price ?? 0) || 0;
            const oldPrice = Number(product?.old_price ?? 0) || 0;

            return (
              <div
                key={id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-amber-200"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
                }}
              >
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(id)}
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

                {/* Product Image */}
                <Link to={`/product/${id}`}>
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={product.image ?? "/placeholder.png"}
                      alt={product.name ?? "Product image"}
                      className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-6">
                  <Link to={`/product/${id}`}>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300 min-h-[3.5rem]">
                      {product.name}
                    </h2>
                  </Link>

                  {/* Price Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-gray-900">
                        ${newPrice}
                      </span>
                      {oldPrice > newPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${oldPrice}
                        </span>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {oldPrice > newPrice && (
                      <div className="text-right">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                          Save{" "}
                          {Math.round(((oldPrice - newPrice) / (oldPrice || 1)) * 100)}
                          %
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">4.8</span>
                    <span className="text-xs text-gray-400">(64)</span>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-300 rounded-2xl transition-all duration-500 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">👔</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>

      {/* Footer */}
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
    </>
  );
}

export default Men;