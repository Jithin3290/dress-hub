import React, { useContext } from 'react';
import WishlistContext from '../Context/WishlistContext';
import ShopContext from '../Context/ShopContext';

function WishList() {
  const { wish } = useContext(WishlistContext);
  const products = useContext(ShopContext);

  const wishedProducts = products.filter(item => wish.includes(item.id));

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Wishlist</h1>
      
      {wishedProducts.length === 0 ? (
        <p className="text-center text-gray-600">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishedProducts.map(item => (
            <div key={item.id} className="border p-4 rounded text-center hover:shadow-md">
              <img src={item.image} alt={item.name} className="w-full h-48 object-contain mb-2" />
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-green-600">${item.new_price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishList;
