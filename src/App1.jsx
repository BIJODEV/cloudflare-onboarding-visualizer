// src/App.jsx
import React, { useState } from "react";
import Diagram from "./components/DNSFlow.jsx";

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
    color: "orange"
  }
};

export default function App() {
  const [stage, setStage] = useState("before");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-8">
      {/* Executive Header */}
      <div className="text-center mb-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Cloudflare Migration: Security & Performance Transformation
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Executive Overview - Risk Reduction and Business Value Creation
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

      {/* Executive Summary */}
      {/* {stage === 'proxy' && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-6 max-w-4xl w-full border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Executive Summary: Value Proposition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Security ROI</h4>
              <ul className="space-y-1">
                <li>• DDoS protection: Prevents $50K+ potential downtime costs</li>
                <li>• WAF: Reduces data breach risk by 80%</li>
                <li>• Bot management: Protects against credential stuffing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Performance ROI</h4>
              <ul className="space-y-1">
                <li>• Global caching: 60% reduction in origin bandwidth costs</li>
                <li>• Faster load times: 2-3x improvement for international users</li>
                <li>• Reduced latency: Improves conversion rates by 5-10%</li>
              </ul>
            </div>
          </div>
        </div>
      )} */}

      {/* Migration Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Project Timeline & Risk Mitigation</h3>
        <div className="flex justify-between items-center relative">
          <div className={`text-center z-10 ${stage === 'before' ? 'scale-110' : ''}`}>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">1</div>
            <div className="font-semibold">Current State</div>
            <div className="text-xs text-gray-500">Week 1: Assessment</div>
          </div>
          <div className={`text-center z-10 ${stage === 'dnsOnly' ? 'scale-110' : ''}`}>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">2</div>
            <div className="font-semibold">DNS Migration</div>
            <div className="text-xs text-gray-500">Week 2: Cutover</div>
          </div>
          <div className={`text-center z-10 ${stage === 'proxy' ? 'scale-110' : ''}`}>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">3</div>
            <div className="font-semibold">Proxy Enable</div>
            <div className="text-xs text-gray-500">Week 3: Optimization</div>
          </div>
          <div className="absolute top-6 left-20 right-20 h-1 bg-gray-300 -z-0"></div>
        </div>
      </div>
    </div>
  );
}