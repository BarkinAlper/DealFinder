import { useColorScheme } from "react-native";

import { darkTheme, lightTheme } from "@/constants/theme";

export function useThemeColors() {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  const colors = isDark ? darkTheme : lightTheme;

  return {
    colors,
    isDark,
    colorScheme,
  };
}
