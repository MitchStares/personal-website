// PopoutInsights.tsx
import React from "react";
import Popout from "./Popout";
import { LayerCount } from "../types";

interface PopoutInsightsProps {
  layerCounts: LayerCount[];
  onClose: () => void;
  editMode: boolean;
}

const PopoutInsights: React.FC<PopoutInsightsProps> = ({
  layerCounts,
  onClose,
  editMode,
}) => (
  <Popout
    title="Visible Features by Layer"
    onClose={onClose}
    editMode={editMode}
    style={{
      position: 'absolute',
      bottom: '4px',
      right: '4px',
      width: '250px',
      height: '400px',
    }}
  >
    <div className="overflow-y-auto h-full">
      {layerCounts.map((layerCount, index) => (
        <div key={index} className="mb-1 flex justify-between">
          <span className="text-gray-700">{layerCount.name}:</span>
          <span className="font-semibold text-gray-800">{layerCount.count}</span>
        </div>
      ))}
    </div>
  </Popout>
);

export default PopoutInsights;
