// src/App.jsx
import React, { useState, useEffect } from "react";
import Diagram from "./components/DNSFlow3.jsx";

const STAGES = {
  before: {
    title: "Current State: Direct Connection",
    description: "Users connect directly to our AWS infrastructure without security filtering",
    businessImpact: "✓ Full control\n✗ No attack protection\n✗ Performance varies globally\n✗ SSL overhead on origin",
    risks: ["DDoS attacks directly hit servers", "No WAF protection", "Global latency issues", "SSL computational costs"],
    color: "blue"
  },
  dnsOnly: {
    title: "Transition Phase: DNS Migration",
    description: "Gradual DNS propagation - some traffic uses Cloudflare DNS, some uses cached Route53",
    businessImpact: "✓ Zero-downtime migration\n✓ Risk-free testing period\n✗ Mixed security state during transition",
    risks: ["Temporary inconsistent security coverage", "Need to maintain both configurations", "Monitoring complexity during cutover"],
    color: "green"
  },
  proxy: {
    title: "Target State: Full Proxy Protection",
    description: "All traffic flows through Cloudflare's global security and performance network",
    businessImpact: "✓ Enterprise-grade security\n✓ Global performance optimization\n✓ Reduced infrastructure costs\n✓ Enhanced user experience",
    benefits: ["DDoS protection saves $ in incident response", "WAF prevents data breaches", "Caching reduces AWS bandwidth costs by 60%+", "Faster loading improves conversion rates"],
     securityDetails: {
    sslTermination: "TLS/SSL handshake happens at Cloudflare edge, reducing origin server CPU load",
    wafRules: {
      owasp: "179+ OWASP Core Ruleset rules",
      managed: "420+ Cloudflare Managed Ruleset rules",
      initialAction: "Log-only mode for safe initial deployment"
                },
                twoConnections: "Separate encrypted connections: Client→Cloudflare and Cloudflare→Origin"
            },
    color: "orange"
  }
};

