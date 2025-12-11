// src/pages/OrderPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../Redux/Slices/orderSlice";

// helpers
const formatCurrency = (val) => {
  if (val === null || val === undefined || Number.isNaN(Number(val))) return "0.00";
  const n = typeof val === "number" ? val : parseFloat(String(val));
  return n.toFixed(2);
};

const resolveImageUrl = (imgPath) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${API_BASE.replace(/\/$/, "")}${imgPath}`;
};

function OrderItemRow({ item }) {
  const unitPrice = Number(item.price || 0);
  const qty = Number(item.quantity || 0);
  const lineTotal = unitPrice * qty;
  const imageUrl = resolveImageUrl(item.product?.image || "");

  return (
    <div className="flex gap-3 items-start py-2 border-b last:border-b-0">
      <img
        src={imageUrl}
        alt={item.product?.name || "product"}
        className="w-16 h-16 object-cover rounded bg-gray-100"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />

      <div className="flex-1">
        <div className="font-medium">{item.product?.name || "Product"}</div>
        <div className="text-sm text-gray-500">Size: {item.size || "-"}</div>
        <div className="text-sm text-gray-500">Qty: {qty}</div>

        <div className="mt-1 text-sm flex items-center gap-3 text-gray-600">
          <div>Unit: ₹{formatCurrency(unitPrice)}</div>
          <div className="font-semibold">Line: ₹{formatCurrency(lineTotal)}</div>
        </div>
      </div>

      <div className="w-28 text-right">
        <div className="text-xs text-gray-500">Price</div>
        <div className="font-semibold">₹{formatCurrency(lineTotal)}</div>
      </div>
    </div>
  );
}

function OrderSummary({ order }) {
  const subtotal = (order.items || []).reduce((acc, it) => {
    const p = Number(it.price || 0);
    const q = Number(it.quantity || 0);
    return acc + p * q;
  }, 0);

  const shipping = Number(order.shipping_cost || 0);
  const tax = Number(order.tax_amount || 0);
  const computedTotal = subtotal + shipping + tax;
  const serverTotal = Number(order.total_amount || 0);
  const mismatch = Math.abs(computedTotal - serverTotal) > 0.01;

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex justify-between text-sm text-gray-600">
        <div>Subtotal</div>
        <div>₹{formatCurrency(subtotal)}</div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <div>Shipping</div>
        <div>₹{formatCurrency(shipping)}</div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <div>Tax</div>
        <div>₹{formatCurrency(tax)}</div>
      </div>

      <div className="flex justify-between items-center mt-3 border-t pt-3">
        <div className="text-sm text-gray-500">Total (calculated)</div>
        <div className="font-semibold text-lg">₹{formatCurrency(computedTotal)}</div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="text-sm text-gray-500">Total (server)</div>
        <div className="font-semibold text-lg">₹{formatCurrency(serverTotal)}</div>
      </div>

      {mismatch && (
        <div className="mt-2 text-xs text-red-600">
          Notice: server total differs from calculated subtotal. This can happen if discounts, shipping or taxes are applied on the server.
        </div>
      )}
    </div>
  );
}

export default function OrderPage() {
  const dispatch = useDispatch();
  const reduxOrders = useSelector((s) => (s.orders ? s.orders.orders : null));
  const loading = useSelector((s) => (s.orders ? s.orders.loading : false));
  const error = useSelector((s) => (s.orders ? s.orders.error : null));

  const [orders, setOrders] = useState([]);
  const [expandedSet, setExpandedSet] = useState(new Set());

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

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
          const createdAtString = order?.created_at ? new Date(order.created_at).toLocaleString() : "-";
          const isOpen = expandedSet.has(order.id);

          return (
            <section key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Order #{order.id} • {createdAtString}</div>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100">
                      ORDER: {order.order_status || "pending"}
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
                <button onClick={() => toggleExpanded(order.id)} className="px-3 py-1 rounded border text-sm hover:bg-gray-50">
                  {isOpen ? "Hide details" : "View details"}
                </button>

                {order.tracking_id && (
                  <a className="px-3 py-1 rounded border text-sm hover:bg-gray-50" href="#">
                    Tracking
                  </a>
                )}
              </div>

              {isOpen && (
                <div className="mt-4">
                  <div className="border rounded p-3 bg-gray-50">
                    <div className="mb-2 text-sm text-gray-600">Shipping: {order.shipping_address || "—"}</div>

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

                    <OrderSummary order={order} />
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
