import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import DrawerComponents from "../../../components/DrawerComponents";

const DrawerRootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={DrawerComponents}
        screenOptions={{
          drawerStyle: {
            width: "75%", // Adjust drawer width
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerTitle: "Home",
          }}
        />
        <Drawer.Screen
          name="route"
          options={{
            headerTitle: "Route",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerRootLayout;

const styles = StyleSheet.create({});
