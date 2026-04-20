import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import { useEffect, useState, useMemo } from "react";
import axios, { AxiosResponse } from "axios";
import { Loading, RouteItem } from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";

interface Route {
  _id: string;
  routeNo: number;
  routeName: string;
  routeColor: string;
  waypoints: {
    location: { lat: number; lng: number } | null;
    name: string | null;
    isOutBound: boolean;
  }[];
  status: string;
  points: { inBoundPoints: string; outBoundPoints: string };
}

const Route = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [routes, setRoutes] = useState<Route[] | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasNetwork, setHasNetwork] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    loadRoutes();
  }, [router]);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const networkAvailable = await checkNetwork();
      const storedRoutes = await AsyncStorage.getItem("routes_data");

      if (!networkAvailable && storedRoutes) {
        const localVersion = await AsyncStorage.getItem("routes_version");

        setRoutes(JSON.parse(storedRoutes));
        setLoading(false);
        return;
      }

      const localVersion = parseInt(
        (await AsyncStorage.getItem("routes_version")) || "0"
      );
      const response: AxiosResponse = await axios.get("/routes", {
        timeout: 10000,
      });

      if (!storedRoutes) {
        setRoutes(response.data?.routes);
        await AsyncStorage.setItem(
          "routes_data",
          JSON.stringify(response.data?.routes)
        );

        await AsyncStorage.setItem(
          "routes_version",
          response.data?.version.toString()
        );
        setLoading(false);
        return;
      }

      if (localVersion !== response.data?.version) {
        setRoutes(response.data?.routes);

        await AsyncStorage.setItem(
          "routes_data",
          JSON.stringify(response.data?.routes)
        );

        await AsyncStorage.setItem(
          "routes_version",
          response.data?.version.toString()
        );

        setLoading(false);
        return;
      }

      setRoutes(JSON.parse(storedRoutes));

      setLoading(false);
    } catch (error) {
      console.error("Error loading routes", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const checkNetwork = async () => {
    try {
      const network = await Network.getNetworkStateAsync();
      setHasNetwork(network.isConnected ?? false);
      return network.isConnected ?? false;
    } catch (error) {
      console.error("Error checking network", error);
      return false;
    }
  };

  const filteredRoutes = useMemo(() => {
    if (!routes) return [];

    return routes
      .filter(
        (route) =>
          route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.routeNo.toString().includes(searchQuery)
      )
      .sort((a, b) => a.routeNo - b.routeNo);
  }, [routes, searchQuery]);

  const handleRoutePress = (route_data: Route) => {
    router.push(
      `/user?route_data=${encodeURIComponent(JSON.stringify(route_data))}`
    );
  };

  const renderItem = ({ item }: { item: Route }) => (
    <RouteItem
      routeNo={item.routeNo}
      routeName={item.routeName}
      routeColor={item.routeColor}
      onPress={() => handleRoutePress(item)}
    />
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRoutes();
    setRefreshing(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.cardBackground,
      margin: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 10,
      fontSize: 16,
      color: theme.colors.text,
    },
    searchIcon: {
      marginRight: 5,
    },
    clearIcon: {
      padding: 5,
    },
    listContainer: {
      paddingVertical: 8,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading visible={loading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={24}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search routes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textSecondary}
        />
        {searchQuery !== "" && (
          <MaterialIcons
            name="close"
            size={24}
            color={theme.colors.textSecondary}
            style={styles.clearIcon}
            onPress={() => setSearchQuery("")}
          />
        )}
      </View>
      <FlatList
        data={filteredRoutes}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      />
    </View>
  );
};

export default Route;
