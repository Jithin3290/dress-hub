// src/pages/OrderPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../Redux/Slices/orderSlice";
import api from "../../user_api"; 

// currency helper
const formatCurrency = (val) =>
  typeof val === "number" ? val.toFixed(2) : parseFloat(val).toFixed(2);

// resolve image path to absolute URL using VITE_API_URL or default backend
const resolveImageUrl = (imgPath) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${API_BASE.replace(/\/$/, "")}${imgPath}`;
};

function OrderItemRow({ item }) {
  const imageUrl = resolveImageUrl(item.product?.image || "");
  return (
    <div className="flex gap-3 items-start py-2 border-b last:border-b-0">
      <img
        src={imageUrl}
        alt={item.product?.name || "product"}
        className="w-16 h-16 object-cover rounded bg-gray-100"
        onError={(e) => {
          // hide broken image icon (no fallback image)
          e.currentTarget.style.visibility = "hidden";
        }}
      />
      <div className="flex-1">
        <div className="font-medium">{item.product?.name || "Product"}</div>
        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
        <div className="text-sm text-gray-500">Size: {item.size || "-"}</div>
      </div>
      <div className="w-24 text-right">
        <div className="font-semibold">₹{formatCurrency(item.price)}</div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  const dispatch = useDispatch();
  const reduxOrders = useSelector((s) => (s.orders ? s.orders.orders : null));
  const loading = useSelector((s) => (s.orders ? s.orders.loading : false));
  const error = useSelector((s) => (s.orders ? s.orders.error : null));

  // local copy so we can optimistically update UI without re-fetching Redux
  const [orders, setOrders] = useState([]);
  // expanded set to avoid per-card hooks inside map
  const [expandedSet, setExpandedSet] = useState(new Set());
  // cancelling map { [orderId]: boolean }
  const [cancelling, setCancelling] = useState({});

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // keep local copy in sync when redux updates
  useEffect(() => {
    if (Array.isArray(reduxOrders)) setOrders(reduxOrders);
  }, [reduxOrders]);

  const toggleExpanded = (id) => {
    setExpandedSet((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    // optimistic update: remove or mark cancelled depending on preference
    const prevOrders = orders;
    // Here we remove the order from list (you requested removing rather than refetch)
    setOrders((o) => o.filter((x) => x.id !== orderId));
    setCancelling((s) => ({ ...s, [orderId]: true }));

    try {
      // adjust endpoint if your backend path differs
      const url = `/order/${orderId}/cancel/`; // will be appended to api.baseURL + /api/v1/ by user_api
      // we assume PATCH; change to POST if your backend expects that
      const res = await api.patch(url, {}, { headers: { Accept: "application/json" } });

      if (res.status >= 200 && res.status < 300) {
        // success: clean up cancelling state
        setCancelling((s) => {
          const copy = { ...s };
          delete copy[orderId];
          return copy;
        });
        // done; order already removed from UI
        return;
      }

      throw new Error(`Unexpected status ${res.status}`);
    } catch (err) {
      // restore previous orders on failure
      setOrders(prevOrders);
      setCancelling((s) => {
        const copy = { ...s };
        delete copy[orderId];
        return copy;
      });
      console.error("Cancel failed", err);
      alert("Failed to cancel order: " + (err?.response?.data?.detail || err.message || err));
    }
  };

  const isEmpty = useMemo(() => !orders || orders.length === 0, [orders]);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
        <div className="text-gray-600">Loading orders…</div>
      </main>
    );
  }

  if (error && isEmpty) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
        <div className="text-red-600">Failed to load orders: {String(error)}</div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      {isEmpty && <div className="text-gray-600">No orders yet.</div>}

      <div className="grid gap-4">
        {orders?.map((order) => {
          const createdAtString = order?.created_at
            ? new Date(order.created_at).toLocaleString()
            : "-";
          const isOpen = expandedSet.has(order.id);
          const isCancelling = !!cancelling[order.id];
          return (
            <section key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">
                    Order #{order.id} • {createdAtString}
                  </div>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 mr-2">
                      {order.payment_status || "N/A"}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100">
                      {order.order_status || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold">₹{formatCurrency(order.total_amount)}</div>
                  <div className="text-sm text-gray-500">
                    {order.razorpay_order_id ? "Paid via Razorpay" : "Payment pending"}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => toggleExpanded(order.id)}
                  className="px-3 py-1 rounded border text-sm hover:bg-gray-50"
                >
                  {isOpen ? "Hide details" : "View details"}
                </button>

                {order.order_status && !["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.order_status) && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    disabled={isCancelling}
                    className="px-3 py-1 rounded border text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}

                {order.tracking_id && (
                  <a className="px-3 py-1 rounded border text-sm hover:bg-gray-50" href="#">
                    Tracking
                  </a>
                )}
              </div>

              {isOpen && (
                <div className="mt-4">
                  <div className="border rounded p-3 bg-gray-50">
                    <div className="mb-2 text-sm text-gray-600">
                      Shipping: {order.shipping_address || "—"}
                    </div>

                    <div className="mb-3">
                      <div className="font-medium mb-2">Items</div>
                      <div className="space-y-2">
                        {order.items?.map((it) => (
                          <OrderItemRow key={it.id} item={it} />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">Phone: {order.phone || "-"}</div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Subtotal</div>
                        <div className="font-semibold text-lg">₹{formatCurrency(order.total_amount)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
