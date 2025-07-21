import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Popular() {
  const [og, setOg] = useState([]);

  useEffect(() => {
    async function Col() {
      try {
        const response = await fetch('http://localhost:3000/data');
        const data = await response.json();
        setOg(data);
        console.log(data);
      } catch (e) {
        console.log('Error fetching data:', e);
      }
    }

    Col();
  }, []);

  return (
    <div className="py-12 px-6 sm:px-10 lg:px-20">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
        POPULAR IN WOMEN
      </h1>

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

export default Popular;
