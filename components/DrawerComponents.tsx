import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import {
  DrawerItemList,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const DrawerComponents = (props: DrawerContentComponentProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { logout } = useAuth();

  return (
    <View style={[{ flex: 1 }, { paddingTop: top }]}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={{
          flex: 1,
          paddingTop: 10,
        }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View
        style={[
          styles.logoutContainer,
          { paddingBottom: Math.max(20, bottom) },
        ]}
      >
        <TouchableOpacity onPress={() => logout()} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrawerComponents;

const styles = StyleSheet.create({
  logoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1D3754",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
  },
});
