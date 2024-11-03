import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { FC } from "react";

const Loading: FC<{ visible?: boolean }> = ({ visible = false }) => {
  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    </Modal>
  );
};

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
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loading;
