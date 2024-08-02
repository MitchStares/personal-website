import React from 'react';

interface FeatureCounterProps {
  count: number;
}
// Component to visualise the features counted in MapView. Will expand to more complex component. 
const FeatureCounter: React.FC<FeatureCounterProps> = ({ count }) => (
  <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow">
    Visible Features: {count}
  </div>
);

export default FeatureCounter;