// src/components/FeatureCounter.tsx
import React from 'react';

interface FeatureCounterProps {
  featureCounts: number[];
}

const FeatureCounter: React.FC<FeatureCounterProps> = ({ featureCounts }) => {
  return (
    <div className="absolute bottom-4 right-4">
      {featureCounts.map((count, index) => (
        <div key={index}>
          Layer {index + 1}: {count} features visible
        </div>
      ))}
    </div>
  );
};

export default FeatureCounter;
