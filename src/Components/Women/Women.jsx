import React, { useContext, useState } from 'react';
import ShopContext from '../../Context/ShopContext';
import WishlistContext from '../../Context/WishlistContext';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../../Context/AuthContext';
import Footer from '../Footer/Footer';

function Women() {
  const products = useContext(ShopContext);
  const { wish, setWish } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const [priceFilter, setPriceFilter] = useState("all");

  const toggleWishlist = (id) => {
    if (user && user.login === true) {
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

  const filteredProducts = womenProducts.filter(product => {
    if (priceFilter === "below100") return product.new_price < 100;
    if (priceFilter === "above100") return product.new_price >= 100;
    return true;
  });

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header with dropdown filter */}
      <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
        <h1 className="text-xl font-bold mb-4 md:mb-0">Women's Collection</h1>
        <select
          className="border px-3 py-2 rounded"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="below100">Below $100</option>
          <option value="above100">Above $100</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {filteredProducts.map(product => (
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

      <div className='pt-10'>
        <Footer />
      </div>
    </div>
  );
}

export default Women;
