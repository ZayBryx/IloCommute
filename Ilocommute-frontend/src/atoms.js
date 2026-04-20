import axios from "axios";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const mapOptionsAtom = atom({
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: true,
});

export const routeAtom = atom(null);
export const inBoundRoutesAtom = atom([]);
export const outBoundRoutesAtom = atom([]);

export const inboundResponseAtom = atom(null);
export const outboundResponseAtom = atom(null);

export const showInboundAtom = atom(true);
export const showOutboundAtom = atom(true);

export const isPlacingInboundAtom = atom({ placing: false, index: null });
export const isPlacingOutboundAtom = atom({ placing: false, index: null });

export const addOutboundRouteAtom = atom(null, (get, set) => {
  const outboundRoutes = get(outBoundRoutesAtom);
  const newRoute = {
    name: null,
    location: { lat: null, lng: null },
    isOutBound: true,
    routeNo: routeAtom.routeNo,
    stops: [],
    order:
      outboundRoutes.length > 0
        ? Math.max(...outboundRoutes.map((r) => r.order)) + 1
        : 0,
  };

  set(outBoundRoutesAtom, [...outboundRoutes, newRoute]);
});

export const addInboundRouteAtom = atom(null, (get, set) => {
  const inboundRoutes = get(inBoundRoutesAtom);
  const outboundRoutes = get(outBoundRoutesAtom);

  const newRoute = {
    name: null,
    location: { lat: null, lng: null },
    isOutBound: false,
    routeNo: routeAtom.routeNo,
    stops: [],
    order:
      inboundRoutes.length > 0
        ? Math.max(...inboundRoutes.map((r) => r.order)) + 1
        : Math.max(...outboundRoutes.map((r) => r.order), -1) + 1,
  };

  set(inBoundRoutesAtom, [...inboundRoutes, newRoute]);
});

export const getOneRouteAtom = atom(null, async (get, set, id) => {
  try {
    const response = await axios.get(`/routes/${id}`);

    const { routeName, routeNo, routeColor, _id, status, waypoints } =
      response.data;

    set(routeAtom, { _id, routeNo, routeName, routeColor, status });

    if (waypoints.length === 0) {
      set(outBoundRoutesAtom, []);
      set(inBoundRoutesAtom, []);
      set(inboundResponseAtom, []);
      set(outboundResponseAtom, []);
      return;
    }

    const outboundWaypoints = waypoints
      .filter((wp) => wp.isOutBound)
      .map((wp, index) => ({
        ...wp,
        order: wp.order || index,
      }));

    const maxOutboundOrder = Math.max(
      ...outboundWaypoints.map((r) => r.order),
      -1
    );

    const inboundWaypoints = waypoints
      .filter((wp) => !wp.isOutBound)
      .map((wp, index) => ({
        ...wp,
        order: wp.order || maxOutboundOrder + index + 1,
      }));

    set(outBoundRoutesAtom, outboundWaypoints);
    set(inBoundRoutesAtom, inboundWaypoints);
  } catch (error) {
    console.error("Error fetching route data:", error);
  }
});

export const clearRouteDataAtom = atom(null, (get, set) => {
  set(routeAtom, null);
  set(inBoundRoutesAtom, []);
  set(outBoundRoutesAtom, []);
  set(inboundResponseAtom, null);
  set(outboundResponseAtom, null);
  set(showInboundAtom, true);
  set(showOutboundAtom, true);
  set(showStopsOutboundAtom, { isShown: false, waypoint: null, index: null });
  set(showStopsInboundAtom, { isShown: false, waypoint: null, index: null });
});

export const hasChangesAtom = atom(false);

export const draftInboundRoutesAtom = atomWithStorage("draftInbound", []);
export const draftOutboundRoutesAtom = atomWithStorage("draftOutbound", []);
export const draftRouteIdAtom = atomWithStorage("draftRouteId", null);

export const addStopToRouteInboundAtom = atom(
  null,
  (get, set, { routeIndex, stop }) => {
    const routes = get(inBoundRoutesAtom);
    const updatedRoutes = [...routes];
    const route = updatedRoutes[routeIndex];

    const newStop = {
      ...stop,
      routeNo: get(routeAtom).routeNo,
      location: { lat: null, lng: null },
      order: parseFloat(
        (route.stops.length > 0
          ? Math.max(...route.stops.map((s) => s.order)) + 0.00001
          : route.order + 0.00001
        ).toFixed(5)
      ),
    };

    route.stops.push(newStop);
    set(inBoundRoutesAtom, updatedRoutes);
  }
);

export const addStopToRouteOutboundAtom = atom(
  null,
  (get, set, { routeIndex, stop }) => {
    const routes = get(outBoundRoutesAtom);
    const updatedRoutes = [...routes];
    const route = updatedRoutes[routeIndex];

    const newStop = {
      ...stop,
      routeNo: get(routeAtom).routeNo,
      location: { lat: null, lng: null },
      order: parseFloat(
        (route.stops.length > 0
          ? Math.max(...route.stops.map((s) => s.order)) + 0.00001
          : route.order + 0.00001
        ).toFixed(5)
      ),
    };

    route.stops.push(newStop);
    set(outBoundRoutesAtom, updatedRoutes);
  }
);

export const isPlacingInboundStopAtom = atom({
  placing: false,
  waypointType: null,
  waypointIndex: null,
  stopindex: null,
  stopOrder: null,
});
export const isPlacingOutboundStopAtom = atom({
  placing: false,
  waypointType: null,
  waypointIndex: null,
  stopindex: null,
  stopOrder: null,
});

export const showStopsOutboundAtom = atom({
  isShown: false,
  waypoint: null,
  index: null,
});

export const showStopsInboundAtom = atom({
  isShown: false,
  waypoint: null,
  index: null,
});

export const clearAllInboundStopsAtom = atom(null, (get, set) => {
  const routes = get(inBoundRoutesAtom);
  const clearedRoutes = routes.map((route) => ({ ...route, stops: [] }));
  set(inBoundRoutesAtom, clearedRoutes);
});

export const clearAllOutboundStopsAtom = atom(null, (get, set) => {
  const routes = get(outBoundRoutesAtom);
  const clearedRoutes = routes.map((route) => ({ ...route, stops: [] }));
  set(outBoundRoutesAtom, clearedRoutes);
});
