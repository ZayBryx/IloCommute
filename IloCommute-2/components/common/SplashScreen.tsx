import { StyleSheet, Image, View } from "react-native";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";

const SplashScreen = () => {
  const {isDarkMode} = useTheme()

  const theme = !isDarkMode ? darkTheme : lightTheme 

  const styles = StyleSheet.create({
    logo: {
      width: 200,
      height: 200,
    },
    container: {
      backgroundColor: theme.colors.background,
    }
  });
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("@/assets/adaptive-icon.png")} />
    </View>
  );
};

export default SplashScreen;


