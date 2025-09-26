// src/components/HighlightTool.jsx
import React, { useState } from 'react';

const HighlightTool = () => {
  const [highlights, setHighlights] = useState([]);
  const [isHighlighting, setIsHighlighting] = useState(false);

  const addHighlight = (e) => {
    if (!isHighlighting) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setHighlights(prev => [...prev, {
      id: Date.now(),
      x: x - 20,
      y: y - 20,
      color: '#f59e0b' // yellow
    }]);
  };

  return (
    <>
      {/* Highlights overlay */}
      <div 
        className="fixed inset-0 z-40 pointer-events-none"
        onClick={addHighlight}
      >
        {highlights.map(highlight => (
          <div
            key={highlight.id}
            className="absolute w-10 h-10 rounded-full border-4 border-yellow-400 bg-yellow-200 bg-opacity-30 animate-pulse"
            style={{ left: highlight.x, top: highlight.y }}
          />
        ))}
      </div>

      {/* Simple toolbar */}
      <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg p-3">
        <button
          onClick={() => setIsHighlighting(!isHighlighting)}
          className={`px-4 py-2 rounded font-semibold ${
            isHighlighting 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isHighlighting ? '🟡 Highlighting...' : '💡 Highlight'}
        </button>
        
        <button
          onClick={() => setHighlights([])}
          className="ml-2 px-3 py-2 bg-gray-500 text-white rounded text-sm"
        >
          Clear
        </button>
        
        {isHighlighting && (
          <div className="text-xs text-gray-600 mt-1">Click anywhere to highlight</div>
        )}
      </div>
    </>
  );
};

export default HighlightTool;
