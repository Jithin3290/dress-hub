// src/Context/WishlistContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wish, setWish] = useState([]);
  const {user}=useContext(AuthContext)

  // Load wishlist on login
  useEffect(() => {
    const fetchWish = async () => {
      if (user?.login) {
        try {
          const res = await axios.get(`http://localhost:3000/user/${user.id}`);
          setWish(res.data.wish || []);
        } catch (err) {
          console.error("Failed to fetch wishlist:", err);
        }
      } else {
        setWish([]); // clear on logout
      }
    };
    fetchWish();
  }, [user]);

  // Sync wish to JSON server whenever it changes
  useEffect(() => {
    if (user?.login) {
      axios.patch(`http://localhost:3000/user/${user.id}`, { wish })
        .catch((err) => console.error("Failed to update wishlist:", err));
    }
  }, [wish]);

  return (
    <WishlistContext.Provider value={{ wish, setWish }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
