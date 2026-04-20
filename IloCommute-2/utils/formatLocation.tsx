interface Location {
    lat: number;
    lng: number;
  }
const formatLocation = (location: Location) => {

  return { latitude: location.lat, longitude: location.lng };
};

export default formatLocation
