import React, { useState, useEffect } from 'react';

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onToggleSidebar: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFileUpload, onToggleSidebar }) => {
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

  return (
    <div>
      <div
        className={`fixed top-0 left-0 pt-4rem h-full w-64 bg-gray-800 text-white transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-lg z-10`}
        style={{ paddingTop: '4rem' }}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Upload Shapefile</h2>
          <label className="block mb-4">
            <span className="sr-only">Choose file</span>
            <input
              type="file"
              accept='.geojson, .json'
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            />
          </label>
        </div>
      </div>
      <button
        className={`absolute p-4 text-white bg-gray-800 hover:bg-gray-700 top-4 rounded-e-md transition-transform duration-300 transform ${isOpen ? 'translate-x-64' : 'translate-x-0'} z-20`}
        onClick={toggleSidebar}
        style={{ left: isOpen ? "" : '0' }}
      >
        ☰
      </button>
    </div>
  );
};
export default Sidebar;
