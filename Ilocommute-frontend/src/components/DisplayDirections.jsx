import { useMemo, useEffect } from "react";
import { useAtomValue, useAtom } from "jotai";
import { DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import {
  inBoundRoutesAtom,
  outBoundRoutesAtom,
  inboundResponseAtom,
  showInboundAtom,
  showOutboundAtom,
  outboundResponseAtom,
} from "../atoms";

const DisplayDirections = () => {
  const inbound = useAtomValue(inBoundRoutesAtom);
  const outbound = useAtomValue(outBoundRoutesAtom);

  const showInbound = useAtomValue(showInboundAtom);
  const showOutbound = useAtomValue(showOutboundAtom);

  const [inboundResponse, setInboundResponse] = useAtom(inboundResponseAtom);
  const [outboundResponse, setOutboundResponse] = useAtom(outboundResponseAtom);

  const validateRoutes = (routes) => {
    return routes.filter(
      (route) =>
        route.location &&
        route.location.lat !== null &&
        route.location.lng !== null
    );
  };

  const inboundOptions = useMemo(() => {
    const validInbound = validateRoutes(inbound);
    if (validInbound.length < 2) {
      setInboundResponse(null);
      return null;
    }

    const sortedInbound = [...validInbound].sort((a, b) => a.order - b.order);
    const waypoints = sortedInbound.slice(1, -1).map((wp) => ({
      location: wp.location,
      stopover: true,
    }));

    return {
      origin: sortedInbound[0].location,
      destination: sortedInbound[sortedInbound.length - 1].location,
      waypoints,
      travelMode: "DRIVING",
    };
  }, [inbound, setInboundResponse]);

  const outboundOptions = useMemo(() => {
    const validOutbound = validateRoutes(outbound);
    if (validOutbound.length < 2) {
      setOutboundResponse(null);
      return null;
    }

    const sortedOutbound = [...validOutbound].sort((a, b) => a.order - b.order);
    const waypoints = sortedOutbound.slice(1, -1).map((wp) => ({
      location: wp.location,
      stopover: true,
    }));

    return {
      origin: sortedOutbound[0].location,
      destination: sortedOutbound[validOutbound.length - 1].location,
      waypoints,
      travelMode: "DRIVING",
    };
  }, [outbound, setOutboundResponse]);

  useEffect(() => {
    if (validateRoutes(inbound).length >= 2) {
      setInboundResponse(null);
    }
  }, [inbound, setInboundResponse]);

  useEffect(() => {
    if (validateRoutes(outbound).length >= 2) {
      setOutboundResponse(null);
    }
  }, [outbound, setOutboundResponse]);

  const handleInboundCallback = (response) => {
    if (response && response.status === "OK") {
      setInboundResponse(response);
    } else {
      console.error("Inbound directions request failed: ", response?.status);
    }
  };

  const handleOutboundCallback = (response) => {
    if (response && response.status === "OK") {
      setOutboundResponse(response);
    } else {
      console.error("Outbound directions request failed: ", response?.status);
    }
  };
  return (
    <>
      {/* Inbound Directions */}
      {inbound.length > 1 && !inboundResponse && inboundOptions && (
        <DirectionsService
          options={inboundOptions}
          callback={handleInboundCallback}
        />
      )}
      {inboundResponse && showInbound && (
        <DirectionsRenderer
          options={{
            directions: inboundResponse,
            suppressMarkers: false,
            preserveViewport: true,
          }}
        />
      )}

      {/* Outbound Directions */}
      {outbound.length > 1 && !outboundResponse && outboundOptions && (
        <DirectionsService
          options={outboundOptions}
          callback={handleOutboundCallback}
        />
      )}
      {outboundResponse && showOutbound && (
        <DirectionsRenderer
          options={{
            directions: outboundResponse,
            suppressMarkers: false,
            preserveViewport: true,
            polylineOptions: { strokeColor: "red" },
          }}
        />
      )}
    </>
  );
};

export default DisplayDirections;
