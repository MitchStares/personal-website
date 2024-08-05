import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { FaBars, FaChartBar, FaCog } from "react-icons/fa";
import { LayerCount } from "../types";

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onToggleSidebar: (isOpen: boolean) => void;
  layers: any[];
  onLayerSettingChange: (index: number, key: string, value: any) => void;
  onRemoveLayer: (index: number) => void;
  onOptionChange: (option: string, value: any) => void;
  options: { [key: string]: any };
  insights: Array<{ title: string; value: string | number }>;
  layerCounts: LayerCount[];
  onPopoutInsights: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onFileUpload,
  onToggleSidebar,
  layers,
  onLayerSettingChange,
  onRemoveLayer,
  onOptionChange,
  options,
  insights,
  layerCounts,
  onPopoutInsights,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedLayers, setExpandedLayers] = useState<boolean[]>(
    Array(layers.length).fill(false)
  );

  useEffect(() => {
    onToggleSidebar(activeSection !== null);
  }, [activeSection, onToggleSidebar]);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const toggleLayer = (index: number) => {
    setExpandedLayers((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  useEffect(() => {
    setExpandedLayers(Array(layers.length).fill(false));
  }, [layers.length]);

  return (
    <div className="fixed top-0 left-0 h-full z-10 flex">
      {/* Sidebar content */}
      <div
        className={`bg-gray-800 text-white h-full w-64 transition-transform duration-300 transform ${
          activeSection !== null ? "translate-x-0" : "-translate-x-full"
        } shadow-lg overflow-y-auto`}
        style={{ paddingTop: "4rem" }}
      >
        <div className="p-4">
          {activeSection === "layers" && (
            <div>
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
                        onLayerSettingChange(index, "visible", !layer.visible)
                      }
                      className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    />
                    <input
                      type="text"
                      value={layer.name || `Layer ${index + 1}`}
                      onChange={(e) =>
                        onLayerSettingChange(index, "name", e.target.value)
                      }
                      className="p-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mr-2"
                    />
                    <button
                      onClick={() => toggleLayer(index)}
                      className="text-white"
                    >
                      {expandedLayers[index] ? "▲" : "▼"}
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
                        <label className="block text-sm mb-2">
                          Transparency
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={layer.transparency}
                          onChange={(e) =>
                            onLayerSettingChange(
                              index,
                              "transparency",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Fill Color Input */}
                      <div className="mb-4">
                        <label className="block text-sm mb-2">Fill Color</label>
                        <SketchPicker
                          color={{
                            r: layer.fillColor[0],
                            g: layer.fillColor[1],
                            b: layer.fillColor[2],
                          }}
                          onChange={(color) => {
                            const newColor = [
                              color.rgb.r,
                              color.rgb.g,
                              color.rgb.b,
                            ];
                            onLayerSettingChange(index, "fillColor", newColor);
                          }}
                        />
                      </div>

                      {/* Line Color Input */}
                      <div className="mb-4">
                        <label className="block text-sm mb-2">Line Color</label>
                        <SketchPicker
                          color={{
                            r: layer.lineColor[0],
                            g: layer.lineColor[1],
                            b: layer.lineColor[2],
                          }}
                          onChange={(color) => {
                            const newColor = [
                              color.rgb.r,
                              color.rgb.g,
                              color.rgb.b,
                            ];
                            onLayerSettingChange(index, "lineColor", newColor);
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
                            onLayerSettingChange(
                              index,
                              "lineWidth",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full p-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeSection === "insights" && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Insights
              </h2>
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="mb-2 bg-white p-3 rounded-md shadow"
                >
                  <h3 className="font-semibold text-gray-700">
                    {insight.title}
                  </h3>
                  <p className="text-gray-600">{insight.value}</p>
                </div>
              ))}
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">
                Visible Features by Layer
                <button
                  onClick={onPopoutInsights}
                  className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Pop Out
                </button>
              </h3>
              {layerCounts
                .filter((layerCount) =>
                  layers.find(
                    (layer) => layer.id === layerCount.id && layer.visible
                  )
                )
                .map((layerCount, index) => (
                  <div
                    key={index}
                    className="mb-1 flex justify-between bg-white p-2 rounded-md shadow"
                  >
                    <span className="text-gray-700">{layerCount.name}:</span>
                    <span className="font-semibold text-gray-800">
                      {layerCount.count}
                    </span>
                  </div>
                ))}
            </div>
          )}

          {activeSection === "options" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Options</h2>
              {Object.entries(options).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={(e) => onOptionChange(key, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">{key}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pullout tabs */}
      <div
        className={`flex flex-col transition-transform duration-300 transform ${
          activeSection !== null ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <button
          className={`p-4 text-white bg-gray-800 hover:bg-gray-700 rounded-r-md shadow-lg ${
            activeSection === "layers" ? "bg-gray-600" : ""
          }`}
          onClick={() => toggleSection("layers")}
          style={{ marginTop: "4rem" }}
        >
          <FaBars />
        </button>
        <button
          className={`p-4 text-white bg-gray-800 hover:bg-gray-700 rounded-r-md shadow-lg ${
            activeSection === "insights" ? "bg-gray-600" : ""
          }`}
          onClick={() => toggleSection("insights")}
        >
          <FaChartBar />
        </button>
        <button
          className={`p-4 text-white bg-gray-800 hover:bg-gray-700 rounded-r-md shadow-lg ${
            activeSection === "options" ? "bg-gray-600" : ""
          }`}
          onClick={() => toggleSection("options")}
        >
          <FaCog />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
