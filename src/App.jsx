import { useState } from 'react'
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Shopcategory from './Pages/Shopcategory'
import Shop from './Pages/shop'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import LoginSignup from './Pages/LoginSignup'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}></Route>
        <Route path='/mens' element={<Shopcategory category="men"/>}></Route>
        <Route path='/womens' element={<Shopcategory category="women"/>}></Route>
        <Route path='/kids' element={<Shopcategory category="kid"/>}></Route>
        <Route path='/product' element={<Product/>}>
        <Route path=":productId" element={<Product/>}></Route>
        </Route>
        <Route path= "/cart" element={<Cart/>}></Route>
        <Route path= "/login" element={<LoginSignup/>}></Route>

      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
