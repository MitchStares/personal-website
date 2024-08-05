import * as turf from '@turf/turf';
import { WebMercatorViewport } from '@deck.gl/core';
import RBush from 'rbush';

interface Layer {
  id: string;
  data: {
    features: any[];
  };
  visible: boolean;
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  width: number;
  height: number;
}
interface RBushItem {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    feature: any;
  }
export const calculateAverageArea = (
  layers: Layer[],
  viewState: ViewState,
  spatialIndex: RBush<RBushItem>
): number => {
  // Create a viewport from the current view state
  const viewport = new WebMercatorViewport(viewState);
  const bounds = viewport.getBounds();
  const viewportBbox = turf.bboxPolygon(bounds);

  let totalArea = 0;
  let visiblePolygonCount = 0;

  // Search for features in the current viewport
  const viewportFeatures = spatialIndex.search({
    minX: bounds[0],
    minY: bounds[1],
    maxX: bounds[2],
    maxY: bounds[3]
  });

  layers.forEach(layer => {
    if (layer.visible) {
      const layerFeatures = viewportFeatures.filter(item => 
        item.feature.properties.layerId === layer.id &&
        (item.feature.geometry.type === 'Polygon' || item.feature.geometry.type === 'MultiPolygon')
      );

      layerFeatures.forEach(item => {
        const feature = item.feature;
        if (turf.booleanIntersects(feature, viewportBbox)) {
          const area = turf.area(feature);
          totalArea += area;
          visiblePolygonCount++;
        }
      });
    }
  });

  return visiblePolygonCount > 0 ? totalArea / visiblePolygonCount : 0;
};