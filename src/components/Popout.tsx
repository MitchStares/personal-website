import React from "react";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

interface PopoutProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  editMode: boolean;
  onResize?: (size: { width: number; height: number }) => void;
}

const Popout: React.FC<PopoutProps> = ({ title, onClose, children, style, editMode, onResize }) => {
  const [size, setSize] = React.useState({ width: 250, height: 200 });

  const handleResize = (event: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    setSize(size);
    if (onResize) {
      onResize(size);
    }
  };

  const content = (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={handleResize}
      draggableOpts={{ disabled: !editMode }}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg" style={{ ...style, width: size.width, height: size.height }}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
        {children}
      </div>
    </Resizable>
  );

  return editMode ? (
    <Draggable disabled={!editMode}>
      {content}
    </Draggable>
  ) : (
    content
  );
};

export default Popout;
