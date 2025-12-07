// src/components/Product/Product.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Components/Footer/Footer";
import api from "../user_api";

import { fetchProduct } from "../Redux/Slices/productsSlice";
import { addCartItem, fetchCart } from "../Redux/Slices/cartSlice";
import { setCheckoutItems } from "../Redux/Slices/orderSlice"; 
import { addRecentlyWatched } from "../Redux/Slices/recentlywatchedSlice";

function safeCategoryName(cat) {
  if (!cat) return "Fashion";
  if (typeof cat === "string") return cat;
  if (typeof cat === "object" && cat.name) return cat.name;
  return "Fashion";
}

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector((s) => s.products?.items || []);
  const selected = useSelector((s) => s.products?.selected);
  const selectedLoading = useSelector((s) => s.products?.selectedLoading);
  const cartState = useSelector((s) => s.cart || {}); // safer default

  const productFromList = products.find((p) => String(p.id) === String(id));
  const product =
    selected && String(selected.id) === String(id) ? selected : productFromList;

  const [selectedSize, setSelectedSize] = useState("");
  const [qty] = useState(1);

  // local optimistic flag so button switches instantly
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product if needed
  useEffect(() => {
    if (!productFromList && (!selected || String(selected.id) !== String(id))) {
      dispatch(fetchProduct({ id })).catch(() => {});
    }
  }, [dispatch, id, productFromList, selected]);

  // Recently watched + server
  useEffect(() => {
    if (!product) return;

    const mini = {
      id: product.id,
      name: product.name,
      image: product.image ?? "",
      new_price: product.new_price ?? product.price ?? 0,
      old_price: product.old_price ?? 0,
      category: safeCategoryName(product.category),
    };

    dispatch(addRecentlyWatched(mini));

  
  }, [dispatch, product]);

  // Auto-select first in-stock size
  useEffect(() => {
    if (!product || !Array.isArray(product.sizes)) return;
    const firstAvailable = product.sizes.find((s) => Number(s.stock) > 0);
    if (firstAvailable) setSelectedSize(firstAvailable.size);
  }, [product]);

  if (!product && selectedLoading)
    return <p className="text-center mt-10">Loading product...</p>;
  if (!product)
    return <p className="text-center mt-10 text-lg">Product not found.</p>;

  const categoryName = safeCategoryName(product.category);
  const img = product.image || product.image_url || "";
  const newPrice =
    product.new_price ?? product.newPrice ?? product.price ?? 0;
  const oldPrice = product.old_price ?? product.oldPrice ?? 0;

  // Determine cart items array safely
  const cartItems = Array.isArray(cartState.items)
    ? cartState.items
    : Array.isArray(cartState)
    ? cartState
    : [];

  // Debugging (remove if you don't want console logs)
  // console.log("Cart state:", cartState);
  // console.log("Cart items resolved:", cartItems);

  // Detect if product is in cart (checks several possible shapes)
  const isInCartFromStore = cartItems.some((it) => {
    const pid =
      it?.product?.id ??
      it?.product_id ??
      it?.product ??
      it?.id;
    return String(pid) === String(product.id);
  });

  // final decision: if we optimistically just added, show Go to Cart immediately
  const isInCart = isInCartFromStore || addedToCart;

  // ADD TO CART
  const handleAddToCart = async () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      await dispatch(
        addCartItem({
          productId: product.id,
          quantity: 1,
          size: selectedSize,
        })
      ).unwrap();

      // optimistic UI: show Go to Cart immediately
      setAddedToCart(true);

      // refresh server cart in background (keeps store accurate)
      dispatch(fetchCart()).catch((e) => {
        // if fetch fails, we'll keep optimistic flag for a short time
        console.error("fetchCart failed:", e);
      });

      toast.success("Added to cart");
    } catch (err) {
      
      navigate("/login");
    }
  };

  // BUY NOW (single-product checkout)
  const handleBuyNow = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const singleItem = {
      product: product.id,
      quantity: qty,
      size: selectedSize || "",
      shipping_address: "",
      phone: "",
    };

    dispatch(setCheckoutItems([singleItem]));
    navigate("/payment");
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 mt-4">
        <Toaster position="top-center" toastOptions={{ duration: 600 }} />

        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-lg">
          <img
            src={img}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md object-cover"
            onError={(e) => {
              e.currentTarget.src = "/fallback-product.png";
            }}
          />

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-1 capitalize">{categoryName}</p>

              {oldPrice > newPrice && (
                <p className="line-through text-gray-400">₹{oldPrice}</p>
              )}

              <p className="text-2xl text-green-600 font-bold mb-4">
                ₹{newPrice}
              </p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description ||
                  product.short_description ||
                  `${product.name} — premium quality.`}
              </p>

              {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold mb-2">
                    Choose size
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((s) => {
                      const out = Number(s.stock) <= 0;
                      const selected = selectedSize === s.size;

                      return (
                        <button
                          key={s.size}
                          onClick={() => !out && setSelectedSize(s.size)}
                          disabled={out}
                          className={`px-3 py-2 rounded-full border ${
                            selected
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-200"
                          } ${out
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                          }`}
                        >
                          {s.size} {out ? "(OOS)" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-4 items-center">
              {isInCart ? (
                <button
                  onClick={() => navigate("/cart")}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              )}

              <button
                onClick={handleBuyNow}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Product;
