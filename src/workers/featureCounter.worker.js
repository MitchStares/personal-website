/* eslint-disable no-restricted-globals */
// featureCounter.worker.js
import * as turf from '@turf/turf';

self.onmessage = function(e) {
  const { viewportBounds, features, layerId, attributeCounters } = e.data;
  
  const viewportBbox = turf.bboxPolygon(viewportBounds);
  
  const visibleFeatures = features.filter(feature => {
    switch (feature.geometry.type) {
      case "Point":
        return true;
      case "Polygon":
      case "MultiPolygon":
        return turf.booleanIntersects(feature, viewportBbox);
      case "LineString":
      case "MultiLineString":
        return turf.booleanCrosses(feature, viewportBbox) || turf.booleanWithin(feature, viewportBbox);
      default:
        return false;
    }
  });

  const layerCount = { id: layerId, count: visibleFeatures.length };

  const attributeCounts = attributeCounters.map(counter => {
    const counts = {};
    visibleFeatures.forEach(feature => {
      const value = feature.properties[counter.attribute];
      counts[value] = (counts[value] || 0) + 1;
    });
    return { id: counter.id, counts };
  });

  self.postMessage({ layerCount, attributeCounts });
};