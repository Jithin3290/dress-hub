import { useContext, useEffect } from 'react';
import CartContext from '../Context/CartContext';
import ShopContext from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

function Cart() {
  const data = useContext(ShopContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const nav = useNavigate();

  const getUser = () => JSON.parse(sessionStorage.getItem("user"));
  const auth = getUser();

  const cart = data.filter(product => cartItems[product.id]);

  // 🔄 Sync cart to DB + session
  const syncCartToUser = async (updatedCart) => {
    const freshAuth = getUser();
    if (freshAuth?.id) {
      try {
        await axios.patch(`http://localhost:3000/user/${freshAuth.id}`, {
          cart: updatedCart,
        });

        sessionStorage.setItem("user", JSON.stringify({ ...freshAuth, cart: updatedCart }));
      } catch (err) {
        console.error("Failed to sync cart to user:", err);
      }
    }
  };

  // 🔁 Load cart from sessionStorage once on mount
  useEffect(() => {
    if (auth?.cart) {
      setCartItems(auth.cart);
    }
  }, []);

  const increment = (id) => {
    const updated = {
      ...cartItems,
      [id]: (cartItems[id] || 1) + 1
    };
    setCartItems(updated);
    syncCartToUser(updated);
  };

  const decrement = (id) => {
    let updated = { ...cartItems };
    if (updated[id] <= 1) {
      delete updated[id];
    } else {
      updated[id] -= 1;
    }
    setCartItems(updated);
    syncCartToUser(updated);
  };

  const removeItem = (id) => {
    const updated = { ...cartItems };
    delete updated[id];
    setCartItems(updated);
    syncCartToUser(updated);
  };

  const total = cart.reduce((sum, item) => {
    return sum + item.new_price * cartItems[item.id];
  }, 0);

  const handleBuyNow = () => {
    if (!auth) {
      toast.error("Please login to continue");
      return;
    }
    nav("/order");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border p-4 mb-4 rounded">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-green-600">${item.new_price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {cartItems[item.id] > 1 && (
                  <button onClick={() => decrement(item.id)} className="px-2 py-1 border">-</button>
                )}
                <span>{cartItems[item.id]}</span>
                <button onClick={() => increment(item.id)} className="px-2 py-1 border">+</button>
                <button onClick={() => removeItem(item.id)} className="ml-3 text-red-500">Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold">Total: ${total}</h2>
            <button
              onClick={handleBuyNow}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
