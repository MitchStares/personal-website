import React from "react";

interface PopoutProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Popout: React.FC<PopoutProps> = ({ title, onClose, children, style }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg" style={style}>
    <button
      onClick={onClose}
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
    >
      ×
    </button>
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
    {children}
  </div>
);

export default Popout;
