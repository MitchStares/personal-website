import { FeatureCollection, Feature, Geometry, GeoJsonProperties } from 'geojson';

export interface CRS {
  type: 'name';
  properties: {
    name: string;
  };
}

export interface CustomFeatureCollection extends Omit<FeatureCollection, 'type'> {
  type: 'FeatureCollection';
  crs?: CRS;
}

export interface CustomFeature extends Omit<Feature, 'type'> {
  type: 'Feature';
  crs?: CRS;
}

export type CustomGeometry = Geometry;
export type CustomGeoJsonProperties = GeoJsonProperties;