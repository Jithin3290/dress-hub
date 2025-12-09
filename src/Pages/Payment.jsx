// src/Pages/Payment.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// adjust these paths if your project structure differs
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  clearCheckoutItems, // if your slice uses a different action name, replace it
} from "../Redux/Slices/orderSlice";
import { fetchCart, removeCartItem } from "../Redux/Slices/cartSlice";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const s = document.createElement("script");
    s.id = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/**
 * SafeImage - avoids infinite onError loops and supports lazy loading.
 * Usage: <SafeImage src={url} alt="..." className="..." />
 */
function SafeImage({ src, alt, className }) {
  const FALLBACK = "/fallback-product.png";
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);

  useEffect(() => {
    setImgSrc(src || FALLBACK);
  }, [src]);

  const onError = () => {
    if (imgSrc !== FALLBACK) setImgSrc(FALLBACK);
  };

  return (
    <img
      src={imgSrc}
      alt={alt || "product image"}
      className={className}
      onError={onError}
      loading="lazy"
    />
  );
}

export default function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // prefer checkoutItems (set by product page Buy Now) else use cart
  const checkoutItems = useSelector((s) => s.orders?.checkoutItems);
  const checkoutLoading = useSelector((s) => s.orders?.checkoutLoading);
  const cartState = useSelector((s) => s.cart ?? {});
  const cartItems = Array.isArray(cartState.items) ? cartState.items : cartState;
  const productsList = useSelector((s) => s.products?.items ?? []);
  const auth = useSelector((s) => s.auth ?? {});
  const user = auth.user;

  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);

  // normalize orders payload
  const ordersPayload = useMemo(() => {
    const source =
      Array.isArray(checkoutItems) && checkoutItems.length > 0
        ? checkoutItems
        : Array.isArray(cartItems)
        ? cartItems
        : [];

    return source.map((it) => {
      if (it?.product && typeof it.product === "object") {
        return {
          product: it.product.id ?? it.product.pk,
          quantity: it.quantity ?? 1,
          size: it.size ?? "",
          shipping_address: it.shipping_address ?? "",
          phone: it.phone ?? "",
          __productObj: it.product,
        };
      }

      return {
        product: it.product ?? it.product_id ?? it.id,
        quantity: it.quantity ?? 1,
        size: it.size ?? it.selected_size ?? "",
        shipping_address: it.shipping_address ?? it.address ?? "",
        phone: it.phone ?? it.contact ?? "",
        __productObj: it.product_detail ?? it.productObj ?? null,
      };
    });
  }, [checkoutItems, cartItems]);

  // Build line items and resolve prices robustly
  const lineItems = useMemo(() => {
    const parseNum = (v) => {
      if (v === null || v === undefined) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    return ordersPayload.map((it) => {
      let productObj = it.__productObj ?? null;

      if (!productObj && Array.isArray(cartItems)) {
        const found = cartItems.find((ci) =>
          String(ci.product?.id ?? ci.product ?? ci.product_id ?? ci.id) === String(it.product)
        );
        productObj = found?.product ?? found?.product_detail ?? productObj;
      }

      if (!productObj && Array.isArray(productsList)) {
        productObj = productsList.find((p) => String(p.id) === String(it.product)) ?? null;
      }

      const fromProduct = parseNum(
        productObj?.discounted_price ??
          productObj?.discountedPrice ??
          productObj?.new_price ??
          productObj?.newPrice ??
          productObj?.price ??
          productObj?.mrp ??
          productObj?.amount
      );

      const fromCartUnit = parseNum(
        (() => {
          if (!Array.isArray(cartItems)) return null;
          const found = cartItems.find((ci) =>
            String(ci.product?.id ?? ci.product ?? ci.product_id ?? ci.id) === String(it.product)
          );
          return found?.unit_price ?? found?.price ?? null;
        })()
      );

      const unitPrice = fromProduct ?? fromCartUnit ?? 0;
      const priceMissing = !(fromProduct !== null || fromCartUnit !== null) || unitPrice <= 0;
      const subtotal = unitPrice * (Number(it.quantity) || 0);

      return {
        ...it,
        productObj,
        unitPrice,
        subtotal,
        priceMissing,
        displayName: productObj?.name ?? `Product #${it.product}`,
        displayImage: productObj?.image ?? productObj?.image_url ?? "/fallback-product.png",
      };
    });
  }, [ordersPayload, cartItems, productsList]);

  const totalPrice = useMemo(() => {
    return lineItems.reduce((s, l) => s + (Number(l.subtotal) || 0), 0);
  }, [lineItems]);

  useEffect(() => {
    if (user) {
      if (user.phone) setPhone(user.phone);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user]);

  useEffect(() => {
    if (!ordersPayload || ordersPayload.length === 0) {
      navigate(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const hasPriceProblem = lineItems.some((l) => l.priceMissing);
  const payDisabled = processing || checkoutLoading || hasPriceProblem || Number(totalPrice) <= 0;
  
  const handleRemoveItem = async (productId) => {
    try {
      const ci = Array.isArray(cartItems)
        ? cartItems.find((ci) =>
            String(ci.product?.id ?? ci.product ?? ci.product_id ?? ci.id) === String(productId)
          )
        : null;
      const cartItemId = ci?.id ?? null;
      if (!cartItemId) {
        toast.error("Cannot remove item, id missing");
        return;
      }
      await dispatch(removeCartItem({ productId, cartItemId })).unwrap();
      dispatch(fetchCart());
      toast.success("Removed item");
    } catch (e) {
      console.error("remove failed", e);
      toast.error("Failed to remove item");
    }
  };

  const handlePay = async () => {
    if (ordersPayload.length === 0) {
      toast.error("No items to checkout");
      return;
    }
    if (hasPriceProblem) {
      toast.error("One or more items have no price. Remove them or contact support.");
      return;
    }
    if (!shippingAddress || shippingAddress.trim().length < 5) {
      toast.error("Please enter a valid shipping address");
      return;
    }
    if (!phone || phone.trim().length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const payloadWithContact = ordersPayload.map((it) => ({
      ...it,
      shipping_address: shippingAddress,
      phone: phone,
    }));

    setProcessing(true);
    try {
      const action = await dispatch(createRazorpayOrder({ orders: payloadWithContact }));
      if (action.error) {
        console.error("createRazorpayOrder failed", action);
        toast.error("Could not create payment order");
        setProcessing(false);
        return;
      }
      const data = action.payload;

      const ok = await loadRazorpayScript();
      if (!ok) {
        toast.error("Failed to load payment SDK");
        setProcessing(false);
        return;
      }

      const options = {
        key: data.razorpay_key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpay_order_id,
        name: "Your Store",
        description: "Order payment",
        prefill: {
          name: user?.username ?? user?.full_name ?? "",
          email: user?.email ?? "",
          contact: phone || "",
        },
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orders_payload: payloadWithContact,
            };
            const verifyAction = await dispatch(verifyRazorpayPayment(verifyPayload));
            if (verifyAction.error) {
              console.error("verifyRazorpayPayment failed", verifyAction);
              toast.error("Payment verification failed");
              setProcessing(false);
              return;
            }

            toast.success("Payment successful");
            try {
              dispatch(clearCheckoutItems());
            } catch (e) {
              console.warn("clearCheckoutItems not found in slice, skipping.");
            }
            dispatch(fetchCart());
            navigate("/order");
          } catch (e) {
            console.error("verify error", e);
            toast.error("Payment verification exception");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast("Payment window closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        console.error("payment.failed", resp);
        toast.error("Payment failed");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error("payment flow error", err);
      toast.error("Payment failed");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Items</h3>

        {lineItems.map((l, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-3">
              <SafeImage
                src={l.displayImage}
                alt={l.displayName}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <div className="font-medium">{l.displayName}</div>
                <div className="text-sm text-gray-500">Size: {l.size || "-"}</div>
                <div className="text-sm text-gray-500">Qty: {l.quantity}</div>
              </div>
            </div>

            <div className="text-right">
              {l.priceMissing ? (
                <div className="text-sm text-red-600">Price not available</div>
              ) : (
                <>
                  <div>₹{Number(l.unitPrice || 0).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Sub: ₹{Number(l.subtotal || 0).toFixed(2)}</div>
                </>
              )}

              {l.priceMissing && (
                <div className="mt-2 flex gap-2 justify-end">
                  <button
                    onClick={() => handleRemoveItem(l.product)}
                    className="px-3 py-1 text-sm rounded bg-red-500 text-white"
                  >
                    Remove
                  </button>
                  <a href="mailto:support@yourstore.com" className="px-3 py-1 text-sm rounded border">
                    Contact Support
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <div className="font-semibold">Total</div>
          <div className="font-bold text-lg">₹{Number(totalPrice).toFixed(2)}</div>
        </div>

        {hasPriceProblem && (
          <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-300 text-sm">
            One or more items do not have a valid price. Remove them or contact support to proceed with payment.
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Shipping & Contact</h3>
        <div className="mb-3">
          <label className="block text-sm mb-1">Shipping address</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Enter shipping address"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile number"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate(-1)} className="px-4 py-2 rounded border" disabled={processing || checkoutLoading}>
          Back
        </button>

        <button
          onClick={handlePay}
          className={`px-6 py-2 rounded text-white ${payDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          disabled={payDisabled}
        >
          {processing || checkoutLoading ? "Processing..." : `Pay ₹${Number(totalPrice).toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
