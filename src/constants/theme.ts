/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";


export const lightTheme = {
  background: "#F5F5F5",
  surface: "#FFFFFF",

  text: "#1F2937",
  secondaryText: "#6B7280",

  primary: "#2563EB",
  onPrimary: "#FFFFFF",

  border: "#D1D5DB",

  inputBackground: "#FFFFFF",
  placeholder: "#9CA3AF",

  error: "#DC2626",
};

export const darkTheme = {
  background: "#111827",
  surface: "#1F2937",

  text: "#F9FAFB",
  secondaryText: "#9CA3AF",

  primary: "#60A5FA",
  onPrimary: "#111827",

  border: "#374151",

  inputBackground: "#1F2937",
  placeholder: "#9CA3AF",

  error: "#F87171",
};

export type AppTheme = typeof lightTheme;
