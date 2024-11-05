import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ViewStyle,
  TextStyle,
} from "react-native";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { Link, router } from "expo-router";
import Loading from "../components/Loading";

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

  const handleLogin = async (data: FormData): Promise<void> => {
    try {
      setLoading(true);
      await guestLogin(data.name);
      router.push("/user" as any);
    } catch (error) {
      console.log("ERROR GUEST: " + error);
    } finally {
      setLoading(false);
    }
  };

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

interface Styles {
  container: ViewStyle;
  backgroundShapes: ViewStyle;
  circle: ViewStyle;
  circleTop: ViewStyle;
  circleBottom: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  formContainer: ViewStyle;
  input: ViewStyle;
  loginButton: ViewStyle;
  loginButtonText: TextStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 100,
    borderRadius: 20,
    margin: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#062365",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
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
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 4,
    width: 350,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#0037a4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  backButton: {
    marginTop: 40,
  },
  backButtonText: {
    color: "#0037a4",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
