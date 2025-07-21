import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/all_products");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <ShopContext.Provider value={data}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;
