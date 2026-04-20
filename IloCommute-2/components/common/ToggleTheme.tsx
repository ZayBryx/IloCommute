import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";

const ToggleTheme = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={{
        marginRight: 15,
        padding: 8,
      }}
    >
      <MaterialIcons 
        name={isDarkMode ? "light-mode" : "dark-mode"} 
        size={24} 
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
};

export default ToggleTheme; 