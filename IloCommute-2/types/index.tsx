import BottomSheet from "@gorhom/bottom-sheet";
import MapView, { LatLng } from "react-native-maps";
import React from "react";
import { GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";

export interface Route {
  _id: string;
  routeNo: number;
  routeName: string;
  routeColor: string;
  waypoints: {
    location: { lat: number; lng: number } | null;
    name: string | null;
    isOutBound: boolean;
    order: number;
  }[];
  status: string;
  points: { inBoundPoints: string; outBoundPoints: string };
  decodedPoints: {
    inBoundPointsDecoded: { latitude: number; longitude: number }[];
    outBoundPointsDecoded: { latitude: number; longitude: number }[];
  };
}

export interface CloseRouteState {
  routeState: DirectRoute | TransferRoute | null;
  setRouteState: (value: DirectRoute | TransferRoute | null) => void;
  setNavigating: (value: boolean) => void;
  setCurrentStep: (value: number) => void;
}

export interface Stop {
  _id: string;
  name: string;
  location: { lat: number; lng: number };
}

export interface ShowStopsProps {
  stops: Stop[] | null;
  setStops: (value: Stop[] | null) => void;
}

export interface WaypointListProp {
  route: Route | null;
}

export interface RouteMapDisplayProp {
  route: Route | null;
  showInBound: boolean;
  showOutBound: boolean;
}

export type LocationType = "origin" | "destination";

export interface MapControlProps {
  showLocation: boolean;
  showStops: boolean;
  showSatellite: boolean;
  showTraffic: boolean;
  locationPermission: boolean;
  toggleShowLocation: () => void;
  toggleShowStops: () => void;
  toggleShowSatellite: () => void;
  toggleShowTraffic: () => void;
  toggleShowMapControl: () => void;
  toggleLocationPermission: () => void;
  setShowMapControl: (value: boolean) => void;
  mapRef: React.RefObject<MapView>;
  initialLocation: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export interface ControlBoxProps {
  title: string;
  icon: JSX.Element;
  isActive: boolean;
  onPress: () => void;
  setShowMapControl: (value: boolean) => void;
}

export interface MapButtonProps {
  showLocation: boolean;
  showStops: boolean;
  showSatellite: boolean;
  showTraffic: boolean;
  showMapControl: boolean;
  setCurrentStep: (value: 0) => void;
  toggleShowLocation: () => void;
  toggleShowStops: () => void;
  toggleShowSatellite: () => void;
  toggleShowTraffic: () => void;
  toggleLocationPermission: () => void;
  toggleShowMapControl: () => void;
  locationPermission: boolean;
  mapRef: React.RefObject<MapView>;
  initialLocation: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  showInBound: boolean;
  showOutBound: boolean;
  toggleShowInBound: () => void;
  toggleShowOutBound: () => void;
  route?: Route;
  isPlacingMarker: boolean;
  toggleIsPlacingMarker: () => void;
  navigating: boolean;
  toggleNavigating: () => void;
  directRoute?: DirectRoute | null;
  transferRoute?: TransferRoute | null;
}

export interface PlacesInputProp {
  setLocation: (value: LatLng | null) => void;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  inputType: LocationType;
  setIsPlacingMarker: (value: boolean) => void;
  setSelectedInputType: (value: LocationType | null) => void;
  inputRef: React.RefObject<GooglePlacesAutocompleteRef | null>;
  setRoutesResponse: (
    value: {
      directRoutes: DirectRoute[];
      transferRoutes: TransferRoute[];
    } | null
  ) => void;
  setDirectRoute: (value: DirectRoute | null) => void;
  setTransferRoute: (value: TransferRoute | null) => void;
}

interface Segment {
  polyline: string;
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  origin: LatLng;
  destination: LatLng;
}

interface WalkSegment extends Segment {
  address: string;
}

interface JeepneySegment extends Segment {
  fare_estimation: {
    modernized: {
      regular: number;
      discounted: number;
    };
    traditional: {
      regular: number;
      discounted: number;
    };
  };
}

export interface DirectRoute {
  route: Route;
  segments: {
    walkToPickup: WalkSegment;
    jeepneyPath: JeepneySegment;
    walkFromDropoff: WalkSegment;
  };
  duration?: {
    text: string;
    value: number;
  };
  distance?: {
    text: string;
    value: number;
  };
}

export interface TransferRoute {
  routes: {
    routeNo: number;
    routeName: string;
    routeColor: string;
    transferPoint: {
      location: {
        lat: number;
        lng: number;
      };
      name: string;
    };
  }[];
  segments: {
    walkToPickup: WalkSegment;
    firstJeepney: JeepneySegment;
    transferWalk: WalkSegment;
    secondJeepney: JeepneySegment;
    walkFromDropoff: WalkSegment;
  };
  totalDuration: {
    text: string;
    value: number;
  };
  totalDistance: {
    text: string;
    value: number;
  };
  totalWalkingDistance: {
    text: string;
    value: number;
  };
}

export interface NavigationGuideProps {
  directRoute?: DirectRoute | null;
  transferRoute?: TransferRoute | null;
  onClose: () => void;
  mapRef: React.RefObject<MapView>;
  currentStep: number;
  setCurrentStep: (value: number) => void;
  setNavigating: (value: boolean) => void;
}

export interface DisplayInstructionsProps {
  navigating: boolean;
  setNavigating: (value: boolean) => void;
  directRoute: DirectRoute | null;
  transferRoute: TransferRoute | null;
  mapRef: React.RefObject<MapView>;
  currentStep: number;
  setCurrentStep: (value: number) => void;
}

export interface RouteResponseItemProps {
  routesResponse: {
    directRoutes: DirectRoute[];
    transferRoutes: TransferRoute[];
  } | null;
}

export interface LocationFormData {
  origin: LatLng | null;
  destination: LatLng | null;
}

export interface LocationInputProps {
  origin: LatLng | null;
  destination: LatLng | null;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  originInputRef: React.RefObject<GooglePlacesAutocompleteRef | null>;
  destinationInputRef: React.RefObject<GooglePlacesAutocompleteRef | null>;
  setOrigin: (value: LatLng | null) => void;
  setDestination: (value: LatLng | null) => void;
  setIsPlacingMarker: (value: boolean) => void;
  setSelectedInputType: (value: LocationType | null) => void;
  setRoutesResponse: (
    value: {
      directRoutes: DirectRoute[];
      transferRoutes: TransferRoute[];
    } | null
  ) => void;
  setDirectRoute: (value: DirectRoute | null) => void;
  setTransferRoute: (value: TransferRoute | null) => void;
}

export interface PlaceMarkerProps {
  setIsPlacingMarker: (value: boolean) => void;
  setSelectedInputType: (value: LocationType | null) => void;
  selectedInputType: LocationType | null;
  mapCenter: LatLng | null;
  setOrigin: (value: LatLng) => void;
  setDestination: (value: LatLng) => void;
  originInputRef: React.RefObject<GooglePlacesAutocompleteRef | null>;
  destinationInputRef: React.RefObject<GooglePlacesAutocompleteRef | null>;
}

export interface RouteItemProps {
  routeNo: number;
  routeName: string;
  routeColor: string;
  onPress?: () => void;
}

export interface TrackerProps {
  navigating: boolean;
  transferRoute: TransferRoute | null;
  directRoute: DirectRoute | null;
  setShowLocation: (value: boolean) => void;
}

export interface JWTpayload {
  exp: number;
  name: string;
  role: string;
  userId: string;
}

export interface GoogleJWTpayload {
  name: string;
  sub: string;
  picture: string;
  email: string;
  given_name: string;
  family_name: string;
  iat: number;
  iss: string;
  aud: string;
  azp: string;
  exp: number;
  email_verified: boolean;
}

export interface User {
  name: string | null;
  id: string;
  photo: string | null;
  email: string;
  givenName: string | null;
  familyName: string | null;
}

export interface Data {
  idToken: string | null;
  serverAuthCode: string | null;
  user: User;
}

export interface GoogleResponse {
  type: string;
  data: Data;
}

export interface AuthData {
  isAuth: boolean;
  user?: {
    name?: string;
    profilePicture?: string;
    id?: string;
  };
}

export interface Error {
  error?: boolean;
  message?: string;
}

export interface AuthContextType {
  authData: AuthData;
  loading: boolean;
  guestLogin: (
    name: string
  ) => Promise<{ error?: boolean; code?: any; message?: any } | void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
