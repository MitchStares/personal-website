import React, { useState, useRef, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Sidebar from '../components/Sidebar';
import MapView from '../components/MapView';
import RBush from 'rbush';
import * as turf from '@turf/turf';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const INITIAL_VIEW_STATE = {
  longitude: 151.2110,
  latitude: -33.8614,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

//Rbush/Typescript likes to be precious. Needs it own structure
interface RBushItem {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  feature: any;
}

const MapPage: React.FC = () => {
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v9');
  const [mapHeight, setMapHeight] = useState('100vh');
  const [layers, setLayers] = useState<any[]>([]);
  const navbarRef = useRef<HTMLDivElement>(null); //Needed for map canvas height calculation to avoid navbar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewport, setViewport] = useState(INITIAL_VIEW_STATE);
  const [spatialIndex, setSpatialIndex] = useState<RBush<RBushItem> | null>(null);

  //Creating the spatial index for each feature using RBush for use in MapView
  useEffect(() => {
    const index = new RBush<RBushItem>();
    layers.forEach(layer => {
      if (layer.data && layer.data.features) {
        layer.data.features.forEach((feature: any) => {
          const bbox = turf.bbox(feature);
          index.insert({
            minX: bbox[0],
            minY: bbox[1],
            maxX: bbox[2],
            maxY: bbox[3],
            feature: feature
          });
        });
      }
    });
    setSpatialIndex(index);
  }, [layers]);

  //Window resizing. Calculate navbar offset for canvas
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

  //Uploading of files, parsing as json and adding to layer array with fields for data, name and aesthetics options
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

  //Handling changes to aesthetic options
  const handleLayerSettingChange = (index: number, key: string, value: any) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      newLayers[index] = { ...newLayers[index], [key]: value };
      return newLayers;
    });
  };

  //On delete, remove from layer array
  const handleLayerRemove = (index: number) => {
    setLayers(prevLayers => prevLayers.filter((_, i) => i !== index));
  };

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
        {MAPBOX_ACCESS_TOKEN ?(
       <MapView
          initialViewState={INITIAL_VIEW_STATE}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle={mapStyle}
          layers={layers}
          spatialIndex={spatialIndex}
          onViewStateChange={setViewport}
          onStyleChange={setMapStyle}
          sidebarOpen={sidebarOpen}
        />
        ) : (
          <div> Mapbox access token is missing. Please check environment variables. </div>
        )} 
      </div>
    </div>
  );
};

export default MapPage;