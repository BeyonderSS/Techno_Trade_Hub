
import React from "react";
import { ArrowRight } from "lucide-react";
import EarnCard from "./EarnCard";

const earnCardData = [
  { img: img1, title: "Gamming PC", price: "$99/ $79.00" },
  { img: img2, title: "Mining RIG", price: "$299/ $189.00" },
  { img: img3, title: "Mining Farm", price: "$299/ $199.00" },
];

const HowEarn = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          {/* Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              <div>
                <p className="text-cyan-600 font-medium uppercase tracking-wider text-sm">
                  Start Earning Today
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  How to{" "}
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    Earn?
                  </span>
                </h1>
              </div>
            </div>
          </div>
          
          {/* Subtitle */}
          <div className="lg:max-w-md">
            <div className="flex items-start gap-3 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white shadow-lg">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <p className="text-gray-700 font-semibold text-lg leading-relaxed">
                  It comes down to your PC's{" "}
                  <span className="text-cyan-600">Processing power</span> and{" "}
                  <span className="text-blue-600">luck</span>
                </p>
                <div className="flex items-center gap-2 mt-2 text-cyan-600">
                  <ArrowRight size={16} />
                  <span className="text-sm font-medium">Get started now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {earnCardData.map((card, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            >
              <EarnCard
                img={card.img}
                title={card.title}
                price={card.price}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <span>Start Earning Today</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowEarn;
