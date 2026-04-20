import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Sidebar, Spinner } from "../components";
import axios from "axios";
import { defaultMapConfig } from "../config/googleMapsConfig";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 10.7202,
  lng: 122.5621,
};

const Stops = () => {
  const [markers, setMarkers] = useState([]);
  const [markerState, setMarkerState] = useState({ isPlacing: false });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapTypeId, setMapTypeId] = useState("satellite");
  const [showLabels, setShowLabels] = useState(true);
  const streetViewRef = useRef(null);

  const mapOptions = useMemo(() => {
    return {
      zoomControl: true,
      streetViewControl: true,
      mapTypeControl: true,
      fullScreenControl: true,
      mapTypeId: mapTypeId,
      styles: showLabels
        ? []
        : [
            {
              featureType: "all",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
    };
  }, [mapTypeId, showLabels]);

  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript(defaultMapConfig);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    streetViewRef.current = map.getStreetView();
  }, []);

  const enableMarker = useCallback(() => {
    setMarkerState({ isPlacing: true });

    if (mapRef.current) {
      mapRef.current.setOptions({ draggableCursor: "crosshair" });
    }
  }, []);

  const disableMarker = useCallback(() => {
    setMarkerState({ isPlacing: false });

    if (mapRef.current) {
      mapRef.current.setOptions({ draggableCursor: "" });
    }
  }, []);

  const fetchMarkers = useCallback(async () => {
    try {
      const response = await axios.get("/stop");
      setMarkers(response.data);
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  }, []);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  const addMarker = useCallback(
    async (event) => {
      if (!markerState.isPlacing) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const location = { lat, lng };

      try {
        const response = await axios.post("/stop", { location });
        setMarkers((prev) => [...prev, response.data]);
      } catch (error) {
        console.error("Error adding marker:", error);
      }

      disableMarker();
    },
    [markerState, disableMarker]
  );

  const setCenterAndZoom = useCallback((position, zoom) => {
    mapRef.current.setCenter(position);
    mapRef.current.setZoom(zoom);
  }, []);

  const handleDeleteMarker = useCallback(async (id) => {
    try {
      await axios.delete(`/stop/${id}`);
      setMarkers((prev) => prev.filter((marker) => marker._id !== id));
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  }, []);

  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleMapTypeChange = useCallback((type) => {
    setMapTypeId(type);
  }, []);

  const toggleLabels = useCallback(() => {
    setShowLabels((prev) => !prev);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <Spinner />;

  return (
    <div className="flex flex-col container mx-auto min-w-full relative">
      <Sidebar
        markers={markers}
        setCenterAndZoom={setCenterAndZoom}
        enableMarker={enableMarker}
        onMapTypeChange={handleMapTypeChange}
        onToggleLabels={toggleLabels}
        showLabels={showLabels}
        mapTypeId={mapTypeId}
      />
      <div className="flex-1">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
          options={mapOptions}
          onLoad={onMapLoad}
          onClick={addMarker}
        >
          {markers &&
            markers.map(
              (marker) =>
                marker.location.lat &&
                marker.location.lng && (
                  <Marker
                    key={marker._id}
                    position={{
                      lat: marker.location.lat,
                      lng: marker.location.lng,
                    }}
                    onClick={() => handleMarkerClick(marker)}
                  >
                    {selectedMarker === marker && (
                      <InfoWindow
                        position={{
                          lat: marker.location.lat,
                          lng: marker.location.lng,
                        }}
                        onCloseClick={handleCloseInfoWindow}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <button
                            onClick={() => handleDeleteMarker(marker._id)}
                            style={{
                              backgroundColor: "#d9534f",
                              color: "white",
                              border: "none",
                              padding: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                )
            )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Stops;
