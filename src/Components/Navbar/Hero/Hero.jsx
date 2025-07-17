import React from "react";

function Hero() {
  return (
    <div className="h-screen bg-gradient-to-b from-[#e4e1ff] to-[#e1ffea22] flex flex-col lg:flex-row items-center px-6 lg:px-0">
      <div className="flex-1 flex flex-col justify-center gap-5 lg:pl-[180px] text-center lg:text-left">
        <h2 className="text-black text-2xl lg:text-[26px] font-semibold">NEW ARRIVALS</h2>
        <div className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] text-[#271e1e] font-semibold leading-none">
          <div className="flex justify-center lg:justify-start items-center gap-5">
            <p>New</p>
            <img src="/product/hand_icon.png" alt="hand" className="w-[60px] sm:w-[80px] lg:w-[100px]" />
          </div>
          <p>Collections</p>
          <p>for everyone</p>
        </div>
        <div className="flex justify-center lg:justify-start items-center gap-[15px] h-[60px] sm:h-[70px] w-[220px] sm:w-[300px] rounded-[75px] mt-[30px] bg-red-600 text-white text-base sm:text-[20px] font-semibold cursor-pointer hover:bg-red-700 transition">
          <div className="relative left-10 pt-[6px]">Latest Collections</div>
          <img src="/product/arrow.png" alt="arrow" className="relative left-10 w-4 h-4 sm:w-5 sm:h-5 " />
        </div>
      </div>

      <div className="flex-1 flex justify-center mt-10 lg:mt-0">
        <img src="/product/heroog1.png" alt="hero" className=" w-[70%] max-w-[500px] object-contain" />
      </div>
    </div>
  );
}

export default Hero;
