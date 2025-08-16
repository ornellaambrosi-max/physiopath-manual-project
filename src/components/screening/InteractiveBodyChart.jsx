import React, { useState, useRef } from 'react';
import { BodyFront, BodyBack } from './BodySVGs'; // We'll create this file next

export default function InteractiveBodyChart({ view, markedAreas, currentSensation, onAreaDrawn, onAreaClick }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const svgRef = useRef(null);

  const getMousePosition = (e) => {
    const svg = svgRef.current;
    if (!svg) return null;

    const ctm = svg.getScreenCTM();
    if (!ctm) return null;

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    return {
      x: (clientX - ctm.e) / ctm.a,
      y: (clientY - ctm.f) / ctm.d
    };
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const pos = getMousePosition(e);
    if (!pos) return;

    if (!isDrawing) {
      setIsDrawing(true);
      setPoints([pos]);
    } else {
      setPoints([...points, pos]);
    }
  };

  const handleFinishDrawing = () => {
    if (points.length < 3) {
      // Not a valid shape, reset
      setIsDrawing(false);
      setPoints([]);
      return;
    }

    const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`).join(' ') + ' Z';
    
    onAreaDrawn({
      id: `area-${Date.now()}`,
      pathData,
      view,
      sensationType: currentSensation.type,
      intensity: currentSensation.intensity,
      color: currentSensation.color,
    });

    setIsDrawing(false);
    setPoints([]);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (isDrawing) {
      handleFinishDrawing();
    }
  };

  return (
    <div onDoubleClick={handleDoubleClick} className="relative aspect-[1/2] max-w-sm mx-auto">
      <svg
        ref={svgRef}
        viewBox="0 0 200 400"
        className="w-full h-full touch-none"
        onMouseDown={handleMouseDown}
        aria-label={`Interactive body chart, ${view} view. Click to mark areas.`}
        role="img"
      >
        <title>Body Chart</title>
        {/* Render the correct body view */}
        {view === 'front' ? <BodyFront /> : <BodyBack />}

        {/* Render previously marked areas */}
        {markedAreas.filter(area => area.view === view).map((area) => (
          <path
            key={area.id}
            d={area.pathData}
            fill={`${area.color}${Math.round(area.intensity / 10 * 200).toString(16).padStart(2, '0')}`} // Color with intensity as opacity
            stroke={area.color}
            strokeWidth="1"
            className="cursor-pointer transition-all hover:stroke-2"
            onClick={() => onAreaClick(area.id)}
            aria-label={`Marked area for ${area.sensationType} with intensity ${area.intensity}`}
          />
        ))}

        {/* Render the polygon currently being drawn */}
        {isDrawing && points.length > 0 && (
          <g>
            <polyline
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={currentSensation.color}
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2" fill={currentSensation.color} />
            ))}
          </g>
        )}
      </svg>
      {isDrawing && (
         <div className="absolute top-2 left-2 bg-white/80 p-2 rounded-lg text-xs text-warm-gray-800 shadow-md">
           Double-click to complete shape.
         </div>
       )}
    </div>
  );
}