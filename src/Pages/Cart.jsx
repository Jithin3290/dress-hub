import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CartContext from "../Context/CartContext";
import ShopContext from "../Context/ShopContext";
import AuthContext from "../Context/AuthContext";
import OrderContext from "../Context/OrderContext";
import toast, { Toaster } from "react-hot-toast";

function Cart() {
  const { user } = useContext(AuthContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const { order, setOrder } = useContext(OrderContext);
  const products = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3000/user/${user.id}`)
        .then((res) => {
          setCartItems(res.data.cart || []);
          setOrder(res.data.order || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load cart:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const updateCartInServer = (updatedCart) => {
    setCartItems(updatedCart);
    axios.patch(`http://localhost:3000/user/${user.id}`, {
      cart: updatedCart,
    });
  };

  const updateOrderInServer = (newOrder) => {
    setOrder(newOrder);
    axios.patch(`http://localhost:3000/user/${user.id}`, {
      order: newOrder,
    });
  };

  const handleQuantityChange = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateCartInServer(updatedCart);
  };

  const handleBuyNow = (item) => {
    const updatedOrder = [...order, item];
    updateOrderInServer(updatedOrder);

    const updatedCart = cartItems.filter((cart) => cart.id !== item.id);
    updateCartInServer(updatedCart);

    navigate("/payment");
  };

  const handleBuyAll = () => {
    const updatedOrder = [...order, ...cartItems];
    updateOrderInServer(updatedOrder);
    updateCartInServer([]);
    navigate("/payment");
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const product = products.find((p) => String(p.id) === String(item.id));
    return product ? sum + item.quantity * product.new_price : sum;
  }, 0);

  if (loading)
    return (
      <div className="text-center p-8 text-lg font-semibold">
        Loading your cart...
      </div>
    );

  if (!user)
    return (
      <div className="text-center p-8 text-red-500 font-semibold text-xl">
        Please log in to view your cart.
      </div>
    );

  if (!cartItems || cartItems.length === 0)
    return (
      <div className="text-center p-8 text-gray-600 font-semibold text-xl">
        Your cart is empty.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const product = products.find(
            (p) => String(p.id) === String(item.id)
          );
          if (!product) return null;

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-500">₹{product.new_price}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Added on: {new Date(item.date).toLocaleString()}
                  </p>

                  <div className="mt-2 flex gap-2 items-center">
                    <button
                      className={`px-2 py-1 rounded ${
                        item.quantity <= 1
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gray-200"
                      }`}
                      onClick={() => {
                        if (item.quantity <= 1) {
                          toast.error("Minimum quantity is 1");
                          return;
                        }
                        handleQuantityChange(item.id, -1);
                      }}
                    >
                      -
                    </button>

                    <span className="px-2">{item.quantity}</span>

                    <button
                      className={`px-2 py-1 rounded ${
                        item.quantity >= 5
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gray-200"
                      }`}
                      onClick={() => {
                        if (item.quantity >= 5) {
                          toast.error("Maximum quantity is 5");
                          return;
                        }
                        handleQuantityChange(item.id, 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => handleBuyNow(item)}
                >
                  Buy Now
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    const updatedCart = cartItems.filter(
                      (cart) => cart.id !== item.id
                    );
                    updateCartInServer(updatedCart);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-lg font-semibold">Total: ₹{totalPrice}</p>
        <button
          onClick={handleBuyAll}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Buy All
        </button>
      </div>
    </div>
  );
}

export default Cart;
