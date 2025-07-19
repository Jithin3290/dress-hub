// src/Context/CartContext.js
import React, { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Use user from AuthContext
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/user/${user.id}`);
        setCartItems(res.data.cart || []);
      } catch (error) {
        console.error("Failed to load cart:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]); // Re-fetch cart when user changes (login/logout)

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
