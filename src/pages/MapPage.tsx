// src/pages/MapPage.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import StaticMap from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import BaseLayerSelector from '../components/BaseLayerSelector';
import Sidebar from '../components/Sidebar';
import { GeoJsonLayer, WebMercatorViewport } from 'deck.gl';
import { ViewStateChangeParameters } from '@deck.gl/core'

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
  const navbarRef = useRef<HTMLDivElement>(null); // needed to calculate map height and avoid navbar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewport, setViewport] = useState(INITIAL_VIEW_STATE);
  const [visibleFeatureCount, setVisibleFeatureCount] = useState(0);
  const [hasPointGeometry, setHasPointGeometry] = useState(false); //to track layers with point and conditionally render counter


  const handleViewStateChange = (params: ViewStateChangeParameters<any>) => {
    setViewport(params.viewState);
    // console.log('New view state:', params.viewState);
  }

  const countVisibleFeatures = useMemo(() => {
    // console.log('Recalculating visible features');
    if (layers.length === 0) return 0;
    const webMercatorViewport = new WebMercatorViewport(viewport);
    const bounds = webMercatorViewport.getBounds();
    // console.log('Current bounds:' , bounds)

    let count = 0;
    layers.forEach(layer => {
      if (layer.visible && layer.data && layer.data.features) {
        const layerCount = layer.data.features.filter((feature: any) => {
          if (feature.geometry.type === 'Point') {
            const [lon, lat] = feature.geometry.coordinates;
            return lon >= bounds[0] && lon <= bounds[2] && lat >= bounds[1] && lat <= bounds[3];
          }
          //other geometry types here
          return true;
        }).length;
        // console.log(`Layer ${layer.name} visible features:`, layerCount);
        count += layerCount

      }
    });
    // console.log('Total visible features:', count);
    return count;
  }, [layers, viewport]);

  useEffect(() => {
    // console.log('Updating visible feature count:', countVisibleFeatures);
    setVisibleFeatureCount(countVisibleFeatures);

    const hasPoints = layers.some(layer =>
      layer.data.features.some((feature: any) => feature.geometry.type === 'Point')
    );
    setHasPointGeometry(hasPoints);

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
  }, [countVisibleFeatures, layers]);

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
          onViewStateChange={handleViewStateChange}
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
        {hasPointGeometry &&(
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow">
        Visible Features: {visibleFeatureCount}
        </div>)}
      </div>
    </div>
  );
};

export default MapPage;
