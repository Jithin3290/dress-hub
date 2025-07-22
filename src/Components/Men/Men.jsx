import React, { useContext, useState } from 'react';
import ShopContext from '../../Context/ShopContext';
import WishlistContext from '../../Context/WishlistContext';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../../Context/AuthContext';
import Footer from '../Footer/Footer';

function Men() {
  const products = useContext(ShopContext);
  const { wish, setWish } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const [priceFilter, setPriceFilter] = useState("all");

  const toggleWishlist = (id) => {
    if (user && user.login === true) {
      let updatedWishlist;

      if (Array.isArray(wish) && wish.includes(id)) {
        updatedWishlist = wish.filter(pid => pid !== id);
        toast("Removed from Wishlist");
      } else {
        updatedWishlist = Array.isArray(wish) ? [...wish, id] : [id];
        toast.success("Added to Wishlist");
      }

      setWish(updatedWishlist);
    } else {
      toast.error("Please login");
    }
  };

  const menProducts = products.filter(item => item.category === "men");

  const filteredProducts = menProducts.filter(product => {
    if (priceFilter === "below100") return product.new_price < 100;
    if (priceFilter === "above100") return product.new_price >= 100;
    return true;
  });

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
          <h1 className="text-xl font-bold mb-4 md:mb-0">Men's Collection</h1>

          {/* Filter Section (right side on desktop, stacked on mobile) */}
          <div className="flex flex-col md:flex-row items-center gap-2">

            <select
              className="border px-2 py-1 rounded"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="below100">Below $100</option>
              <option value="above100">Above $100</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {filteredProducts.map(product => (
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

      <div className="pt-10">
        <Footer />
      </div>
    </>
  );
}

export default Men;
