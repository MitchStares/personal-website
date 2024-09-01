import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";

interface PopoutProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  editMode: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize: (width: number, height: number) => void;
  sidebarOffset: number;
}

const Popout: React.FC<PopoutProps> = ({ 
  title, 
  onClose, 
  children, 
  editMode, 
  position, 
  size, 
  onUpdatePosition, 
  onUpdateSize 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [localPosition, setLocalPosition] = useState(position);
  const popoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalPosition(position);
  }, [position]);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
    setLocalPosition(newPosition);
    onUpdatePosition(newPosition.x, newPosition.y);
  };

  const handleResize = (event: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    onUpdateSize(size.width, size.height);
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  const content = (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={handleResize}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      draggableOpts={{ disabled: !editMode }}
      minConstraints={[200, 100]}
      maxConstraints={[500, 800]}
    >
      <div 
        ref={popoutRef}
        className="bg-white p-4 rounded-lg shadow-lg overflow-hidden"
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="overflow-auto" style={{ height: `${size.height - 40}px` }}>
          {children}
        </div>
        {editMode && !isResizing && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 opacity-50 cursor-se-resize" />
        )}
      </div>
    </Resizable>
  );

  return (
    <div style={{ position: 'absolute', left: localPosition.x, top: localPosition.y }}>
      {editMode ? (
        <Draggable 
          position={localPosition}
          onDrag={handleDrag} 
          bounds="parent"
          nodeRef={popoutRef}
          
        >
          {content}
        </Draggable>
      ) : (
        content
      )}
    </div>
  );
};

export default Popout;
