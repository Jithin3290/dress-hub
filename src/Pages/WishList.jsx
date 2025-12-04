// src/Components/WishList/WishList.jsx
import React, { useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { fetchWishlist, removeWishlistItem, clearWishLocal } from "../Redux/Slices/wishlistSlice";

export default function WishList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((s) => s.products?.items ?? []);
  const user = useSelector((s) => s.auth?.user ?? null);
  const wishlist = useSelector((s) => s.wishlist ?? { items: [], raw: [], loading: false, error: null });
  const cartItemsFromStore = useSelector((s) => s.cart?.items ?? null);

  const { items: wishIds = [], raw: wishRaw = [], loading: wishLoading = false, error: wishError = null } = wishlist;

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
    else dispatch(clearWishLocal());
  }, [user, dispatch]);

  const wishListProducts = useMemo(() => {
  const ids = Array.isArray(wishIds) ? wishIds.map(String) : [];
  const raw = Array.isArray(wishRaw) ? wishRaw : [];
  const allProducts = Array.isArray(products) ? products : [];

  const fromRaw = raw
    .map((it) => {
      if (!it) return null;
      
      // Check for product_detail first (new backend structure)
      if (it.product_detail && typeof it.product_detail === "object") {
        return it.product_detail;
      }
      // Fallback to old structure
      if (it.product && typeof it.product === "object") return it.product;
      if (it.id && (it.name || it.image || it.new_price || it.price)) return it;
      return null;
    })
    .filter(Boolean);

  if (fromRaw.length) return fromRaw.map((p) => ({ ...p, id: String(p.id) }));

  if (ids.length && allProducts.length) {
    return ids
      .map((pid) => allProducts.find((p) => String(p.id) === String(pid)))
      .filter(Boolean)
      .map((p) => ({ ...p, id: String(p.id) }));
  }

  if (raw.length && typeof raw[0] !== "object") return raw.map((id) => ({ id: String(id) }));

  return [];
}, [wishIds, wishRaw, products]);

  const removeFromWishlist = useCallback(
    async (productId) => {
      try {
        await dispatch(removeWishlistItem(productId)).unwrap();
        toast.success("Removed from wishlist");
      } catch (err) {
        console.error("Failed to remove wishlist item:", err);
        toast.error("Failed to remove from wishlist");
      }
    },
    [dispatch]
  );

  // ... addToCart and handleBuyNow same as earlier (keep from your file)

  if (wishLoading) return <div className="text-center p-8"><p className="font-semibold">Loading wishlist...</p></div>;
console.log(wishListProducts)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-center mb-4">Your Wishlist</h1>
      {wishListProducts.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">Your wishlist is empty.</p>
          <p className="mt-3 text-sm text-gray-400">Add items by clicking the heart icon on product cards.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishListProducts.map((product) => (
            
            <div key={product.id} className="border rounded-lg p-4 shadow relative bg-white">
              <button className="absolute top-2 right-2 text-red-500" onClick={() => removeFromWishlist(product.id)} aria-label="Remove from wishlist">
                <FaHeart size={20} />
              </button>

              <img src={product.image ?? "/placeholder.png"} alt={product.name ?? `Product ${product.id}`} className="w-full h-48 object-contain mb-2" />
              <h2 className="text-lg font-medium">{product.name ?? `Product ${product.id}`}</h2>
              <p className="text-gray-700">₹{product.new_price ?? product.price ?? "—"}</p>

              <div className="flex gap-2 mt-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded" onClick={() => {/* handleBuyNow or reuse your handler */}}>
                  Buy Now
                </button>
                <Link to={`/product/${product.id}`}><button className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300">View</button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
