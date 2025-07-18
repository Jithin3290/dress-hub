import React, { useContext, useEffect, useState } from 'react';
import OrderContext from '../Context/OrderContext';
import ShopContext from '../Context/ShopContext';
import CartContext from '../Context/CartContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Cart() {
  const data = useContext(ShopContext); // All products
  const { cartItems, setCartItems } = useContext(CartContext);
  const { setOrder } = useContext(OrderContext);

  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const u = JSON.parse(sessionStorage.getItem("user"));
    setUser(u);
  }, []);

  useEffect(() => {
    let t = 0;
    cartItems.forEach((item) => {
      const p = data.find((prod) => prod.id === item.id);
      if (p) {
        t += p.new_price * item.quantity;
      }
    });
    setTotal(t);
  }, [cartItems, data]);

  const syncCart = async (newCart) => {
    setCartItems(newCart);
    const updatedUser = { ...user, cart: newCart };
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    await axios.patch(`http://localhost:3000/user/${user.id}`, {
      cart: newCart,
    });
  };

  const handleIncrement = (id) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        if (item.quantity >= 5) {
          toast.error("You can only add up to 5 items.");
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    syncCart(updated);
  };

  const handleDecrement = (id) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        if (item.quantity <= 1) {
          toast.error("Minimum quantity is 1.");
          return item;
        }
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    syncCart(updated);
  };

  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    syncCart(updated);
    toast.success("Item removed from cart");
  };

  const handleBuyNow = async () => {
    const newOrder = [...cartItems];
    const updatedUser = { ...user, order: [...(user.order || []), ...newOrder], cart: [] };
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setCartItems([]);
    setOrder((prev) => [...prev, ...newOrder]);

    await axios.patch(`http://localhost:3000/user/${user.id}`, {
      cart: [],
      order: updatedUser.order,
    });

    toast.success("Order placed successfully!");
  };

  return (
    <div className="cart-container p-4">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => {
          const prod = data.find((p) => p.id === item.id);
          if (!prod) return null;

          return (
            <div key={item.id} className="cart-item flex gap-4 items-center mb-4 shadow-md p-4 rounded-lg">
              <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{prod.name}</h3>
                <p>₹{prod.new_price} x {item.quantity}</p>
                <div className="flex items-center gap-2 mt-2">
                  {/* 👇 Conditional rendering for - button */}
                  {item.quantity > 1 && (
                    <button onClick={() => handleDecrement(item.id)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                  )}
                  <span className="font-bold">{item.quantity}</span>
                  {/* 👇 Conditional rendering for + button */}
                  {item.quantity < 5 && (
                    <button onClick={() => handleIncrement(item.id)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                  )}
                  <button onClick={() => handleRemove(item.id)} className="ml-4 text-red-500">Remove</button>
                </div>
              </div>
              <p className="font-semibold">₹{prod.new_price * item.quantity}</p>
            </div>
          );
        })
      )}

      {cartItems.length > 0 && (
        <div className="cart-summary mt-6">
          <h3 className="text-xl font-bold">Total: ₹{total}</h3>
          <button
            onClick={handleBuyNow}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
