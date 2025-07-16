import React, { useContext } from 'react';
import ShopContext from '../../Context/ShopContext';
import { Link } from 'react-router-dom';
import WishlistContext from '../../Context/WishlistContext';

function Kid() {
  const products = useContext(ShopContext); 
  const { wish, setWish } = useContext(WishlistContext);

  const toggleWishlist = (id) => {
    if (wish.includes(id)) {
      setWish(prev => prev.filter(pid => pid !== id));
    } else {
      setWish(prev => [...prev, id]);
    }
  };

  const kidsProducts = products.filter(item => item.category === "kid");

  return ( 
    <div>
      <img src="/product/banner_kids.png" alt="banner" />
      <h1 className="text-center p-10 text-xl font-bold mb-4">Kid's Collection</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kidsProducts.map(product => (
          <div key={product.id} className="relative border p-4 rounded hover:shadow-lg transition">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-2 right-2 text-xl"
            >
              {wish.includes(product.id) ? '❤️' : '🤍'}
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

export default Kid;
