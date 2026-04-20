import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Page() {
  const { authData, loading } = useAuth();
  const [checkingFirstLaunch, setCheckingFirstLaunch] = useState(true);
  const MINIMUM_SPLASH_TIME = 2000;

  const checkIfFirstLaunch = async () => {
    try {
      const isLaunch = await AsyncStorage.getItem("has_launched");
      return !isLaunch;
    } catch (error) {
      console.error("Error checking first launch:", error);
      return false;
    }
  };

  const handleNavigation = async () => {
    try {
      const isFirstLaunch = await checkIfFirstLaunch();

      setTimeout(async () => {
        if (isFirstLaunch) {
          await AsyncStorage.setItem("has_launched", "true");
          router.replace("(introduction)");
        } else if (authData.isAuth) {
          router.replace("/user");
        } else {
          router.replace("/login");
        }
        setCheckingFirstLaunch(false);
      }, MINIMUM_SPLASH_TIME);
    } catch (error) {
      console.error("Navigation error:", error);
      setCheckingFirstLaunch(false);
    }
  };

  useEffect(() => {
    handleNavigation();
  }, [authData.isAuth]);

  return null;
}
