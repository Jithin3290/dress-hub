import React, { useEffect } from 'react'
import Hero from '../Components/Navbar/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
import Footer from '../Components/Footer/Footer'
import NewCollections from '../Components/NewCollections/NewCollections'

function Shop() {
  return (
    <div >
        <Hero/>
        <br />
        <br />
       <hr />
       <br />
        <br />
        
        <Popular/>
       
        <NewCollections/>
        <NewsLetter/>
        <Footer/>

        
    </div>
  )
}

export default Shop