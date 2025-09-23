// src/components/FeaturePanel.jsx - Compact version
import React from "react";

export default function FeaturePanel({ selectedNode, onClose }) {
  if (!selectedNode) return null;

  const features = {
    "cloudflare-proxy": {
      title: "Cloudflare Features",
      sections: [
        {
          title: "SSL/TLS Termination",
          icon: "🔒",
          features: [
            "TLS 1.2/1.3 at edge",
            "SSL certificate management",
            "Origin Certificate Support",
            "40% origin CPU reduction"
          ]
        },
        {
          title: "WAF Protection",
          icon: "🚫",
          features: [
            "OWASP Ruleset (179+ rules)",
            "Managed Rules (420+ rules)",
            "Custom rule capability",
            "Log-only safe deployment"
          ]
        },
        {
          title: "Performance & Security",
          icon: "⚡",
          features: [
            "DDoS protection",
            "Global CDN caching",
            "HTTP/2 & HTTP/3..etc"
          ]
        }
      ]
    }
  };

  const nodeFeatures = features[selectedNode.id];

  if (!nodeFeatures) return null;

  return (
    <div className="absolute top-2 right-2 w-64 bg-white rounded-lg shadow-xl border-2 border-blue-200 z-10">
      <div className="p-2 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-800">{nodeFeatures.title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-md"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto p-2">
        {nodeFeatures.sections.map((section, index) => (
          <div key={index} className="mb-2 last:mb-0">
            <div className="flex items-center mb-1">
              <span className="text-lg mr-1">{section.icon}</span>
              <h4 className="font-semibold text-gray-700 text-xs">{section.title}</h4>
            </div>
            <ul className="space-y-0.5">
              {section.features.map((feature, featIndex) => (
                <li key={featIndex} className="text-xs text-gray-600 flex items-start">
                  <span className="text-green-500 mr-1 text-xs">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-500">
          💡 <strong>Safe rollout:</strong> Start with log-only mode
        </div>
      </div>
    </div>
  );
}