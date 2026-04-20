import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { DrawerComponents, ToggleTheme } from "@/components";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/constants/theme';

const DrawerRootLayout = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={DrawerComponents}
        screenOptions={{
          drawerStyle: {
            width: "75%",
            backgroundColor: theme.colors.background,
          },
          headerStyle: {
            backgroundColor: theme.colors.cardBackground,
          },
          headerTitleStyle: {
            color: theme.colors.text,
          },
          headerTintColor: theme.colors.text,
          drawerActiveTintColor: theme.colors.primary,
          drawerInactiveTintColor: theme.colors.textSecondary,
          headerTitleAlign: 'center',
          headerRight: () => <ToggleTheme />,
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
