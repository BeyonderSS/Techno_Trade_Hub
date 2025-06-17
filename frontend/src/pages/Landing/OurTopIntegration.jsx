import React from 'react';


import b1 from "../../assets/Home/b1.png";
import b2 from "../../assets/Home/b2.png";
import b2a from "../../assets/Home/b4a.png";
import b3 from "../../assets/Home/bb3.png";
import b4 from "../../assets/Home/b4.png";
import b5a from "../../assets/Home/b5.png";
import b5 from "../../assets/Home/b7.png";
import b6 from "../../assets/Home/b6.png";
const OurTopIntegration = () => {
  // Mock logo data - replace with your actual images
  const logos = [
    { name: b1 , color: 'from-blue-500 to-purple-600' },
    { name: b2, color: 'from-green-500 to-teal-600' },
    { name: b2a, color: 'from-red-500 to-pink-600' },
    { name:b3, color: 'from-yellow-500 to-orange-600' },
    { name: b4, color: 'from-indigo-500 to-blue-600' },
    { name: b5a, color: 'from-purple-500 to-pink-600' },
    { name: b5, color: 'from-teal-500 to-green-600' },
    { name: b6, color: 'from-orange-500 to-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            <span className="text-white/80 text-sm font-medium">Trusted by industry leaders</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-6 leading-tight">
            Our Top
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
              Integration
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Cloud mining is the easiest and most efficient way to earn cryptocurrency. 
            <span className="text-purple-300"> Trusted by millions worldwide.</span>
          </p>
        </div>

        {/* Floating logos grid */}
        <div className="relative">
          {/* Main grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${logo.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110`}></div>
                
                {/* Logo container */}
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-32 flex items-center justify-center transition-all duration-500 transform hover:scale-105 hover:rotate-3 hover:bg-white/20 cursor-pointer animate-fade-in-up">
                  {/* Mock logo - replace with your actual images */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${logo.color} flex items-center justify-center shadow-2xl`}>
                    <span className="text-white font-bold text-xl">
                      <img src={logo.name} alt="" />
                    </span>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
              </div>
            ))}
          </div>

          {/* Connecting lines animation */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full opacity-20">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2"/>
                </linearGradient>
              </defs>
              {[...Array(4)].map((_, i) => (
                <line
                  key={i}
                  x1={`${20 + i * 25}%`}
                  y1="20%"
                  x2={`${30 + i * 25}%`}
                  y2="80%"
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: '500K+', label: 'Active Users', icon: '👥' },
            { number: '99.9%', label: 'Uptime', icon: '⚡' },
            { number: '24/7', label: 'Support', icon: '💬' }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-white/60">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default OurTopIntegration;