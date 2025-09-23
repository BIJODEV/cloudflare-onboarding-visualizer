// src/components/CustomNode.jsx
import React from "react";
import { Handle, Position } from "reactflow";

export default function CustomNode({ data, selected }) {
  return (
    <div className={`px-4 py-3 shadow-lg rounded-xl bg-white border-2 text-center min-w-[160px] max-w-[180px] transition-all duration-200 ${
      selected 
        ? 'border-blue-500 shadow-lg scale-105' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-blue-500"
      />
      
      <div className="text-xl mb-1">{data.emoji}</div>
      <div className="font-semibold text-gray-800 text-sm leading-tight">{data.title}</div>
      
      {data.subtitle && (
        <div className="text-xs text-gray-600 mt-1 leading-tight">{data.subtitle}</div>
      )}

      {/* Show expand indicator if node has features */}
      {data.hasFeatures && (
        <div className="text-xs text-blue-500 mt-1 font-medium">
          Click for details →
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-green-500"
      />
    </div>
  );
}