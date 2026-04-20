import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { RouteResponseItemProps, DirectRoute, TransferRoute } from "@/types";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/constants/theme';

const RoutesResponseItem = ({ routesResponse }: RouteResponseItemProps) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  if (!routesResponse) return null;

  const styles = StyleSheet.create({
    container: {
      borderTopWidth: 1,
      borderColor: theme.colors.border,
      marginTop: 20,
      paddingTop: 10,
      gap: 12,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    routeItem: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      borderLeftWidth: 6,
    },
    routeInfo: {
      gap: 4,
      width: '90%',
    },
    routeInfoItem: {
      width: '100%',
    },
    routeNumberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    routeNameText: { 
      fontWeight: 'bold',
      fontSize: 16,
      flex: 1,
      color: theme.colors.text,
    },
    routeHeader: { 
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    routeNumberBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      minWidth: 45,
      alignItems: "center",
    },
    routeNumber: {
      color: theme.colors.buttonText,
      fontWeight: "600",
      fontSize: 14,
    },
    routeName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      flex: 1,
    },
    routeDetails: {
      flexDirection: "row",
      gap: 16,
      marginTop: 4,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    detailText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    noRoutesText: {
      textAlign: 'center',
      fontSize: 16,
      color: theme.colors.textSecondary,
      padding: 20,
    },
    transferRouteItem: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      position: 'relative',
      overflow: 'hidden',
    },
    transferHeader: {
      marginBottom: 12,
      gap: 12,
    },
    transferLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    routeNumbers: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    smallRouteBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      minWidth: 35,
      alignItems: 'center',
    },
    smallRouteNumber: {
      color: theme.colors.buttonText,
      fontWeight: '600',
      fontSize: 12,
    },
    transferDetails: {
      gap: 8,
    },
    detailRow: {
      flexDirection: 'row',
      gap: 16,
    },
    gradientBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: '50%',
      height: 250,
      opacity: 0.9,
    },
    transferContent: {
      padding: 16,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 11,
      margin: 1,
    },
    arrowContainer: {
      alignItems: 'flex-start',
      marginLeft: 12,
    },
  });

  if (routesResponse.directRoutes.length === 0 && routesResponse.transferRoutes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noRoutesText}>No routes found</Text>
      </View>
    );
  }

  const handleRoutePress = (route: DirectRoute | TransferRoute) => {
    if ('routes' in route) {
      router.push({
        pathname: "/user",
        params: {
          transfer_route: encodeURIComponent(JSON.stringify(route))
        }
      });
    } else {
      router.push({
        pathname: "/user",
        params: {
          direct_route: encodeURIComponent(JSON.stringify(route))
        }
      });
    }
  };

  const renderDirectRoute = (route: DirectRoute, index: number) => (
    <TouchableOpacity
      style={[styles.routeItem, { borderLeftColor: route.route.routeColor }]}
      onPress={() => handleRoutePress(route)}
      key={`direct-${index}`}
    >
      <View style={styles.routeInfo}>
        <View style={styles.routeHeader}>
          <View
            style={[
              styles.routeNumberBadge,
              { backgroundColor: route.route.routeColor },
            ]}
          >
            <Text style={styles.routeNumber}>{route.route.routeNo}</Text>
          </View>
          <Text style={styles.routeName}>{route.route.routeName}</Text>
        </View>

        <View style={styles.routeDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {route.duration?.text || "N/A"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="map-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {route.distance?.text || "N/A"}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderTransferRoute = (route: TransferRoute, index: number) => (
    <TouchableOpacity
      style={[styles.routeItem, { 
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderLeftColor: route.routes[0].routeColor,
        borderRightColor: route.routes[1].routeColor,
      }]}
      onPress={() => handleRoutePress(route)}
      key={`transfer-${index}`}
    >
      <View style={styles.routeInfo}>
        <View style={styles.routeHeader}>
          <View
            style={[
              styles.routeNumberBadge,
              { backgroundColor: route.routes[0].routeColor },
            ]}
          >
            <Text style={styles.routeNumber}>{route.routes[0].routeNo}</Text>
          </View>
          <Text style={styles.routeName} numberOfLines={1}>
            {route.routes[0].routeName}
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-down" size={16} color={theme.colors.textSecondary} />
        </View>

        <View style={styles.routeHeader}>
          <View
            style={[
              styles.routeNumberBadge,
              { backgroundColor: route.routes[1].routeColor },
            ]}
          >
            <Text style={styles.routeNumber}>{route.routes[1].routeNo}</Text>
          </View>
          <Text style={styles.routeName} numberOfLines={1}>
            {route.routes[1].routeName}
          </Text>
        </View>

        <View style={styles.routeDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {route.totalDuration?.text || "N/A"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="map-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {route.totalDistance?.text || "N/A"}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <>
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Feather name="map-pin" size={24} color={theme.colors.textSecondary} />
        <Text style={styles.routeName}>Result</Text>
      </View>
      {routesResponse.directRoutes.map((route, index) => renderDirectRoute(route, index))}
      {routesResponse.transferRoutes.map((route, index) => renderTransferRoute(route, index))}
    </View>
    </>
  );
};

export default RoutesResponseItem;

