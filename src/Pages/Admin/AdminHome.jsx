import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function AdminHome() {
  const [orders, setOrders] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await axios.get('http://localhost:3000/user');
      const productRes = await axios.get('http://localhost:3000/all_products');

      const allOrders = userRes.data.flatMap(user =>
        user.order
          ? Object.entries(user.order).map(([productId, quantity]) => ({
              productId,
              quantity,
            }))
          : []
      );

      const products = productRes.data;
      let total = 0;
      let monthly = Array(12).fill(0);

      allOrders.forEach(order => {
        const product = products.find(p => p.id == order.productId);
        if (product) {
          const price = product.new_price * order.quantity;
          total += price;
          const currentMonth = new Date().getMonth(); // fake all in current month
          monthly[currentMonth] += price;
        }
      });

      setOrders(allOrders);
      setTotalEarnings(total);
      setMonthlyData(
        monthly.map((amount, i) => ({
          month: new Date(0, i).toLocaleString('default', { month: 'short' }),
          earnings: amount,
        }))
      );
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome, Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg text-gray-600">Total Orders</h2>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg text-gray-600">Total Earnings</h2>
          <p className="text-3xl font-bold text-green-600">₹{totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
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
    </div>
  );
}

export default AdminHome;
