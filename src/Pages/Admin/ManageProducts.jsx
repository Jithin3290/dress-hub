// src/Pages/Admin/ManageProducts.jsx
import React, { useContext } from "react";
import ShopContext from "../../Context/ShopContext";

function ManageProducts() {
  const products = useContext(ShopContext);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <img
              src={item.image}
              alt={item.name}
              className="h-48 w-full object-contain mb-2"
            />
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-green-600 font-semibold">₹{item.new_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageProducts;
