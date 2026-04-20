import { useEffect, useState, useMemo, useCallback } from "react";
import * as Location from "expo-location";
import { TrackerProps } from "@/types";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const Tracker = ({
  navigating,
  directRoute,
  transferRoute,
  setShowLocation,
}: TrackerProps) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [alertShown, setAlertShown] = useState<boolean>(false);
  const [lastVibrationTime, setLastVibrationTime] = useState<number>(0);
  const [nearAlertShown, setNearAlertShown] = useState<boolean>(false);
  const [arrivedAlertShown, setArrivedAlertShown] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);

  const destinations = useMemo(() => {
    if (directRoute) {
      return [directRoute.segments.jeepneyPath.destination];
    } else if (transferRoute) {
      return [
        transferRoute.segments.firstJeepney.destination,
        transferRoute.segments.secondJeepney.destination,
      ];
    }
    return [];
  }, [directRoute, transferRoute]);

  const calculateDistance = useCallback(
    (coords1: Coordinates, coords2: Coordinates): number => {
      const R = 6371e3;
      const lat1 = coords1.latitude * (Math.PI / 180);
      const lat2 = coords2.latitude * (Math.PI / 180);
      const deltaLat = (coords2.latitude - coords1.latitude) * (Math.PI / 180);
      const deltaLon =
        (coords2.longitude - coords1.longitude) * (Math.PI / 180);

      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLon / 2) *
          Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c;
    },
    []
  );

  const triggerHapticFeedback = useCallback(
    (
      feedbackType:
        | typeof Haptics.NotificationFeedbackType.Success
        | typeof Haptics.NotificationFeedbackType.Error
    ) => {
      const currentTime = Date.now();
      if (currentTime - lastVibrationTime <= 3000) return;

      for (let i = 0; i < 3; i++) {
        Haptics.notificationAsync(feedbackType);
      }
      setLastVibrationTime(currentTime);
    },
    [lastVibrationTime]
  );

  const getDestinationName = useCallback(
    (index: number) => {
      if (directRoute) {
        return "jeepney stop";
      } else if (transferRoute) {
        return index === 0 ? "first jeepney stop" : "second jeepney stop";
      }
      return "destination";
    },
    [directRoute, transferRoute]
  );

  const handleProximityAlerts = useCallback(
    (distance: number) => {
      if (
        !notificationsEnabled ||
        currentDestinationIndex >= destinations.length
      )
        return;

      if (distance < 50 && !arrivedAlertShown) {
        const destinationName = getDestinationName(currentDestinationIndex);
        Alert.alert(
          "Destination Alert",
          `You have arrived at your ${destinationName}!`
        );
        triggerHapticFeedback(Haptics.NotificationFeedbackType.Success);
        setArrivedAlertShown(true);
        setNearAlertShown(true);

        if (currentDestinationIndex < destinations.length - 1) {
          setTimeout(() => {
            setCurrentDestinationIndex((prev) => prev + 1);
            setArrivedAlertShown(false);
            setNearAlertShown(false);
          }, 5000);
        }
      } else if (distance < 200 && !nearAlertShown && !arrivedAlertShown) {
        const destinationName = getDestinationName(currentDestinationIndex);
        Alert.alert(
          "Destination Alert",
          `Your ${destinationName} is approaching!`
        );
        triggerHapticFeedback(Haptics.NotificationFeedbackType.Error);
        setNearAlertShown(true);
      } else if (distance >= 200) {
        setNearAlertShown(false);
        setArrivedAlertShown(false);
      }
    },
    [
      triggerHapticFeedback,
      nearAlertShown,
      arrivedAlertShown,
      notificationsEnabled,
      destinations.length,
      currentDestinationIndex,
      getDestinationName,
    ]
  );

  const handleLocationUpdate = useCallback(
    (newLocation: Location.LocationObject) => {
      if (destinations.length === 0) return;

      setUserLocation(newLocation.coords);
      setHeading(newLocation.coords.heading);

      const currentDestination = destinations[currentDestinationIndex];
      if (currentDestination) {
        const distance = calculateDistance(
          newLocation.coords,
          currentDestination
        );
        handleProximityAlerts(distance);
      }
    },
    [
      destinations,
      currentDestinationIndex,
      calculateDistance,
      handleProximityAlerts,
    ]
  );

  const startLocationTracking = useCallback(async () => {
    if (!directRoute && !transferRoute) return;

    return await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
      },
      handleLocationUpdate
    );
  }, [directRoute, transferRoute, handleLocationUpdate]);

  const requestLocationPermissions = useCallback(async () => {
    if (alertShown) {
      if (notificationsEnabled) {
        const watchLocation = await startLocationTracking();
        return () => watchLocation?.remove();
      }
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location permission not granted");
      return;
    }

    Alert.alert(
      "Location Alerts",
      "Would you like to be notified when you are near your jeepney stops?",
      [
        {
          text: "No",
          onPress: () => {
            setShowLocation(false);
            setAlertShown(true);
            setNotificationsEnabled(false);
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            setShowLocation(true);
            setAlertShown(true);
            setNotificationsEnabled(true);
            const watchLocation = await startLocationTracking();
            return () => watchLocation?.remove();
          },
        },
      ]
    );
  }, [
    alertShown,
    setShowLocation,
    startLocationTracking,
    notificationsEnabled,
  ]);

  // Reset all states when navigation is turned off
  useEffect(() => {
    if (!navigating) {
      // Reset location states
      setUserLocation(null);
      setHeading(null);

      // Reset alert states
      setAlertShown(false);
      setLastVibrationTime(0);
      setNearAlertShown(false);
      setArrivedAlertShown(false);

      // Reset notification and tracking states
      setNotificationsEnabled(false);
      setCurrentDestinationIndex(0);

      // Reset location visibility
      setShowLocation(false);
    } else {
      requestLocationPermissions();
    }
  }, [navigating, requestLocationPermissions, setShowLocation]);

  return null;
};

export default Tracker;
