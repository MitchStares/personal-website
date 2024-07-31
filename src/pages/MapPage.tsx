// src/pages/MapPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import StaticMap from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import BaseLayerSelector from '../components/BaseLayerSelector';
import Sidebar from '../components/Sidebar';
import { GeoJsonLayer } from 'deck.gl';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const INITIAL_VIEW_STATE = {
  longitude: 151.2110,
  latitude: -33.8614,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

const MapPage: React.FC = () => {
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v9');
  const [mapHeight, setMapHeight] = useState('100vh');
  const [layers, setLayers] = useState<any[]>([]);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (navbarRef.current) {
        const navbarHeight = navbarRef.current.offsetHeight;
        setMapHeight(`calc(100vh - ${navbarHeight}px)`);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const json = JSON.parse(event.target.result as string);
        setLayers(prevLayers => [
          ...prevLayers,
          {
            id: `geojson-layer-${prevLayers.length}`,
            name: `Layer ${prevLayers.length + 1}`,
            data: json,
            visible: true,
            transparency: 0.7,
            fillColor: [255, 140, 0],
            lineColor: [255, 255, 255],
            lineWidth: 1
          }
        ]);
      }
    };
    reader.readAsText(file);
  };

  const handleLayerSettingChange = (index: number, key: string, value: any) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      newLayers[index] = { ...newLayers[index], [key]: value };
      return newLayers;
    });
  };

  const handleLayerRemove = (index: number) => {
    setLayers(prevLayers => prevLayers.filter((_, i) => i !== index));
  };

  const renderedLayers = layers.map((layer, index) => (
    new GeoJsonLayer({
      id: layer.id,
      data: layer.data,
      visible: layer.visible,
      filled: true,
      opacity: layer.transparency,
      getFillColor: layer.fillColor,
      getLineColor: layer.lineColor,
      lineWidthScale: layer.lineWidth,
      pointRadiusMinPixels: 5,
      getPointRadius: 100,
    })
  ));

  return (
    <div ref={navbarRef}>
      <div className="relative flex">
        <Sidebar
          onFileUpload={handleFileUpload}
          onToggleSidebar={setSidebarOpen}
          layers={layers}
          onLayerSettingChange={handleLayerSettingChange}
          onRemoveLayer={handleLayerRemove}
        />
      </div>
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`} style={{ height: mapHeight }}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={renderedLayers}
        >
          <StaticMap
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            mapStyle={mapStyle}
            style={{ height: '100%' }}
          />
        </DeckGL>
        <BaseLayerSelector
          currentStyle={mapStyle}
          onStyleChange={(style) => setMapStyle(style)}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </div>
  );
};

export default MapPage;
