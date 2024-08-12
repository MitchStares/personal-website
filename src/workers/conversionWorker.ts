/* eslint-disable no-restricted-globals */
// src/workers/conversionWorker.ts
import { CustomFeatureCollection, CustomFeature, CRS } from '../types/geojson';
import proj4 from 'proj4';
import * as shapefile from 'shapefile';
import { parse } from 'papaparse';
import JSZip from 'jszip';

const webMercator = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs';

const ctx: Worker = self as any;

ctx.addEventListener('message', async (event: MessageEvent) => {
  const { file, fileType } = event.data;
  
  try {
    let geoJSON: CustomFeatureCollection;
    switch (fileType) {
      case 'geojson':
      case 'json':
        geoJSON = await handleGeoJSON(file);
        break;
      case 'csv':
        geoJSON = await handleCSV(file);
        break;
      case 'zip':
        geoJSON = await handleShapefile(file);
        break;
      default:
        throw new Error('Unsupported file format');
    }
    
    ctx.postMessage({ geoJSON, success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      ctx.postMessage({ error: error.message, success: false });
    } else {
      ctx.postMessage({ error: String(error), success: false });
    }
  }
});

async function handleGeoJSON(file: File): Promise<CustomFeatureCollection> {
  const text = await file.text();
  const geoJSON = JSON.parse(text) as CustomFeatureCollection;
  return reprojectGeoJSON(geoJSON);
}

async function handleCSV(file: File): Promise<CustomFeatureCollection> {
  const text = await file.text();
  return convertCSVToGeoJSON(text);
}

async function handleShapefile(file: File): Promise<CustomFeatureCollection> {
  const zip = new JSZip();
  const zipContents = await zip.loadAsync(file);

  const shpFile = Object.values(zipContents.files).find(f => f.name.endsWith('.shp'));
  const dbfFile = Object.values(zipContents.files).find(f => f.name.endsWith('.dbf'));
  const prjFile = Object.values(zipContents.files).find(f => f.name.endsWith('.prj'));

  if (!shpFile || !dbfFile) {
    throw new Error('Invalid shapefile: missing .shp or .dbf file');
  }

  const shpBuffer = await shpFile.async('arraybuffer');
  const dbfBuffer = await dbfFile.async('arraybuffer');

  let sourceCRS = 'EPSG:4326'; // Default to WGS84
  if (prjFile) {
    const prjContent = await prjFile.async('text');
    sourceCRS = prjContent.trim();
  }

  const source = await shapefile.open(shpBuffer, dbfBuffer);
  const features: GeoJSON.Feature[] = [];

  let result;
  while ((result = await source.read()) && !result.done) {
    features.push(result.value);
  }

  const geoJSON: CustomFeatureCollection = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: sourceCRS,
      },
    },
    features,
  };

  return reprojectGeoJSON(geoJSON);
}

function reprojectGeoJSON(geoJSON: CustomFeatureCollection): CustomFeatureCollection {
  const sourceCRS = geoJSON.crs?.properties?.name || 'EPSG:4326';
  
  if (sourceCRS === 'EPSG:3857') {
    return geoJSON; // Already in Web Mercator
  }

  const reprojectPoint = (coords: number[]): number[] => {
    const [x, y] = proj4(sourceCRS, webMercator, coords);
    return [x, y];
  };

  const reprojectFeature = (feature: CustomFeature): CustomFeature => {
    const geometry = feature.geometry;
    let newCoordinates: any;

    switch (geometry.type) {
      case 'Point':
        newCoordinates = reprojectPoint(geometry.coordinates);
        break;
      case 'LineString':
      case 'MultiPoint':
        newCoordinates = geometry.coordinates.map(reprojectPoint);
        break;
      case 'Polygon':
      case 'MultiLineString':
        newCoordinates = geometry.coordinates.map((line: number[][]) => line.map(reprojectPoint));
        break;
      case 'MultiPolygon':
        newCoordinates = geometry.coordinates.map((polygon: number[][][]) => polygon.map(line => line.map(reprojectPoint)));
        break;
      default:
        throw new Error(`Unsupported geometry type: ${geometry.type}`);
    }

    return {
      ...feature,
      geometry: {
        ...geometry,
        coordinates: newCoordinates,
      },
    };
  };

  return {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:3857',
      },
    },
    features: geoJSON.features.map(reprojectFeature),
  };
}

function convertCSVToGeoJSON(csvText: string): CustomFeatureCollection {
  const { data } = parse(csvText, { header: true });
  const features: GeoJSON.Feature[] = data.map((row: any) => {
    const lat = parseFloat(row.latitude || row.lat);
    const lon = parseFloat(row.longitude || row.lon || row.lng);

    if (isNaN(lat) || isNaN(lon)) {
      throw new Error('CSV must contain latitude and longitude columns');
    }

    const [x, y] = proj4('EPSG:4326', webMercator, [lon, lat]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [x, y],
      },
      properties: row,
    };
  });

  return {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:3857',
      },
    },
    features,
  };
}