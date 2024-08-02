// FeatureCounter.tsx
import React from 'react';

interface LayerCount {
  name: string;
  count: number;
}

interface FeatureCounterProps {
  layerCounts: LayerCount[];
}

const FeatureCounter: React.FC<FeatureCounterProps> = ({ layerCounts }) => (
  <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow">
    {layerCounts.map((layerCount, index) => (
      <div key={index}>
        {layerCount.name}: {layerCount.count}
      </div>
    ))}
  </div>
);

export default FeatureCounter;