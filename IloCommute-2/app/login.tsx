import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");


export default function login() {
  const { googleSignIn } = useAuth();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundShapes: {
      ...StyleSheet.absoluteFillObject,
    },
    circle: {
      position: "absolute",
      borderRadius: Math.round(width + height) / 2,
      width: width * 0.8,
      height: width * 0.8,
      opacity: 0.1,
    },
    circleTop: {
      backgroundColor: theme.colors.backgroundShape,
      top: -width * 0.2,
      right: -width * 0.2,
    },
    circleBottom: {
      backgroundColor: theme.colors.backgroundShape,
      bottom: -width * 0.4,
      left: -width * 0.4,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      borderRadius: 20,
      margin: 20,
      backgroundColor: theme.colors.contentBackground,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 24,
      opacity: 0.8,
      backgroundColor: theme.colors.iconContainerBackground,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
      overflow: "hidden",
      shadowColor: theme.colors.iconContainerShadow,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.35,
      shadowRadius: 5,
      elevation: 7,
    },
    icon: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 40,
      textAlign: "center",
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
    },
    googleButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 35,
    },
    signInButton: {
      backgroundColor: theme.colors.googleButton,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      width: 300,
      height: 50,
      marginBottom: 20,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    signInButtonText: {
      color: theme.colors.background,
      fontSize: 16,
      textAlign: "center",
      fontWeight: "600",
    },
    guestButton: {
      backgroundColor: theme.colors.cardBackground,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderWidth: 1,
      borderColor: theme.colors.guestButtonBorder,
      borderRadius: 25,
      width: 300,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    guestButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      textAlign: "center",
      fontWeight: "600",
    },
    sitemapButton: {
      marginTop: 40,
    },
    sitemapButtonText: {
      color: theme.colors.primary,
      fontSize: 14,
      textDecorationLine: "underline",
    },
  });
  
  
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.backgroundShapes}>
          <View style={[styles.circle, styles.circleTop]} />
          <View style={[styles.circle, styles.circleBottom]} />
        </View>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image source={require("../assets/adaptive-icon.png")} style={styles.icon} />
          </View>
          <Text style={styles.title}>Welcome to IloCommute!</Text>
          <Text style={styles.subtitle}>Choose how you'd like to continue</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => googleSignIn()}
            >
              <View style={styles.googleButtonContent}>
                <FontAwesome name="google" size={24} color={theme.colors.primary} />
                <Text style={styles.signInButtonText}>Sign in with Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.push("/guest")}
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
          style={styles.sitemapButton}
          onPress={() => router.replace("_sitemap")}
        >
          <Text style={styles.sitemapButtonText}>Sitemap</Text>
        </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    </>
  );
}

