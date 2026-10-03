import { StyleSheet, TextInput } from "react-native";
import { useThemeColors } from "../../hooks/use-theme-colors";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const { colors } = useThemeColors();

  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Search deals..."
      placeholderTextColor={colors.placeholder}
      autoCorrect={false}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,

    marginHorizontal: 16,
    marginVertical: 8,

    paddingHorizontal: 12,

    borderWidth: 1,
    borderRadius: 8,

    fontSize: 16,
  },
});
