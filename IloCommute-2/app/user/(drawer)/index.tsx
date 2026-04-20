import { StyleSheet, View, Dimensions, Text, Keyboard } from "react-native";
import MapView, { LatLng, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DisplayRoute,
  MapButton,
  LocationInput,
  PlaceMarker,
  RouteMapDisplay,
  WaypointList,
  DisplayDirectRoute,
  RoutesResponseItem,
  ShowStops,
  CloseRoute,
  DisplayTransferRoute,
  DisplayInstructions,
  BottomSheetBackdrop,
  MapControl,
  Tracker,
} from "@/components";
import { useLocalSearchParams } from "expo-router";
import { DirectRoute, LocationType, Route, TransferRoute, Stop } from "@/types";
import useToggle from "@/hooks/useToggle";
import { GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import darkModeMap from "@/nightCustomMap.json";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React from "react";

const Index = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  const [route, setRoute] = useState<Route | null>(null);
  const [directRoute, setDirectRoute] = useState<DirectRoute | null>(null);
  const [transferRoute, setTransferRoute] = useState<TransferRoute | null>(
    null
  );
  const [routesResponse, setRoutesResponse] = useState<{
    directRoutes: DirectRoute[];
    transferRoutes: TransferRoute[];
  } | null>(null);

  const [navigating, toggleNavigating, setNavigating] = useToggle(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [selectedInputType, setSelectedInputType] =
    useState<LocationType | null>(null);

  const [stops, setStops] = useState<Stop[] | null>([]);

  const originInputRef = useRef<GooglePlacesAutocompleteRef | null>(null);
  const destinationInputRef = useRef<GooglePlacesAutocompleteRef | null>(null);

  const [isPlacingMarker, toggleIsPlacingMarker] = useToggle(false);
  const [showLocation, toggleShowLocation, setShowLocation] = useToggle(false);
  const [showStops, toggleShowStops] = useToggle(false);
  const [showSatellite, toggleShowSatellite] = useToggle(false);
  const [showTraffic, toggleShowTraffic] = useToggle(false);
  const [showInBound, toggleShowInBound] = useToggle(true);
  const [showOutBound, toggleShowOutBound] = useToggle(true);
  const [showMapControl, toggleShowMapControl, setShowMapControl] =
    useToggle(false);

  const [locationPermission, toggleLocationPermission] = useToggle(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );

  const { route_data, direct_route, transfer_route } = useLocalSearchParams();

  const mapRef = useRef<MapView>(null);

  const snapPoints = useMemo(
    () => ["20%", "32%", "40%", "45%", "50%", "75%", "100%"],
    []
  );
  const snapPointsWaypoint = useMemo(
    () => ["10%", "20%", "40%", "45%", "50%", "75%", "100%"],
    []
  );
  const snapPointsGuide = useMemo(
    () => ["10%", "20%", "40%", "45%", "50%", "75%", "100%"],
    []
  );
  const snapPointsMapControl = useMemo(() => ["30", "50"], []);

  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const bottomSheetWaypointRef = useRef<BottomSheet | null>(null);
  const bottomSheetGuideRef = useRef<BottomSheet | null>(null);
  const bottomSheetMapControlRef = useRef<BottomSheet | null>(null);

  const iloiloInitianLocation = useMemo(() => {
    return {
      latitude: 10.71999,
      longitude: 122.5599,
      latitudeDelta: 0.1522,
      longitudeDelta: 0.0621,
    };
  }, []);

  useEffect(() => {
    const startLocationUpdates = async () => {
      if (showLocation && isFollowingUser) {
        try {
          // Request foreground permission if not already granted
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            console.log("Permission to access location was denied");
            return;
          }

          // Start location updates
          locationSubscription.current = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 100,
            },
            (location) => {
              if (isFollowingUser && mapRef.current) {
                mapRef.current.animateToRegion({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }
            }
          );
        } catch (error) {
          console.error("Error starting location updates:", error);
        }
      }
    };

    startLocationUpdates();

    // Cleanup subscription when component unmounts or following is disabled
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, [showLocation, isFollowingUser]);

  // Update following state when showLocation changes
  useEffect(() => {
    if (showLocation) {
      setIsFollowingUser(true);
    } else {
      setIsFollowingUser(false);
    }
  }, [showLocation]);

  // receive route id and display on the map
  useEffect(() => {
    if (!route_data) return;

    setRoute(JSON.parse(route_data as string));
  }, [route_data]);

  // receive direct details route and display on the map
  useEffect(() => {
    if (!direct_route) {
      setDirectRoute(null);
      return;
    }
    try {
      const parsedRoute = JSON.parse(direct_route as string);
      setDirectRoute(parsedRoute);
      setTransferRoute(null); // Clear other route type
    } catch (error) {
      console.error("Error parsing direct route:", error);
      setDirectRoute(null);
    }
  }, [direct_route]);

  // receive transfer details route and display on the map
  useEffect(() => {
    if (!transfer_route) {
      setTransferRoute(null);
      return;
    }
    try {
      const parsedRoute = JSON.parse(transfer_route as string);
      setTransferRoute(parsedRoute);
      setDirectRoute(null); // Clear other route type
    } catch (error) {
      console.error("Error parsing transfer route:", error);
      setTransferRoute(null);
    }
  }, [transfer_route]);

  // switches multiple bottom sheet to show and hide
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showMapControl) {
        bottomSheetRef.current?.close();
        bottomSheetGuideRef.current?.close();
        bottomSheetWaypointRef.current?.close();
        setTimeout(() => {
          bottomSheetMapControlRef.current?.snapToIndex(1);
        }, 100);
      } else if (route) {
        bottomSheetRef.current?.close();
        bottomSheetGuideRef.current?.close();
        bottomSheetMapControlRef.current?.close();
        setTimeout(() => {
          bottomSheetWaypointRef.current?.snapToIndex(2);
        }, 100);
      } else if (directRoute || transferRoute) {
        bottomSheetRef.current?.close();
        bottomSheetWaypointRef.current?.close();
        bottomSheetMapControlRef.current?.close();
        setTimeout(() => {
          bottomSheetGuideRef.current?.snapToIndex(2);
        }, 100);
      } else if (routesResponse) {
        bottomSheetWaypointRef.current?.close();
        bottomSheetGuideRef.current?.close();
        bottomSheetMapControlRef.current?.close();
        setTimeout(() => {
          bottomSheetRef.current?.snapToIndex(2);
        }, 100);
      } else {
        bottomSheetWaypointRef.current?.close();
        bottomSheetGuideRef.current?.close();
        bottomSheetMapControlRef.current?.close();
        setTimeout(() => {
          bottomSheetRef.current?.snapToIndex(0);
        }, 100);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [route, routesResponse, directRoute, transferRoute, showMapControl]);

  // when direct route route the map will be focused to the walk to pickup and walk from dropoff
  useEffect(() => {
    if (directRoute) {
      mapRef.current?.animateToRegion(
        {
          latitude:
            directRoute?.segments.walkToPickup.destination.latitude ??
            iloiloInitianLocation.latitude,
          longitude:
            directRoute?.segments.walkToPickup.destination.longitude ??
            iloiloInitianLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        300
      );
    }
  }, [directRoute]);

  // when transfer route route the map will be focused to the walk to pickup and walk from dropoff
  useEffect(() => {
    if (transferRoute) {
      mapRef.current?.animateToRegion(
        {
          latitude:
            transferRoute?.segments.walkToPickup.destination.latitude ??
            iloiloInitianLocation.latitude,
          longitude:
            transferRoute?.segments.walkToPickup.destination.longitude ??
            iloiloInitianLocation.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        },
        300
      );
    }
  }, [transferRoute]);

  const handleMapRegionChange = useCallback((region: LatLng) => {
    if (isFollowingUser) {
      setIsFollowingUser(false);
    }
    setTimeout(() => {
      setMapCenter(region);
    }, 100);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    map: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    },
    contentContainer: {
      flex: 1,
      padding: 16,
      zIndex: 1000,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.colors.text,
    },
    bottomSheetStyle: {
      backgroundColor: theme.colors.background,
    },
  });

  useEffect(() => {
    if (origin) {
      mapRef.current?.animateToRegion(
        {
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        300
      );
    }

    if (destination) {
      mapRef.current?.animateToRegion(
        {
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        300
      );
    }

    if (!origin && !destination) {
      mapRef.current?.animateToRegion(iloiloInitianLocation, 300);
    }
  }, [origin, destination]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={iloiloInitianLocation}
        showsMyLocationButton={false}
        showsUserLocation={showLocation}
        showsTraffic={showTraffic}
        onPress={() => Keyboard.dismiss()}
        customMapStyle={isDarkMode ? darkModeMap : []}
        mapType={showSatellite ? "hybrid" : "standard"}
        onRegionChangeComplete={(region) => handleMapRegionChange(region)}
        onUserLocationChange={(event) => {
          if (isFollowingUser && event?.nativeEvent?.coordinate) {
            mapRef.current?.animateToRegion({
              latitude: event.nativeEvent.coordinate.latitude,
              longitude: event.nativeEvent.coordinate.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }}
      >
        {/* Map component inside */}

        {!(directRoute || transferRoute) && (
          <>
            {origin && (
              <Marker coordinate={origin}>
                <MaterialIcons name="trip-origin" size={24} color="green" />
              </Marker>
            )}

            {destination && (
              <Marker coordinate={destination}>
                <MaterialIcons name="trip-origin" size={24} color="red" />
              </Marker>
            )}
          </>
        )}

        <RouteMapDisplay
          route={route}
          showInBound={showInBound}
          showOutBound={showOutBound}
        />

        {showStops && stops && <ShowStops stops={stops} setStops={setStops} />}

        {directRoute && (
          <DisplayDirectRoute
            directRoute={directRoute}
            currentStep={currentStep}
            navigating={navigating}
          />
        )}

        {transferRoute && (
          <DisplayTransferRoute
            transferRoute={transferRoute}
            currentStep={currentStep}
            navigating={navigating}
          />
        )}

        {/* Map component inside */}
      </MapView>

      <Tracker
        navigating={navigating}
        directRoute={directRoute}
        transferRoute={transferRoute}
        setShowLocation={setShowLocation}
      />

      {route && <DisplayRoute route={route} setRoute={setRoute} />}

      {directRoute && (
        <CloseRoute
          routeState={directRoute}
          setCurrentStep={setCurrentStep}
          setNavigating={setNavigating}
          setRouteState={
            setDirectRoute as (
              value: DirectRoute | TransferRoute | null
            ) => void
          }
        />
      )}

      {transferRoute && (
        <CloseRoute
          routeState={transferRoute}
          setCurrentStep={setCurrentStep}
          setNavigating={setNavigating}
          setRouteState={
            setTransferRoute as (
              value: DirectRoute | TransferRoute | null
            ) => void
          }
        />
      )}

      {isPlacingMarker && selectedInputType && (
        <PlaceMarker
          setIsPlacingMarker={toggleIsPlacingMarker}
          setSelectedInputType={setSelectedInputType}
          mapCenter={mapCenter}
          setOrigin={setOrigin}
          setDestination={setDestination}
          selectedInputType={selectedInputType}
          originInputRef={originInputRef}
          destinationInputRef={destinationInputRef}
        />
      )}

      <MapButton
        showLocation={showLocation}
        showStops={showStops}
        showSatellite={showSatellite}
        showTraffic={showTraffic}
        showMapControl={showMapControl}
        setCurrentStep={setCurrentStep}
        toggleShowLocation={toggleShowLocation}
        toggleShowStops={toggleShowStops}
        toggleShowSatellite={toggleShowSatellite}
        toggleShowTraffic={toggleShowTraffic}
        toggleLocationPermission={toggleLocationPermission}
        toggleShowMapControl={toggleShowMapControl}
        locationPermission={locationPermission}
        mapRef={mapRef}
        initialLocation={iloiloInitianLocation}
        showInBound={showInBound}
        showOutBound={showOutBound}
        toggleShowInBound={toggleShowInBound}
        toggleShowOutBound={toggleShowOutBound}
        route={route ?? undefined}
        isPlacingMarker={isPlacingMarker}
        toggleIsPlacingMarker={toggleIsPlacingMarker}
        navigating={navigating}
        toggleNavigating={toggleNavigating}
        directRoute={directRoute ?? undefined}
        transferRoute={transferRoute ?? undefined}
      />

      {/* bottom sheet for map control */}
      <BottomSheet
        ref={bottomSheetMapControlRef}
        index={-1}
        snapPoints={snapPointsMapControl}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backdropComponent={BottomSheetBackdrop}
        onChange={(index) => {
          if (index === -1) {
            setShowMapControl(false);
          }
        }}
        style={styles.bottomSheetStyle}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textSecondary }}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
      >
        <MapControl
          showLocation={showLocation}
          showStops={showStops}
          showSatellite={showSatellite}
          showTraffic={showTraffic}
          toggleShowLocation={toggleShowLocation}
          toggleShowStops={toggleShowStops}
          toggleShowSatellite={toggleShowSatellite}
          toggleShowTraffic={toggleShowTraffic}
          toggleShowMapControl={toggleShowMapControl}
          locationPermission={locationPermission}
          mapRef={mapRef}
          initialLocation={iloiloInitianLocation}
          toggleLocationPermission={toggleLocationPermission}
          setShowMapControl={setShowMapControl}
        />
      </BottomSheet>

      {/* bottom sheet for guide */}
      <BottomSheet
        ref={bottomSheetGuideRef}
        index={0}
        snapPoints={snapPointsGuide}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        style={styles.bottomSheetStyle}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textSecondary }}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <DisplayInstructions
            navigating={navigating}
            setNavigating={setNavigating}
            directRoute={directRoute}
            transferRoute={transferRoute}
            mapRef={mapRef}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </BottomSheetView>
      </BottomSheet>

      {/* bottom sheet for waypoint */}
      <BottomSheet
        ref={bottomSheetWaypointRef}
        index={0}
        snapPoints={snapPointsWaypoint}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textSecondary }}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <WaypointList route={route} />
        </BottomSheetView>
      </BottomSheet>

      {/* bottom sheet for input location */}
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textSecondary }}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <LocationInput
            origin={origin}
            destination={destination}
            setOrigin={setOrigin}
            setDestination={setDestination}
            bottomSheetRef={bottomSheetRef}
            setIsPlacingMarker={toggleIsPlacingMarker}
            setSelectedInputType={setSelectedInputType}
            originInputRef={originInputRef}
            destinationInputRef={destinationInputRef}
            setRoutesResponse={setRoutesResponse}
            setDirectRoute={setDirectRoute}
            setTransferRoute={setTransferRoute}
          />

          {routesResponse && (
            <RoutesResponseItem routesResponse={routesResponse} />
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Index;
