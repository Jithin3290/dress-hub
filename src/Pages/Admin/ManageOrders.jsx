// src/Pages/Admin/ManageOrders.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ShopContext from "../../Context/ShopContext";

function ManageOrders() {
  const products = useContext(ShopContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:3000/user");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }

    fetchUsers();
  }, []);

  const getProductById = (id) => products.find((p) => Number(p.id) === Number(id));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      {users.map((user) => (
        <div key={user.id} className="mb-6 p-4 bg-white rounded shadow">
          <h3 className="font-bold text-lg mb-2">{user.name}'s Orders</h3>
          {user.order && user.order.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.order.map((orderId) => {
                const product = getProductById(orderId);
                return product ? (
                  <div
                    key={orderId}
                    className="border p-3 rounded shadow-sm bg-gray-50"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-contain mb-2"
                    />
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-green-600 font-bold">₹{product.new_price}</p>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-gray-500">No orders found.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ManageOrders;
