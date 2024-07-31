import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onToggleSidebar: (isOpen: boolean) => void;
  layers: any[];
  onLayerSettingChange: (index: number, key: string, value: any) => void;
  onRemoveLayer: (index: number) => void; // Added prop for removing layers
}

const Sidebar: React.FC<SidebarProps> = ({
  onFileUpload,
  onToggleSidebar,
  layers,
  onLayerSettingChange,
  onRemoveLayer, // Added prop for removing layers
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedLayers, setExpandedLayers] = useState<boolean[]>(Array(layers.length).fill(false));

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

  const toggleLayer = (index: number) => {
    setExpandedLayers(prevExpandedLayers => {
      const newExpandedLayers = [...prevExpandedLayers];
      newExpandedLayers[index] = !newExpandedLayers[index];
      return newExpandedLayers;
    });
  };

  useEffect(() => {
    // Ensure the expandedLayers array has the correct length
    setExpandedLayers(Array(layers.length).fill(false));
  }, [layers.length]);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 pt-4rem h-full w-64 bg-gray-800 text-white transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg z-10 overflow-y-auto`}
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

          {layers.map((layer, index) => (
            <div key={layer.id} className="mb-4">
              <div className="flex justify-between items-center mb-2">
              <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() =>
                    onLayerSettingChange(index, 'visible', !layer.visible)
                  }
                  className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                />
                <input
                  type="text"
                  value={layer.name || `Layer ${index + 1}`}
                  onChange={(e) => onLayerSettingChange(index, 'name', e.target.value)}
                  className="p-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mr-2"
                />
                <button
                  onClick={() => toggleLayer(index)}
                  className="text-white"
                >
                  {expandedLayers[index] ? '▲' : '▼'}
                </button>
                <button
                  onClick={() => onRemoveLayer(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
              {expandedLayers[index] && (
                <div>
                  {/* Layer Visibility Toggle
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={layer.visible}
                        onChange={() =>
                          onLayerSettingChange(index, 'visible', !layer.visible)
                        }
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-sm">Show Layer</span>
                    </label>
                  </div> */}

                  {/* Transparency Slider */}
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Transparency</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={layer.transparency}
                      onChange={(e) =>
                        onLayerSettingChange(index, 'transparency', parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Fill Color Input */}
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Fill Color</label>
                    <SketchPicker
                      color={{ r: layer.fillColor[0], g: layer.fillColor[1], b: layer.fillColor[2] }}
                      onChange={(color) => {
                        const newColor = [color.rgb.r, color.rgb.g, color.rgb.b];
                        onLayerSettingChange(index, 'fillColor', newColor);
                      }}
                    />
                  </div>

                  {/* Line Color Input */}
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Line Color</label>
                    <SketchPicker
                      color={{ r: layer.lineColor[0], g: layer.lineColor[1], b: layer.lineColor[2] }}
                      onChange={(color) => {
                        const newColor = [color.rgb.r, color.rgb.g, color.rgb.b];
                        onLayerSettingChange(index, 'lineColor', newColor);
                      }}
                    />
                  </div>

                  {/* Line Width Input */}
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Line Width</label>
                    <input
                      type="number"
                      value={layer.lineWidth}
                      onChange={(e) =>
                        onLayerSettingChange(index, 'lineWidth', parseFloat(e.target.value))
                      }
                      className="w-full p-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
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
