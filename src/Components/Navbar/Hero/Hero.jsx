import React from "react";
import "./Hero.css";
function Hero() {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>NEW ARRIVALS</h2>
        <div>
          <div className="hand-icon">
            <p>New</p>
            <img src="/product/hand_icon.png" alt="hand image" />
          </div>
          <p>Collections</p>
          <p>for everyone</p>
        </div>
        <div className="hero-latest-button">
          <div style={{paddingTop:"23px"}}>latest Collections</div>
          <img src="/product/arrow.png" alt="arrow image" />
        </div>
      </div>
      <div className="hero-right">
        <img src="/product/hero_image.png" alt="image" />
      </div>
    </div>
  );
}

export default Hero;
