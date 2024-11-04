import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import { Slot } from "expo-router";

const UserLayout = () => {
  const { authData } = useAuth();

  useEffect(() => {
    if (!authData.isAuth) {
      router.replace("/");
    }
  }, [authData.isAuth]);

  return <Slot />;
};

export default UserLayout;
