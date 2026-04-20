import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaMapMarkerAlt, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  showStopsOutboundAtom,
  showStopsInboundAtom,
  addStopToRouteOutboundAtom,
  addStopToRouteInboundAtom,
  inBoundRoutesAtom,
  outBoundRoutesAtom,
  isPlacingOutboundStopAtom,
  isPlacingInboundStopAtom,
  hasChangesAtom,
} from "../atoms";

const StopsInput = () => {
  const [showStopsOutbound] = useAtom(showStopsOutboundAtom);
  const [showStopsInbound] = useAtom(showStopsInboundAtom);
  const [, addStopToRouteOutbound] = useAtom(addStopToRouteOutboundAtom);
  const [, addStopToRouteInbound] = useAtom(addStopToRouteInboundAtom);
  const [inBoundRoutes, setInBoundRoutes] = useAtom(inBoundRoutesAtom);
  const [outBoundRoutes, setOutBoundRoutes] = useAtom(outBoundRoutesAtom);
  const [, setIsPlacingOutboundStop] = useAtom(isPlacingOutboundStopAtom);
  const [, setIsPlacingInboundStop] = useAtom(isPlacingInboundStopAtom);
  const setHasChange = useAtomValue(hasChangesAtom);

  // Dynamically derive the waypoint and index
  const currentRoutes = showStopsOutbound.isShown
    ? outBoundRoutes
    : inBoundRoutes;
  const { isShown, index } = showStopsOutbound.isShown
    ? showStopsOutbound
    : showStopsInbound;
  const waypoint = isShown ? currentRoutes[index] : null;

  const handlePlaceStop = (stopIndex, stopOrder) => {
    if (showStopsOutbound.isShown) {
      setIsPlacingOutboundStop({
        placing: true,
        waypointType: "outbound",
        waypointIndex: showStopsOutbound.index,
        stopIndex: stopIndex,
        stopOrder: stopOrder,
      });
    } else {
      setIsPlacingInboundStop({
        placing: true,
        waypointType: "inbound",
        waypointIndex: showStopsInbound.index,
        stopIndex: stopIndex,
        stopOrder: stopOrder,
      });
    }
  };

  const addStop = () => {
    if (!waypoint) return;

    const newStop = {
      name: `Stop ${waypoint.stops.length + 1}`,
      order: waypoint.stops.length + 1,
      routeNo: waypoint.routeNo,
      isOutBound: waypoint.isOutBound,
    };

    if (showStopsOutbound.isShown) {
      addStopToRouteOutbound({ routeIndex: index, stop: newStop });
    } else {
      addStopToRouteInbound({ routeIndex: index, stop: newStop });
    }
    setHasChange(true);
  };

  const reorderStops = (stops, startIndex, endIndex) => {
    const reorderedStops = Array.from(stops); // Make a copy of the stops
    const [removed] = reorderedStops.splice(startIndex, 1); // Remove the stop at startIndex
    reorderedStops.splice(endIndex, 0, removed); // Insert the removed stop at endIndex

    // Swap the orders between the two dragged stops
    const swappedStops = [...reorderedStops];
    const startStop = swappedStops[startIndex];
    const endStop = swappedStops[endIndex];

    // Swap their order values
    swappedStops[startIndex] = { ...startStop, order: endStop.order };
    swappedStops[endIndex] = { ...endStop, order: startStop.order };

    return swappedStops;
  };

  const onDragEnd = (result) => {
    if (!result.destination || !waypoint) return;

    const reorderedStops = reorderStops(
      waypoint.stops,
      result.source.index,
      result.destination.index
    );

    const updateStops = (routes, setter) =>
      setter((prevRoutes) =>
        prevRoutes.map((route, idx) =>
          idx === index ? { ...route, stops: reorderedStops } : route
        )
      );

    if (showStopsOutbound.isShown) {
      updateStops(outBoundRoutes, setOutBoundRoutes);
    } else {
      updateStops(inBoundRoutes, setInBoundRoutes);
    }
  };

  const deleteStop = (stopOrder) => {
    if (!waypoint) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this stop.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the stop with the given order
        const updatedStops = waypoint.stops
          .filter((stop) => stop.order !== stopOrder)
          .map((stop, idx) => ({
            ...stop,
            order: parseFloat((idx + 1) * 0.00001).toFixed(5), // Maintain decimal precision
          }));

        const updateStops = (routes, setter) =>
          setter((prevRoutes) =>
            prevRoutes.map((route, idx) =>
              idx === index ? { ...route, stops: updatedStops } : route
            )
          );

        if (showStopsOutbound.isShown) {
          updateStops(outBoundRoutes, setOutBoundRoutes);
        } else {
          updateStops(inBoundRoutes, setInBoundRoutes);
        }

        Swal.fire("Deleted!", "The stop has been deleted.", "success");
      }
    });
    setHasChange(true);
  };

  const clearStops = (routeType) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete all stops for this route.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const clearAllStops = (setter) =>
          setter((prevRoutes) =>
            prevRoutes.map((route, idx) =>
              idx === index ? { ...route, stops: [] } : route
            )
          );

        if (routeType === "outbound") {
          clearAllStops(setOutBoundRoutes);
        } else if (routeType === "inbound") {
          clearAllStops(setInBoundRoutes);
        }

        Swal.fire("Deleted!", "All stops have been deleted.", "success");
      }
      setHasChange(true);
    });
  };

  return (
    isShown &&
    waypoint && (
      <div className="p-4 bg-gray-100 rounded shadow-md absolute bottom-4 left-4 w-80">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-800">{waypoint.name}</h2>
        </div>
        <div className="max-h-80 overflow-y-auto mb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="stops-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {waypoint.stops.map((stop, index) => (
                    <Draggable
                      key={stop.order}
                      draggableId={stop.order.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between p-2 bg-white border rounded shadow hover:bg-gray-50"
                        >
                          <div>
                            <h3 className="text-sm font-semibold text-gray-700">
                              {stop.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Order: {stop.order}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => deleteStop(stop.order)}
                              className="p-2 rounded-full bg-red-300 text-gray-600 hover:bg-red-600 hover:text-white"
                            >
                              <FaTrashAlt className="text-lg" />
                            </button>
                            <button
                              onClick={() => handlePlaceStop(index, stop.order)}
                              className="p-2 rounded-full bg-gray-300 text-gray-600 hover:bg-blue-600 hover:text-white"
                            >
                              <FaMapMarkerAlt className="text-lg" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={addStop}
            className="w-full p-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Add Stop
          </button>
          {showStopsOutbound.isShown && (
            <button
              onClick={() => clearStops("outbound")}
              className="w-full p-2 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete All Outbound Stops
            </button>
          )}
          {showStopsInbound.isShown && (
            <button
              onClick={() => clearStops("inbound")}
              className="w-full p-2 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete All Inbound Stops
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default StopsInput;
