import { Autocomplete } from "@react-google-maps/api";
import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import {
  FaTrashAlt,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaCompress,
  FaExpand,
  FaSave,
  FaWindowClose,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { TbBusStop } from "react-icons/tb";
import { Link } from "react-router-dom";
import { SaveModal } from "./";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import {
  routeAtom,
  inBoundRoutesAtom,
  outBoundRoutesAtom,
  addOutboundRouteAtom,
  addInboundRouteAtom,
  isPlacingInboundAtom,
  isPlacingOutboundAtom,
  inboundResponseAtom,
  outboundResponseAtom,
  draftInboundRoutesAtom,
  draftOutboundRoutesAtom,
  draftRouteIdAtom,
  hasChangesAtom,
  getOneRouteAtom,
  showStopsOutboundAtom,
  showStopsInboundAtom,
  clearRouteDataAtom,
} from "../atoms";
import { useForm } from "react-hook-form";
import { adjustRouteOrders } from "../helper";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const bounds = {
  north: 11.27,
  south: 10.5,
  east: 122.95,
  west: 122.3,
};

const fields = ["geometry.location", "name"];

const MapInput = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInBoundOpen, setIsInBoundOpen] = useState(false);
  const [isOutBoundOpen, setIsOutBoundOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [data, setData] = useState({});

  const [isPlacingInbound, setIsPlacingInbound] = useAtom(isPlacingInboundAtom);
  const [isPlacingOutbound, setIsPlacingOutbound] = useAtom(
    isPlacingOutboundAtom
  );

  const autocompleteInboundRef = useRef([]);
  const autocompleteOutboundRef = useRef([]);

  const route = useAtomValue(routeAtom);
  const [inBoundRoutes, setInBoundRoutes] = useAtom(inBoundRoutesAtom);
  const [outBoundRoutes, setOutBoundRoutes] = useAtom(outBoundRoutesAtom);

  const addOutboundRoutes = useSetAtom(addOutboundRouteAtom);
  const addInboundRoutes = useSetAtom(addInboundRouteAtom);

  const inboundResponse = useSetAtom(inboundResponseAtom);
  const outboundResponse = useSetAtom(outboundResponseAtom);
  const getRoute = useSetAtom(getOneRouteAtom);

  const [draftInbound, setDraftInbound] = useAtom(draftInboundRoutesAtom);
  const [draftOutbound, setDraftOutbound] = useAtom(draftOutboundRoutesAtom);
  const [draftRouteId, setDraftRouteId] = useAtom(draftRouteIdAtom);
  const clearRouteData = useSetAtom(clearRouteDataAtom);

  useEffect(() => {
    clearRouteData();
  }, [clearRouteData]);

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      _id: "",
      outbound: [],
      inbound: [],
    },
  });

  const [isUsingDraft, setIsUsingDraft] = useState(false);
  const [hasChanges, setHasChanges] = useAtom(hasChangesAtom);

  const [showStopsOutbound, setShowStopsOutbound] = useAtom(
    showStopsOutboundAtom
  );
  const [showStopsInbound, setShowStopsInbound] = useAtom(showStopsInboundAtom);

  const toggleShowOutboundStop = (waypoint, index) => {
    setShowStopsOutbound((prev) => {
      const newState = {
        isShown: !prev.index === index || !prev.isShown,
        waypoint: waypoint,
        index: index,
      };
      if (newState.isShown) {
        setShowStopsInbound((outboundPrev) => ({
          ...outboundPrev,
          isShown: false,
        }));
      }
      return newState;
    });
  };

  const toggleShowInboundStop = (waypoint, index) => {
    setShowStopsInbound((prev) => {
      const newState = {
        isShown: !prev.index === index || !prev.isShown,
        waypoint: waypoint,
        index: index,
      };
      if (newState.isShown) {
        setShowStopsOutbound((outboundPrev) => ({
          ...outboundPrev,
          isShown: false,
        }));
      }
      return newState;
    });
  };

  const togglePlacingInbound = useCallback(
    (currentIndex) => {
      setIsPlacingInbound((prev) => ({
        placing: prev.index !== currentIndex || !prev.placing,
        index: currentIndex,
      }));
    },
    [setIsPlacingInbound]
  );

  const togglePlacingOutbound = useCallback(
    (currentIndex) => {
      setIsPlacingOutbound((prev) => ({
        placing: prev.index !== currentIndex || !prev.placing,
        index: currentIndex,
      }));
    },
    [setIsPlacingOutbound]
  );

  const handleInboundAutocompleteOnLoad = useCallback((autocomplete, index) => {
    autocompleteInboundRef.current[index] = autocomplete;
  }, []);

  const handleOutboundAutocompleteOnLoad = useCallback(
    (autocomplete, index) => {
      autocompleteOutboundRef.current[index] = autocomplete;
    },
    []
  );

  const onDragEnd = (result, routes, setRoutes) => {
    if (!result.destination) return;

    const updatedRoutes = Array.from(routes);
    const [movedRoute] = updatedRoutes.splice(result.source.index, 1);
    updatedRoutes.splice(result.destination.index, 0, movedRoute);

    // Update order
    updatedRoutes.forEach((route, index) => {
      route.order = index;
    });

    setRoutes(updatedRoutes);
    setHasChanges(true);
  };

  const handleInboundPlaceChange = useCallback(
    (index) => {
      const autocomplete = autocompleteInboundRef.current[index];
      if (!autocomplete) return;

      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const name = place.name || "";

        const updatedInBoundRoutes = [...inBoundRoutes];
        updatedInBoundRoutes[index] = {
          ...updatedInBoundRoutes[index],
          location: { lat, lng },
          name: name,
        };
        setInBoundRoutes(updatedInBoundRoutes);

        setValue(`inbound.${index}.location.lat`, lat);
        setValue(`inbound.${index}.location.lng`, lng);
        setValue(`inbound.${index}.name`, name);
      }
      setHasChanges(true);
    },
    [inBoundRoutes, setInBoundRoutes, setValue]
  );

  const handleOutboundPlaceChange = useCallback(
    (index) => {
      const autocomplete = autocompleteOutboundRef.current[index];
      if (!autocomplete) return;

      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const name = place.name || "";

        const updatedOutBoundRoutes = [...outBoundRoutes];
        updatedOutBoundRoutes[index] = {
          ...updatedOutBoundRoutes[index],
          location: { lat, lng },
          name: name,
        };
        setOutBoundRoutes(updatedOutBoundRoutes);

        setValue(`outbound.${index}.location.lat`, lat);
        setValue(`outbound.${index}.location.lng`, lng);
        setValue(`outbound.${index}.name`, name);
      }
      setHasChanges(true);
    },
    [outBoundRoutes, setOutBoundRoutes, setValue]
  );

  useEffect(() => {
    if (route?._id) {
      // Reset entire form first
      reset({
        _id: route._id,
        outbound: [],
        inbound: [],
      });

      // Then set new values
      setValue("_id", route._id);

      outBoundRoutes.forEach((item, index) => {
        setValue(`outbound.${index}`, {
          isOutBound: true,
          location: {
            lat: item.location?.lat,
            lng: item.location?.lng,
          },
          order: index,
          name: item.name || "",
          routeNo: item.routeNo || route.routeNo,
          stops: item.stops || [],
        });
      });

      inBoundRoutes.forEach((item, index) => {
        setValue(`inbound.${index}`, {
          isOutBound: false,
          location: {
            lat: item.location?.lat,
            lng: item.location?.lng,
          },
          order: index,
          name: item.name || "",
          routeNo: item.routeNo || route.routeNo,
          stops: item.stops || [],
        });
      });
    }
  }, [route, outBoundRoutes, inBoundRoutes, reset, setValue]);

  const handleDeleteInbound = async (index) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmation.isConfirmed) return;

    const updatedInBoundRoutes = [...inBoundRoutes];
    updatedInBoundRoutes.splice(index, 1);
    setInBoundRoutes(updatedInBoundRoutes);

    setValue("inbound", updatedInBoundRoutes);
    setHasChanges(true);
  };

  const handleDeleteOutbound = async (index) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmation.isConfirmed) return;

    const updatedOutBoundRoutes = [...outBoundRoutes];
    updatedOutBoundRoutes.splice(index, 1);
    setOutBoundRoutes(updatedOutBoundRoutes);

    setValue("outbound", updatedOutBoundRoutes);
    setHasChanges(true);
  };

  const handleCloseModal = useCallback(() => {
    setShowSaveModal(false);
  }, []);

  // Check for unsaved changes on component mount
  useEffect(() => {
    if (draftRouteId === route?._id && hasChanges) {
      // Show recovery dialog
      Swal.fire({
        title: "Recover unsaved changes?",
        text: "You have unsaved changes from your last session",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, recover",
        cancelButtonText: "No, start fresh",
      }).then((result) => {
        if (result.isConfirmed) {
          setInBoundRoutes(draftInbound);
          setOutBoundRoutes(draftOutbound);
          setIsUsingDraft(true); // Track that we're using recovered data
        } else {
          clearDrafts();
        }
      });
    }
  }, [route?._id]);

  const clearDrafts = () => {
    setDraftInbound([]);
    setDraftOutbound([]);
    setDraftRouteId(null);
    setIsUsingDraft(false);
    setHasChanges(false);
    inboundResponse(null);
    outboundResponse(null);
  };

  useEffect(() => {
    if (route?._id && hasChanges) {
      setDraftRouteId(route._id);
      setDraftInbound(inBoundRoutes);
      setDraftOutbound(outBoundRoutes);
    }
  }, [inBoundRoutes, outBoundRoutes, hasChanges]);

  useEffect(() => {
    setHasChanges(false);
  }, [route?._id]);

  const handleSave = async (data) => {
    const waypoints = adjustRouteOrders(data.outbound, data.inbound);
    setData({ _id: data._id, waypoints });
    setShowSaveModal(true);

    clearDrafts();
    setHasChanges(false);
    console.log(waypoints);
  };

  const handleClearDraft = async () => {
    const result = await Swal.fire({
      title: "Clear draft changes?",
      text: "This will restore the original route data",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear draft",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      clearDrafts();
      // Reset form values
      setValue("outbound", []);
      setValue("inbound", []);
      // Reload original route data
      if (route?._id) {
        await getRoute(route._id);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSave)}
        className="absolute top-[4.25rem] sm:top-3 left-0 sm:left-3 bg-white w-full sm:w-auto sm:min-w-[24rem] max-w-md h-auto p-3 sm:shadow-lg rounded-none sm:rounded-md overflow-hidden z-50"
      >
        <input type="hidden" {...register("_id")} />

        <div className="flex flex-row items-center gap-2">
          <Link
            to="/dashboard/routes"
            className="text-red-600 hover:text-red-700 transition-colors shrink-0"
          >
            <FaArrowLeft size={18} />
          </Link>

          <div className="flex-1 flex items-center min-w-0 px-2">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm sm:text-base truncate pr-2">
                {route?.routeName}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isUsingDraft && (
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="flex items-center gap-1 bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-yellow-600 transition text-xs sm:text-sm whitespace-nowrap"
                >
                  <FaTrashAlt size={12} className="sm:text-base" />
                  <span className="hidden sm:inline">Clear Draft</span>
                </button>
              )}
              <button
                type="submit"
                className="flex items-center gap-1 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-green-600 transition text-xs sm:text-sm whitespace-nowrap"
              >
                <FaSave size={12} className="sm:text-base" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-600 hover:text-gray-800 transition-colors shrink-0"
          >
            {isMinimized ? <FaExpand size={18} /> : <FaCompress size={18} />}
          </button>
        </div>

        {!isMinimized && (
          <div className="mt-3 space-y-3">
            {/* Outbound Dropdown */}
            <div className="flex flex-col">
              <button
                type="button"
                className="flex items-center justify-between w-full bg-red-500 text-white rounded-t-md px-3 py-2 hover:bg-red-600 transition text-xs sm:text-sm"
                onClick={() => setIsOutBoundOpen(!isOutBoundOpen)}
              >
                <div className="flex w-full justify-between items-center text-sm">
                  <span>Outbound Waypoints ({outBoundRoutes.length})</span>
                  {isOutBoundOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </button>

              {isOutBoundOpen && (
                <div className="max-h-80 overflow-y-auto border border-gray-300 py-2 bg-red-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <DragDropContext
                    onDragEnd={(result) =>
                      onDragEnd(result, outBoundRoutes, setOutBoundRoutes)
                    }
                  >
                    <Droppable droppableId="outboundRoutes">
                      {(provided) => (
                        <ol
                          className="space-y-2 text-xs px-2 list-[upper-alpha] ml-4 "
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {outBoundRoutes.map((item, index) => (
                            <Draggable
                              key={index}
                              draggableId={`outbound-${index}`}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="pl-1 "
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="hidden"
                                      {...register(
                                        `outbound.${index}.isOutBound`
                                      )}
                                      value={true}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(
                                        `outbound.${index}.location.lat`
                                      )}
                                      value={item.location?.lat | null}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(
                                        `outbound.${index}.location.lng`
                                      )}
                                      value={item.location?.lng | null}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(`outbound.${index}.order`)}
                                      value={index}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(`outbound.${index}.routeNo`)}
                                      value={item.routeNo || route.routeNo}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(`outbound.${index}.stops`)}
                                      value={JSON.stringify(item.stops || [])}
                                    />
                                    <Autocomplete
                                      className="w-full"
                                      bounds={bounds}
                                      fields={fields}
                                      onLoad={(autocomplete) =>
                                        handleOutboundAutocompleteOnLoad(
                                          autocomplete,
                                          index
                                        )
                                      }
                                      onPlaceChanged={() =>
                                        handleOutboundPlaceChange(index)
                                      }
                                    >
                                      <input
                                        type="text"
                                        placeholder="Enter waypoint"
                                        {...register(`outbound.${index}.name`)}
                                        defaultValue={item.name || ""}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </Autocomplete>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteOutbound(index)
                                        }
                                        className="bg-white text-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition"
                                      >
                                        <FaTrashAlt />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          togglePlacingOutbound(index)
                                        }
                                        className={
                                          isPlacingOutbound.index === index &&
                                          isPlacingOutbound.placing
                                            ? "bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition"
                                            : "bg-slate-500 text-white rounded-md p-2 hover:bg-slate-600 transition"
                                        }
                                      >
                                        {isPlacingOutbound.index === index &&
                                        isPlacingOutbound.placing ? (
                                          <FaWindowClose />
                                        ) : (
                                          <FaMapMarkerAlt />
                                        )}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleShowOutboundStop(item, index)
                                        }
                                        className={
                                          showStopsOutbound.index === index &&
                                          showStopsOutbound.isShown
                                            ? "bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition"
                                            : "bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition"
                                        }
                                      >
                                        {showStopsOutbound.index === index &&
                                        showStopsOutbound.isShown ? (
                                          <FaWindowClose />
                                        ) : (
                                          <TbBusStop />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ol>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}

              {/* Outbound Add Button */}
              <button
                type="button"
                onClick={() => {
                  addOutboundRoutes();
                  setIsOutBoundOpen(true);
                }}
                className="flex items-center text-sm gap-2 border border-black border-1 bg-white text-grey px-3 py-2 rounded-b-md hover:bg-red-600 hover:text-white transition w-full"
              >
                <FaPlus />
                Add Outbound Waypoint
              </button>
            </div>

            {/* Inbound Dropdown */}
            <div className="flex flex-col">
              <button
                type="button"
                className="flex items-center justify-between w-full bg-blue-500 text-white rounded-t-md px-3 py-2 hover:bg-blue-600 transition text-xs sm:text-sm"
                onClick={() => setIsInBoundOpen(!isInBoundOpen)}
              >
                <div className="flex w-full justify-between items-center text-sm">
                  <span>Inbound Waypoint ({inBoundRoutes.length})</span>
                  {isInBoundOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </button>

              {isInBoundOpen && (
                <div className="max-h-80 overflow-y-auto border border-gray-300 py-2 bg-red-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <DragDropContext
                    onDragEnd={(result) =>
                      onDragEnd(result, inBoundRoutes, setInBoundRoutes)
                    }
                  >
                    <Droppable droppableId="inboundRoutes">
                      {(provided) => (
                        <ol
                          className="space-y-2 text-xs px-2 list-[upper-alpha] ml-4 "
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {inBoundRoutes.map((item, index) => (
                            <Draggable
                              key={index}
                              draggableId={`inbound-${index}`}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="pl-1"
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="hidden"
                                      {...register(
                                        `inbound.${index}.isOutBound`
                                      )}
                                      value={false}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(
                                        `inbound.${index}.location.lat`
                                      )}
                                      value={item.location?.lat | null}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(
                                        `inbound.${index}.location.lng`
                                      )}
                                      value={item.location?.lng | null}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(`inbound.${index}.order`)}
                                      value={index}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(`inbound.${index}.routeNo`)}
                                      value={item.routeNo || route.routeNo}
                                    />
                                    <input
                                      type="hidden"
                                      {...register(`inbound.${index}.stops`)}
                                      value={JSON.stringify(item.stops || [])}
                                    />
                                    <Autocomplete
                                      className="w-full"
                                      bounds={bounds}
                                      fields={fields}
                                      onLoad={(autocomplete) =>
                                        handleInboundAutocompleteOnLoad(
                                          autocomplete,
                                          index
                                        )
                                      }
                                      onPlaceChanged={() =>
                                        handleInboundPlaceChange(index)
                                      }
                                    >
                                      <input
                                        type="text"
                                        placeholder="Enter waypoint"
                                        {...register(`inbound.${index}.name`)}
                                        defaultValue={item.name || ""}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </Autocomplete>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteInbound(index)
                                        }
                                        className="bg-white text-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition"
                                      >
                                        <FaTrashAlt />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          togglePlacingInbound(index)
                                        }
                                        className={
                                          isPlacingInbound.index === index &&
                                          isPlacingInbound.placing
                                            ? "bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition"
                                            : "bg-slate-500 text-white rounded-md p-2 hover:bg-slate-600 transition"
                                        }
                                      >
                                        {isPlacingInbound.index === index &&
                                        isPlacingInbound.placing ? (
                                          <FaWindowClose />
                                        ) : (
                                          <FaMapMarkerAlt />
                                        )}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleShowInboundStop(item, index)
                                        }
                                        className={
                                          showStopsInbound.index === index &&
                                          showStopsInbound.isShown
                                            ? "bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition"
                                            : "bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition"
                                        }
                                      >
                                        {showStopsInbound.index === index &&
                                        showStopsInbound.isShown ? (
                                          <FaWindowClose />
                                        ) : (
                                          <TbBusStop />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ol>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}

              {/* Inbound Add Button */}
              <button
                type="button"
                onClick={() => {
                  addInboundRoutes();
                  setIsInBoundOpen(true);
                }}
                className="flex items-center text-sm gap-2 bg-white-500 text-grey border border-black border-1 px-3 py-2 rounded-b-md hover:bg-blue-600 hover:text-white transition w-full"
              >
                <FaPlus />
                Add Inbound Waypoints
              </button>
            </div>
          </div>
        )}
      </form>

      <SaveModal
        isOpen={showSaveModal}
        onClose={handleCloseModal}
        data={data}
      />
    </>
  );
};

export default MapInput;
