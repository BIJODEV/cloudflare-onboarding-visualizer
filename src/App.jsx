// src/App.jsx
import React, { useState } from "react";
import Diagram from "./components/DNSFlow.jsx";

const STAGES = {
  before: {
    title: "Current State (Route53)",
    description: "Direct DNS resolution through AWS Route53"
  },
  dnsOnly: {
    title: "DNS-Only Mode (Propagation)",
    description: "Mixed state during NS record update - some users use cached Route53, others use Cloudflare DNS"
  },
  proxy: {
    title: "Proxy Mode Enabled",
    description: "All traffic flows through Cloudflare's security and performance stack"
  }
};

export default function App() {
  const [stage, setStage] = useState("before");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          DNS & Cloudflare Migration Flow
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Visualizing the transition from Route53 to Cloudflare with proxy mode
        </p>
      </div>
      
      {/* Stage Indicator */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {STAGES[stage].title}
        </h2>
        <p className="text-gray-600 max-w-2xl">
          {STAGES[stage].description}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-8">
        {Object.entries(STAGES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setStage(key)}
            className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
              stage === key 
                ? key === 'before' ? 'bg-blue-600 text-white shadow-lg' 
                  : key === 'dnsOnly' ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
            }`}
          >
            {config.title.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Diagram Container */}
      <div className="relative">
        <Diagram stage={stage} />
        
        {/* Legend */}
        <div className="mt-6 flex justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">DNS Query</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Direct Connection</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Proxy Connection</span>
          </div>
        </div>
      </div>

      {/* Features Highlight */}
      {stage === 'proxy' && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-2 border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Proxy Mode Features Enabled:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>SSL/TLS Termination</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Web Application Firewall (WAF)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>DDoS Protection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Global Caching</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}