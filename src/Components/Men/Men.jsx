import React, { useContext } from 'react';
import ShopContext from '../../Context/ShopContext';
import WishlistContext from '../../Context/WishlistContext';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function Men() {
  const products = useContext(ShopContext);
  const { wish, setWish } = useContext(WishlistContext);
  const auth = JSON.parse(sessionStorage.getItem("user"));

  const toggleWishlist = async (id) => {
    if (auth && auth.login === true) {
      let updatedWishlist;

      if (Array.isArray(wish) && wish.includes(id)) {
        updatedWishlist = wish.filter(pid => pid !== id);
      } else {
        updatedWishlist = Array.isArray(wish) ? [...wish, id] : [id];
      }

      // Update local state
      setWish(updatedWishlist);

      // Sync with JSON server
      try {
        await axios.patch(`http://localhost:3000/user/${auth.id}`, {
          wishlist: updatedWishlist
        });
      } catch (error) {
        console.error("Failed to update wishlist on server:", error);
      }
    } else {
      toast.error("Please login");
    }
  };

  const menProducts = products.filter(item => item.category === "men");

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <img src="/product/banner_mens.png" alt="banner" />
      <h1 className="text-center p-10 text-xl font-bold mb-4">Men's Collection</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {menProducts.map(product => (
          <div key={product.id} className="relative border p-4 rounded hover:shadow-lg transition">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-2 right-2 text-xl"
            >
              {(Array.isArray(wish) ? wish : []).includes(product.id) ? '❤️' : '🤍'}
            </button>

            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} className="w-full h-48 object-contain" />
            </Link>
            <h2 className="mt-2 font-medium text-sm">{product.name}</h2>
            <p className="text-green-600 font-semibold">
              ${product.new_price}{' '}
              <span className="text-gray-500 line-through text-sm">${product.old_price}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Men;
