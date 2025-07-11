import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shopcategory from './Pages/Shopcategory';
import Shop from './Pages/shop';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import ShopContext from './Context/ShopContext';
import axios from 'axios';
import Men from './Components/Men/Men';
import Women from './Components/Women/Women';
import Kids from './Components/Kids/Kids';
function App() {
  const [data, setData] = useState([]); 

  useEffect(() => {
    async function Collection() {
      try {
        const res = await axios.get("http://localhost:3000/all_products");
        setData(res.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    Collection();
  }, []);

  return (
    <ShopContext.Provider value={data}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/mens' element={<Men />} />
          <Route path='/womens' element={<Women />} />
          <Route path='/kids' element={<Kids/>} />
          <Route path='product/:id' element={<Product />} >
          </Route>
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ShopContext.Provider>
  );
}

export default App;