export default function App() {
  const [stage, setStage] = useState("before");
  const [isRevealed, setIsRevealed] = useState(false);
  const [curtainPosition, setCurtainPosition] = useState(0);

    // Auto-reveal after a delay, or on click
    useEffect(() => {
        const timer = setTimeout(() => {
        startReveal();
        }, 50000); // Auto-start after 5 mins

        return () => clearTimeout(timer);
    }, []);

    const startReveal = () => {
        setIsRevealed(true);
        // Animate curtain opening
        let position = 0;
        const interval = setInterval(() => {
        position += 5;
        setCurtainPosition(position);
        if (position >= 100) {
            clearInterval(interval);
        }
        }, 30);
    };

    // If not revealed yet, show the curtain
    if (!isRevealed) {
        return (
        <div 
            className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex flex-col items-center justify-center p-8 cursor-pointer"
            onClick={startReveal}
        >
            {/* Mystery curtain */}
            <div className="relative w-full max-w-4xl h-96 rounded-2xl overflow-hidden">
            {/* Hidden content behind curtain */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                <div className="text-center mb-8 max-w-4xl">
                    <div className="mb-4">
                        <img 
                        src="https://www.cloudflare.com/img/logo-cloudflare-dark.svg" 
                        alt="Cloudflare" 
                        className="h-12 mx-auto"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                        Cloudflare Onboarding: Security & Performance Transformation
                    </h1>
                </div>
            </div>
            
            {/* Curtain overlay */}
            <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center"
                style={{ 
                clipPath: `polygon(0% 0%, ${curtainPosition}% 0%, ${curtainPosition}% 100%, 0% 100%)`,
                transition: 'clip-path 0.1s linear'
                }}
            >
                <div className="text-center text-white">
                <div className="text-8xl mb-6 opacity-90">🔒</div>
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Enterprise Security Reveal
                </h1>
                <p className="text-xl text-blue-200 mb-6">Click anywhere or wait to discover the migration strategy</p>
                <div className="animate-pulse text-2xl">👇</div>
                </div>
            </div>
            </div>

            {/* Countdown or instruction */}
            <div className="mt-8 text-blue-200 text-lg">
            <div className="animate-bounce">Click to Reveal</div>
            </div>
        </div>
    </div>
        );
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-8">
      {/* Executive Header */}
      <div className="text-center mb-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Cloudflare Onboarding Process Transition
        </h1>
        <p className="text-xl text-gray-600 mb-6">
           Overview - Risk Reduction and Business Value
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Strategic Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl">🛡️</div>
              <div className="font-semibold">Risk Mitigation</div>
              <div className="text-gray-600">Prevent costly security incidents</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl">⚡</div>
              <div className="font-semibold">Performance</div>
              <div className="text-gray-600">Global acceleration</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-2xl">💰</div>
              <div className="font-semibold">Cost Optimization</div>
              <div className="text-gray-600">Reduce AWS bandwidth costs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Navigation */}
      <div className="flex space-x-4 mb-8">
        {Object.entries(STAGES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setStage(key)}
            className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 min-w-[200px] ${
              stage === key 
                ? key === 'before' ? 'bg-blue-600 text-white shadow-lg' 
                  : key === 'dnsOnly' ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            {config.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Current Stage Info */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 max-w-4xl w-full border-t-4 border-blue-400">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{STAGES[stage].title}</h2>
        <p className="text-gray-600 mb-4">{STAGES[stage].description}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Business Impact</h3>
            <div className="whitespace-pre-line text-sm bg-white p-3 rounded">
              {STAGES[stage].businessImpact}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">
              {stage === 'proxy' ? 'Key Benefits' : 'Key Risks'}
            </h3>
            <ul className="space-y-2">
              {(stage === 'proxy' ? STAGES[stage].benefits : STAGES[stage].risks)?.map((item, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className={`mr-2 mt-1 ${stage === 'proxy' ? 'text-green-500' : 'text-red-500'}`}>
                    {stage === 'proxy' ? '✓' : '⚠'}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Visual Diagram */}
      <div className="mb-8">
        <Diagram stage={stage} />
      </div>

      {/* Enhanced Legend - INSERT RIGHT HERE */}
            <div className="mt-6 flex justify-center space-x-8 flex-wrap">
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
                <span className="text-sm text-gray-700">Client → Cloudflare</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-6 h-1 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Cloudflare → Origin</span>
            </div>
            </div>

      {/* Executive Summary */}
      {/* Security Details Panel - Show only in Proxy state */}
            {stage === 'proxy' && (
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full mt-4 border-l-4 border-purple-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Security Architecture Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Two-Connection Architecture */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Dual Connection Architecture</h4>
                    <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span><strong>Connection 1:</strong> Client → Cloudflare (TLS 1.3)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span><strong>Connection 2:</strong> Cloudflare → Origin (Optimized)</span>
                    </div>
                    <p className="text-blue-700 mt-2"></p>
                    </div>
                </div>

                {/* WAF Rules Details */}
                <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Web Application Firewall (599+ Rules)</h4>
                    <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>OWASP Core Ruleset:</span>
                        <span className="font-semibold">179 rules</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cloudflare Managed Rules:</span>
                        <span className="font-semibold">420+ rules</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Initial Deployment Mode:</span>
                        <span className="font-semibold text-green-600">Log-Only (Safe)</span>
                    </div>
                    </div>
                </div>
                </div>

                {/* Initial Deployment Strategy */}
                <div className="mt-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 mb-2">Safe Deployment Strategy</h4>
                <div className="text-sm text-yellow-700">
                    <p><strong>Phase 1 (Week 1):</strong> All WAF rules set to "LOG" mode - monitor traffic without blocking</p>
                    <p><strong>Phase 2 (Week 2):</strong> Critical rules moved to "BLOCK" mode after validation</p>
                    {/* <p><strong>Phase 3 (Week 3):</strong> Full protection enabled with optimized rule configuration</p> */}
                </div>
                </div>
            </div>
            )}

      {/* Migration Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Project Timeline & Risk Mitigation</h3>
        <div className="flex justify-between items-center relative">
          <div className={`text-center z-10 ${stage === 'before' ? 'scale-110' : ''}`}>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">1</div>
            <div className="font-semibold">Current State</div>
            <div className="text-xs text-gray-500">Assessment</div>
          </div>
          <div className={`text-center z-10 ${stage === 'dnsOnly' ? 'scale-110' : ''}`}>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">2</div>
            <div className="font-semibold">DNS Migration</div>
            <div className="text-xs text-gray-500">Cutover</div>
          </div>
          <div className={`text-center z-10 ${stage === 'proxy' ? 'scale-110' : ''}`}>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">3</div>
            <div className="font-semibold">Proxy Enable</div>
            <div className="text-xs text-gray-500">Optimization</div>
          </div>
          <div className="absolute top-6 left-20 right-20 h-1 bg-gray-300 -z-0"></div>
        </div>
      </div>
    </div>
  );
}
