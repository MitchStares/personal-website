// src/analytics.ts
import ReactGA from "react-ga4";

export const initGA = (measurementId: string) => {
  ReactGA.initialize(measurementId);
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const getPathFromHash = (hash: string) => {
  // Remove the leading '#' if it exists
  return hash.charAt(0) === '#' ? hash.slice(1) : hash;
};