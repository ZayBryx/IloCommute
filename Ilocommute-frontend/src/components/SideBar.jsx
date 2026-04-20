import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { FaTrashAlt, FaMapMarkerAlt, FaPlus, FaSearch } from "react-icons/fa";

const Sidebar = ({ markers, setCenterAndZoom, enableMarker }) => {
  const autocompleteRef = useRef(null);

  const bounds = new window.google.maps.LatLngBounds(
    new window.google.maps.LatLng(10.6202, 122.4621), // Southwest corner
    new window.google.maps.LatLng(10.8202, 122.6621) // Northeast corner
  );

  const handlePlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const position = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCenterAndZoom(position, 20);
    }
  };

  return (
    <div className="mt-16 sm:m-0 w-full">
      <div className="bg-white h-16 p-3 flex items-center gap-3 sm:max-w-lg">
        <button className="text-gray-600">
          <FaSearch className="text-xl" />
        </button>
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceSelected}
          className="flex-grow"
          options={{ bounds, strictBounds: true }}
        >
          <input
            type="text"
            placeholder="Search for a place..."
            className="text-sm sm:text-base p-1 w-full border-b border-gray-300 focus:outline-none focus:border-green-500"
          />
        </Autocomplete>
        <button
          className="bg-green-600 text-white text-xs sm:text-base flex items-center gap-1 px-4 py-3 rounded-lg transition duration-200 hover:bg-green-500 focus:outline-none"
          onClick={() => enableMarker()}
        >
          <FaMapMarkerAlt className="text-lg" />
          <span className="hidden sm:block">Add a Stop</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
