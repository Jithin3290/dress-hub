import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ShopContext from "../Context/ShopContext";
import CartContext from "../Context/CartContext";
import OrderContext from "../Context/OrderContext";
import axios from "axios";

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

  const updateUserData = async (newCart, newOrder = null) => {
    if (!user || !user.id) return;

    try {
      const payload = { cart: newCart };
      if (newOrder !== null) {
        payload.order = newOrder;
        setOrder(newOrder);
      }

      await axios.patch(`http://localhost:3000/user/${user.id}`, payload);
      const updatedUser = { ...user, ...payload };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleAddToCart = () => {
    if (!user || !user.login) {
      navigate("/signup");
      return;
    }

    const updatedCart = { ...cartItems };
    updatedCart[product.id] = (updatedCart[product.id] || 0) + 1;

    setCartItems(updatedCart);
    updateUserData(updatedCart);
  };

  const handleBuyNow = () => {
    if (!user || !user.login) {
      navigate("/signup");
      return;
    }

    // Update order list (avoid duplicates)
    const updatedOrder = order.includes(product.id)
      ? [...order]
      : [...order, product.id];

    // Update cart as well (optional for Buy Now)
    const updatedCart = { ...cartItems };
    updatedCart[product.id] = (updatedCart[product.id] || 0) + 1;

    setCartItems(updatedCart);
    updateUserData(updatedCart, updatedOrder);

    navigate("/order");
  };

  if (!product) {
    return <p className="text-center mt-10 text-lg">Product not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto rounded-lg shadow"
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category}</p>
          <p className="text-lg line-through text-gray-400">
            ${product.old_price}
          </p>
          <p className="text-2xl text-green-600 font-bold mb-4">
            ${product.new_price}
          </p>

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
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
