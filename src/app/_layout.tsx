import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const navigationTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Deals",
          }}
        />

        <Stack.Screen
          name="deal/[id]"
          options={{
            title: "Deal Detail",

            // Galeri swipe hareketleriyle
            // Stack'in geri gitme gesture'ının
            // çakışmasını engeller.
            gestureEnabled: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
