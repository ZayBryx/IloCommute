import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  DrawerItemList,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import defaultProfilePicture from "@/assets/icon.png";
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/constants/theme';

const DrawerComponents = (props: DrawerContentComponentProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { logout, authData } = useAuth();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    profileContainer: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      alignItems: "center",
      backgroundColor: theme.colors.surface,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    userName: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    logoutContainer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#1D3754',
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      padding: 12,
    },
    logoutText: {
      color: theme.colors.background,
      fontSize: 16,
    },
  });

  return (
    <View style={[{ flex: 1 }, { paddingTop: top }]}>
      <View style={styles.profileContainer}>
        <Image
          source={
            authData?.user?.profilePicture
              ? { uri: authData.user.profilePicture }
              : defaultProfilePicture
          }
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{authData?.user?.name || "User"}</Text>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: 10,
          backgroundColor: theme.colors.background,
        }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View
        style={[
          styles.logoutContainer,
          { paddingBottom: Math.max(20, bottom) },
        ]}
      >
        <TouchableOpacity onPress={() => logout()} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrawerComponents;
