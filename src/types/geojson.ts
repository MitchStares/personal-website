// src/types/geojson.ts

import { FeatureCollection, Feature, Geometry, GeoJsonProperties } from 'geojson';

export interface CRS {
  type: string;
  properties: {
    name: string;
  };
}

export interface CustomFeatureCollection extends FeatureCollection {
  crs?: CRS;
}

export interface CustomFeature extends Feature {
  crs?: CRS;
}

export type CustomGeometry = Geometry;
export type CustomGeoJsonProperties = GeoJsonProperties;