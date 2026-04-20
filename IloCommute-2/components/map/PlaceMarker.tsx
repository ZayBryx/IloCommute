import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useEffect } from "react";
import { PlaceMarkerProps } from "@/types";
import getPlaceName from "@/utils/getPlaceName";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import React from "react";

const PlaceMarker = ({
  setIsPlacingMarker,
  setSelectedInputType,
  selectedInputType,
  setOrigin,
  setDestination,
  mapCenter,
  originInputRef,
  destinationInputRef,
}: PlaceMarkerProps) => {
  const { isDarkMode } = useTheme();
  const theme = !isDarkMode ? darkTheme : lightTheme;

  const markerPlacing = useCallback(async () => {
    setIsPlacingMarker(false);

    if (!mapCenter?.latitude || !mapCenter?.longitude) return;

    const placeName = await getPlaceName(
      mapCenter.latitude,
      mapCenter.longitude
    );

    const location = {
      latitude: mapCenter.latitude,
      longitude: mapCenter.longitude,
    };

    if (selectedInputType === "origin") {
      setOrigin(location);
      if (originInputRef?.current) {
        setTimeout(() => {
          originInputRef.current?.setAddressText(placeName);
          originInputRef.current?.focus();
          originInputRef.current?.blur();
        }, 100);
      }
    } else if (selectedInputType === "destination") {
      setDestination(location);
      if (destinationInputRef?.current) {
        setTimeout(() => {
          destinationInputRef.current?.setAddressText(placeName);
          destinationInputRef.current?.focus();
          destinationInputRef.current?.blur();
        }, 100);
      }
    }

    setSelectedInputType(null);
  }, [mapCenter, selectedInputType, setOrigin, setDestination]);

  const { height, width } = Dimensions.get("window");

  const styles = StyleSheet.create({
    markerIconContainer: {
      position: "absolute",
      top: height / 2 - 34,
      left: width / 2 - 13,
    },
    buttonContainer: {
      position: "absolute",
      bottom: 200,
      width: "100%",
      alignItems: "center",
    },
    button: {
      backgroundColor: "#007AFF",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
    closeButton: {
      position: "absolute",
      top: -700,
      left: 10,
      backgroundColor: "red",
      borderRadius: 30,
    },
    crossMarker: {
      position: "absolute",
      top: height / 2 - 9,
      left: width / 2 - 12,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    crossLine: {
      position: "absolute",
      width: 35,
      height: 2,
      backgroundColor: theme.colors.background,
      transform: [{ rotate: "-45deg" }],
    },
    crossLineDiagonal: {
      position: "absolute",
      width: 35,
      height: 2,
      backgroundColor: theme.colors.background,
      transform: [{ rotate: "45deg" }],
    },
  });

  return (
    <>
      <View style={styles.markerIconContainer}>
        <FontAwesome
          name="map-marker"
          size={38}
          color={selectedInputType === "origin" ? "green" : "red"}
        />
      </View>

      <View style={styles.crossMarker}>
        <View style={styles.crossLine} />
        <View style={styles.crossLineDiagonal} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={markerPlacing}>
          <Text style={styles.buttonText}>Place Marker</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PlaceMarker;
