import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shopcategory from './Pages/Shopcategory';
import Shop from './Pages/shop';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Signup from './Pages/Signup';
import ShopContext from './Context/ShopContext';
import axios from 'axios';
import Men from './Components/Men/Men';
import Women from './Components/Women/Women';
import Kids from './Components/Kids/Kids';
import CartContext from './Context/CartContext';
import WishList from './Pages/WishList';

import Login from './Pages/Login';
import OrderContext from './Context/OrderContext';
import Order from './Components/Orders/Order';
import CartOrderContext from './Context/CartOrderContext';
import { WishlistProvider } from './Context/WishlistContext';

function App() {
  const [data, setData] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [order, setOrder] = useState([]);
  const [cartOrder, setCartOrder] = useState({});

  // 🟢 Fetch product list
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("http://localhost:3000/all_products");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  // 🟢 Load cart when user logs in
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user?.login) {
      if (user.cart) setCartItems(user.cart);
    }
  }, []);

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      <CartOrderContext.Provider value={{ cartOrder, setCartOrder }}>
        <WishlistProvider> {/* ✅ Use the provider which handles sync logic */}
          <CartContext.Provider value={{ cartItems, setCartItems }}>
            <ShopContext.Provider value={data}>
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path='/signup' element={<Signup />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/' element={<Shop />} />
                  <Route path='/mens' element={<Men />} />
                  <Route path='/womens' element={<Women />} />
                  <Route path='/kids' element={<Kids />} />
                  <Route path='/product/:id' element={<Product />} />
                  <Route path='/cart' element={<Cart />} />
                  <Route path='/order' element={<Order />} />
                  <Route path='/wish' element={<WishList />} />
                </Routes>
              </BrowserRouter>
            </ShopContext.Provider>
          </CartContext.Provider>
        </WishlistProvider>
      </CartOrderContext.Provider>
    </OrderContext.Provider>
  );
}

export default App;
