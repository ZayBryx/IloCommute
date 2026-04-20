import React, { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAtom } from "jotai";
import {
  inBoundRoutesAtom,
  outBoundRoutesAtom,
  hasChangesAtom,
} from "../atoms";

const StopMarker = ({ stops }) => {
  const [selectedStop, setSelectedStop] = useState(null);
  const [inBoundRoutes, setInBoundRoutes] = useAtom(inBoundRoutesAtom);
  const [outBoundRoutes, setOutBoundRoutes] = useAtom(outBoundRoutesAtom);
  const setHasChange = useAtom(hasChangesAtom);

  if (!stops || stops.length === 0) {
    return null;
  }

  const handleMarkerClick = (stop) => {
    if (selectedStop && selectedStop.order === stop.order) {
      setSelectedStop(null);
    } else {
      setSelectedStop(stop);
    }
  };

  const greenMarker = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: "green",
    fillOpacity: 1,
    strokeColor: "white",
    strokeWeight: 1,
    scale: 8,
  };

  const handleDelete = (stop) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this stop.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updateStops = (routes, setter) =>
          setter((prevRoutes) =>
            prevRoutes.map((route) =>
              route.stops.some((s) => s.order === stop.order)
                ? {
                    ...route,
                    stops: route.stops
                      .filter((s) => s.order !== stop.order)
                      .map((s, idx) => ({ ...s, order: idx + 1 })),
                  }
                : route
            )
          );

        if (stop.isOutBound) {
          updateStops(outBoundRoutes, setOutBoundRoutes);
        } else {
          updateStops(inBoundRoutes, setInBoundRoutes);
        }

        Swal.fire("Deleted!", "The stop has been deleted.", "success");
        setHasChange(true);
      }
    });
  };

  return (
    <>
      {stops.map((stop) => (
        <Marker
          key={stop.order}
          position={stop.location}
          onClick={() => handleMarkerClick(stop)}
          icon={greenMarker}
          animation={window.google.maps.Animation.DROP}
        >
          {selectedStop && selectedStop.order === stop.order && (
            <InfoWindow onCloseClick={() => setSelectedStop(null)}>
              <div className="bg-white p-1 rounded-lg shadow-lg">
                <h3 className="text-sm font-semibold mb-2">{stop.name}</h3>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Order: {stop.order}</p>
                    <p className="text-sm text-gray-600">
                      Route No: {stop.routeNo}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(stop)}
                    className="mt-2 flex items-center justify-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    <FaTrashAlt className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </>
  );
};

export default StopMarker;
