import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';

interface ColorSelectorProps {
  layer: any;
  onColorChange: (colorType: string, value: any) => void;
  onAttributeChange: (attribute: string, target: 'fill' | 'line') => void;
  onColorSchemeChange: (scheme: string, target: 'fill' | 'line') => void;
  onGeometryTypeChange: (geometryType: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ 
  layer, 
  onColorChange, 
  onAttributeChange,
  onColorSchemeChange,
  onGeometryTypeChange
}) => {
  const [fillColorBy, setFillColorBy] = useState<'solid' | 'attribute'>(layer.fillColorAttribute ? 'attribute' : 'solid');
  const [lineColorBy, setLineColorBy] = useState<'solid' | 'attribute'>(layer.lineColorAttribute ? 'attribute' : 'solid');

  const handleColorByChange = (event: React.ChangeEvent<HTMLSelectElement>, target: 'fill' | 'line') => {
    const value = event.target.value as 'solid' | 'attribute';
    if (target === 'fill') {
      setFillColorBy(value);
      if (value === 'solid') {
        onAttributeChange('', 'fill');
        onColorSchemeChange('', 'fill');
      }
    } else {
      setLineColorBy(value);
      if (value === 'solid') {
        onAttributeChange('', 'line');
        onColorSchemeChange('', 'line');
      }
    }
  };

  const handleAttributeChange = (event: React.ChangeEvent<HTMLSelectElement>, target: 'fill' | 'line') => {
    const attribute = event.target.value;
    onAttributeChange(attribute, target);
  };

  const handleColorSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>, target: 'fill' | 'line') => {
    const scheme = event.target.value;
    onColorSchemeChange(scheme, target);
  };

  const handleGeometryTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const geometryType = event.target.value;
    onGeometryTypeChange(geometryType);
  };

  const getAttributes = () => {
    if (layer.data.features && layer.data.features.length > 0) {
      return Object.keys(layer.data.features[0].properties);
    }
    return [];
  };

  const colorSchemes = [
    { name: 'Category10', value: 'category10' },
    { name: 'Accent', value: 'accent' },
    { name: 'Dark2', value: 'dark2' },
    { name: 'Paired', value: 'paired' },
    { name: 'Set1', value: 'set1' },
    { name: 'Set2', value: 'set2' },
    { name: 'Set3', value: 'set3' },
    { name: 'Pastel1', value: 'pastel1' },
    { name: 'Pastel2', value: 'pastel2' },
  ];

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">Geometry Type</h3>
      <select
        value={layer.selectedGeometryType || ''}
        onChange={handleGeometryTypeChange}
        className="w-full p-2 mb-4 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Geometry Types</option>
        {layer.geometryTypes.map((type: string) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <h3 className="font-bold mb-2">Fill Color</h3>
      <select
        value={fillColorBy}
        onChange={(e) => handleColorByChange(e, 'fill')}
        className="w-full p-2 mb-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="solid">Solid Color</option>
        <option value="attribute">Color by Attribute</option>
      </select>

      {fillColorBy === 'solid' && (
        <SketchPicker
          color={{
            r: layer.fillColor[0],
            g: layer.fillColor[1],
            b: layer.fillColor[2],
          }}
          onChange={(color) => {
            const newColor = [color.rgb.r, color.rgb.g, color.rgb.b];
            onColorChange("fillColor", newColor);
          }}
        />
      )}

      {fillColorBy === 'attribute' && (
        <>
          <select
            value={layer.fillColorAttribute || ''}
            onChange={(e) => handleAttributeChange(e, 'fill')}
            className="w-full p-2 mb-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an attribute</option>
            {getAttributes().map(attr => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>

          <select
            value={layer.fillColorScheme || ''}
            onChange={(e) => handleColorSchemeChange(e, 'fill')}
            className="w-full p-2 mb-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a color scheme</option>
            {colorSchemes.map(scheme => (
              <option key={scheme.value} value={scheme.value}>{scheme.name}</option>
            ))}
          </select>
        </>
      )}

      <h3 className="font-bold mt-4 mb-2">Line Color</h3>
      <select
        value={lineColorBy}
        onChange={(e) => handleColorByChange(e, 'line')}
        className="w-full p-2 mb-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="solid">Solid Color</option>
        <option value="attribute">Color by Attribute</option>
      </select>

      {lineColorBy === 'solid' && (
        <SketchPicker
          color={{
            r: layer.lineColor[0],
            g: layer.lineColor[1],
            b: layer.lineColor[2],
          }}
          onChange={(color) => {
            const newColor = [color.rgb.r, color.rgb.g, color.rgb.b];
            onColorChange("lineColor", newColor);
          }}
        />
      )}

      {lineColorBy === 'attribute' && (
        <>
          <select
            value={layer.lineColorAttribute || ''}
            onChange={(e) => handleAttributeChange(e, 'line')}
            className="w-full p-2 mb-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an attribute</option>
            {getAttributes().map(attr => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>

          <select
            value={layer.lineColorScheme || ''}
            onChange={(e) => handleColorSchemeChange(e, 'line')}
            className="w-full p-2 mb-2 text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a color scheme</option>
            {colorSchemes.map(scheme => (
              <option key={scheme.value} value={scheme.value}>{scheme.name}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default ColorSelector;