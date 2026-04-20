import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { CloseRouteState } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import { useRouter } from "expo-router";

const CloseRoute = ({
  routeState,
  setRouteState,
  setNavigating,
  setCurrentStep,
}: CloseRouteState) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const router = useRouter();

  const handleClose = useCallback(() => {
    setRouteState(null);
    setCurrentStep(0);
    setNavigating(false);
    router.push({
      pathname: "/user",
      params: {},
    });
  }, []);

  const isTransferRoute = routeState && "routes" in routeState;

  const routeInfo =
    routeState && "route" in routeState
      ? {
          routeNo: routeState.route.routeNo,
          routeName: routeState.route.routeName,
          routeColor: routeState.route.routeColor,
        }
      : {
          routeNo: routeState?.routes[0].routeNo,
          routeName: `${routeState?.routes
            .map((r) => r.routeName)
            .join(" → ")}`,
          routeColor: routeState?.routes[0].routeColor,
          secondaryColor: routeState?.routes[1].routeColor,
        };

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
      gap: 12,
    },
    transferBadgeContainer: {
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    },
    routeNoContainer: {
      padding: 4,
      borderRadius: 4,
      minWidth: 32,
      alignItems: "center",
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

  return (
    <View style={styles.container}>
      <View style={styles.routeInfo}>
        {isTransferRoute ? (
          <View style={styles.transferBadgeContainer}>
            <View
              style={[
                styles.routeNoContainer,
                { backgroundColor: routeInfo.routeColor },
              ]}
            >
              <Text style={styles.routeNoText}>
                {routeState.routes[0].routeNo}
              </Text>
            </View>
            <MaterialIcons
              name="arrow-downward"
              size={12}
              color={theme.colors.textSecondary}
            />
            <View
              style={[
                styles.routeNoContainer,
                { backgroundColor: routeInfo.secondaryColor },
              ]}
            >
              <Text style={styles.routeNoText}>
                {routeState.routes[1].routeNo}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.routeNoContainer,
              { backgroundColor: routeInfo.routeColor },
            ]}
          >
            <Text style={styles.routeNoText}>{routeInfo.routeNo}</Text>
          </View>
        )}
        <Text style={styles.routeName}>{routeInfo.routeName}</Text>
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

export default CloseRoute;
