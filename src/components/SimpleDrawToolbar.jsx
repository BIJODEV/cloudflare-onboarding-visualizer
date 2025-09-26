// src/components/SimpleDrawToolbar.jsx
import React, { useState, useRef } from 'react';

const SimpleDrawToolbar = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('draw'); // 'draw' or 'text'
  const [drawings, setDrawings] = useState([]);
  const [texts, setTexts] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [isAddingText, setIsAddingText] = useState(false);
  // textPosition contains both svg coords and client coords for placing the input
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const [color, setColor] = useState('#ef4444');
  const [fontSize, setFontSize] = useState(16);

  const svgRef = useRef(null);
  const textInputRef = useRef(null);

  // ---------- Drawing handlers (using SVG mouse events) ----------
  const svgPointFromEvent = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: e.clientX, y: e.clientY };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const transformed = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: transformed.x, y: transformed.y };
  };

    const handleSvgMouseDown = (e) => {
    if (!isDrawing) return;

    if (mode === "draw") {
        const p = svgPointFromEvent(e);
        setCurrentPath([{ x: p.x, y: p.y }]);
    } else if (mode === "text") {
        // ✅ finalize any existing text before starting new one
        if (isAddingText && currentText.trim()) {
        finalizeText();
        }

        const p = svgPointFromEvent(e);
        setTextPosition({
        x: p.x,
        y: p.y,
        clientX: e.clientX,
        clientY: e.clientY
        });

        setIsAddingText(true);
        setCurrentText("");
        setTimeout(() => textInputRef.current?.focus(), 0);
    }
    };


  const handleSvgMouseMove = (e) => {
    if (!isDrawing) return;
    if (mode !== 'draw') return;
    if (currentPath.length === 0) return;

    const p = svgPointFromEvent(e);
    setCurrentPath(prev => [...prev, { x: p.x, y: p.y }]);
  };

  const handleSvgMouseUp = () => {
    if (mode === 'draw' && currentPath.length > 1) {
      setDrawings(prev => [...prev, { id: Date.now() + Math.random(), path: currentPath, color, type: 'drawing' }]);
    }
    setCurrentPath([]);
  };

  // ---------- Text handling ----------
    const finalizeText = () => {
    if (currentText.trim()) {
        const newText = {
        id: Date.now() + Math.random(),
        x: textPosition.x,
        y: textPosition.y,
        text: currentText,
        color,
        fontSize,
        type: "text"
        };
        // ✅ append, never replace
        setTexts((prev) => [...prev, newText]);
    }
    setCurrentText("");
    setIsAddingText(false);
    };

  const cancelText = () => {
    setCurrentText('');
    setIsAddingText(false);
  };
  
  // Helper: wrap text into multiple lines after N words
    const wrapText = (text, wordsPerLine = 5) => {
    const words = text.split(" ");
    const lines = [];

    for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, i + wordsPerLine).join(" "));
    }

    return lines;
    };

  const clearAll = () => {
    setDrawings([]);
    setTexts([]);
    setCurrentPath([]);
    setIsAddingText(false);
  };

  // handle Enter/Escape on the input itself
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finalizeText();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelText();
    }
  };

  // ---------- Render ----------
  return (
    <>
      {/* Drawing Canvas Overlay */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{ pointerEvents: isDrawing ? 'auto' : 'none', touchAction: 'none' }}
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
        >
          {/* Existing drawings */}
          {drawings.map((drawing) => (
            <path
              key={drawing.id}
              d={drawing.path.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
              stroke={drawing.color}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          ))}

          {/* Current drawing */}
          {currentPath.length > 0 && mode === 'draw' && (
            <path
              d={currentPath.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
              stroke={color}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Existing texts */}
          {texts.map((text, index) => {
            const lines = wrapText(text.text, 5); // ⬅️ 5 words per line
            return (
                <text
                key={`text-${index}`}
                x={text.x}
                y={text.y}
                fill={text.color}
                fontSize={text.fontSize}
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
                style={{ pointerEvents: "none" }}
                >
                {lines.map((line, i) => (
                    <tspan key={i} x={text.x} dy={i === 0 ? 0 : text.fontSize * 1.2}>
                    {line}
                    </tspan>
                ))}
                </text>
            );
            })}
        </svg>

        {/* Text input overlay - positioned by clientX/clientY so it maps to screen */}
        {isAddingText && (
          <div
            className="fixed z-50 bg-white border-2 border-blue-500 rounded shadow-lg p-2"
            style={{
              left: textPosition.clientX,
              top: textPosition.clientY,
              transform: 'translate(8px, 8px)'
            }}
          >
            <input
              ref={textInputRef}
              type="text"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Type your text..."
              onKeyDown={handleInputKeyDown}
              className="outline-none border-none bg-transparent"
              style={{
                color: color,
                fontSize: `${fontSize}px`,
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            />
            <div className="text-xs text-gray-500 mt-1">
              Press Enter to save, Esc to cancel
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-xl border border-gray-300 p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button
            onClick={() => {
              setIsDrawing(true);
              setMode('draw');
              setIsAddingText(false);
            }}
            className={`px-4 py-2 rounded font-semibold ${isDrawing && mode === 'draw' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            🖊️ Draw
          </button>

          <button
            onClick={() => {
              setIsDrawing(true);
              setMode('text');
              setIsAddingText(false);
            }}
            className={`px-4 py-2 rounded font-semibold ${isDrawing && mode === 'text' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            📝 Add Text
          </button>

          <button
            onClick={() => setIsDrawing(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded font-semibold"
          >
            ✋ Stop
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* color swatches */}
          <div className="flex space-x-2">
            {[
              { color: '#ef4444' },
              { color: '#3b82f6' },
              { color: '#10b981' },
              { color: '#f59e0b' },
              { color: '#000000' },
              { color: '#ffffff', border: '1px solid #ccc' }
            ].map((item) => (
              <button
                key={item.color}
                onClick={() => setColor(item.color)}
                className={`w-8 h-8 rounded-full border-2 ${color === item.color ? 'border-gray-800' : 'border-gray-300'}`}
                style={{ backgroundColor: item.color, border: item.border }}
              />
            ))}
          </div>

          {mode === 'text' && (
            <select
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={14}>Small</option>
              <option value={16}>Medium</option>
              <option value={20}>Large</option>
              <option value={24}>X-Large</option>
            </select>
          )}

          <button onClick={clearAll} className="px-3 py-2 bg-red-500 text-white rounded text-sm font-semibold">
            🗑️ Clear All
          </button>
        </div>

        {isDrawing && (
          <div className="text-center mt-2 text-sm text-gray-600">
            {mode === 'draw' ? '💡 Click and drag to draw' : '💡 Click anywhere to add text'}
          </div>
        )}
      </div>
    </>
  );
};

export default SimpleDrawToolbar;
