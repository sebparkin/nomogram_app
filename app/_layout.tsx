import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{title: 'Home'}} />
      <Stack.Screen name="nonogram_screen" options={{title: 'Nonogram'}} />
    </Stack>
    <StatusBar style='light' />
    </>
)};