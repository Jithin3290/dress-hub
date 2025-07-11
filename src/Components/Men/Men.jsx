import React, { useContext } from 'react';
import ShopContext from '../../Context/ShopContext';
import { Link } from 'react-router-dom';
function Men() {
  const products = useContext(ShopContext); 

  if (!products || !Array.isArray(products)) {
    return <div className="text-center p-10 text-gray-500">Loading Men's Products...</div>;
  }

  const menProducts = products.filter(item => item.category === "men");

  return (
    <div>
        <img src="/product/banner_mens.png" alt="banner" />
      <h1 className="text-center p-10 text-xl font-bold mb-4">Men's Collection</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {menProducts.map(product => (
          <div key={product.id} className="border p-4 rounded hover:shadow-lg transition">
            <Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} className="w-full h-48 object-contain" /></Link>
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
