import React from "react";
import Popout from "./Popout";
import { AttributeCounter } from "../types";

interface AttributeCounterPopoutProps {
  counter: AttributeCounter;
  onClose: () => void;
  index: number;
  totalPopouts: number;
}

const AttributeCounterPopout: React.FC<AttributeCounterPopoutProps> = ({
  counter,
  onClose,
  index,
  totalPopouts
}) => {
  const popoutWidth = 250;
  const popoutHeight = 200;
  const spacing = 10;
  const bottomOffset = 4; // Distance from the bottom of the screen

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
      title={`${counter.layerId} - ${counter.attribute}`} 
      onClose={onClose}
      style={style}
    >
      {Object.entries(counter.counts || {}).map(([value, count]) => (
        <div key={value} className="flex justify-between">
          <span className="text-gray-600">{value}:</span>
          <span className="font-semibold text-gray-800">{count}</span>
        </div>
      ))}
    </Popout>
  );
};

export default AttributeCounterPopout;
