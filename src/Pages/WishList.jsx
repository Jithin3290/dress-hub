import React, { useContext, useEffect, useState } from 'react';
import WishlistContext from '../Context/WishlistContext';
import ShopContext from '../Context/ShopContext';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';

function WishList() {
  const { wish, setWish } = useContext(WishlistContext);
  const products = useContext(ShopContext);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist from server on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user || !user.id) return;

      try {
        const res = await axios.get(`http://localhost:3000/user/${user.id}`);
        const userWish = res.data.wish || [];
        setWish(userWish);
      } catch (err) {
        console.error('Failed to fetch wishlist from server', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [setWish]);

  const removeFromWishlist = async (id) => {
    const updatedWish = wish.filter((pid) => pid !== id);
    setWish(updatedWish);

    const user = JSON.parse(sessionStorage.getItem("user"));
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

  const wishedProducts = products.filter((item) => wish.includes(item.id));

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Wishlist</h1>

      {loading ? (
        <p className="text-center text-gray-500">Log in to see wishlist</p>
      ) : wishedProducts.length === 0 ? (
        <p className="text-center text-gray-600">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishedProducts.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded text-center hover:shadow-md relative"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-contain mb-2"
              />
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-green-600">${item.new_price}</p>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 text-red-500"
              >
                <FaHeart />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishList;
