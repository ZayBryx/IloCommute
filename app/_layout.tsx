import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="guest" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="user" options={{ headerShown: false }} />
            <Stack.Screen
              name="(introduction)/index"
              options={{ headerShown: false }}
            />
          </Stack>
        </GestureHandlerRootView>
      </AuthProvider>
    </>
  );
};

export default RootLayout;
