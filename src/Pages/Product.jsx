import React, { useContext, useState } from "react";
import ShopContext from "../Context/ShopContext";
import { useNavigate, useParams } from "react-router-dom";
import CartContext from "../Context/CartContext";
import OrderContext from "../Context/OrderContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function Product() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { order, setOrder } = useContext(OrderContext);
  const nav = useNavigate();
  const products = useContext(ShopContext);
  const { id } = useParams();
  const auth = JSON.parse(sessionStorage.getItem("user"));

  const [selectedSize, setSelectedSize] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const og = products.find((item) => item.id == id);

  async function handleAddToCart() {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (auth && auth.login === true) {
      const updatedCart = {
        ...cartItems,
        [id]: (cartItems[id] || 0) + 1,
      };

      setCartItems(updatedCart);
      setIsAddedToCart(true);
      toast.success("Added to cart successfully");

      try {
        await axios.patch(`http://localhost:3000/user/${auth.id}`, {
          cart: updatedCart,
        });

        sessionStorage.setItem("user", JSON.stringify({ ...auth, cart: updatedCart }));
      } catch (err) {
        console.error("Failed to sync cart to server:", err);
        toast.error("Cart sync failed!");
      }
    } else {
      toast.error("Please log in");
    }
  }

  function handleBuyNow() {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (auth && auth.login === true) {
      toast.success("Ordered successfully");
      if (!order.includes(id)) {
        setOrder([...order, id]);
      }
      setTimeout(() => {
        nav("/order");
      }, 500);
    } else {
      toast.error("Please log in");
    }
  }

  if (!og) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex md:flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <img
              key={i}
              src={og.image}
              alt={`Thumbnail ${i + 1}`}
              className="w-20 h-20 object-cover border rounded-md"
            />
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <img
            src={og.image}
            alt={og.name}
            className="w-full max-w-md h-auto object-contain border rounded-lg"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-semibold">{og.name}</h1>

          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(4)].map((_, i) => (
              <img
                key={i}
                src="/product/star_icon.png"
                alt="star"
                className="w-5 h-5"
              />
            ))}
            <img
              src="/product/star_dull_icon.png"
              alt="star"
              className="w-5 h-5"
            />
            <p className="text-gray-600 ml-2">122 reviews</p>
          </div>

          <div className="flex gap-4 text-lg font-bold">
            <p className="text-gray-500 line-through">${og.old_price}</p>
            <p className="text-green-600">${og.new_price}</p>
          </div>

          <p className="text-sm text-gray-700">{og.name}</p>

          <div>
            <h2 className="font-semibold mb-2">Select Size</h2>
            <div className="flex gap-3">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-1 rounded-md cursor-pointer ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-4 p-2">
            {isAddedToCart ? (
              <button
                onClick={() => nav("/cart")}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Go to Cart
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`px-6 py-2 rounded text-white ${
                  selectedSize
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!selectedSize}
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
