import React, { useContext, useEffect, useState } from 'react';
import ShopContext from '../Context/ShopContext';
import AuthContext from '../Context/AuthContext';
import WishlistContext from '../Context/WishlistContext';
import CartContext from '../Context/CartContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

function WishList() {
  const products = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const { wish, setWish } = useContext(WishlistContext);
  const { cartItems, setCartItems } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/user/${user.id}`);
        const userData = res.data;
        setWish(userData.wish || []);
        setCartItems(userData.cart || []);
      } catch (error) {
        console.error('Error fetching user wish/cart data:', error);
      } 
    };

    fetchWishData();
  }, [user]);

  const removeFromWishlist = async (productId) => {
    const updatedWish = wish.filter((id) => id !== productId);
    setWish(updatedWish);

    try {
      await axios.patch(`http://localhost:3000/user/${user.id}`, { wish: updatedWish });
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const addToCart = async (productId) => {
    const newItem = { id: productId, quantity: 1, date: new Date().toISOString() };
    const updatedCart = [...cartItems, newItem];
    setCartItems(updatedCart);
    try {
      await axios.patch(`http://localhost:3000/user/${user.id}`, { cart: updatedCart });
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = async (productId) => {
    const orderItem = { id: productId, quantity: 1, date: new Date().toISOString() };

    try {
      const res = await axios.get(`http://localhost:3000/user/${user.id}`);
      const prevOrder = res.data.order || [];
      const updatedOrder = [...prevOrder, orderItem];

      await axios.patch(`http://localhost:3000/user/${user.id}`, { order: updatedOrder });
      toast.success('Order placed');
      navigate('/order');
    } catch (error) {
      console.error('Buy now failed:', error);
    }
  };
  const wishListProducts = products.filter((product) => wish.includes(product.id));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Wishlist</h1>
      {wishListProducts.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishListProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow relative">
              <button
                className="absolute top-2 right-2 text-red-500"
                onClick={() => removeFromWishlist(product.id)}
              >
                <FaHeart size={20} />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain mb-2"
              />
              <h2 className="text-lg font-medium">{product.name}</h2>
              <p className="text-gray-700">₹{product.new_price}</p>

              <div className="flex gap-2 mt-3">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                  onClick={() => handleBuyNow(product.id)}
                >
                  Buy Now
                </button>

                {cartItems.some(item => item.id === product.id) ? (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                      onClick={() => navigate('/cart')}
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  )}
                <Link to={`/product/${product.id}`}>
                  <button className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300">
                    View
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishList;
