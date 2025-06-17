import React from 'react';
import FeatureCard from './FeatureCard';


const featuresCardData = [
  {
    title: "Start build you",
    subTitle: "Career",
    pointOne:
      "As the world of cryptocurrencies continues to evolve, Bitcoin mining offers a unique opportunity to be part of the blockchain revolution while potentially reaping substantial",
    pointTwo:
      "Cloud mining is the easiest and most efficient way to earn money from cryptocurrency",
  },
  {
    title: "Best cloud mining ",
    subTitle: "service with",
    pointOne:
      "In the rapidly evolving landscape of cryptocurrency, cloud mining has emerged as an enticing solution for individuals seeking to participate in hardware setup and maintenance.",
    pointTwo:
      "Among the various options available, one service stands out as a leader in the realm of cloud mining.",
  },
  {
    title: "Receive daily your",
    subTitle: " mind bitcoins",
    pointOne:
      "Imagine waking up every day to a stream of Bitcoin rewards flowing directly into your digital wallet. With our advanced cloud mining service, you can turn this reality.",
    pointTwo:
      "We’re excited to introduce a seamless and secure way for you to daily Bitcoin mining rewards",
  },
];

const FeatureSection = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.08),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.05),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(148,163,184,0.03)_50%,transparent_100%)]"></div>
            
            {/* Floating Decorative Elements */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-32 left-20 w-1 h-1 bg-gradient-to-r from-blue-500 to-slate-400 rounded-full animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 right-10 w-2 h-2 bg-gradient-to-r from-slate-400 to-blue-400 rounded-full animate-pulse opacity-30" style={{animationDelay: '0.5s'}}></div>
            
            {/* Main Content Container */}
            <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24 lg:py-32">
                
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-20 lg:mb-24">
                    <div className="inline-block relative group">
                        {/* Header Background Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Header Content */}
                        <div className="relative space-y-4">
                            <div className="flex justify-center space-x-2 mb-6">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-slate-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-900 to-slate-700 leading-tight tracking-tight">
                                Features
                            </h2>
                            
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"></div>
                            
                            <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                                Discover the powerful capabilities that set us apart
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="relative">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-3xl backdrop-blur-sm"></div>
                    
                    {/* Cards Grid */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
                        {featuresCardData.map((card, index) => (
                            <div 
                                key={index}
                                className="transform hover:scale-105 transition-all duration-500 hover:z-20"
                                style={{
                                    animationDelay: `${index * 150}ms`,
                                    animation: 'fadeInUp 0.8s ease-out forwards'
                                }}
                            >
                                <FeatureCard
                                    title={card.title}
                                    subTitle={card.subTitle}
                                    pointOne={card.pointOne}
                                    pointTwo={card.pointTwo}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-20 md:mt-24 text-center">
                    {/* Stats or Additional Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                        <div className="group">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 group-hover:border-blue-300/50 transition-all duration-300">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">99.9%</div>
                                    <div className="text-sm text-slate-600 font-medium">Uptime</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 group-hover:border-cyan-300/50 transition-all duration-300">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">24/7</div>
                                    <div className="text-sm text-slate-600 font-medium">Support</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-slate-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 group-hover:border-blue-300/50 transition-all duration-300">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-600">100K+</div>
                                    <div className="text-sm text-slate-600 font-medium">Users</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Bottom Elements */}
                    <div className="flex justify-center space-x-6 opacity-40">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse mt-0.5" style={{animationDelay: '0.3s'}}></div>
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-slate-400 rounded-full animate-pulse -mt-0.5" style={{animationDelay: '0.6s'}}></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-slate-400 to-blue-400 rounded-full animate-pulse mt-0.5" style={{animationDelay: '0.9s'}}></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default FeatureSection;