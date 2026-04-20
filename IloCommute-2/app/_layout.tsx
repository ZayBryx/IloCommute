import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from '../context/ThemeContext';

const RootLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="index" 
              options={{ 
                gestureEnabled: false 
              }} 
            />
            <Stack.Screen 
              name="login" 
              options={{ 
                gestureEnabled: false 
              }} 
            />
            <Stack.Screen
              name="(introduction)"
              options={{ 
                gestureEnabled: false 
              }}
            />
            <Stack.Screen 
              name="guest" 
              options={{ 
                gestureEnabled: false 
              }} 
            />
            <Stack.Screen 
              name="user" 
              options={{ 
                gestureEnabled: false 
              }} 
            />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default RootLayout;
