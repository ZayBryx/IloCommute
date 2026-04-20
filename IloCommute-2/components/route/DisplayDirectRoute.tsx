import { DirectRoute } from "@/types";
import RenderSegment from "./RenderSegment";
import React from "react";

interface DisplayDirectRouteProps {
  directRoute: DirectRoute;
  currentStep: number;
  navigating: boolean;
}

const DisplayDirectRoute = ({
  directRoute,
  currentStep,
  navigating,
}: DisplayDirectRouteProps) => {
  const { walkToPickup, jeepneyPath, walkFromDropoff } = directRoute.segments;

  return (
    <>
      <RenderSegment
        polyline={walkToPickup.polyline}
        color="#4A89F3"
        isWalking={true}
        origin={walkToPickup.origin}
        destination={walkToPickup.destination}
        isStart={true}
        routeColor={directRoute.route.routeColor}
        opacity={navigating ? (currentStep === 0 ? 1 : 0.2) : 1}
        zIndex={navigating ? (currentStep === 0 ? 2 : 0) : 1}
      />

      <RenderSegment
        polyline={jeepneyPath.polyline}
        color={directRoute.route.routeColor}
        isWalking={false}
        origin={jeepneyPath.origin}
        destination={jeepneyPath.destination}
        routeColor={directRoute.route.routeColor}
        opacity={navigating ? (currentStep === 1 ? 1 : 0.2) : 1}
        zIndex={navigating ? (currentStep === 1 ? 2 : 0) : 1}
      />

      <RenderSegment
        polyline={walkFromDropoff.polyline}
        color="#4A89F3"
        isWalking={true}
        origin={walkFromDropoff.origin}
        destination={walkFromDropoff.destination}
        isEnd={true}
        routeColor={directRoute.route.routeColor}
        opacity={navigating ? (currentStep === 2 ? 1 : 0.2) : 1}
        zIndex={navigating ? (currentStep === 2 ? 2 : 0) : 1}
      />
    </>
  );
};

export default DisplayDirectRoute;
