import React from "react";
import Popout from "./Popout";
import { AttributeCounter } from "../types";

interface AttributeCounterPopoutProps {
  counter: AttributeCounter;
  onClose: () => void;
  index: number;
  totalPopouts: number;
  editMode: boolean;
  position: { x: number, y: number };
  size: { width: number, height: number };
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize: (width: number, height: number) => void;
  sidebarOffset: number;
}

const AttributeCounterPopout: React.FC<AttributeCounterPopoutProps> = ({
  counter,
  onClose,
  index,
  totalPopouts,
  editMode,
  position,
  size,
  onUpdatePosition,
  onUpdateSize,
  sidebarOffset
}) => {
  return (
    <Popout
      title={`${counter.layerId} - ${counter.attribute}`}
      onClose={onClose}
      editMode={editMode}
      position={{
        x: position.x + sidebarOffset,
        y: position.y
      }}
      size={size}
      onUpdatePosition={(x, y) => onUpdatePosition(x - sidebarOffset, y)}
      onUpdateSize={onUpdateSize}
      sidebarOffset={sidebarOffset}
    >
      <div className="overflow-y-auto h-full">
        {Object.entries(counter.counts || {}).map(([value, count]) => (
          <div key={value} className="flex justify-between">
            <span className="text-gray-600">{value}:</span>
            <span className="font-semibold text-gray-800">{count}</span>
          </div>
        ))}
      </div>
    </Popout>
  );
};

export default AttributeCounterPopout;
