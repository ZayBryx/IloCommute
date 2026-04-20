import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { FC } from "react";
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/constants/theme';

const Loading: FC<{ visible?: boolean }> = ({ visible = false }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loaderContainer: {
      padding: 20,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    </Modal>
  );
};

export default Loading;
