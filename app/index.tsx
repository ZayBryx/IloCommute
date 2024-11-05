import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Page() {
  const { authData, loading } = useAuth();
  const [checkingFirstLaunch, setCheckingFirstLaunch] = useState(true);

  const checkIfFirstLaunch = async () => {
    try {
      const isLaunch = await AsyncStorage.getItem("has_launched");

      if (!isLaunch) {
        await AsyncStorage.setItem("has_launched", "true");
        router.replace("/(introduction)");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking first launch:", error);
      return false;
    } finally {
      setCheckingFirstLaunch(false);
    }
  };

  const handleRedirects = async () => {
    const isFirstLaunch = await checkIfFirstLaunch();

    if (!isFirstLaunch && !loading) {
      if (!authData.isAuth) {
        router.push("/login");
      } else {
        router.push("/user");
      }
    }
  };

  useEffect(() => {
    handleRedirects();
  }, [loading, authData.isAuth]);

  if (checkingFirstLaunch || loading) {
    return null;
  }

  return null;
}
