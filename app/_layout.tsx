import { useEffect, useState, PropsWithChildren, FC } from "react";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";

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
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="guest" />
          <Stack.Screen name="index" />
          <Stack.Screen name="user" />
        </Stack>
      </AuthProvider>
    </>
  );
};

export default RootLayout;
