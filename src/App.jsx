import React, { useEffect, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import Navbar from "./Components/Navbar/Navbar";
import Shop from "./Pages/Shop";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Signup from "./Pages/Signup";
import Men from "./Components/Mens/Men";
import Women from "./Components/Womens/Women";
import Kids from "./Components/Kid/Kids";
import WishList from "./Pages/WishList";
import Login from "./Pages/Login";
import Order from "./Components/Orders/Order";
import ScrollToTop from "./Scroll/Scrolltop";
import ProtectedRouter from "./Components/ProtectedRoutes/ProtectedRouter";
import EditProfile from "./Components/Navbar/EditProfiles/EditProfile";
import ProtectedAdminRoute from "./Components/ProtectedRoutes/ProtectedAdminRoute";
import Payment from "./Pages/Payment";
import Notfound from "./Pages/Notfound";
import AdminDashboard from './Pages/Admin/AdminDashboard';

// redux
import { store } from "./Redux/Store"; // adjust if your store file path differs
import { fetchProfile } from "./Redux/Slices/authSlice"; // adjust path if needed

// Lazy-loaded components
const About = lazy(() => import("./Components/Footer/About"));
const Careers = lazy(() => import("./Components/Footer/Careers"));
const Contact = lazy(() => import("./Components/Footer/Contact"));

// App-level bootstrap component that hydrates auth on start
function AppBootstrap({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    // If cookie-based auth is used, this will hit /user/profile/ with credentials and populate auth state
    dispatch(fetchProfile());
  }, [dispatch]);

  return children;
}

// Wrapper to access useLocation + admin redirect (uses redux auth now)
function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth?.user);

  // hide navbar on certain pages
  const hideNavbarPaths = ["/login", "/signup", "/admin"];
  const shouldHideNavbar = hideNavbarPaths.some((path) => location.pathname.startsWith(path));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <ScrollToTop />
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<ProtectedRouter><Careers /></ProtectedRouter>} />
          <Route path="/contact" element={<ProtectedRouter><Contact /></ProtectedRouter>} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/mens" element={<Men />} />
          <Route path="/womens" element={<Women />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<ProtectedRouter><Cart /></ProtectedRouter>} />
          <Route path="/order" element={<ProtectedRouter><Order /></ProtectedRouter>} />
          <Route path="/wish" element={<ProtectedRouter><WishList /></ProtectedRouter>} />
          <Route path="/payment" element={<ProtectedRouter><Payment /></ProtectedRouter>} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="*" element={<Notfound />} />
          <Route path='/admin' element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />

        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppBootstrap>
        <BrowserRouter>
          <AppWrapper />
        </BrowserRouter>
      </AppBootstrap>
    </Provider>
  );
}

export default App;
