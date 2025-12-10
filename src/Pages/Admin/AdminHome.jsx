// src/Pages/AdminHome.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  fetchAdminUsers,
  fetchAdminOrders,
} from "../../Redux/Slices/adminSlice.jsx";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2", "#FF6F91"];

function resolveImageUrl(imgPath) {
  if (!imgPath) return "";
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${API_BASE.replace(/\/$/, "")}${imgPath}`;
}

export default function AdminHome() {
  const dispatch = useDispatch();
  const { products = [], users = [], orders = [], loading, error } = useSelector((s) => s.admin || {});
  
  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  // helper: convert order created_at to simple date label
  const formatISO = (iso) => (iso ? iso.split("T")[0] : "");

  // --- normalize categories to readable strings ---
const categoryData = useMemo(() => {
  const map = {};
  (products || []).forEach((p) => {
    let cat = "Unknown";
    if (p.category_name) cat = String(p.category_name).trim();
    else if (p.category && typeof p.category === "object") cat = String(p.category.name || p.category.slug || "Unknown").trim();
    else if (typeof p.category === "string") cat = p.category.trim() || "Unknown";
    // do not synthesize "Category #n" here because your backend already returns nested category for most items
    if (!cat) cat = "Unknown";
    map[cat] = (map[cat] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}, [products]);

const categoryColorMap = useMemo(() => {
  const map = {};
  categoryData.forEach((c, idx) => {
    map[c.name] = COLORS[idx % COLORS.length];
  });
  return map;
}, [categoryData]);

  // --- build a lookup map for users so we can resolve order.user when backend returns id/email/object ---
  const userMap = useMemo(() => {
    const m = {};
    (users || []).forEach((u) => {
      if (u == null) return;
      if (u.id !== undefined) m[u.id] = u;
      if (u.email) m[u.email] = u;
      // also map by name just in case
      if (u.name) m[u.name] = u;
    });
    return m;
  }, [users]);

  // --- resolvedOrders: ensure order.user is an object with name/email if possible ---
  const resolvedOrders = useMemo(() => {
    return (orders || []).map((o) => {
      let userObj = o.user ?? null;

      if (!userObj && o.user_id) {
        // some APIs use user_id
        userObj = userMap[o.user_id] || null;
      } else if (typeof o.user === "number") {
        userObj = userMap[o.user] || null;
      } else if (typeof o.user === "string") {
        userObj = userMap[o.user] || null;
      } else if (o.user && typeof o.user === "object" && o.user.id) {
        // try to replace with canonical user from userMap if present
        userObj = userMap[o.user.id] || o.user;
      }

      // fallbacks to safe object so UI can read .name/.email
      if (!userObj) userObj = null;

      return {
        ...o,
        user: userObj,
      };
    });
  }, [orders, userMap]);

  // weekly data computed from resolvedOrders
  const weeklyData = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    return days.map((day) => {
      const count = (resolvedOrders || []).filter((o) => formatISO(o.created_at) === day).length;
      return { date: day, orders: count };
    });
  }, [resolvedOrders]);

  const totalEarnings = useMemo(() => {
    return (resolvedOrders || []).reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  }, [resolvedOrders]);

  const today = new Date().toISOString().split("T")[0];
  const todayEarnings = useMemo(() => {
    return (resolvedOrders || []).filter((o) => formatISO(o.created_at) === today)
      .reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
  }, [resolvedOrders]);

  // top selling from products + resolvedOrders
  const topSelling = useMemo(() => {
    const salesMap = {};
    (resolvedOrders || []).forEach((o) => {
      (o.items || []).forEach((it) => {
        const pid = it.product?.id ?? it.product;
        salesMap[pid] = (salesMap[pid] || 0) + (it.quantity || 0);
      });
    });
    const withSales = (products || []).map((p) => ({ ...p, sales: salesMap[p.id] || 0 }));
    return withSales.sort((a, b) => b.sales - a.sales).slice(0, 6);
  }, [products, resolvedOrders]);

  if (loading) return <div className="p-8">Loading admin dashboard...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {String(error)}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-gray-600">Today’s Earnings</h3>
            <p className="text-2xl font-bold text-green-500">₹{todayEarnings.toFixed(2)}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-gray-600">Total Earnings</h3>
            <p className="text-2xl font-bold text-blue-500">₹{totalEarnings.toFixed(2)}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-gray-600">Total Users</h3>
            <p className="text-2xl font-bold text-purple-500">{(users || []).length}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold text-orange-500">{(resolvedOrders || []).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">Category Distribution</h2>

            <div className="flex items-center gap-4">
              <div style={{ width: 220, height: 220 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColorMap[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend: color swatch + label + count */}
              <div className="flex-1">
                {categoryData.length === 0 && <div className="text-sm text-gray-500">No categories</div>}
                <ul className="space-y-2">
                  {categoryData.map((c) => (
                    <li key={c.name} className="flex items-center gap-3">
                      <span
                        style={{ background: categoryColorMap[c.name], width: 14, height: 14, display: "inline-block", borderRadius: 3 }}
                      />
                      <span className="text-sm text-gray-700 flex-1">{c.name}</span>
                      <span className="text-sm text-gray-500">({c.value})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">Weekly Orders</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Order ID</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {(resolvedOrders || []).slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">
                      {order.user?.name || order.user?.email || "—"}
                    </td>
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">₹{Number(order.total_amount).toFixed(2)}</td>
                    <td className="p-2">{formatISO(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(resolvedOrders || []).length === 0 && (
              <p className="text-gray-500 mt-4">No recent orders found.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Top Selling Products</h2>
          {topSelling.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topSelling.map((item, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition">
                  <div className="w-full h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={resolveImageUrl(item.image)} alt={item.name} className="max-h-full object-contain" />
                    ) : (
                      <div className="text-sm text-gray-400">No image</div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">Price: ₹{item.new_price}</p>
                  <p className="text-sm text-gray-500">Units Sold: {item.sales}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
