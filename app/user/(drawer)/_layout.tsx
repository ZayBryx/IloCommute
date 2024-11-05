import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import DrawerComponents from "../../../components/DrawerComponents";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

const DrawerRootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={DrawerComponents}
        screenOptions={{
          drawerStyle: {
            width: "75%",
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
            headerTitle: "Find",
            title: "Find",
            drawerIcon: ({ color, size }) => (
              <Entypo name="location-pin" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="route"
          options={{
            headerTitle: "Route",
            title: "Route",
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="route" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerRootLayout;
