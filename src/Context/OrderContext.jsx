import { createContext } from 'react';

const OrderContext = createContext({
  order: [], // [{ productId, quantity, date }]
  setOrder: () => {},
});

export default OrderContext;
