import { createContext } from 'react';

const CartContext = createContext({
  cartItems: [], // [{ productId, quantity, date }]
  setCartItems: () => {},
});

export default CartContext;
