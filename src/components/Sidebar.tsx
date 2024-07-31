import React, { useState, useEffect } from 'react';

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onToggleSidebar: (isOpen: boolean) => void;
  layerVisible: boolean;
  transparency: number;
  fillColor: number[];
  lineColor: number[];
  onVisibilityChange: (visible: boolean) => void;
  onTransparencyChange: (opacity: number) => void;
  onFillColorChange: (color: number[]) => void;
  onLineColorChange: (color: number[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onFileUpload,
  onToggleSidebar,
  layerVisible,
  transparency,
  fillColor,
  lineColor,
  onVisibilityChange,
  onTransparencyChange,
  onFillColorChange,
  onLineColorChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onToggleSidebar(isOpen);
  }, [isOpen, onToggleSidebar]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleTransparencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTransparencyChange(parseFloat(event.target.value));
  };

  const handleFillColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFillColorChange(event.target.value.split(',').map(Number));
  };

  const handleLineColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLineColorChange(event.target.value.split(',').map(Number));
  };

  return (
    <div>
      <div
        className={`fixed top-0 left-0 pt-4rem h-full w-64 bg-gray-800 text-white transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg z-10`}
        style={{ paddingTop: '4rem' }}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Upload GeoJSON</h2>
          <label className="block mb-4">
            <span className="sr-only">Choose file</span>
            <input
              type="file"
              accept=".geojson, .json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            />
          </label>

          {/* Layer Visibility Toggle */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={layerVisible}
                onChange={() => onVisibilityChange(!layerVisible)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-sm">Show Layer</span>
            </label>
          </div>

          {/* Transparency Slider */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Transparency</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={transparency}
              onChange={handleTransparencyChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Fill Color Input */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Fill Color (R,G,B)</label>
            <input
              type="text"
              value={fillColor.join(',')}
              onChange={handleFillColorChange}
              className="w-full p-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Line Color Input */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Line Color (R,G,B)</label>
            <input
              type="text"
              value={lineColor.join(',')}
              onChange={handleLineColorChange}
              className="w-full p-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      <button
        className={`absolute p-4 text-white bg-gray-800 hover:bg-gray-700 top-4 rounded-e-md transition-transform duration-300 transform ${
          isOpen ? 'translate-x-64' : 'translate-x-0'
        } z-20`}
        onClick={toggleSidebar}
        style={{ left: isOpen ? '' : '0' }}
      >
        ☰
      </button>
    </div>
  );
};

export default Sidebar;
