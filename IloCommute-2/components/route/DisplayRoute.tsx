import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { decode } from "@googlemaps/polyline-codec";
import { useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { Route } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import React from "react";

const DisplayRoute = ({ route, setRoute }: { route: Route; setRoute: any }) => {
  const { routeName, routeNo, routeColor } = route;
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 20,
      left: 20,
      right: 20,
      width: "78%",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    routeInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    routeNo: {
      padding: 8,
      borderRadius: 8,
      marginRight: 12,
    },
    routeNoText: {
      color: theme.colors.buttonText,
      fontWeight: "bold",
      fontSize: 16,
    },
    routeName: {
      fontSize: 16,
      fontWeight: "500",
      flex: 1,
      color: theme.colors.text,
    },
    closeIcon: {
      padding: 4,
    },
  });

  const getDecodedPoints = useCallback(
    async (points: { inBoundPoints: string; outBoundPoints: string }) => {
      if (!points) return;

      let inBoundPointsDecoded: { latitude: number; longitude: number }[] = [];
      let outBoundPointsDecoded: { latitude: number; longitude: number }[] = [];

      if (points.inBoundPoints) {
        inBoundPointsDecoded = decode(points.inBoundPoints).map(
          ([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          })
        );
      }
      if (points.outBoundPoints) {
        outBoundPointsDecoded = decode(points.outBoundPoints).map(
          ([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          })
        );
      }

      setRoute((r: Route) => ({
        ...r,
        decodedPoints: { inBoundPointsDecoded, outBoundPointsDecoded },
      }));
    },
    [setRoute]
  );

  useEffect(() => {
    if (!route.points) return;

    getDecodedPoints(route.points);
  }, [route.points]);

  const handleClose = () => {
    setRoute(null);
    router.setParams({ route_data: null });
  };

  return (
    <View style={styles.container}>
      <View style={styles.routeInfo}>
        <View style={[styles.routeNo, { backgroundColor: routeColor }]}>
          <Text style={styles.routeNoText}>{routeNo}</Text>
        </View>
        <Text style={styles.routeName}>{routeName}</Text>
      </View>
      <MaterialIcons
        name="close"
        size={24}
        color={theme.colors.textSecondary}
        style={styles.closeIcon}
        onPress={handleClose}
      />
    </View>
  );
};

export default DisplayRoute;
