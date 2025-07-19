import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/shop';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Signup from './Pages/Signup';
import { ShopProvider } from './Context/ShopContext';
import Men from './Components/Men/Men';
import Women from './Components/Women/Women';
import Kids from './Components/Kids/Kids';
import CartContext, { CartProvider } from './Context/CartContext';
import WishList from './Pages/WishList';
import Login from './Pages/Login';
import OrderContext, { OrderProvider } from './Context/OrderContext';
import Order from './Components/Orders/Order';
import { WishlistProvider } from './Context/WishlistContext';
import ProtectedRouter from './Components/ProtectedRoute/ProtectedRouter';
import ProtectedLogin from './Components/ProtectedRoute/ProrectedLogin';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ProtectedAdminRoute from './Components/ProtectedRoute/ProtectedAdminRoute';
import { AuthProvider } from './Context/AuthContext';

function App() {

  return (
    <AuthProvider>
    <OrderProvider>
      <WishlistProvider>
        <CartProvider>
          <ShopProvider>
            <BrowserRouter>
              {!JSON.parse(sessionStorage.getItem("user"))?.isAdmin && <Navbar />}
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
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </BrowserRouter>
          </ShopProvider>
        </CartProvider>
      </WishlistProvider>
    </OrderProvider>
    </AuthProvider>
  );
}

export default App;
