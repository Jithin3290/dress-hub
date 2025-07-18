import React, { useContext } from 'react';
import ShopContext from '../../Context/ShopContext';
import WishlistContext from '../../Context/WishlistContext';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function Women() {
  const products = useContext(ShopContext);
  const { wish, setWish } = useContext(WishlistContext);
  const auth = JSON.parse(sessionStorage.getItem("user"));

  const toggleWishlist = (id) => {
    if (auth && auth.login === true) {
      // Just update local context; PATCH happens in Wishlist.jsx
      if (Array.isArray(wish) && wish.includes(id)) {
        setWish(prev => prev.filter(pid => pid !== id));
        toast.success("Removed from wishlist");
      } else {
        setWish(prev => [...(Array.isArray(prev) ? prev : []), id]);
        toast.success("Added to wishlist");
      }
    } else {
      toast.error("Please login");
    }
  };

  const womenProducts = products.filter(item => item.category === "women");

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <img src="/product/banner_women.png" alt="banner" />

      <h1 className="text-center p-10 text-xl font-bold mb-4">Women's Collection</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {womenProducts.map(product => (
          <div
            key={product.id}
            className="relative border p-4 rounded hover:shadow-lg transition"
          >
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-2 right-2 text-xl"
            >
              {Array.isArray(wish) && wish.includes(product.id) ? '❤️' : '🤍'}
            </button>

            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain"
              />
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

export default Women;
