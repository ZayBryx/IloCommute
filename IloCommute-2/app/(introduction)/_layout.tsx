import { Stack } from "expo-router";

export default function IntroductionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="search" />
      <Stack.Screen name="routes" />
      <Stack.Screen name="navigation" />
      <Stack.Screen name="fare" />
      <Stack.Screen name="location" />
    </Stack>
  );
} 