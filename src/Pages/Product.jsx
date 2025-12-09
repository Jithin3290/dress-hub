// src/components/Product/Product.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Components/Footer/Footer";
import { FaMinus, FaPlus } from "react-icons/fa";
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
  const user = useSelector((s) => s.auth?.user);

  const productFromList = products.find((p) => String(p.id) === String(id));
  const product =
    selected && String(selected.id) === String(id) ? selected : productFromList;

  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

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
    if (!product || !user) return;

    const mini = {
      id: product.id,
      name: product.name,
      image: product.image ?? "",
      new_price: product.new_price ?? product.price ?? 0,
      old_price: product.old_price ?? 0,
      category: safeCategoryName(product.category),
    };

    dispatch(addRecentlyWatched(mini));
  }, [dispatch, product, user]);

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

  // Helper: get stock for product or size (same logic used in Cart)
  const getStockForProduct = (productObj, size = null) => {
    if (!productObj) return null;

    if (Array.isArray(productObj.sizes) && productObj.sizes.length > 0) {
      if (size) {
        const found = productObj.sizes.find((s) => String(s.size) === String(size));
        if (found && (found.stock !== undefined && found.stock !== null)) {
          return Number(found.stock);
        }
      }
      // sum up sizes as fallback
      const total = productObj.sizes.reduce((acc, s) => acc + (Number(s.stock) || 0), 0);
      if (total > 0) return total;
    }

    if (productObj.stock !== undefined && productObj.stock !== null) return Number(productObj.stock);
    if (productObj.quantity !== undefined && productObj.quantity !== null) return Number(productObj.quantity);
    if (productObj.available_stock !== undefined && productObj.available_stock !== null) return Number(productObj.available_stock);

    return null;
  };

  const selectedStock = getStockForProduct(product, selectedSize);

  // caps
  const MAX_ALLOWED_QTY = 5;
  const effectiveMax = selectedStock !== null && selectedStock !== undefined ? Math.min(MAX_ALLOWED_QTY, selectedStock) : MAX_ALLOWED_QTY;

  const lowStock = selectedStock !== null && selectedStock !== undefined && selectedStock > 0 && selectedStock < 5;
  const outOfStock = selectedStock !== null && selectedStock === 0;

  // ADD TO CART
  const handleAddToCart = async () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    // check stock before sending
    if (selectedStock !== null && selectedStock !== undefined && qty > selectedStock) {
      toast.error(`Only ${selectedStock} left in stock`);
      return;
    }

    if (qty < 1 || qty > MAX_ALLOWED_QTY) {
      toast.error(`Quantity must be between 1 and ${MAX_ALLOWED_QTY}`);
      return;
    }

    try {
      await dispatch(
        addCartItem({
          productId: product.id,
          quantity: qty,
          size: selectedSize,
        })
      ).unwrap();

      // optimistic UI: show Go to Cart immediately
      setAddedToCart(true);

      // refresh server cart in background (keeps store accurate)
      dispatch(fetchCart()).catch((e) => {
        console.error("fetchCart failed:", e);
      });

      toast.success("Added to cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
      // if your backend wants login, it might throw; keep original behavior
      navigate("/login");
    }
  };

  // BUY NOW (single-product checkout)
  const handleBuyNow = () => {
    if (!product) {
      toast.error("Product not available");
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (selectedStock !== null && selectedStock !== undefined && qty > selectedStock) {
      toast.error(`Only ${selectedStock} left in stock`);
      return;
    }

    if (qty < 1 || qty > MAX_ALLOWED_QTY) {
      toast.error(`Quantity must be between 1 and ${MAX_ALLOWED_QTY}`);
      return;
    }

    if (!user) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }

    const productObj = {
      id: product.id,
      name: product.name,
      image: product.image ?? product.image_url ?? "",
      slug: product.slug ?? product.id,
      sku: product.sku ?? "",
    };

    const singleItem = {
      product: product.id,
      product_id: product.id,
      productId: product.id,
      id: product.id,
      name: product.name,
      image: productObj.image,
      product_obj: productObj,
      quantity: qty,
      size: selectedSize || "",
      price: newPrice,
      old_price: oldPrice,
      price_in_cents: Math.round(Number(newPrice) * 100),
      shipping_address: "",
      phone: "",
    };
    
    try {
      dispatch(setCheckoutItems([singleItem]));
      try {
        const serialized = JSON.stringify([singleItem]);
        localStorage.setItem("checkoutItems", serialized);
        localStorage.setItem("checkout_items", serialized);
        localStorage.setItem("payment_items", serialized);
      } catch (e) {
        console.warn("Could not write checkout fallback to localStorage", e);
      }

      navigate("/payment", { state: { items: [singleItem], from: "product" } });
    } catch (err) {
      console.error("handleBuyNow error:", err);
      toast.error("Could not start checkout");
    }
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

              {/* Stock info + hurry message */}
              {selectedStock !== null && selectedStock !== undefined && (
                <div className="mb-3">
                  {selectedStock > 0 ? (
                    <>
                      <p className="text-sm text-gray-600">In stock: {selectedStock}</p>
                      {selectedStock < 5 && (
                        <p className="text-red-600 text-sm">Hurry up — only {selectedStock} left</p>
                      )}
                    </>
                  ) : (
                    <p className="text-red-500 text-sm">Out of stock</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-4 items-center">
              {/* Quantity selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-2 py-1 rounded bg-gray-200"
                  disabled={qty <= 1}
                >
                  <FaMinus />
                </button>

                <div className="px-4 py-1 border rounded text-center">{qty}</div>

                <button
                  onClick={() => {
                    const available = selectedStock;
                    const cap = available !== null && available !== undefined ? Math.min(5, available) : 5;
                    if (qty >= cap) {
                      if (available !== null && available !== undefined) {
                        toast.error("Maximum quantity reached");
                      } 
                      return;
                    }
                    setQty((q) => Math.min(5, q + 1));
                  }}
                  className="px-2 py-1 rounded bg-gray-200"
                >
                  <FaPlus />
                </button>
              </div>

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
                  disabled={outOfStock}
                >
                  Add to Cart
                </button>
              )}

              <button
                onClick={handleBuyNow}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={outOfStock}
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
