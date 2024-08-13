import React, { useCallback, useEffect, useMemo} from "react";
import DeckGL from "@deck.gl/react";
import StaticMap from "react-map-gl";
import { COORDINATE_SYSTEM, GeoJsonLayer, WebMercatorViewport } from "deck.gl";
import { ViewStateChangeParameters } from "@deck.gl/core";
import * as turf from "@turf/turf"; //Spatial Calcs
import RBush from "rbush"; // Quick Feature Culling
import debounce from "lodash/debounce"; // Mouse Abuse delay
// import FeatureCounter from "./FeatureCounter";
import BaseLayerSelector from "./BaseLayerSelector";
import { RBushItem, LayerCount } from "../types";

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
}) => {
  // const [visibleFeatureCount, setVisibleFeatureCount] = React.useState(0);

  const countVisibleFeatures = useCallback(
    (viewportBounds: [number, number, number, number]): LayerCount[] => {
      if (!spatialIndex) return [];

      const viewportFeatures = spatialIndex.search({
        minX: viewportBounds[0],
        minY: viewportBounds[1],
        maxX: viewportBounds[2],
        maxY: viewportBounds[3],
      });

      const viewportBbox = turf.bboxPolygon(viewportBounds);

      //filtering spatialIndex using intersect for polygon and cross or within for line. Point not needed as its a simple calculation
      const counts = layers.map((layer) => {
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

      return counts;
    },
    [spatialIndex, layers]
  );

  // Our mouse abuse function. Waits until 200ms have passed since viewportBounds has been updated.
  const debouncedUpdateVisibleFeatures = useMemo(
    () =>
      debounce((bounds: [number, number, number, number]) => {
        const counts = countVisibleFeatures(bounds);
        onLayerCountsUpdate(counts);
      }, 200),
    [countVisibleFeatures, onLayerCountsUpdate]
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

  //Iterating through the layers array using map() and rendering as geojsonlayers.
  const renderedLayers = useMemo(() => {
    return layers.map((layer) => {
      return new GeoJsonLayer({
        id: layer.id,
        data: layer.data,
        visible: layer.visible,
        filled: true,
        opacity: layer.transparency,
        getFillColor: layer.fillColor,
        stroked: true,
        getLineColor: layer.lineColor,
        lineWidthScale: layer.lineWidth,
        pointRadiusScale: 6,
        getPointRadius: 5,
        pickable: true,
        lineWidthMinPixels: 1,
        lineJointRounded: true,
        lineMiterLimit: 2,
        getRadius: 100,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
      });
    });
  }, [layers]);


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
