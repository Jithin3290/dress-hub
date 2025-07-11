import React from 'react'
import "./Offer.css"
function Offer() {
  return (
    <div className='offers'>
        <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCT</p>
        <button>Check Now</button>
        </div>
        <div className="offers-right">
        <img src="/product/exclusive_image.png" alt="image" />
        </div>
    </div>
    
  )
}

export default Offer