import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import {
  FaBars,
  FaChartBar,
  FaChevronLeft,
  FaCog,
} from "react-icons/fa";
import { AttributeCounter, LayerCount } from "../types";
import { Link } from "react-router-dom";
import DataTablePopup from "./DataTablePopup";
import ColorSelector from "./ColourSelector";

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onToggleSidebar: (isOpen: boolean) => void;
  layers: any[];
  onLayerSettingChange: (index: number, key: string, value: any) => void;
  onRemoveLayer: (index: number) => void;
  onOptionChange: (option: string, value: any) => void;
  options: { [key: string]: any };
  insights: Array<{ title: string; value: string | number }>;
  onPopoutInsights: () => void;
  layerCounts: LayerCount[];
  attributeCounters: AttributeCounter[];
  onAddAttributeCounter: (layerId: string, attribute: string) => void;
  onRemoveAttributeCounter: (index: number) => void;
  onPopoutAttributeCounter: (index: number) => void;
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
  attributeCounters,
  onAddAttributeCounter,
  onRemoveAttributeCounter,
  onPopoutInsights,
  onPopoutAttributeCounter,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedLayers, setExpandedLayers] = useState<boolean[]>(
    Array(layers.length).fill(false)
  );
  const [showDataTable, setShowDataTable] = useState<number | null>(null);
  const [showAddCounter, setShowAddCounter] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState("");

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

  const handleDataTypesChange = (layerId: string, newDataTypes: {[key: string]: string}) => {
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    if (layerIndex !== -1) {
      onLayerSettingChange(layerIndex, 'dataTypes', newDataTypes);
    }
  };
  const handleAddCounter = () => {
    if (selectedLayer && selectedAttribute) {
      onAddAttributeCounter(selectedLayer, selectedAttribute);
      setShowAddCounter(false);
      setSelectedLayer("");
      setSelectedAttribute("");
    }
  };

  useEffect(() => {
    setExpandedLayers(Array(layers.length).fill(false));
  }, [layers.length]);

  const renderInsights = () => {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Insights</h2>
        
        {/* General Insights */}
        {insights.map((insight, index) => (
          <div key={index} className="mb-2 bg-white p-3 rounded-md shadow">
            <h3 className="font-semibold text-gray-700">{insight.title}</h3>
            <p className="text-gray-600">{insight.value}</p>
          </div>
        ))}

        {/* Layer Counts */}
        <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">
          Visible Features by Layer
          <button
            onClick={onPopoutInsights}
            className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Pop Out
          </button>
        </h3>
        {layerCounts
          .filter((layerCount) =>
            layers.find((layer) => layer.id === layerCount.id && layer.visible)
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

        {/* Attribute Counters */}
        <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
          Attribute Counters
        </h3>
        {attributeCounters.map((counter, index) => (
          <div key={index} className="mb-4 bg-white p-3 rounded-md shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">
                {`${layers.find(l => l.id === counter.layerId)?.name} - ${counter.attribute}`}
              </span>
              <div>
                <button
                  onClick={() => onPopoutAttributeCounter(index)}
                  className="mr-2 text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Pop Out
                </button>
                <button
                  onClick={() => onRemoveAttributeCounter(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
            {counter.counts && Object.entries(counter.counts).map(([value, count]) => (
              <div key={value} className="flex justify-between items-center">
                <span className="text-gray-600">{value}:</span>
                <span className="font-semibold text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={() => setShowAddCounter(true)}
          className="w-full py-2 px-4 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-300 mt-4"
        >
          Add Attribute Counter
        </button>
      </div>
    );
  };

  return (
    <div className="fixed top-0 left-0 h-full z-10 flex">
      {/* Sidebar content */}
      <div
        className={`bg-[#f8f5f1] text-green-800 h-full w-64 transition-transform duration-300 transform ${
          activeSection !== null ? "translate-x-0" : "-translate-x-full"
        } shadow-lg overflow-y-auto`}
      >
        <div className="p-4 border-b border-green-800">
          <Link
            to="/"
            className="flex items-center text-green-800 hover:text-green-700 transition-colors duration-300"
          >
            <FaChevronLeft size={16} className="mr-2" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
        <div style={{ paddingTop: "1rem" }}>
          <div className="p-4">
            {activeSection === "layers" && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-green-800">
                  Upload GeoJSON
                </h2>
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
                        <button
                          onClick={() => setShowDataTable(index)}
                          className="w-full py-2 px-4 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-300 mb-4"
                        >
                          View Data Table
                        </button>
                        {/* Geometry Type Toggles */}
                        {layer.geometryTypes &&
                          layer.geometryTypes.length > 1 && (
                            <div className="mb-4">
                              <label className="block text-sm mb-2">
                                Visible Geometry Types
                              </label>
                              {layer.geometryTypes.map((type: string) => (
                                <div
                                  key={type}
                                  className="flex items-center mb-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      layer.visibleGeometryTypes[type] !== false
                                    }
                                    onChange={() => {
                                      const newVisibleTypes = {
                                        ...layer.visibleGeometryTypes,
                                        [type]:
                                          !layer.visibleGeometryTypes[type],
                                      };
                                      onLayerSettingChange(
                                        index,
                                        "visibleGeometryTypes",
                                        newVisibleTypes
                                      );
                                    }}
                                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                                  />
                                  <span className="text-sm">{type}</span>
                                </div>
                              ))}
                            </div>
                          )}

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

{/* Color Selector */}
<ColorSelector
                    layer={layer}
                    onColorChange={(colorType, value) => {
                      onLayerSettingChange(index, colorType, value);
                    }}
                    onAttributeChange={(attribute, target) => {
                      onLayerSettingChange(index, `${target}ColorAttribute`, attribute);
                    }}
                    onColorSchemeChange={(scheme, target) => {
                      onLayerSettingChange(index, `${target}ColorScheme`, scheme);
                    }}
                    onGeometryTypeChange={(geometryType) => {
                      onLayerSettingChange(index, "selectedGeometryType", geometryType);
                    }}
                  />

                        {/* Line Width Input */}
                        <div className="mb-4">
                          <label className="block text-sm mb-2">
                            Line Width
                          </label>
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

            {activeSection === "insights" && renderInsights()}

            {activeSection === "options" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Options (WIP)</h2>
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
      </div>

      {/* Pullout tabs */}
      <div
        className={`flex flex-col transition-transform duration-300 transform ${
          activeSection !== null ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <button
          className={`p-4 text-gray-800 bg-[#f8f5f1] hover:bg-green-700 rounded-r-md shadow-lg transition-all duration-300 ${
            activeSection === "layers"
              ? "bg-green-700 hover:bg-green-800 translate-x-0 scale-y-110 z-10"
              : ""
          }`}
          onClick={() => toggleSection("layers")}
          style={{ marginTop: "4rem" }}
        >
          <FaBars
            className={`transform transition-transform duration-300 ${
              activeSection === "layers" ? "scale-110" : ""
            }`}
          />
        </button>
        <button
          className={`p-4 text-gray-800 bg-[#f8f5f1] hover:bg-green-700 rounded-r-md shadow-lg transition-all duration-300 ${
            activeSection === "insights"
              ? "bg-green-700 hover:bg-green-800 translate-x-0 scale-y-110 z-10"
              : ""
          }`}
          onClick={() => toggleSection("insights")}
        >
          <FaChartBar
            className={`transform transition-transform duration-300 ${
              activeSection === "insights" ? "scale-110" : ""
            }`}
          />
        </button>
        <button
          className={`p-4 text-gray-800 bg-[#f8f5f1] hover:bg-green-700 rounded-r-md shadow-lg transition-all duration-300 ${
            activeSection === "options"
              ? "bg-green-700 hover:bg-green-800 translate-x-0 scale-y-110 z-10"
              : ""
          }`}
          onClick={() => toggleSection("options")}
        >
          <FaCog
            className={`transform transition-transform duration-300 ${
              activeSection === "options" ? "scale-110" : ""
            }`}
          />
        </button>
      </div>
      {/* Data Table Popup */}
      {showDataTable !== null && (
        <DataTablePopup
          layer={layers[showDataTable]}
          onClose={() => setShowDataTable(null)}
          onDataTypesChange={handleDataTypesChange}
        />
      )}

      {/* Add Attribute Counter Popup */}
      {showAddCounter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Attribute Counter</h2>
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="">Select Layer</option>
              {layers.map((layer) => (
                <option key={layer.id} value={layer.id}>
                  {layer.name}
                </option>
              ))}
            </select>
            {selectedLayer && (
              <select
                value={selectedAttribute}
                onChange={(e) => setSelectedAttribute(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="">Select Attribute</option>
                {Object.keys(layers.find((l) => l.id === selectedLayer)?.data.features[0].properties || {}).map((attr) => (
                  <option key={attr} value={attr}>
                    {attr}
                  </option>
                ))}
</select>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleAddCounter}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddCounter(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
