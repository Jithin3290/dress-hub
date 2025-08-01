import React, { useEffect, useState, useContext } from 'react';
import Hero from '../Components/Navbar/Hero/Hero';
import Popular from '../Components/Populars/Popular';
import Footer from '../Components/Footer/Footer';
import NewCollections from '../Components/NewCollection/NewCollections';
import RecentlyWatched from '../Components/RecentlyWatches/RecentlyWatched';

function Shop() {
  return (
    <div>
      <Hero />
      <hr />
      <br />
      <br />
      <Popular />
      <NewCollections />
      <RecentlyWatched />
      <Footer />
    </div>
  );
}

export default Shop;
