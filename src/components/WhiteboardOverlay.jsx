// src/components/WhiteboardOverlay.jsx
import React, { useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const WhiteboardOverlay = ({ isActive, onClose }) => {
  const canvasRef = useRef();

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-4 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Whiteboard Mode</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => canvasRef.current?.clearCanvas()}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Clear
            </button>
            <button
              onClick={() => canvasRef.current?.undo()}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Undo
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="border-2 border-gray-300 rounded-lg">
          <ReactSketchCanvas
            ref={canvasRef}
            width="100%"
            height="400px"
            strokeWidth={4}
            strokeColor="#ef4444" // red-500
            canvasColor="transparent"
          />
        </div>
        
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => canvasRef.current?.eraseMode(false)}
            className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded"
          >
            <div className="w-6 h-1 bg-red-500"></div>
            <span>Draw</span>
          </button>
          <button
            onClick={() => canvasRef.current?.eraseMode(true)}
            className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded"
          >
            <div className="w-6 h-1 bg-white border border-gray-400"></div>
            <span>Eraser</span>
          </button>
          <div className="flex items-center space-x-2">
            <span>Color:</span>
            <button onClick={() => canvasRef.current?.changeColor('#ef4444')} className="w-6 h-6 bg-red-500 rounded"></button>
            <button onClick={() => canvasRef.current?.changeColor('#3b82f6')} className="w-6 h-6 bg-blue-500 rounded"></button>
            <button onClick={() => canvasRef.current?.changeColor('#10b981')} className="w-6 h-6 bg-green-500 rounded"></button>
            <button onClick={() => canvasRef.current?.changeColor('#f59e0b')} className="w-6 h-6 bg-yellow-500 rounded"></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardOverlay;
