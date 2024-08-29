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
  const popoutWidth = 250; // Adjust this value based on your popout's width
  const popoutHeight = 200; // Adjust this value based on your popout's height
  const spacing = 10; // Spacing between popouts
  const columns = Math.ceil(Math.sqrt(totalPopouts)); // Calculate number of columns

  const column = index % columns;
  const row = Math.floor(index / columns);

  const style: React.CSSProperties = {
    position: 'absolute',
    bottom: `${spacing + row * (popoutHeight + spacing)}px`,
    right: `${spacing + column * (popoutWidth + spacing)}px`,
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
