import React from 'react'
import Hero from '../Components/Navbar/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offer from '../Components/Offers/Offer'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
function Shop() {
  return (
    <div>
        <Hero/>
        <br />
        <br />
       <hr />
       <br />
        <br />
        
        <Popular/>
        <Offer/>
        <NewCollections/>
        <NewsLetter/>
    </div>
  )
}

export default Shop