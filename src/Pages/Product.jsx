import React, { useContext, useEffect, useState } from 'react';
import ShopContext from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import CartContext from '../Context/CartContext';
import toast, { Toaster } from 'react-hot-toast';

function Product() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const products = useContext(ShopContext);
  const { id } = useParams();


  const og = products.find(item => item.id == id);
  function handle() {
    setCartItems(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    toast.success("Added to cart successfully");
  }
  

  return (
    <div className="max-w-7xl mx-auto p-6">
          <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex md:flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <img
              key={i}
              src={og.image}
              alt={`Thumbnail ${i + 1}`}
              className="w-20 h-20 object-cover border rounded-md"
            />
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <img
            src={og.image}
            alt={og.name}
            className="w-full max-w-md h-auto object-contain border rounded-lg"
          />
        </div>


        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-semibold">{og.name}</h1>

          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(4)].map((_, i) => (
              <img key={i} src="/product/star_icon.png" alt="star" className="w-5 h-5" />
            ))}
            <img src="/product/star_dull_icon.png" alt="star" className="w-5 h-5" />
            <p className="text-gray-600 ml-2">122 reviews</p>
          </div>

          <div className="flex gap-4 text-lg font-bold">
            <p className="text-gray-500 line-through">${og.old_price}</p>
            <p className="text-green-600">${og.new_price}</p>
          </div>

          <p className="text-sm text-gray-700">{og.name}</p>

          <div>
            <h2 className="font-semibold mb-2">Select Size</h2>
            <div className="flex gap-3">
              {["S", "M", "L", "XL", "XXL"].map(size => (
                <div
                  key={size}
                  className="border px-4 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-4 p-2">
            <button  onClick={ handle} className=" bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
              ADD TO CART
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              BUY NOW
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Product;
