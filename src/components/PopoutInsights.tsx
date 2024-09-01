// PopoutInsights.tsx
import React, { useState, useEffect } from "react";
import Popout from "./Popout";
import { LayerCount } from "../types";

interface PopoutInsightsProps {
  layerCounts: LayerCount[];
  onClose: () => void;
  editMode: boolean;
  sidebarOffset: number;
}

const PopoutInsights: React.FC<PopoutInsightsProps> = ({
  layerCounts,
  onClose,
  editMode,
  sidebarOffset,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 250, height: 400 });
  const [hasBeenMoved, setHasBeenMoved] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      const newX = Math.min(Math.max(0, window.innerWidth - 270), maxX);
      const newY = Math.min(Math.max(0, window.innerHeight - 420), maxY);
      setPosition({ x: newX, y: newY });
    };

    if (!hasBeenMoved) {
      updatePosition();
    }

    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [size, hasBeenMoved]);

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
      <Popout
        title="Visible Features by Layer"
        onClose={onClose}
        editMode={editMode}
        position={{
          x: position.x + sidebarOffset,
          y: position.y
        }}
        size={size}
        onUpdatePosition={(x, y) => {
          setPosition({ x: x - sidebarOffset, y });
          setHasBeenMoved(true);
        }}
        onUpdateSize={(width, height) => setSize({ width, height })}
        sidebarOffset={sidebarOffset}
      >
        <div className="overflow-y-auto h-full" style={{ pointerEvents: 'auto' }}>
          {layerCounts.map((layerCount, index) => (
            <div key={index} className="mb-1 flex justify-between">
              <span className="text-gray-700">{layerCount.name}:</span>
              <span className="font-semibold text-gray-800">{layerCount.count}</span>
            </div>
          ))}
        </div>
      </Popout>
    </div>
  );
};

export default PopoutInsights;
