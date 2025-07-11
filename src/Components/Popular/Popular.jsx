


import React, { useEffect, useState } from 'react';
import './Popular.css';

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
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <div className="popular-item">
        {og.map((item) => (
          <div key={item.id} className="popular-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>
              ₹{item.new_price}{' '}
              <span style={{ textDecoration: 'line-through', color: 'gray' }}>
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
