import { Polyline, Marker } from "react-native-maps";
import React from "react";
import { RouteMapDisplayProp } from "@/types";

const RouteMapDisplay = ({
  route = null,
  showInBound = false,
  showOutBound = false,
}: RouteMapDisplayProp) => {
  return (
    <>
      {showInBound && route && route.decodedPoints?.inBoundPointsDecoded && (
        <Polyline
          coordinates={route.decodedPoints.inBoundPointsDecoded}
          strokeColor="#0096FF"
          strokeWidth={5}
        />
      )}

      {showOutBound && route && route.decodedPoints?.outBoundPointsDecoded && (
        <Polyline
          coordinates={route.decodedPoints.outBoundPointsDecoded}
          strokeColor="#EE4B2B"
          strokeWidth={5}
        />
      )}

      {/* display marker */}
    </>
  );
};

export default RouteMapDisplay;
