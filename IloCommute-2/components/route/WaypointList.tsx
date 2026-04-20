import { WaypointListProp } from "@/types";
import { ScrollView } from 'react-native-gesture-handler'
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {useTheme} from '@/context/ThemeContext'
import {lightTheme, darkTheme} from '@/constants/theme'

const WaypointsList = ({ route }: WaypointListProp) => {
  const {isDarkMode} = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  if (!route) return null;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    routeInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    routeNumberBadge: {
      alignItems: 'center',
      flexDirection: 'row',
      padding: 8,
      borderRadius: 6,
    },
    routeNumber: {
      color: theme.colors.buttonText,
      fontWeight: '600',
      fontSize: 16,
    },
    routeName: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    scrollContent: {
      flexGrow: 0,
    },
    landMarkItem: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    landMarkContainer: {
      width: 24,
      alignItems: "center",
    },
    landMarkDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.cardBackground,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 2,
    },
    landMarkLine: {
      flex: 1,
      width: 2,
      height: '100%',
      position: 'absolute',
      top: 12,
    },
    landMarkDetails: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      marginLeft: 12,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: 12,
    },
    landMarkLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    landMarkText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
          <View style={[styles.routeNumberBadge, { backgroundColor: route.routeColor }]}>
          <MaterialIcons 
            name="directions-bus" 
            size={24} 
            color={theme.colors.buttonText} 
          />
            <Text style={styles.routeNumber}>{route.routeNo}</Text>
          </View>
        <Text style={styles.routeName}>{route.routeName}</Text>
      </View>

      <ScrollView style={styles.scrollContent}>

        {route.waypoints.slice(1, -1).map((item, index) => (
          <View key={index} style={styles.landMarkItem}>
            <View style={styles.landMarkContainer}>
              <View style={[styles.landMarkDot, { backgroundColor: route.routeColor }]} />
              <View style={[styles.landMarkLine, { backgroundColor: route.routeColor }]} />
            </View>
            <View style={styles.landMarkDetails}>
              <Text style={styles.landMarkText} numberOfLines={1}>
                {item?.name || "Unnamed Stop"}
              </Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
};



export default WaypointsList;
