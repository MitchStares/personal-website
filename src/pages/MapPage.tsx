// src/pages/MapPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import StaticMap from 'react-map-gl';
import { LineLayer } from '@deck.gl/layers';
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

const data = [
  { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }
];

const layers = [
  new LineLayer({ id: 'line-layer', data })
];

const MapPage: React.FC = () => {
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v9');
  const [mapHeight, setMapHeight] = useState('100vh');
  const [geoJson, setGeoJson] = useState<any>(null);
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
  // const handleFileUpload = (file: File) => {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   fetch('/process-shapefile', {
  //     method: 'POST',
  //     body: formData,
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     setGeoJson(data);
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  // };
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const json = JSON.parse(event.target.result as string);
        setGeoJson(json);
      }
    };
    reader.readAsText(file);
  };

  const layers = [
    geoJson && new GeoJsonLayer({
      id: 'geojson-layer',
      data: geoJson,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [160, 160, 180, 200],
      getLineColor: [0, 0, 0, 200],
      getPointRadius: 100,
      pointRadiusScale: 1,
    })
  ].filter(Boolean);

  return (
    <div ref={navbarRef}>
      <div className="relative flex">
      <Sidebar onFileUpload={handleFileUpload} onToggleSidebar={setSidebarOpen} />
      </div>
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`} style={{ height: mapHeight }}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
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
