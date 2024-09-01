// PopoutInsights.tsx
import React from "react";
import Popout from "./Popout";
import { LayerCount } from "../types";

interface PopoutInsightsProps {
  layerCounts: LayerCount[];
  onClose: () => void;
  index: number;
  totalPopouts: number;
}

const PopoutInsights: React.FC<PopoutInsightsProps> = ({
  layerCounts,
  onClose,
  index,
  totalPopouts
}) => {
  const popoutWidth = 250;
  const popoutHeight = 400;
  const spacing = 10;
  const bottomOffset = 4;

  const style: React.CSSProperties = {
    position: 'absolute',
    bottom: `${bottomOffset + (popoutHeight + spacing) * index}px`,
    right: `${spacing}px`,
    width: `${popoutWidth}px`,
    maxHeight: `${popoutHeight}px`,
    overflowY: 'auto'
  };

  return (
    <Popout
      title="Visible Features by Layer"
      onClose={onClose}
      style={style}
    >
      {layerCounts.map((layerCount, index) => (
        <div key={index} className="mb-1 flex justify-between">
          <span className="text-gray-700">{layerCount.name}:</span>
          <span className="font-semibold text-gray-800">{layerCount.count}</span>
        </div>
      ))}
    </Popout>
  );
};

export default PopoutInsights;
