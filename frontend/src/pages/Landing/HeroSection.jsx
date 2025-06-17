
import React from "react";
import cryst1 from "../../assets/Home/presale.png";
import cryst2 from "../../assets/Home/crystal2.png";
// import cryst3 from "../../assets/home/crystal3.png";

const HeroSection = () => {
  return (
    <div className="w-full text-white">
      {/* Section container */}
      <div className="relative w-full h-[50vh] sm:h-[90vh] md:h-[100vh] rounded-3xl overflow-hidden">
        
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://ik.imagekit.io/Priy12345/9feaf9df4bc57c00d54c1e220f66eb830e5872a6.mp4?updatedAt=1747631933529"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Optional: Dark overlay for better text/image contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

        {/* Content area */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-8 space-y-6">
          
          {/* Top Image (Crystal 1) */}
          <img
            src={cryst1}
            alt="Crystal 1"
            className="w-[12rem] sm:w-[18rem] md:w-[25rem] lg:w-[30rem] transition-transform duration-500 hover:scale-105"
          />

          {/* Middle Image (Crystal 2) */}
          <img
            src={cryst2}
            alt="Crystal 2"
            className="w-[18rem] sm:w-[25rem] md:w-[35rem] lg:w-[50rem] mt-2 sm:mt-4 transition-transform duration-500 hover:scale-105"
          />

          {/* Text and Crystal 3 Row */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mt-6 sm:mt-10 gap-6">
            
            {/* Text content */}
            <div className="md:w-11/12 text-center md:text-left px-2 sm:px-4 text-base sm:text-lg md:text-xl lg:text-2xl">
              <p className="leading-relaxed tracking-wide">
                <strong>NEBULUX</strong> is the native cryptocurrency of the <strong>TECHNO TRADE HUB</strong> ecosystem—designed to power a new era of decentralized finance. Built on a secure and scalable blockchain infrastructure, NEBULUX integrates seamlessly with our platform's features, offering users real utility, speed, and low transaction costs.
              </p>
            </div>

            {/* Crystal 3 image */}
            {/* <div className="md:w-1/2 flex justify-center">
              <img
                src={cryst3}
                alt="Crystal 3"
                className="w-[12rem] sm:w-[18rem] md:w-[22rem] lg:w-[30rem] transition-transform duration-500 hover:scale-105"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
