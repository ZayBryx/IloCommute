import { TransferRoute } from "@/types";
import RenderSegment from "./RenderSegment";
import React from "react";

interface DisplayTransferRouteProps {
  transferRoute: TransferRoute;
  currentStep: number;
  navigating: boolean;
}

const DisplayTransferRoute = ({
  transferRoute,
  currentStep,
  navigating,
}: DisplayTransferRouteProps) => {
  const {
    walkToPickup,
    firstJeepney,
    transferWalk,
    secondJeepney,
    walkFromDropoff,
  } = transferRoute.segments;

  return (
    <>
      <RenderSegment
        polyline={walkToPickup.polyline}
        color="#4A89F3"
        isWalking={true}
        origin={walkToPickup.origin}
        destination={walkToPickup.destination}
        isStart={true}
        routeColor={transferRoute.routes[0].routeColor}
        secondaryRouteColor={transferRoute.routes[1].routeColor}
        isFirstJeepney={true}
        opacity={navigating ? (currentStep === 0 ? 1 : 0.2) : 1}
        zIndex={navigating ? (currentStep === 0 ? 2 : 0) : 1}
      />

      <RenderSegment
        polyline={firstJeepney.polyline}
        color={transferRoute.routes[0].routeColor}
        isWalking={false}
        origin={firstJeepney.origin}
        destination={firstJeepney.destination}
        routeColor={transferRoute.routes[0].routeColor}
        secondaryRouteColor={transferRoute.routes[1].routeColor}
        isFirstJeepney={true}
        opacity={navigating ? (currentStep === 1 ? 1 : 0.2) : 1}
        zIndex={navigating ? (currentStep === 1 ? 2 : 0) : 1}
      />

      <RenderSegment
        polyline={transferWalk.polyline}
        color="#4A89F3"
        isWalking={true}
        origin={transferWalk.origin}
        destination={transferWalk.destination}
        routeColor={transferRoute.routes[0].routeColor}
        secondaryRouteColor={transferRoute.routes[1].routeColor}
        opacity={navigating ? (currentStep === 2 ? 1 : 0.2) : 1}
        zIndex={navigating ? (currentStep === 2 ? 2 : 0) : 1}
      />

      <RenderSegment
        polyline={secondJeepney.polyline}
        color={transferRoute.routes[1].routeColor}
        isWalking={false}
        origin={secondJeepney.origin}
        destination={secondJeepney.destination}
        routeColor={transferRoute.routes[0].routeColor}
        secondaryRouteColor={transferRoute.routes[1].routeColor}
        opacity={navigating ? (currentStep === 3 ? 1 : 0.2) : 1}
        zIndex={navigating ? (currentStep === 3 ? 2 : 0) : 1}
      />

      <RenderSegment
        polyline={walkFromDropoff.polyline}
        color="#4A89F3"
        isWalking={true}
        origin={walkFromDropoff.origin}
        destination={walkFromDropoff.destination}
        isEnd={true}
        routeColor={transferRoute.routes[0].routeColor}
        secondaryRouteColor={transferRoute.routes[1].routeColor}
        opacity={navigating ? (currentStep === 4 ? 1 : 0.2) : 1}
        zIndex={navigating ? (currentStep === 4 ? 2 : 0) : 1}
      />
    </>
  );
};

export default DisplayTransferRoute;
