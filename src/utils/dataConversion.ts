// src/utils/dataConversion.ts

import { CustomFeatureCollection } from '../types/geojson';

export async function convertToGeoJSON(file: File): Promise<CustomFeatureCollection> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/conversionWorker.ts', import.meta.url));

    worker.onmessage = (event: MessageEvent) => {
      if (event.data.success) {
        resolve(event.data.geoJSON);
      } else {
        reject(new Error(event.data.error));
      }
      worker.terminate();
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage({ file, fileType: fileExtension });
  });
}