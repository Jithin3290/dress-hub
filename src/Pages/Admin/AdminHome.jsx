import React, { useEffect, useState, useContext } from 'react';
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

function AdminHome() {
  const [admin, setAdmin] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data,setData] = useState([]);
   useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/all_products");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchData();
  }, []);

  const formatDateToISO = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const [day, month, rest] = dateStr.split('/');
      const [year] = rest.split(',');
      return `${year.trim()}-${month}-${day}`;
    }
    return dateStr.split('T')[0];
  };

  const getPriceById = (id) => {
    const product = data.find((p) => p.id === id);
    return product?.new_price || 0;
  };

  const getCategoryData = () => {
    const categoryMap = {};
    data.forEach((product) => {
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

  const getTodayEarnings = () => {
    const today = new Date().toISOString().split('T')[0];
    return orders
      .filter((o) => o.date === today)
      .reduce((sum, o) => sum + o.total, 0);
  };

  const getTotalEarnings = () => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  };

  useEffect(() => {
    const loggedIn = JSON.parse(sessionStorage.getItem('user'));
    if (loggedIn?.isAdmin) {
      axios.get('http://localhost:3000/admin').then((res) => {
        const match = res.data.find((a) => a.email === loggedIn.email);
        setAdmin(match);
      });

      axios.get('http://localhost:3000/user').then((res) => {
        const allUsers = res.data;

        const allOrders = res.data.flatMap((user) =>
          user.order.map((o) => {
            const isoDate = formatDateToISO(o.date);
            const price = getPriceById(o.id);
            return {
              ...o,
              userName: user.name,
              userEmail: user.email,
              date: isoDate,
              price,
              total: price * (o.quantity || 1),
            };
          })
        );

        setUsers(allUsers);
        setOrders(allOrders);
      });

      setTimeout(() => setLoading(false), 800);
    } else {
      setLoading(false);
    }
  }, [data]);

  const recentOrders = [...orders].reverse().slice(0, 5);
  const categoryData = getCategoryData();
  const weeklyData = getWeeklyData();
  const todayEarnings = getTodayEarnings();
  const totalEarnings = getTotalEarnings();

  const topSelling = data
    .map((p) => ({
      ...p,
      sales: orders.filter((o) => o.id === p.id).reduce((sum, o) => sum + (o.quantity || 1), 0),
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Welcome, {admin.name}
        </h1>

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
            <p className="text-2xl font-bold text-purple-500">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold text-orange-500">{orders.length}</p>
          </div>
        </div>

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

        <div className="bg-white rounded-xl p-6 shadow-md mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Top Selling Products</h2>
          {topSelling.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topSelling.map((item, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-contain rounded-md mb-3"
                  />
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

export default AdminHome;
