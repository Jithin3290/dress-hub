import React, { useContext, useEffect, useState } from 'react';
import WishlistContext from '../Context/WishlistContext';
import ShopContext from '../Context/ShopContext';
import CartContext from '../Context/CartContext';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function WishList() {
  const { wish, setWish } = useContext(WishlistContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const products = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const userData = JSON.parse(sessionStorage.getItem('user'));
      if (!userData || !userData.id) {
        setLoading(false);
        return;
      }

      setUser(userData);

      try {
        const res = await axios.get(`http://localhost:3000/user/${userData.id}`);
        const userWish = res.data.wish || [];
        setWish(userWish);
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [setWish]);

  const removeFromWishlist = async (id) => {
    const updatedWish = wish.filter(pid => pid !== id);
    setWish(updatedWish);

    if (!user) return;

    try {
      await axios.patch(`http://localhost:3000/user/${user.id}`, {
        wish: updatedWish,
      });

      const updatedUser = { ...user, wish: updatedWish };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to update wishlist on server", err);
    }
  };

  const addToCart = async (id) => {
    if (!user) return;

    const currentDate = new Date().toISOString().split('T')[0];
    const existingCart = cartItems || [];
    const alreadyInCart = existingCart.find(item => item.id === id);

    if (alreadyInCart) {
      toast.error("Item already in cart");
      return;
    }

    const updatedCart = [...existingCart, { id, quantity: 1, date: currentDate }];
    setCartItems(updatedCart);

    try {
      await axios.patch(`http://localhost:3000/user/${user.id}`, {
        cart: updatedCart,
      });

      const updatedUser = { ...user, cart: updatedCart };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Added to cart");
      navigate('/cart');
    } catch (err) {
      console.error("Failed to update cart on server", err);
    }
  };

  const wishedProducts = products.filter(item => wish.includes(item.id));

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-center mb-6">Your Wishlist</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading wishlist...</p>
      ) : !user ? (
        <p className="text-center text-red-500">Please log in to view your wishlist.</p>
      ) : wishedProducts.length === 0 ? (
        <p className="text-center text-gray-600">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishedProducts.map(item => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md relative">
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 text-red-500"
              >
                <FaHeart />
              </button>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-contain mb-2"
              />
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-green-600 font-medium">${item.new_price}</p>

              <button
                onClick={() => addToCart(item.id)}
                className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishList;
