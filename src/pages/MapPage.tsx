// src/pages/MapPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import StaticMap from 'react-map-gl';
import { LineLayer } from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import BaseLayerSelector from '../components/BaseLayerSelector';

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
  const navbarRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={navbarRef}>
      <div style={{ height: mapHeight }}>
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
        />
      </div>
    </div>
  );
};

export default MapPage;
