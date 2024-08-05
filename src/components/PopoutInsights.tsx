// PopoutInsights.tsx
import React from 'react';
import { LayerCount } from '../types';

interface PopoutInsightsProps {
  layerCounts: LayerCount[];
  onClose: () => void;
}

const PopoutInsights: React.FC<PopoutInsightsProps> = ({ layerCounts, onClose }) => (
  <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
      ×
    </button>
    <h3 className="text-lg font-semibold mb-2 text-gray-800">Visible Features by Layer</h3>
    {layerCounts.map((layerCount, index) => (
      <div key={index} className="mb-1 flex justify-between">
        <span className="text-gray-700">{layerCount.name}:</span>
        <span className="font-semibold text-gray-800">{layerCount.count}</span>
      </div>
    ))}
  </div>
);

export default PopoutInsights;