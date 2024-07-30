// src/components/BaseLayerSelector.tsx
import React, { useState, useRef } from 'react';

interface BaseLayerSelectorProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

const BaseLayerSelector: React.FC<BaseLayerSelectorProps> = ({ currentStyle, onStyleChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 5000);
  };

  const styles = [
    { id: 'mapbox://styles/mapbox/light-v9', label: 'Light' },
    { id: 'mapbox://styles/mapbox/dark-v9', label: 'Dark' },
    { id: 'mapbox://styles/mapbox/streets-v11', label: 'Streets' },
    { id: 'mapbox://styles/mapbox/outdoors-v11', label: 'Outdoors' },
    { id: 'mapbox://styles/mapbox/satellite-v9', label: 'Satellite' },
  ];

  return (
    <div
      className="absolute bottom-4 left-4 z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative group">
        <button className="bg-white p-2 rounded shadow">Base Layer</button>
        <div
          className={`absolute left-0 bottom-full mb-2 ${isExpanded ? 'flex' : 'hidden'} flex-col bg-white p-2 rounded shadow transition-opacity duration-500`}
        >
          {styles.map((style) => (
            <button
              key={style.id}
              className={`p-2 rounded ${currentStyle === style.id ? 'bg-gray-300' : 'bg-white'}`}
              onClick={() => onStyleChange(style.id)}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaseLayerSelector;
