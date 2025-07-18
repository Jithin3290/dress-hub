import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ShopContext from '../../Context/ShopContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#34d399', '#60a5fa', '#facc15', '#f87171', '#a78bfa', '#f472b6'];

function AdminHome() {
  const products = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await axios.get('http://localhost:3000/user');
      const allOrders = [];
      const categoryMap = {};
      const dailyMap = {};
      let total = 0;
      let monthly = Array(12).fill(0);

      userRes.data.forEach(user => {
        if (Array.isArray(user.order)) {
          user.order.forEach(order => {
            const product = products.find(p => p.id == order.id);
            if (product) {
              const price = product.new_price * order.quantity;
              total += price;
              const date = new Date(order.date);
              const key = date.toISOString().split('T')[0];
              const monthIndex = date.getMonth();

              if (!dailyMap[key]) dailyMap[key] = 0;
              dailyMap[key] += price;
              monthly[monthIndex] += price;

              const cat = product.category || 'Others';
              if (!categoryMap[cat]) categoryMap[cat] = 0;
              categoryMap[cat] += price;

              allOrders.push({ ...order, price, date: key, category: cat });
            }
          });
        }
      });

      setOrders(allOrders);
      setTotalEarnings(total);

      setDailyData(
        Object.entries(dailyMap).map(([date, earnings]) => ({ date, earnings }))
      );

      setMonthlyData(
        monthly.map((amount, i) => ({
          month: new Date(0, i).toLocaleString('default', { month: 'short' }),
          earnings: amount,
        }))
      );

      setCategoryData(
        Object.entries(categoryMap).map(([category, earnings], index) => ({
          name: category,
          value: earnings,
          color: COLORS[index % COLORS.length],
        }))
      );
    };

    fetchData();
  }, [products]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome, Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg text-gray-600">Total Orders</h2>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg text-gray-600">Total Earnings</h2>
          <p className="text-3xl font-bold text-green-600">₹{totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg text-gray-600">Unique Days</h2>
          <p className="text-3xl font-bold">{dailyData.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily Earnings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="earnings" stroke="#60a5fa" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="earnings" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Earnings by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice().reverse().map((order, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{order.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
