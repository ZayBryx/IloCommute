import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCallback, useState } from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { MapButtonProps } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import React from "react";

const MapButton: React.FC<MapButtonProps> = ({
  showLocation,
  showStops,
  showSatellite,
  showTraffic,
  showMapControl,
  setCurrentStep,
  toggleShowLocation,
  toggleShowStops,
  toggleShowSatellite,
  toggleShowTraffic,
  toggleLocationPermission,
  locationPermission,
  mapRef,
  initialLocation,
  showInBound,
  showOutBound,
  toggleShowInBound,
  toggleShowOutBound,
  route,
  isPlacingMarker,
  toggleIsPlacingMarker,
  toggleShowMapControl,
  navigating,
  toggleNavigating,
  directRoute,
  transferRoute,
}) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [loadingLocation, setLoadingLocation] = useState(false);

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      right: 15,
      gap: 10,
    },
    closeButton: {
      backgroundColor: theme.colors.closeButton,
      borderRadius: 25,
      width: 45,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      backgroundColor: theme.colors.mapControlBackground,
      borderRadius: 25,
      padding: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 45,
      height: 45,
      elevation: 3,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    activeButton: {
      backgroundColor: theme.colors.activeButton,
      transform: [{ scale: 0.95 }],
    },
  });

  const containerStyle = {
    ...styles.container,
    top: 10,
  };

  const handleShowUserLocation = async () => {
    if (!locationPermission) {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Cannot Access Location",
          "To show your current location, please enable location permissions."
        );
        return;
      }

      toggleLocationPermission();
    }

    setLoadingLocation(true);

    try {
      const location = await Location.getCurrentPositionAsync({});

      if (!showLocation) {
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            500
          );
        }
      } else {
        if (mapRef.current) {
          mapRef.current.animateToRegion(initialLocation, 500);
        }
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setLoadingLocation(false);
    }

    toggleShowLocation();
  };

  const offNavigating = () => {
    toggleNavigating();
    setCurrentStep(0);
  };

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[styles.button, showMapControl && styles.activeButton]}
        onPress={toggleShowMapControl}
      >
        <Ionicons
          name="layers-outline"
          size={24}
          color={theme.colors.background}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, showLocation && styles.activeButton]}
        onPress={handleShowUserLocation}
        disabled={loadingLocation}
      >
        {loadingLocation ? (
          <ActivityIndicator size="small" color={theme.colors.background} />
        ) : (
          <MaterialIcons
            name="my-location"
            size={24}
            color={theme.colors.background}
          />
        )}
      </TouchableOpacity>

      {(directRoute || transferRoute) && (
        <TouchableOpacity
          style={[styles.button, navigating && { backgroundColor: "red" }]}
          onPress={offNavigating}
        >
          {!navigating ? (
            <Ionicons
              name="navigate"
              size={24}
              color={theme.colors.background}
            />
          ) : (
            <MaterialIcons
              name="close"
              size={24}
              color={theme.colors.background}
            />
          )}
        </TouchableOpacity>
      )}

      {isPlacingMarker && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={toggleIsPlacingMarker}
        >
          <MaterialIcons
            name="close"
            size={32}
            color={theme.colors.background}
          />
        </TouchableOpacity>
      )}

      {route && (
        <>
          <TouchableOpacity
            style={[styles.button, showInBound && styles.activeButton]}
            onPress={toggleShowInBound}
          >
            <MaterialIcons
              name="directions-bus"
              size={24}
              color={theme.colors.background}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, showOutBound && styles.activeButton]}
            onPress={toggleShowOutBound}
          >
            <MaterialIcons
              name="directions-bus"
              size={24}
              color={theme.colors.background}
            />
            <MaterialIcons
              name="undo"
              size={12}
              color={theme.colors.background}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MapButton;
