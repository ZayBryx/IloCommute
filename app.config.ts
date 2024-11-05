import { ExpoConfig, ConfigContext } from "expo/config";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "ilocommute",
  slug: "ilocommute",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "ilocommute",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "cover",
    backgroundColor: "#0037A4",
  },
  ios: {
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
    bundleIdentifier: "com.ilocommute.ilo",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    config: {
      googleMaps: { apiKey: GOOGLE_MAPS_API_KEY },
    },
    package: "com.ilocommute.ilo",
  },
  plugins: [
    "expo-router",
    [
      "expo-secure-store",
      {
        faceIDPermission:
          "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "27878e73-7060-47f0-a8a3-9f0bc01a0332",
    },
  },
});
