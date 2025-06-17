import React from "react";
import bgimg from "../../assets/Home/bgbitcoins.png";
import { HiHandThumbUp } from "react-icons/hi2";
// import { Link } from "react-router-dom";

import hand from "../../assets/Home/hand1.png";
import thumb from "../../assets/Home/thumps2.png";
import reward from "../../assets/Home/reward.png";
import dollar from "../../assets/Home/dollar.png";

const technoTradeCardData = [
  {
    img: hand,
    title: "Instant Wallet Credit",
    desc: "Join today and get $10 instantly in your wallet.",
  },
  {
    img: thumb,
    title: "AI-Powered Trading",
    desc: "Advanced AI engine for smarter, efficient trading decisions.",
  },
  {
    img: reward,
    title: "Scalable Daily ROI",
    desc: "Earn passive income with scalable daily return plans.",
  },
  {
    img: dollar,
    title: "Team & Referral Bonuses",
    desc: "Grow your network and earn rewards from your team's success.",
  },
  {
    img: dollar,
    title: "Transparent & Reliable",
    desc: "Seamless withdrawals and active customer support.",
  },
];

const Whyprestorix = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="w-full mt-5 h-full mb-5 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-no-repeat transition-transform duration-[300ms] ease-in-out hover:translate-x-4"
          style={{
            backgroundImage: `url(${bgimg})`,
            transform: "translateX(0)",
            animation: "slideRight 8s ease-in-out infinite alternate",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center px-4">
          <div className="bg-black/70 p-6 md:p-12 lg:p-20 rounded-xl text-white max-w-6xl w-full backdrop-blur-sm">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center lg:text-left">
              Smart Crypto Investment with AI
            </h1>

            <h2 className="mt-6 text-lg sm:text-xl md:text-2xl lg:text-3xl bg-sky-400 px-4 py-3 rounded-xl text-center font-semibold shadow-lg">
              Start your journey with just $100 – Let AI work for your income!
            </h2>

            <p className="mt-6 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-center lg:text-left">
              Join <strong>Techno Trade Hub</strong> — an AI-powered platform for intelligent crypto trading and daily returns. Designed for beginners and pros alike, we make passive income easier, scalable, and transparent.
            </p>

            <ul className="mt-10 space-y-6 text-base sm:text-lg md:text-xl lg:text-2xl">
              {[
                "Real-Time Dashboard : Monitor your performance 24/7",
                "AI-Powered Engine : Make smart moves with zero effort",
                "Fully Managed Trading : No hardware, no hassle – we handle it all",
                "Guaranteed Uptime : 99.9% server availability",
                "Estimated Monthly Returns : 30%–35%",
                "Minimum Investment : $100",
                "Plan Duration : 6 months",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <HiHandThumbUp className="text-sky-400 mt-1 text-2xl" />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.replace(
                        /: (.*)/,
                        ': <span class="text-sky-300 font-semibold">$1</span>'
                      ),
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Why Techno Trade Hub Section */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12">
            Why Choose Techno Trade Hub?
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {technoTradeCardData.map((card, id) => (
              <div
                key={id}
                className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="h-12 w-12 object-contain mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-sm sm:text-base text-sky-200">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes slideRight {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(20px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Whyprestorix;
