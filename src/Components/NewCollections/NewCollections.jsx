import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NewCollections() {
  const [og, setOg] = useState([]);

  useEffect(() => {
    
    async function col() {
      try {
        const item = await fetch("http://localhost:3000/new_collections");
        const data = await item.json();
        setOg(data);
      } catch (e) {
        console.error("Error fetching new collections:", e);
      }
    }

    col();
  }, []);

  return (
    <div className="py-12 px-6 sm:px-10 lg:px-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-2">
        NEW COLLECTIONS
      </h1>
      <hr className="border-t-2 border-gray-300 w-24 mx-auto mb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {og.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-4 text-center"
          >
            <Link to={`/product/${item.id}`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            </Link>
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-red-600 font-bold text-base mt-1">
              ₹{item.new_price}
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{item.old_price}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewCollections;
