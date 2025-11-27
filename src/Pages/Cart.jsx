// src/Components/Cart/Cart.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  addCartItem,
  checkoutCart,
} from "../Redux/Slices/cartSlice"; // adjust path if needed

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((s) => s.auth?.user);
  const products = useSelector((s) => s.products?.items ?? []);
  const cartState = useSelector((s) => s.cart ?? { items: [], loading: false });
  const { items: cartItems = [], loading = false } = cartState;

  // track which cart items are currently being updated (set of ids or productIds for fallback)
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const setUpdating = useCallback((id, value) => {
    setUpdatingIds((prev) => {
      const next = new Set(prev);
      if (value) next.add(String(id));
      else next.delete(String(id));
      return next;
    });
  }, []);

  // Ensure cart is loaded (AppRoot may already fetch on login)
  useEffect(() => {
    if (user?.login) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  // Helper: normalize cart item to get productId and quantity
  const normalizedCart = useMemo(() => {
    return (cartItems || []).map((item) => {
      // server CartItem shape: { id, product: { id, name, ... }, quantity, unit_price, ... }
      if (item?.product) {
        return {
          cartItemId: item.id ?? item.pk ?? null,
          productId: item.product.id,
          productObj: item.product,
          quantity: Number(item.quantity || 0),
          unit_price: item.unit_price ?? item.product.new_price ?? item.product.price ?? 0,
          raw: item,
        };
      }
      // fallback shape: { id: <productId>, quantity, date }
      return {
        cartItemId: item.id ?? null,
        productId: item.id,
        productObj: products.find((p) => String(p.id) === String(item.id)) ?? null,
        quantity: Number(item.quantity || 0),
        unit_price:
          item.unit_price ??
          products.find((p) => String(p.id) === String(item.id))?.new_price ??
          0,
        raw: item,
      };
    });
  }, [cartItems, products]);

  // total price computed from normalizedCart
  const totalPrice = useMemo(() => {
    return normalizedCart.reduce((sum, it) => {
      const price = Number(it.unit_price ?? 0);
      return sum + price * (Number(it.quantity) || 0);
    }, 0);
  }, [normalizedCart]);

  // Quantity change: delta can be +1 or -1
  const handleQuantityChange = async (productId, cartItemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      toast.error("Minimum quantity is 1");
      return;
    }
    if (newQty > 99) {
      toast.error("Maximum quantity reached");
      return;
    }

    const lockId = cartItemId ?? productId;
    setUpdating(lockId, true);
    try {
      // pass cartItemId when available; thunk prefers it
      await dispatch(updateCartItem({ productId, quantity: newQty, cartItemId })).unwrap();
      toast.success("Quantity updated");
    } catch (err) {
      console.error("Failed to update quantity:", err);
      const msg = err?.message || err?.detail || "Failed to update quantity";
      toast.error(String(msg));
    } finally {
      setUpdating(lockId, false);
    }
  };

  const handleRemove = async (productId, cartItemId) => {
    const lockId = cartItemId ?? productId;
    setUpdating(lockId, true);
    try {
      await dispatch(removeCartItem(productId)).unwrap();
      toast.success("Removed from cart");
    } catch (err) {
      console.error("Remove failed:", err);
      const msg = err?.message || err?.detail || "Failed to remove item";
      toast.error(String(msg));
    } finally {
      setUpdating(lockId, false);
    }
  };

  const handleBuyNow = async (productId) => {
    if (!user?.login) {
      toast.error("Please login to continue");
      return;
    }

    try {
      // ideally you'd create an order object server-side; this keeps current app flow:
      await dispatch(removeCartItem(productId)).unwrap();
      navigate("/payment");
    } catch (err) {
      console.error("Buy now failed:", err);
      toast.error("Buy now failed");
    }
  };

  const handleBuyAll = async () => {
    if (!user?.login) {
      toast.error("Please login to continue");
      return;
    }

    try {
      await dispatch(checkoutCart({ clearAfter: true })).unwrap();
      navigate("/payment");
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Checkout failed");
    }
  };

  if (loading)
    return (
      <div className="text-center p-8 text-lg font-semibold">Loading your cart...</div>
    );

  if (!user)
    return (
      <div className="text-center p-8 text-red-500 font-semibold text-xl">
        Please log in to view your cart.
      </div>
    );

  if (!normalizedCart || normalizedCart.length === 0)
    return (
      <div className="text-center p-8 text-gray-600 font-semibold text-xl">
        Your cart is empty.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="space-y-4">
        {normalizedCart.map((it) => {
          const product = it.productObj;
          if (!product) return null;

          const lockId = it.cartItemId ?? it.productId;
          const updating = updatingIds.has(String(lockId));

          return (
            <div
              key={`${it.productId}-${it.cartItemId ?? "fallback"}`}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-500">₹{it.unit_price}</p>
                  <p className="text-sm">Quantity: {it.quantity}</p>
                  {it.raw?.added_at || it.raw?.date ? (
                    <p className="text-xs text-gray-400 mt-1">
                      Added on:{" "}
                      {new Date(it.raw.added_at ?? it.raw.date).toLocaleString()}
                    </p>
                  ) : null}

                  <div className="mt-2 flex gap-2 items-center">
                    <button
                      className={`px-2 py-1 rounded ${it.quantity <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"}`}
                      onClick={() => {
                        if (it.quantity <= 1) {
                          toast.error("Minimum quantity is 1");
                          return;
                        }
                        handleQuantityChange(it.productId, it.cartItemId, it.quantity, -1);
                      }}
                      aria-label="Decrease quantity"
                      disabled={updating}
                    >
                      <FaMinus />
                    </button>

                    <span className="px-2">{it.quantity}</span>

                    <button
                      className={`px-2 py-1 rounded ${it.quantity >= 99 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"}`}
                      onClick={() => {
                        if (it.quantity >= 99) {
                          toast.error("Maximum quantity reached");
                          return;
                        }
                        handleQuantityChange(it.productId, it.cartItemId, it.quantity, 1);
                      }}
                      aria-label="Increase quantity"
                      disabled={updating}
                    >
                      <FaPlus />
                    </button>

                    {updating && <span className="ml-2 text-xs text-gray-500">Updating...</span>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => handleBuyNow(it.productId)}
                  disabled={updating}
                >
                  Buy Now
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => handleRemove(it.productId, it.cartItemId)}
                  disabled={updating}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-lg font-semibold">Total: ₹{totalPrice}</p>
        <button
          onClick={handleBuyAll}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Buy All
        </button>
      </div>
    </div>
  );
}

export default Cart;
