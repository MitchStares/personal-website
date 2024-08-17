import React, { useCallback, useMemo} from "react";
import DeckGL from "@deck.gl/react";
import StaticMap from "react-map-gl";
import { GeoJsonLayer, WebMercatorViewport } from "deck.gl";
import { ViewStateChangeParameters } from "@deck.gl/core";
import * as turf from "@turf/turf"; //Spatial Calcs
import RBush from "rbush"; // Quick Feature Culling
import debounce from "lodash/debounce"; // Mouse Abuse delay
// import FeatureCounter from "./FeatureCounter";
import BaseLayerSelector from "./BaseLayerSelector";
import { RBushItem, LayerCount, AttributeCounter } from "../types";
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { interpolateViridis, interpolatePlasma, interpolateInferno, interpolateMagma, interpolateCividis } from 'd3-scale-chromatic';
import { schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemeSet1, schemeSet2, schemeSet3, schemePastel1, schemePastel2 } from 'd3-scale-chromatic';


//Props coming from MapPage
interface MapViewProps {
  initialViewState: any;
  mapboxAccessToken: string;
  mapStyle: string;
  layers: any[];
  spatialIndex: RBush<RBushItem> | null;
  onViewStateChange: (viewState: any) => void;
  onStyleChange: (style: string) => void;
  sidebarOpen: boolean;
  onLayerCountsUpdate: (counts: LayerCount[]) => void;
  attributeCounters: AttributeCounter[];
  onAttributeCountsUpdate: (counts: { [key: string]: number }[]) => void;
}

