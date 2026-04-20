/**
 * Gets the place name from latitude and longitude
 * @param {number} lat - The latitude
 * @param {number} lng - The longitude
 * @returns {Promise<string>} The place name
 */
export const getPlaceName = async (lat, lng) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject("Geocoder failed due to: " + status);
      }
    });
  });
};
