import React, { useState, useRef, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Sidebar from '../components/Sidebar';
import MapView from '../components/MapView';
import RBush from 'rbush';
import * as turf from '@turf/turf';
// import { calculateAverageArea } from '../utils/calculateAverageArea';
import {LayerCount, RBushItem} from "../types";
import PopoutInsights from '../components/PopoutInsights';


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
  const navbarRef = useRef<HTMLDivElement>(null); //Needed for map canvas height calculation to avoid navbar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewport, setViewport] = useState(INITIAL_VIEW_STATE);
  const [spatialIndex, setSpatialIndex] = useState<RBush<RBushItem> | null>(null);
  const [layerCounts, setLayerCounts] = useState<LayerCount[]>([]);
  const [showPopoutInsights, setShowPopoutInsights] = useState(false);

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
        const layerId = `geojson-layer-${layers.length}`;
        const layerName = `Layer ${layers.length + 1}`;

        json.features = json.features.map((feature: any) => ({
          ...feature,
          properties: {
            ...feature.properties,
            layerId: layerId
          }
        }));

        setLayers(prevLayers => [
          ...prevLayers,
          {
            id: layerId,
            name: layerName,
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

      if (key === 'name') {
        const layerId = newLayers[index].id;
        newLayers[index].data.features = newLayers[index].data.features.map((feature: any) => ({
          ...feature,
          properties: {
            ...feature.properties,
            layerId: layerId
          }
        }));
      }

      return newLayers;
    });
  };

  //On delete, remove from layer array
  const handleLayerRemove = (index: number) => {
    setLayers(prevLayers => prevLayers.filter((_, i) => i !== index));
  };
  const [insights, setInsights] = useState([
    { title: 'Total Features', value: 0 },
    { title: 'Average Area', value: 0 },
  ]);

  const [options, setOptions] = useState({
    showLabels: true,
    enableHeatmap: false,
    // Add more options as needed
  });

  // useEffect(() => {
    // Calculate insights based on layers data
  //   const totalFeatures = layers.reduce((sum, layer) => sum + layer.data.features.length, 0);
  //   const averageArea = calculateAverageArea(layers); // Implement this function

  //   setInsights([
  //     { title: 'Total Features', value: totalFeatures },
  //     { title: 'Average Area', value: averageArea.toFixed(2) },
  //   ]);
  // }, [layers]);

  const handleOptionChange = (option: string, value: any) => {
    setOptions(prev => ({ ...prev, [option]: value }));
  };

  const handleLayerCountsUpdate = (counts: LayerCount[]) => {
    setLayerCounts(counts);
    // Calculate total visible features
    const totalVisibleFeatures = counts.reduce((sum, layer) => sum + layer.count, 0);
    
    // Update insights
    setInsights([
      { title: 'Total Visible Features', value: totalVisibleFeatures },
      // { title: 'Average Area', value: 0 }, // You can update this when you implement calculateAverageArea
    ]);
  };

  return (
    <div ref={navbarRef}>
      <div className="relative flex">
        <Sidebar
          onToggleSidebar={setSidebarOpen}
          onFileUpload={handleFileUpload}
          layers={layers}
          onLayerSettingChange={handleLayerSettingChange}
          onRemoveLayer={handleLayerRemove}
          onOptionChange={handleOptionChange}
          options={options}
          insights={insights}
          layerCounts = {layerCounts}
          onPopoutInsights={() => setShowPopoutInsights(true)}
        />
      </div>
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`} style={{ height: mapHeight }}>
        {MAPBOX_ACCESS_TOKEN ?(
       <>
       <MapView
          initialViewState={INITIAL_VIEW_STATE}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle={mapStyle}
          layers={layers}
          spatialIndex={spatialIndex}
          onViewStateChange={setViewport}
          onStyleChange={setMapStyle}
          sidebarOpen={sidebarOpen}
          onLayerCountsUpdate={handleLayerCountsUpdate}
        />
        {showPopoutInsights && (
          <PopoutInsights
            layerCounts={layerCounts.filter(layerCount => 
              layers.find(layer => layer.id === layerCount.id && layer.visible)
            )}
            onClose={() => setShowPopoutInsights(false)}
          />
        )}
       </>
        ) : (
          <div> Mapbox access token is missing. Please check environment variables. </div>
        )} 
      </div>
    </div>
  );
};

export default MapPage;