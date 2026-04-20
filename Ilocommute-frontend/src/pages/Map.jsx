import { memo, useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api";
import { defaultMapConfig } from "../config/googleMapsConfig";
import { useSetAtom, useAtom } from "jotai";
import {
  mapOptionsAtom,
  getOneRouteAtom,
  clearRouteDataAtom,
  inBoundRoutesAtom,
  outBoundRoutesAtom,
  isPlacingInboundAtom,
  isPlacingOutboundAtom,
  hasChangesAtom,
  isPlacingOutboundStopAtom,
  isPlacingInboundStopAtom,
  showStopsOutboundAtom,
  showStopsInboundAtom,
} from "../atoms";
import {
  MapInput,
  DisplayDirections,
  RouteControl,
  StopsInput,
  StopMarker,
} from "../components";
import { getPlaceName } from "../helper";
import { useForm } from "react-hook-form";

const center = { lat: 10.71999, lng: 122.5599 };
const containerStyle = {
  width: "100%",
  height: "100vh",
  position: "relative",
};
const bounds = {
  north: 11.27,
  south: 10.5,
  east: 122.95,
  west: 122.3,
};

const Map = () => {
  const { id } = useParams();
  const location = useLocation();
  const { isLoaded } = useJsApiLoader(defaultMapConfig);
  const [options, setOptions] = useAtom(mapOptionsAtom);
  const getRoute = useSetAtom(getOneRouteAtom);
  const clearRouteData = useSetAtom(clearRouteDataAtom);
  const setHasChanges = useSetAtom(hasChangesAtom);

  const [map, setMap] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);

  const [inboundRoutes, setInboundRoutes] = useAtom(inBoundRoutesAtom);
  const [outboundRoutes, setOutboundRoutes] = useAtom(outBoundRoutesAtom);

  const [isPlacingInbound, setIsPlacingInbound] = useAtom(isPlacingInboundAtom);
  const [isPlacingOutbound, setIsPlacingOutbound] = useAtom(
    isPlacingOutboundAtom
  );

  const [isPlacingInboundStop, setIsPlacingInboundStop] = useAtom(
    isPlacingInboundStopAtom
  );
  const [isPlacingOutboundStop, setIsPlacingOutboundStop] = useAtom(
    isPlacingOutboundStopAtom
  );

  const [showStopsOutbound] = useAtom(showStopsOutboundAtom);
  const [showStopsInbound] = useAtom(showStopsInboundAtom);

  const { setValue } = useForm();

  useEffect(() => {
    clearRouteData();

    if (id) {
      getRoute(id);
    }
  }, [id, getRoute, clearRouteData]);

  const onLoad = useCallback(function callback(map) {
    if (!map) return;

    const googleBounds = new window.google.maps.LatLngBounds();
    googleBounds.extend({ lat: bounds.north, lng: bounds.east });
    googleBounds.extend({ lat: bounds.south, lng: bounds.west });
    map.fitBounds(googleBounds);

    setMap(map);
  }, []);

  useEffect(() => {
    if (
      isPlacingInbound.placing ||
      isPlacingOutbound.placing ||
      isPlacingInboundStop.placing ||
      isPlacingOutboundStop.placing
    ) {
      setOptions((prev) => ({ ...prev, draggableCursor: "crosshair" }));
    } else {
      setOptions((prev) => ({ ...prev, draggableCursor: "default" }));
    }
  }, [
    isPlacingInbound,
    isPlacingOutbound,
    setOptions,
    isPlacingInboundStop,
    isPlacingOutboundStop,
  ]);

  const onMouseMove = useCallback((e) => {
    setMousePosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(
    async (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      try {
        const placeName = await getPlaceName(lat, lng);

        if (isPlacingOutbound.placing) {
          const updatedOutboundRoutes = [...outboundRoutes];
          updatedOutboundRoutes[isPlacingOutbound.index] = {
            ...updatedOutboundRoutes[isPlacingOutbound.index],
            location: { lat, lng },
            name: placeName,
          };

          setOutboundRoutes(updatedOutboundRoutes);

          setValue(`outbound.${isPlacingOutbound.index}.location.lat`, lat);
          setValue(`outbound.${isPlacingOutbound.index}.location.lng`, lng);
          setValue(`outbound.${isPlacingOutbound.index}.name`, placeName);

          setIsPlacingOutbound({ placing: false, index: null });
          setHasChanges(true);
        }

        if (isPlacingInbound.placing) {
          const updatedInboundRoutes = [...inboundRoutes];
          updatedInboundRoutes[isPlacingInbound.index] = {
            ...updatedInboundRoutes[isPlacingInbound.index],
            location: { lat, lng },
            name: placeName,
          };

          setInboundRoutes(updatedInboundRoutes);

          setValue(`inbound.${isPlacingInbound.index}.location.lat`, lat);
          setValue(`inbound.${isPlacingInbound.index}.location.lng`, lng);
          setValue(`inbound.${isPlacingInbound.index}.name`, placeName);

          setIsPlacingInbound({ placing: false, index: null });
          setHasChanges(true);
        }

        if (isPlacingOutboundStop.placing) {
          const updatedOutboundRoutes = [...outboundRoutes];
          const waypointIndex = isPlacingOutboundStop.waypointIndex;
          const stopIndex = isPlacingOutboundStop.stopIndex;
          const stopOrder = isPlacingOutboundStop.stopOrder;

          updatedOutboundRoutes[waypointIndex].stops[stopIndex] = {
            ...updatedOutboundRoutes[waypointIndex].stops[stopIndex],
            location: { lat, lng },
            name: placeName,
            order: stopOrder,
          };

          setOutboundRoutes(updatedOutboundRoutes);

          setValue(
            `outbound.${waypointIndex}.stops.${stopIndex}.location.lat`,
            lat
          );
          setValue(
            `outbound.${waypointIndex}.stops.${stopIndex}.location.lng`,
            lng
          );
          setValue(
            `outbound.${waypointIndex}.stops.${stopIndex}.name`,
            placeName
          );
          setValue(
            `outbound.${waypointIndex}.stops.${stopIndex}.order`,
            stopOrder
          );

          setIsPlacingOutboundStop({
            placing: false,
            waypointType: null,
            waypointIndex: null,
            stopIndex: null,
            stopOrder: null,
          });
          setHasChanges(true);
        }

        if (isPlacingInboundStop.placing) {
          const updatedInboundRoutes = [...inboundRoutes];
          const waypointIndex = isPlacingInboundStop.waypointIndex;
          const stopIndex = isPlacingInboundStop.stopIndex;
          const stopOrder = isPlacingInboundStop.stopOrder;

          updatedInboundRoutes[waypointIndex].stops[stopIndex] = {
            ...updatedInboundRoutes[waypointIndex].stops[stopIndex],
            location: { lat, lng },
            name: placeName,
            order: stopOrder,
          };

          setInboundRoutes(updatedInboundRoutes);

          setValue(
            `inbound.${waypointIndex}.stops.${stopIndex}.location.lat`,
            lat
          );
          setValue(
            `inbound.${waypointIndex}.stops.${stopIndex}.location.lng`,
            lng
          );
          setValue(
            `inbound.${waypointIndex}.stops.${stopIndex}.name`,
            placeName
          );
          setValue(
            `inbound.${waypointIndex}.stops.${stopIndex}.order`,
            stopOrder
          );

          setIsPlacingInboundStop({
            placing: false,
            waypointType: null,
            waypointIndex: null,
            stopIndex: null,
            stopOrder: null,
          });
          setHasChanges(true);
        }
      } catch (error) {
        console.error("ERROR: ", error);
      }
    },
    [
      setIsPlacingInbound,
      setIsPlacingOutbound,
      setInboundRoutes,
      setOutboundRoutes,
      isPlacingInbound,
      isPlacingOutbound,
      setValue,
      inboundRoutes,
      outboundRoutes,
      setHasChanges,
      setIsPlacingInboundStop,
      setIsPlacingOutboundStop,
      isPlacingInboundStop,
      isPlacingOutboundStop,
    ]
  );

  return (
    <div className="relative w-full h-screen">
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onMouseMove={onMouseMove}
          options={options}
          onClick={handleMapClick}
          mapTypeId={import.meta.env.VITE_MAP_ID}
          className="w-full h-full"
        >
          <>
            {showStopsOutbound.isShown && showStopsOutbound.waypoint && (
              <StopMarker stops={showStopsOutbound.waypoint.stops} />
            )}

            {showStopsInbound.isShown && showStopsInbound.waypoint && (
              <StopMarker stops={showStopsInbound.waypoint.stops} />
            )}

            {mousePosition && (
              <div className="pointer-events-none">
                <Circle
                  center={mousePosition}
                  radius={150}
                  options={{
                    fillColor: "#FF000050",
                    fillOpacity: 0.1,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    clickable: false,
                    zIndex: 1,
                  }}
                />

                <Circle
                  center={mousePosition}
                  radius={200}
                  options={{
                    fillColor: "#FF000050",
                    fillOpacity: 0.1,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    clickable: false,
                    zIndex: 1,
                  }}
                />

                <Circle
                  center={mousePosition}
                  radius={250}
                  options={{
                    fillColor: "#FF000050",
                    fillOpacity: 0.1,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    clickable: false,
                    zIndex: 1,
                  }}
                />

                <Circle
                  center={mousePosition}
                  radius={300}
                  options={{
                    fillColor: "#FF000050",
                    fillOpacity: 0.1,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    clickable: false,
                    zIndex: 1,
                  }}
                />
              </div>
            )}
            <DisplayDirections />
          </>
        </GoogleMap>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div className="relative h-full w-full">
          <div className="pointer-events-auto">
            <MapInput />
          </div>

          <div className="pointer-events-auto">
            <RouteControl />
          </div>

          <div className="pointer-events-auto absolute bottom-4 left-4">
            <StopsInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Map);
