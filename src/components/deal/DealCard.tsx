import { Image, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "../themed-text";

import { ThemedView } from "../themed-view";

import { DealSummary } from "@/types/deal";

import { useThemeColors } from "@/hooks/use-theme-colors";
import { formatPrice } from "@/utils/price";

type Props = {
  deal: DealSummary;
  onPress: () => void;
};

export function DealCard({ deal, onPress }: Props) {
  const { colors } = useThemeColors();
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ThemedView
        surface
        style={[
          styles.card,
          {
            borderColor: colors.border,
          },
        ]}
      >
        <Image
          source={{
            uri: deal.imageUrl,
          }}
          style={styles.image}
        />

        <ThemedText style={styles.title}>{deal.title}</ThemedText>

        <ThemedText style={styles.price}>{formatPrice(deal.price)}</ThemedText>

        <ThemedText variant="secondary" style={styles.cause}>
          {deal.cause}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,

    borderRadius: 12,
    borderWidth: 1,

    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 180,
  },

  title: {
    marginTop: 12,

    fontSize: 18,
    fontWeight: "600",
  },

  price: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: "700",
  },
  cause: {
    marginTop: 6,
    fontSize: 14,
  },
});
