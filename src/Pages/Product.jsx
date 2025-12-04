// src/components/Product/Product.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Components/Footer/Footer";
import api from "../user_api"; // opt
import { fetchProduct } from "../Redux/Slices/productsSlice";
import { addCartItem, fetchCart } from "../Redux/Slices/cartSlice";
import { addRecentlyWatched } from "../Redux/Slices/recentlywatchedSlice";


function safeCategoryName(cat) {
  if (!cat) return "Fashion";
  if (typeof cat === "string") return cat;
  if (typeof cat === "object" && cat.name) return cat.name;
  console.warn("Unexpected category shape:", cat);
  return "Fashion";
}

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector((s) => s.products?.items || []);
  const selected = useSelector((s) => s.products?.selected);
  const selectedLoading = useSelector((s) => s.products?.selectedLoading);
  const cartState = useSelector((s) => s.cart || { items: [] });

  const productFromList = products.find((p) => String(p.id) === String(id));
  const product = selected && String(selected.id) === String(id) ? selected : productFromList;

  // local state for size selection and quantity
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  // fetch details if not found in list
  useEffect(() => {
    if (!productFromList && (!selected || String(selected.id) !== String(id))) {
      dispatch(fetchProduct({ id })).catch(() => {});
    }
  }, [dispatch, id, productFromList, selected]);

  // recent watched + server call (best-effort)
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

    (async () => {
      try {
        await api.post("recently-watched/", { product_id: product.id }, { withCredentials: true });
      } catch (e) {
        // ignore server failure
      }
    })();
  }, [dispatch, product]);

  // when product loads, preselect first in-stock size if available
  useEffect(() => {
    if (!product || !Array.isArray(product.sizes)) return;
    const firstAvailable = product.sizes.find((s) => Number(s.stock) > 0);
    if (firstAvailable) setSelectedSize(firstAvailable.size);
  }, [product]);

  if (!product && selectedLoading) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center mt-10 text-lg">Product not found.</p>;
  }

  const categoryName = safeCategoryName(product.category);
  const img = product.image || product.image_url || "";
  const newPrice = product.new_price ?? product.newPrice ?? product.price ?? 0;
  const oldPrice = product.old_price ?? product.oldPrice ?? 0;

  const isInCart = (() => {
    const items = Array.isArray(cartState.items) ? cartState.items : cartState;
    return items.some((it) => {
      const pid = it?.product?.id ?? it?.product_id ?? it?.product ?? it?.id;
      return String(pid) === String(product.id);
    });
  })();

  const handleAddToCart = async () => {
    // if product has sizes, ensure a size is selected
    if (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      // pass size in payload; your slice can ignore it if it doesn't need it
      await dispatch(addCartItem({ productId: product.id, quantity: 1, size: selectedSize })).unwrap();
      await dispatch(fetchCart());
      toast.success("Added to cart");
    } catch (err) {
      console.error("addCartItem failed:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!isInCart) {
        // require size before adding
        if (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize) {
          toast.error("Please select a size");
          return;
        }
        await dispatch(addCartItem({ productId: product.id, quantity: qty, size: selectedSize })).unwrap();
        await dispatch(fetchCart());
      }
      navigate("/payment");
    } catch (err) {
      console.error("Buy Now error:", err);
      toast.error("Could not proceed to payment");
    }
  };


  return (
    <>
      <div className="max-w-5xl mx-auto p-6 mt-4">
        <Toaster position="top-center" toastOptions={{ duration: 600 }} reverseOrder={false} />

        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-lg">
          <img
            src={img}
            alt={product.name || "Product image"}
            className="w-full h-auto rounded-lg shadow-md object-cover"
            onError={(e) => {
              e.currentTarget.src = "/fallback-product.png";
            }}
          />

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-1 capitalize">{categoryName}</p>
              {oldPrice > newPrice && <p className="line-through text-gray-400">₹{oldPrice}</p>}
              <p className="text-2xl text-green-600 font-bold mb-4">₹{newPrice}</p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description || product.short_description || `${product.name} — premium quality.`}
              </p>

              {/* Size selector (minimal, non-complex) */}
              {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold mb-2">Choose size</div>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((s) => {
                      const out = Number(s.stock) <= 0;
                      const selected = selectedSize === s.size;
                      return (
                        <button
                          key={s.size}
                          onClick={() => !out && setSelectedSize(s.size)}
                          disabled={out}
                          className={`px-3 py-2 rounded-full border ${selected ? "border-amber-500 bg-amber-50" : "border-gray-200"} ${out ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
                <button onClick={() => navigate("/cart")} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                  Go to Cart
                </button>
              ) : (
                <button onClick={handleAddToCart} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Add to Cart
                </button>
              )}

              <button onClick={handleBuyNow} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
