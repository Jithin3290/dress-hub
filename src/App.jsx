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
import WishlistContext from './Context/WishlistContext';
import Login from './Pages/Login';
import OrderContext from './Context/OrderContext';
import Order from './Components/Orders/Order';

function App() {
  const [data, setData] = useState([]); 
  const [cartItems, setCartItems] = useState({});
  const [wish, setWish] = useState([]);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    // 🛒 Load product collection
    async function Collection() {
      try {
        const res = await axios.get("http://localhost:3000/all_products");
        setData(res.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    Collection();

    // 🔄 Load cartItems from sessionStorage (if user is logged in)
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.login === true && user.cart) {
      setCartItems(user.cart);
    }
  }, []);

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      <WishlistContext.Provider value={{ wish, setWish }}>
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
                <Route path='product/:id' element={<Product />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/order' element={<Order />} />
                <Route path='/wish' element={<WishList />} />
              </Routes>
           
            </BrowserRouter>
          </ShopContext.Provider>
        </CartContext.Provider>
      </WishlistContext.Provider>
    </OrderContext.Provider>
  );
}

export default App;
