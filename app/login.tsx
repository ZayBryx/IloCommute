import { Link, router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function login() {
  return (
    <>
      <ExpoStatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <View style={styles.backgroundShapes}>
          <View style={[styles.circle, styles.circleTop]} />
          <View style={[styles.circle, styles.circleBottom]} />
        </View>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.icon}
            />
          </View>
          <Text style={styles.title}>Welcome to IloCommute!</Text>
          <Text style={styles.subtitle}>Choose how you'd like to continue</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.signInButton} onPress={login}>
              <View style={styles.googleButtonContent}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    marginTop: StatusBar.currentHeight,
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
    backgroundColor: "#0037a4",
    top: -width * 0.2,
    right: -width * 0.2,
  },
  circleBottom: {
    backgroundColor: "#0037a4",
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
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    opacity: 0.8,
    backgroundColor: "rgba(0, 55, 164, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    overflow: "hidden",
    shadowColor: "#000",
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
    color: "#3d3d3d",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#b0b0b0",
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
    backgroundColor: "#0037a4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: 300,
    height: 50,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  signInButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  guestButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    width: 300,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guestButtonText: {
    color: "#7b7b7b",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  sitemapButton: {
    marginTop: 40,
  },
  sitemapButtonText: {
    color: "#0037a4",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
