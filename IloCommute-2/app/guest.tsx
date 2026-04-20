import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import FormInput from "../components/common/FormInput";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { Link, router } from "expo-router";
import Loading from "../components/common/Loading";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

interface FormData {
  name: string;
}

const Guest: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { guestLogin } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleLogin = async (data: FormData): Promise<void> => {
    try {
      setLoading(true);
      const guest = await guestLogin(data.name);

      if (guest?.error) {
        console.log(guest.message);
        setLoading(false);
        return;
      }

      router.push("/user" as any);
    } catch (error) {
      console.log("ERROR GUEST: " + error);
    } finally {
      setLoading(false);
    }
  };

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
      justifyContent: "flex-start",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      paddingTop: 100,
      borderRadius: 20,
      margin: 20,
      backgroundColor: theme.colors.contentBackground,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 32,
      textAlign: "left",
    },
    formContainer: {
      width: "100%",
      alignItems: "flex-start",
      gap: 32,
      marginBottom: 32,
    },
    input: {
      height: 40,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 4,
      width: 350,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.cardBackground,
      color: theme.colors.text,
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      width: "100%",
      elevation: 3,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    loginButtonText: {
      color: theme.colors.buttonText,
      fontSize: 16,
      textAlign: "center",
      fontWeight: "600",
    },
    backButton: {
      marginTop: 40,
    },
    backButtonText: {
      color: theme.colors.primary,
      fontSize: 14,
      textDecorationLine: "underline",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundShapes}>
        <View style={[styles.circle, styles.circleTop]} />
        <View style={[styles.circle, styles.circleBottom]} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Guest Sign-In</Text>
        <Text style={styles.subtitle}>
          Please fill out the form below to continue
        </Text>

        <View style={styles.formContainer}>
          <FormInput
            label="Name:"
            name="name"
            control={control}
            errors={errors}
            placeholder="ex. Juan Dela Cruz"
            rules={{ required: "Name is required" }}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(handleLogin)}
          >
            <Text style={styles.loginButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton}>
          <Link style={styles.backButtonText} href="/login">
            Back to Home
          </Link>
        </TouchableOpacity>
      </View>

      <Loading visible={loading} />
    </SafeAreaView>
  );
};

export default Guest;


