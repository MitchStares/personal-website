/* eslint-disable no-restricted-globals */
import * as shp from 'shpjs';
import * as Papa from 'papaparse';
// import * as parquet from 'parquetjs-lite';

self.onmessage = async function(e) {
  const { file, type } = e.data;
  let result;

  try {
    switch (type) {
      case 'shapefile':
        result = await convertShapefile(file);
        break;
      case 'csv':
        result = await convertCSV(file);
        break;
      case 'geojson':
        result = await convertGeoJSON(file);
        break;
      // case 'parquet':
      //   result = await convertParquet(file);
      //   break;
      default:
        throw new Error('Unsupported file type');
    }

    self.postMessage({ status: 'success', data: result });
  } catch (error) {
    self.postMessage({ status: 'error', message: error.message });
  }
};

async function convertShapefile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const geojson = await shp(arrayBuffer);
  return geojson;
}

async function convertCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const geojson = {
          type: 'FeatureCollection',
          features: results.data.map((row) => ({
            type: 'Feature',
            properties: row,
            geometry: {
              type: 'Point',
              coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
            }
          }))
        };
        resolve(geojson);
      },
      error: (error) => reject(error),
      header: true,
      dynamicTyping: true
    });
  });
}

async function convertGeoJSON(file) {
  const text = await file.text();
  return JSON.parse(text);
}

// Uncomment and implement when ready to support Parquet
// async function convertParquet(file) {
//   // Implementation for Parquet conversion
// }
