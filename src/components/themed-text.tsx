import { Text, TextProps } from "react-native";

import { useThemeColors } from "../hooks/use-theme-colors";

type ThemedTextProps = TextProps & {
  variant?: "body" | "secondary" | "title" | "link" | "error";
};

export function ThemedText({
  style,
  variant = "body",
  ...props
}: ThemedTextProps) {
  const { colors } = useThemeColors();

  const color = (() => {
    switch (variant) {
      case "secondary":
        return colors.secondaryText;

      case "link":
        return colors.primary;

      case "error":
        return colors.error;

      default:
        return colors.text;
    }
  })();

  return (
    <Text
      {...props}
      style={[
        {
          color,
        },
        variant === "title" && {
          fontSize: 24,
          fontWeight: "700",
        },
        style,
      ]}
    />
  );
}
