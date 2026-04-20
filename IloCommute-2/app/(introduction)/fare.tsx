import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const FareScreen = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 20,
      padding: 20,
      borderRadius: 20,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginTop: 30,
      marginBottom: 10,
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      textAlign: "center",
      paddingHorizontal: 20,
      lineHeight: 24,
    },
    buttonContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingBottom: 30,
      gap: 10,
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "600",
    },
  }); 

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { backgroundColor: theme.colors.cardBackground }]}>
        <Ionicons name="cash-outline" size={100} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Fare Information
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          View estimated fares for your journey before you ride
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.border }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push("/location")}
        >
          <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FareScreen;

