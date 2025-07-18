import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import OrderContext from "../../Context/OrderContext";
import ShopContext from "../../Context/ShopContext";

function Order() {
  const { order, setOrder } = useContext(OrderContext);
  const products = useContext(ShopContext);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

  // Fetch latest order from server
  useEffect(() => {
    async function fetchOrderData() {
      if (user?.id) {
        try {
          const res = await axios.get(`http://localhost:3000/user/${user.id}`);
          const userOrder = res.data.order || [];
          setOrder(userOrder);

          // Also update session storage with latest order
          const updatedUser = { ...user, order: userOrder };
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (err) {
          console.error("Failed to fetch order:", err);
        }
      }
    }

    fetchOrderData();
  }, [user?.id, setOrder]);

  // Prepare displayable products
  useEffect(() => {
    if (products.length > 0 && order.length > 0) {
      const filtered = order
        .map((entry) => {
          const id = typeof entry === "object" ? entry.id : entry;
          const quantity = typeof entry === "object" ? entry.quantity : 1;
          const date = typeof entry === "object" ? entry.date : "Unknown";
          const product = products.find((p) => String(p.id) === String(id));
          if (product) {
            return { ...product, quantity, date };
          }
          return null;
        })
        .filter(Boolean);
      setOrderedProducts(filtered);
    } else {
      setOrderedProducts([]);
    }
  }, [order, products]);

  // Cancel a specific order
  const handleCancelOrder = async (idToRemove) => {
    if (!user?.id) return;

    const updatedOrder = order.filter((entry) => {
      if (typeof entry === "object") {
        return String(entry.id) !== String(idToRemove);
      } else {
        return String(entry) !== String(idToRemove);
      }
    });

    try {
      await axios.patch(`http://localhost:3000/user/${user.id}`, {
        order: updatedOrder,
      });

      // Update local state and session storage
      setOrder(updatedOrder);
      const updatedUser = { ...user, order: updatedOrder };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  if (!user?.login) {
    return (
      <p className="text-center mt-10 text-lg">
        Please log in to see your orders.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {orderedProducts.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedProducts.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow-md bg-white flex flex-col"
            >
              <div className="flex justify-center items-center h-48 bg-gray-100 rounded-md mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full object-contain"
                />
              </div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-green-600 font-bold">${item.new_price}</p>
              <p className="text-sm text-gray-700 mt-1">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-500 mb-3">Date: {item.date}</p>
              <button
                onClick={() => handleCancelOrder(item.id)}
                className="mt-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
