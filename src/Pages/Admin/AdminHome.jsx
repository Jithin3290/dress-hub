import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategoryData = () => {
    const categoryMap = {};
    products.forEach((product) => {
      categoryMap[product.category] = (categoryMap[product.category] || 0) + 1;
    });
    return Object.keys(categoryMap).map((cat) => ({
      name: cat,
      value: categoryMap[cat],
    }));
  };

  const getWeeklyData = () => {
    const today = new Date();
    const weeklyData = Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      const count = orders.filter((o) => o.date === formattedDate).length;
      return { date: formattedDate, orders: count };
    }).reverse();
    return weeklyData;
  };

  useEffect(() => {
    const loggedIn = JSON.parse(sessionStorage.getItem('user'));
    if (loggedIn?.isAdmin) {
      axios.get('http://localhost:3000/admin').then((res) => {
        const match = res.data.find((a) => a.email === loggedIn.email);
        setAdmin(match);
      });

      axios.get('http://localhost:3000/user').then((res) => {
        const allOrders = res.data.flatMap((user) =>
          user.order.map((o) => ({
            ...o,
            userName: user.name,
            userEmail: user.email,
          }))
        );
        setOrders(allOrders);
      });

      axios.get('http://localhost:3000/data').then((res) => {
        setProducts(res.data);
      });

      setTimeout(() => setLoading(false), 800);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600">Admin not found or not authorized.</p>
      </div>
    );
  }

  const recentOrders = [...orders].reverse().slice(0, 5);
  const categoryData = getCategoryData();
  const weeklyData = getWeeklyData();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Welcome, {admin.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">Category Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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

        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Product ID</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{order.userName}</td>
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.quantity}</td>
                    <td className="p-2">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <p className="text-gray-500 mt-4">No recent orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
