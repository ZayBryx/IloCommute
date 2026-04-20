import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteItemProps } from "@/types";
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/constants/theme';

const RouteItem: React.FC<RouteItemProps> = ({
  routeNo,
  routeName,
  routeColor,
  onPress,
}) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.colors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    routeNoContainer: {
      borderRadius: 8,
      padding: 8,
      minWidth: 50,
      alignItems: "center",
      flexDirection: "row",
    },
    routeNo: {
      color: theme.colors.buttonText,
      fontWeight: "bold",
      fontSize: 16,
    },
    routeInfoContainer: {
      flex: 1,
      marginLeft: 16,
    },
    routeName: {
      fontSize: 16,
      color: theme.colors.text,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.routeNoContainer, {backgroundColor: routeColor}]}>
        <MaterialCommunityIcons name="jeepney" size={24} color={theme.colors.buttonText} />
        <Text style={styles.routeNo}>{routeNo}</Text>
      </View>
      <View style={styles.routeInfoContainer}>
        <Text style={styles.routeName}>{routeName}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default RouteItem;
