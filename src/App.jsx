import { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Signup from './Pages/Signup';
import { ShopProvider } from './Context/ShopContext';
import Men from './Components/Men/Men';
import Women from './Components/Women/Women';
import Kids from './Components/Kids/Kids';
import { CartProvider } from './Context/CartContext';
import WishList from './Pages/WishList';
import Login from './Pages/Login';
import { OrderProvider } from './Context/OrderContext';
import Order from './Components/Orders/Order';
import { WishlistProvider } from './Context/WishlistContext';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import { AuthProvider } from './Context/AuthContext';
import ScrollToTop from './Scrolltop/Scrolltop';
import EditProfile from './Components/Navbar/EditProfile/EditProfile';

// Lazy-loaded components
const About = lazy(() => import('./Components/Footer/About'));
const Careers = lazy(() => import('./Components/Footer/Careers'));
const Contact = lazy(() => import('./Components/Footer/Contact'));

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <WishlistProvider>
          <CartProvider>
            <ShopProvider>
              <BrowserRouter>
                <ScrollToTop /> 

                {!JSON.parse(sessionStorage.getItem("user"))?.isAdmin && <Navbar />}

                <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                  <Routes>
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/' element={<Shop />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/careers' element={<Careers />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path="/edit" element={<EditProfile />} />

                    <Route path='/mens' element={<Men />} />
                    <Route path='/womens' element={<Women />} />
                    <Route path='/kids' element={<Kids />} />
                    <Route path='/product/:id' element={<Product />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/order' element={<Order />} />
                    <Route path='/wish' element={<WishList />} />
                    <Route path='/admin' element={<AdminDashboard />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </ShopProvider>
          </CartProvider>
        </WishlistProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
