// src/components/MapPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import StaticMap from 'react-map-gl';
import { LineLayer } from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapHeight, setMapHeight] = useState('100vh');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  const handleStyleChange = (style: string) => {
    setMapStyle(style);
    setIsExpanded(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 5000);
  };

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
        <div
          className="absolute bottom-4 left-4 z-10"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">
            <button className="bg-white p-2 rounded shadow">Base Layer</button>
            <div className={`absolute left-0 bottom-full mb-2 ${isExpanded ? 'flex' : 'hidden'} flex-col bg-white p-2 rounded shadow transition-opacity duration-500`}>
              <button
                className={`p-2 rounded ${mapStyle === 'mapbox://styles/mapbox/light-v9' ? 'bg-gray-300' : 'bg-white'}`}
                onClick={() => handleStyleChange('mapbox://styles/mapbox/light-v9')}
              >
                Light
              </button>
              <button
                className={`p-2 rounded ${mapStyle === 'mapbox://styles/mapbox/dark-v9' ? 'bg-gray-300' : 'bg-white'}`}
                onClick={() => handleStyleChange('mapbox://styles/mapbox/dark-v9')}
              >
                Dark
              </button>
              <button
                className={`p-2 rounded ${mapStyle === 'mapbox://styles/mapbox/streets-v11' ? 'bg-gray-300' : 'bg-white'}`}
                onClick={() => handleStyleChange('mapbox://styles/mapbox/streets-v11')}
              >
                Streets
              </button>
              <button
                className={`p-2 rounded ${mapStyle === 'mapbox://styles/mapbox/outdoors-v11' ? 'bg-gray-300' : 'bg-white'}`}
                onClick={() => handleStyleChange('mapbox://styles/mapbox/outdoors-v11')}
              >
                Outdoors
              </button>
              <button
                className={`p-2 rounded ${mapStyle === 'mapbox://styles/mapbox/satellite-v9' ? 'bg-gray-300' : 'bg-white'}`}
                onClick={() => handleStyleChange('mapbox://styles/mapbox/satellite-v9')}
              >
                Satellite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
