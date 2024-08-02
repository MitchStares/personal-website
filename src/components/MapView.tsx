import React, { useCallback, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import StaticMap from 'react-map-gl';
import { GeoJsonLayer, WebMercatorViewport } from 'deck.gl';
import { ViewStateChangeParameters } from '@deck.gl/core';
import * as turf from '@turf/turf';
import RBush from 'rbush';
import debounce from 'lodash/debounce';
import FeatureCounter from './FeatureCounter';
import BaseLayerSelector from './BaseLayerSelector';

interface MapViewProps {
  initialViewState: any;
  mapboxAccessToken: string;
  mapStyle: string;
  layers: any[];
  spatialIndex: RBush<RBushItem> | null;
  onViewStateChange: (viewState: any) => void;
  onStyleChange: (style: string) => void;
  sidebarOpen: boolean;
}

interface RBushItem {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  feature: any;
}

const MapView: React.FC<MapViewProps> = ({
  initialViewState,
  mapboxAccessToken,
  mapStyle,
  layers,
  spatialIndex,
  onViewStateChange,
  onStyleChange,
  sidebarOpen
}) => {
  const [visibleFeatureCount, setVisibleFeatureCount] = React.useState(0);

  const countVisibleFeatures = useCallback((viewportBounds: [number, number, number, number]) => {
    if (!spatialIndex) return 0;

    const viewportFeatures = spatialIndex.search({
      minX: viewportBounds[0],
      minY: viewportBounds[1],
      maxX: viewportBounds[2],
      maxY: viewportBounds[3]
    });

    const viewportBbox = turf.bboxPolygon(viewportBounds);

    return viewportFeatures.filter(item => {
      const feature = item.feature;
      switch (feature.geometry.type) {
        case 'Point':
          return true;
        case 'Polygon':
        case 'MultiPolygon':
          return turf.booleanIntersects(feature, viewportBbox);
        case 'LineString':
        case 'MultiLineString':
          return turf.booleanCrosses(feature, viewportBbox) || turf.booleanWithin(feature, viewportBbox);
        default:
          return false;
      }
    }).length;
  }, [spatialIndex]);

  const debouncedUpdateVisibleFeatures = useMemo(
    () => debounce((bounds: [number, number, number, number]) => {
      const count = countVisibleFeatures(bounds);
      setVisibleFeatureCount(count);
    }, 200),
    [countVisibleFeatures]
  );

  const handleViewStateChange = (params: ViewStateChangeParameters<any>) => {
    const newViewport = params.viewState;
    onViewStateChange(newViewport);

    const webMercatorViewport = new WebMercatorViewport(newViewport);
    const bounds = webMercatorViewport.getBounds();
  
    if (Array.isArray(bounds) && Array.isArray(bounds[0]) && Array.isArray(bounds[1])) {
      const [[minX, minY], [maxX, maxY]] = bounds;
      debouncedUpdateVisibleFeatures([minX, minY, maxX, maxY]);
    } else if (Array.isArray(bounds) && bounds.length === 4) {
      debouncedUpdateVisibleFeatures(bounds as [number, number, number, number]);
    } else {
      console.error('Unexpected bounds format:', bounds);
    }
  };

  const renderedLayers = layers.map((layer) => (
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
          style={{ height: '100%' }}
        />
      </DeckGL>
      <BaseLayerSelector
        currentStyle={mapStyle}
        onStyleChange={onStyleChange}
        sidebarOpen={sidebarOpen}
      />
      <FeatureCounter count={visibleFeatureCount} />
    </>
  );
};

export default MapView;