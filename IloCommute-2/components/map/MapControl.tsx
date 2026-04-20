import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { MapControlProps } from "@/types";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import ControlBox from "../common/ControlBox";

const MapControl = ({
  showLocation,
  showStops,
  showSatellite,
  showTraffic,
  toggleShowLocation,
  toggleShowStops,
  toggleShowSatellite,
  toggleShowTraffic,
  mapRef,
  initialLocation,
  locationPermission,
  toggleLocationPermission,
  setShowMapControl,
}: MapControlProps) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

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

    toggleShowLocation();
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.colors.text,
    },
    controlsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "space-between",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Controls</Text>
      <View style={styles.controlsGrid}>
        <ControlBox
          title="Stops"
          icon={
            <MaterialCommunityIcons
              name="jeepney"
              size={24}
              color={showStops ? "#fff" : theme.colors.primary}
            />
          }
          isActive={showStops}
          onPress={toggleShowStops}
          setShowMapControl={setShowMapControl}
        />

        <ControlBox
          title="My Location"
          icon={
            <MaterialIcons
              name="my-location"
              size={24}
              color={showLocation ? "#fff" : theme.colors.primary}
            />
          }
          isActive={showLocation}
          onPress={handleShowUserLocation}
          setShowMapControl={setShowMapControl}
        />

        <ControlBox
          title="Satellite"
          icon={
            <MaterialIcons
              name="satellite"
              size={24}
              color={showSatellite ? "#fff" : theme.colors.primary}
            />
          }
          isActive={showSatellite}
          onPress={toggleShowSatellite}
          setShowMapControl={setShowMapControl}
        />

        <ControlBox
          title="Traffic"
          icon={
            <MaterialIcons
              name="traffic"
              size={24}
              color={showTraffic ? "#fff" : theme.colors.primary}
            />
          }
          isActive={showTraffic}
          onPress={toggleShowTraffic}
          setShowMapControl={setShowMapControl}
        />
      </View>
    </View>
  );
};

export default MapControl;
