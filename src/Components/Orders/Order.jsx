import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import OrderContext from "../../Context/OrderContext";
import ShopContext from "../../Context/ShopContext";

function Order() {
  const { order, setOrder } = useContext(OrderContext);
  const products = useContext(ShopContext);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    async function fetchOrderData() {
      if (user && user.id) {
        try {
          const res = await axios.get(`http://localhost:3000/user/${user.id}`);
          const userOrder = res.data.order || [];
          setOrder(userOrder);
        } catch (err) {
          console.error("Failed to fetch order:", err);
        }
      }
    }

    fetchOrderData();
  }, [user?.id, setOrder]);

  useEffect(() => {
    if (products.length > 0 && order.length > 0) {
      const normalizedOrder = order.map((id) => Number(id));
      const filtered = products.filter((item) =>
        normalizedOrder.includes(Number(item.id))
      );
      setOrderedProducts(filtered);
    } else {
      setOrderedProducts([]);
    }
  }, [order, products]);

  if (!user || !user.login) {
    return <p className="text-center mt-10 text-lg">Please log in to see your orders.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {orderedProducts.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedProducts.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
              <p className="text-gray-500 line-through">${item.old_price}</p>
              <p className="text-green-600 font-bold">${item.new_price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
