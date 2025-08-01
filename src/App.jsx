import { useState, useEffect, lazy, Suspense, useContext } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Signup from './Pages/Signup';
import { ShopProvider } from './Context/ShopContext';
import Men from './Components/Mens/Men';
import Women from './Components/Womens/Women';
import Kids from './Components/Kid/Kids';
import { CartProvider } from './Context/CartContext';
import WishList from './Pages/WishList';
import Login from './Pages/Login';
import { OrderProvider } from './Context/OrderContext';
import Order from './Components/Orders/Order';
import { WishlistProvider } from './Context/WishlistContext';
import { RecentlyWatchedProvider } from './Context/RecentlyWatchedContext';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import { AuthProvider } from './Context/AuthContext';
import ScrollToTop from './Scroll/Scrolltop';
import ProtectedRouter from './Components/ProtectedRoutes/ProtectedRouter';
import EditProfile from './Components/Navbar/EditProfiles/EditProfile';
import ProtectedAdminRoute from './Components/ProtectedRoutes/ProtectedAdminRoute';
import AuthContext from './Context/AuthContext';
import Payment from './Pages/Payment';
import Notfound from './Pages/Notfound';

// Lazy-loaded components
const About = lazy(() => import('./Components/Footer/About'));
const Careers = lazy(() => import('./Components/Footer/Careers'));
const Contact = lazy(() => import('./Components/Footer/Contact'));

// Wrapper to access useLocation + Admin Redirect
function AppWrapper() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // ⛳ Redirect admin user to /admin when at /
 

  const hideNavbarPaths = ['/login', '/signup', '/admin'];
  const shouldHideNavbar = hideNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <ScrollToTop />
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Shop />} />
          <Route path='/about' element={<About />} />
          <Route path='/careers' element={<ProtectedRouter><Careers /></ProtectedRouter>} />
          <Route path='/contact' element={<ProtectedRouter><Contact /></ProtectedRouter>} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path='/mens' element={<Men />} />
          <Route path='/womens' element={<Women />} />
          <Route path='/kids' element={<Kids />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/cart' element={<ProtectedRouter><Cart /></ProtectedRouter>} />
          <Route path='/order' element={<ProtectedRouter><Order /></ProtectedRouter>} />
          <Route path='/wish' element={<ProtectedRouter><WishList /></ProtectedRouter>} />
          <Route path='/payment' element={<ProtectedRouter><Payment /></ProtectedRouter>} />
          <Route path='*' element={<Notfound/>}></Route>

          <Route path='/admin' element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <RecentlyWatchedProvider>
    <AuthProvider>
      <OrderProvider>
        <WishlistProvider>
          <CartProvider>
            <ShopProvider>
              <BrowserRouter>
                <AppWrapper />
              </BrowserRouter>
            </ShopProvider>
          </CartProvider>
        </WishlistProvider>
      </OrderProvider>
    </AuthProvider>
    </RecentlyWatchedProvider>
  );
}

export default App;
