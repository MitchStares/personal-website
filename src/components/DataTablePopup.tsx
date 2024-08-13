import React, { useState, useEffect } from 'react';

interface DataTablePopupProps {
  layer: any;
  onClose: () => void;
}

const DataTablePopup: React.FC<DataTablePopupProps> = ({ layer, onClose }) => {
  const [attributes, setAttributes] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [dataTypes, setDataTypes] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (layer && layer.data && layer.data.features && layer.data.features.length > 0) {
      const firstFeature = layer.data.features[0];
      const attrs = Object.keys(firstFeature.properties);
      setAttributes(attrs);

      // Infer data types
      const types: {[key: string]: string} = {};
      attrs.forEach(attr => {
        const value = firstFeature.properties[attr];
        if (typeof value === 'number') {
          types[attr] = 'number';
        } else if (typeof value === 'string') {
          types[attr] = 'string';
        } else if (typeof value === 'boolean') {
          types[attr] = 'boolean';
        } else {
          types[attr] = 'unknown';
        }
      });
      setDataTypes(types);

      setData(layer.data.features.slice(0, 100).map((f: any) => f.properties));
    }
  }, [layer]);

  const handleTypeChange = (attribute: string, newType: string) => {
    setDataTypes(prev => ({ ...prev, [attribute]: newType }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 h-3/4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{layer.name} Data</h2>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {attributes.map(attr => (
                <th key={attr} className="border p-2">
                  {attr}
                  <select 
                    value={dataTypes[attr]} 
                    onChange={(e) => handleTypeChange(attr, e.target.value)}
                    className="ml-2 text-sm"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {attributes.map(attr => (
                  <td key={attr} className="border p-2">{row[attr]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTablePopup;