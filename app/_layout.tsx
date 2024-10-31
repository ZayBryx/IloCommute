import { useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";

interface LayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: LayoutProps) => {
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

  return <Stack>{children}</Stack>;
};

export default RootLayout;