const MapView: React.FC<MapViewProps> = ({
  initialViewState,
  mapboxAccessToken,
  mapStyle,
  layers,
  spatialIndex,
  onViewStateChange,
  onStyleChange,
  sidebarOpen,
  onLayerCountsUpdate,
  attributeCounters,
  onAttributeCountsUpdate,
}) => {

  // const [visibleFeatureCount, setVisibleFeatureCount] = React.useState(0);

  const countVisibleFeatures = useCallback(
    (viewportBounds: [number, number, number, number]): [LayerCount[], { [key: string]: number }[]] => {
      if (!spatialIndex) return [[], []];

      const viewportFeatures = spatialIndex.search({
        minX: viewportBounds[0],
        minY: viewportBounds[1],
        maxX: viewportBounds[2],
        maxY: viewportBounds[3],
      });

      const viewportBbox = turf.bboxPolygon(viewportBounds);

    //filtering spatialIndex using intersect for polygon and cross or within for line. Point not needed as its a simple calculation
      const layerCounts = layers.map((layer) => {
        const layerFeatures = viewportFeatures.filter(
          (item) => item.feature.properties.layerId === layer.id
        );
        const visibleCount = layerFeatures.filter((item) => {
          const feature = item.feature;
          switch (feature.geometry.type) {
            case "Point":
              return true;
            case "Polygon":
            case "MultiPolygon":
              return turf.booleanIntersects(feature, viewportBbox);
            case "LineString":
            case "MultiLineString":
              return (
                turf.booleanCrosses(feature, viewportBbox) ||
                turf.booleanWithin(feature, viewportBbox)
              );
            default:
              return false;
          }
        }).length;

        return { id: layer.id, name: layer.name, count: visibleCount };
      });

      // Count attributes for each counter
      const attributeCounts = attributeCounters.map((counter) => {
        const layerFeatures = viewportFeatures.filter(
          (item) => item.feature.properties.layerId === counter.layerId
        );
        const counts: { [key: string]: number } = {};
        layerFeatures.forEach((item) => {
          const value = item.feature.properties[counter.attribute];
          counts[value] = (counts[value] || 0) + 1;
        });
        return counts;
      });

      return [layerCounts, attributeCounts];
    },
    [spatialIndex, layers, attributeCounters]
  );
  // Our mouse abuse function. Waits until 200ms have passed since viewportBounds has been updated.
  const debouncedUpdateVisibleFeatures = useMemo(
    () =>
      debounce((bounds: [number, number, number, number]) => {
        const [layerCounts, attributeCounts] = countVisibleFeatures(bounds);
        onLayerCountsUpdate(layerCounts);
        onAttributeCountsUpdate(attributeCounts);
      }, 200),
    [countVisibleFeatures, onLayerCountsUpdate, onAttributeCountsUpdate]
  );

  //Just collecting viewState from viewport. No need for anythign else.
  const handleViewStateChange = (params: ViewStateChangeParameters<any>) => {
    const newViewport = params.viewState;
    onViewStateChange(newViewport);

    //Convert viewport to webmercator
    const webMercatorViewport = new WebMercatorViewport(newViewport);
    const bounds = webMercatorViewport.getBounds();

    //Handling different outputs from webmercatorviewport so debounce doesnt freak out
    if (
      Array.isArray(bounds) &&
      Array.isArray(bounds[0]) &&
      Array.isArray(bounds[1])
    ) {
      const [[minX, minY], [maxX, maxY]] = bounds;
      debouncedUpdateVisibleFeatures([minX, minY, maxX, maxY]);
    } else if (Array.isArray(bounds) && bounds.length === 4) {
      debouncedUpdateVisibleFeatures(
        bounds as [number, number, number, number]
      );
    } else {
      console.error("Unexpected bounds format:", bounds);
    }
  };


  const getColorFunction = (colorGradient: string) => {
    switch (colorGradient) {
      case 'viridis': return interpolateViridis;
      case 'plasma': return interpolatePlasma;
      case 'inferno': return interpolateInferno;
      case 'magma': return interpolateMagma;
      case 'cividis': return interpolateCividis;
      default: return interpolateViridis;
    }
  };
  const getCategoricalColorScheme = (scheme: string) => {
    switch (scheme) {
      case 'category10': return schemeCategory10;
      case 'accent': return schemeAccent;
      case 'dark2': return schemeDark2;
      case 'paired': return schemePaired;
      case 'set1': return schemeSet1;
      case 'set2': return schemeSet2;
      case 'set3': return schemeSet3;
      case 'pastel1': return schemePastel1;
      case 'pastel2': return schemePastel2;
      default: return schemeCategory10;
    }
  };
  const getColorScale = (layer: any, colorAttribute: string, colorScheme: string) => {
    const values = layer.data.features.map((f: any) => f.properties[colorAttribute]);

    if (values.every((v: any) => typeof v === 'number' && !isNaN(v))) {
      // Numeric data - use continuous color scale
      const min = Math.min(...values);
      const max = Math.max(...values);
      const colorScale = scaleLinear().domain([min, max]).range([0, 1]);
      const colorFunction = getColorFunction(colorScheme || 'viridis');
      return (value: number) => {
        const scaledValue = colorScale(value);
        const color = colorFunction(scaledValue);
        return color.match(/\d+/g)?.map(Number) || [0, 0, 0];
      };
    } else {
      // Categorical data - use ordinal color scale
      const uniqueValues = Array.from(new Set(values)).filter((value): value is string => 
        typeof value === 'string' || typeof value === 'number'
      ).map(String);
      const colorSchemeArray = getCategoricalColorScheme(colorScheme || 'category10');
      const colorScale = scaleOrdinal<string>().domain(uniqueValues).range(colorSchemeArray);
      return (value: string | number) => {
        const color = colorScale(String(value));
        return color.match(/\d+/g)?.map(Number) || [0, 0, 0];
      };
    }
  };

  //Iterating through the layers array using map() and rendering as geojsonlayers.
  const renderedLayers = layers.map((layer) => {
    console.log('Rendering layer:', layer);

    const filteredFeatures = layer.data.features.filter((feature: any) => 
      layer.selectedGeometryType ? feature.geometry.type === layer.selectedGeometryType : true
    );

    let getFillColor, getLineColor;

    if (layer.fillColorAttribute && layer.fillColorAttribute !== '') {
      const fillColorScale = getColorScale(layer, layer.fillColorAttribute, layer.fillColorScheme);
      getFillColor = (f: any) => {
        const value = f.properties[layer.fillColorAttribute];
        return fillColorScale(value);
      };
    } else {
      getFillColor = layer.fillColor;
    }

    if (layer.lineColorAttribute && layer.lineColorAttribute !== '') {
      const lineColorScale = getColorScale(layer, layer.lineColorAttribute, layer.lineColorScheme);
      getLineColor = (f: any) => {
        const value = f.properties[layer.lineColorAttribute];
        return lineColorScale(value);
      };
    } else {
      getLineColor = layer.lineColor;
    }

    return new GeoJsonLayer({
      id: layer.id,
      data: {
        ...layer.data,
        features: filteredFeatures
      },
      visible: layer.visible,
      filled: true,
      opacity: layer.transparency,
      getFillColor,
      stroked: true,
      getLineColor,
      lineWidthScale: layer.lineWidth,
      pointRadiusMinPixels: 5,
      getPointRadius: 100,
      pickable: true,
      // Add these for better line rendering
      lineWidthMinPixels: 1,
      lineJointRounded: true,
      lineMiterLimit: 2,
    });
  });


  return (
    <>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={renderedLayers}
        onViewStateChange={handleViewStateChange}
      >
        <StaticMap
          mapboxAccessToken={mapboxAccessToken}
          mapStyle={mapStyle}
          style={{ height: "100%" }}
        />
      </DeckGL>
      <BaseLayerSelector
        currentStyle={mapStyle}
        onStyleChange={onStyleChange}
        sidebarOpen={sidebarOpen}
      />
      {/* <FeatureCounter layerCounts={layerCounts} /> */}
    </>
  );
};

export default MapView;
