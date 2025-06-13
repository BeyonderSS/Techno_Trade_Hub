// src/pages/User/Aibot/AiTradeBot.jsx
import React from 'react';

const AiTradeBot = () => {
  return (
    <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100">
      <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-white">AI Trade Bot</h2>
        <p className="text-gray-300 mb-4">
          Welcome to your AI Trade Bot control panel. Here you can manage your automated trading activities.
        </p>
        {/* Add more content here for your AI Trade Bot */}
        <div className="mt-6 p-4 bg-gray-700 rounded-md border border-gray-600">
          <p className="text-lg font-semibold text-white">Bot Status: <span className="text-green-400">Active</span></p>
          <p className="text-sm text-gray-400">Last run: 2025-06-12 10:30 AM</p>
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out">
            Configure Bot
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiTradeBot;