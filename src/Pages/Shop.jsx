import React, { useEffect, useState, useContext } from 'react';
import Hero from '../Components/Navbar/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Footer from '../Components/Footer/Footer';
import NewCollections from '../Components/NewCollections/NewCollections';
import RecentlyWatched from '../Components/RecentlyWatched/RecentlyWatched';

function Shop() {
  return (
    <div>
      <Hero />
      <br />
      <br />
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
