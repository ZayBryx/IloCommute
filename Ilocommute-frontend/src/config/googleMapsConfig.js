export const GOOGLE_MAPS_LIBRARIES = ["places", "maps"];

export const defaultMapConfig = {
  id: "google-map-script",
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
  libraries: GOOGLE_MAPS_LIBRARIES,
  version: "weekly",
};
