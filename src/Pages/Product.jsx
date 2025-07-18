import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ShopContext from "../Context/ShopContext";
import CartContext from "../Context/CartContext";
import OrderContext from "../Context/OrderContext";
import axios from "axios";
import toast from "react-hot-toast";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = useContext(ShopContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const { order, setOrder } = useContext(OrderContext);

  const product = data.find(
    (item) => item.id === parseInt(id) || item.id === id
  );

  const user = JSON.parse(sessionStorage.getItem("user"));

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const updateUserData = async (updatedCart, updatedOrder = null) => {
    if (!user || !user.id) return;

    const payload = { cart: updatedCart };
    if (updatedOrder !== null) {
      payload.order = updatedOrder;
      setOrder(updatedOrder);
    }

    try {
      await axios.patch(`http://localhost:3000/user/${user.id}`, payload);
      const updatedUser = { ...user, ...payload };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleAddToCart = () => {
    if (!user?.login) return navigate("/signup");

    const existingItem = cartItems.find((item) => item.id === product.id);
    const updatedCart = existingItem
      ? cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cartItems, { id: product.id, quantity: 1, date: getTodayDate() }];

    setCartItems(updatedCart);
    updateUserData(updatedCart);

    toast.success(existingItem ? "Cart updated!" : "Added to cart!");
  };

  const handleBuyNow = () => {
    if (!user?.login) return navigate("/signup");

    const existingOrderItem = order.find((item) => item.id === product.id);
    const updatedOrder = existingOrderItem
      ? order.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...order, { id: product.id, quantity: 1, date: getTodayDate() }];

    updateUserData(cartItems, updatedOrder);

    toast.success("Order placed!");
    navigate("/order");
  };

  if (!product) {
    return <p className="text-center mt-10 text-lg">Product not found.</p>;
  }

  const isInCart = cartItems.some((item) => item.id === product.id);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-4">
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto rounded-lg shadow-md"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-1 capitalize">{product.category}</p>
            <p className="line-through text-gray-400">${product.old_price}</p>
            <p className="text-2xl text-green-600 font-bold mb-4">
              ${product.new_price}
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.name} is one of our best-selling items. Crafted with premium materials and designed to deliver exceptional comfort and style. Perfect for daily wear or as a special gift.
            </p>
          </div>

          <div className="flex space-x-4 mt-4">
            {isInCart ? (
              <button
                onClick={() => navigate("/cart")}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Go to Cart
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            )}
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
