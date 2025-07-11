import React, { useState } from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'
function Navbar() {
    const [menu,setMenu] = useState("shop")
  return (
    <nav className='navbar' >
        <div className="nav-logo">
        <img src="/product/logo.png" alt="logo image" />

            <p>DressHub</p>
        </div>
        <ul className="nav-menu">
            <li onClick={()=>setMenu("shop")}><Link to = "/" style={{textDecoration: "none"}}>Shop</Link> {menu === "shop"?<hr/>:<></>}</li>
            <li onClick={()=>setMenu("mens")}><Link to = "/mens" style={{textDecoration: "none"}}>Men</Link> {menu === "mens"?<hr/>:<></>}</li>
            <li onClick={()=>setMenu("womens")}><Link to = "/womens" style={{textDecoration: "none"}}>Women</Link> {menu === "womens"?<hr/>:<></>}</li>
            <li onClick={()=>setMenu("kids")}> <Link to = "/kids" style={{textDecoration: "none"}}>Kids</Link> {menu === "kids"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-cart">
            <Link to="/login" style={{textDecoration: "none"}}><button>LogIn</button></Link>
            <Link to="/cart" style={{textDecoration: "none"}}><img src="/product/cart_icon.png" alt="cart_icon" /></Link>
            <div className="nav-cart-count">5</div>
        </div>
    </nav>
  )
}

export default Navbar