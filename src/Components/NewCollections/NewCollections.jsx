import React, { useEffect, useState } from "react";
import "./NewCollections.css";
function NewCollections() {
  const [og, setOg] = useState([]);
  useEffect(() => {
    try {
      async function col() {
        const item = await fetch("http://localhost:3000/new_collections");
        const data = await item.json();
        setOg(data);
      }
      col();
    } catch (e) {
      console.log(e);
    }
    
  }, []);
  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
      {og.map((item) => (
          <div key={item.id} className="collection-arra" >
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

export default NewCollections;
