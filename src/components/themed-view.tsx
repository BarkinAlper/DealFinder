import { View, ViewProps } from "react-native";

import { useThemeColors } from "../hooks/use-theme-colors";

type ThemedViewProps = ViewProps & {
  surface?: boolean;
};

export function ThemedView({
  style,
  surface = false,
  ...props
}: ThemedViewProps) {
  const { colors } = useThemeColors();

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: surface ? colors.surface : colors.background,
        },
        style,
      ]}
    />
  );
}
