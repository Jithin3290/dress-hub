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

  const getProductById = (id) => products.find((p) => (p.id) == (id));

  const handleCancelOrder = async (userId, orderIndex) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const updatedOrders = [...user.order];
      updatedOrders.splice(orderIndex, 1); // remove order item by index

      await axios.patch(`http://localhost:3000/user/${userId}`, {
        order: updatedOrders,
      });

      // update local state
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, order: updatedOrders } : u
      );
      setUsers(updatedUsers);
    } catch (err) {
      console.error("Failed to cancel order", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Orders</h2>
      {users.map((user) => (
        <div key={user.id} className="mb-8 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">
            {user.name}'s Orders
          </h3>
          {user.order && user.order.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.order.map((orderItem, index) => {
                const product = getProductById(orderItem.id);
                return product ? (
                  <div
                    key={index}
                    className="bg-gray-50 border rounded-lg p-4 shadow-sm relative"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-contain mb-3 rounded"
                    />
                    <h4 className="text-lg font-semibold">{product.name}</h4>
                    <p className="text-green-600 font-bold">₹{product.new_price}</p>
                    <p className="text-sm text-gray-600">Quantity: {orderItem.quantity}</p>
                    <p className="text-sm text-gray-600 mb-2">Ordered on: {orderItem.date}</p>
                    <button
                      onClick={() => handleCancelOrder(user.id, index)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel Order
                    </button>
                  </div>
                ) : (
                  <p key={index} className="text-red-500">
                    Product not found (ID: {orderItem.id})
                  </p>
                );
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
