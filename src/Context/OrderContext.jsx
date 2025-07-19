import React, { createContext, useState, useEffect } from 'react';

const OrderContext = createContext({
  order: [],
  setOrder: () => {},
});

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user?.login && Array.isArray(user.order)) {
      setOrder(user.order);
    }
  }, []);

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
