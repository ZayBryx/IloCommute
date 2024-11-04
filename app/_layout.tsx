import { useEffect, useState, PropsWithChildren, FC } from "react";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  const [hasFirstLaunch, setHasFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();

  const checkIfLaunch = async () => {
    const isLaunch = await AsyncStorage.getItem("has_launched");

    if (!isLaunch) {
      setHasFirstLaunch(true);
      await AsyncStorage.setItem("has_launched", "true");
      router.replace("/(introduction)");
    } else {
      setHasFirstLaunch(false);
    }
  };

  useEffect(() => {
    checkIfLaunch();
  }, []);

  if (hasFirstLaunch === null) {
    return null;
  }

  return (
    <>
      <AuthProvider>
        <GestureHandlerRootView>
          <StatusBar style="dark" />
          <Stack>
            <Stack.Screen name="guest" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="user" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </AuthProvider>
    </>
  );
};

export default RootLayout;
