import React, { createContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wish, setWish] = useState([]);
  const [userId, setUserId] = useState(null);
  const isFirstLoad = useRef(true); // Prevents first render from syncing

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser?.login) {
      setUserId(storedUser.id);
      setWish(storedUser.wish || []);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      isFirstLoad.current = false;
    }
  }, [userId]);

  useEffect(() => {
    if (!userId || isFirstLoad.current) return;

    const syncWishlist = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/user/${userId}`);
        const serverWish = res.data.wish || [];

        const isDifferent = JSON.stringify(serverWish) !== JSON.stringify(wish);
        if (isDifferent) {
          await axios.patch(`http://localhost:3000/user/${userId}`, { wish });

          // Update sessionStorage
          const user = JSON.parse(sessionStorage.getItem('user'));
          const updatedUser = { ...user, wish };
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.error('Failed to update wishlist:', err);
      }
    };

    syncWishlist();
  }, [wish, userId]);

  return (
    <WishlistContext.Provider value={{ wish, setWish }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
