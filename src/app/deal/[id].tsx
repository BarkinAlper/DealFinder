import {
  ActivityIndicator,
  Button,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { ImageGallery } from "@/components/ui/ImageGallery";

import { ThemedText } from "../../components/themed-text";

import { ThemedView } from "../../components/themed-view";

import { useThemeColors } from "../../hooks/use-theme-colors";

import { getDeal } from "../../services/dealsApi";

import type { DealDetail } from "../../types/deal";

export default function DealDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { colors } = useThemeColors();

  const [deal, setDeal] = useState<DealDetail | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
   * Gallery üzerinde gesture devam ederken
   * Detail ScrollView kapatılacak.
   */
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    let ignore = false;

    async function loadDeal() {
      try {
        setLoading(true);
        setError(null);

        const result = await getDeal(id);

        if (!ignore) {
          setDeal(result);
        }
      } catch (error) {
        console.error("Deal loading error:", error);

        if (!ignore) {
          setError("Deal could not be loaded.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDeal();

    return () => {
      ignore = true;
    };
  }, [id]);

  async function openDealUrl() {
    if (!deal?.url) {
      return;
    }

    await Linking.openURL(deal.url);
  }

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.center,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (error || !deal) {
    return (
      <SafeAreaView
        style={[
          styles.center,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ThemedText variant="error">{error ?? "Deal not found."}</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView
        /*
         * BURASI KRİTİK.
         *
         * Image üzerinde gesture varken
         * bütün sayfanın aşağı/yukarı
         * hareket etmesini engeller.
         */
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator
        contentContainerStyle={styles.scrollContent}
      >
        <ImageGallery
          images={deal.images}
          /*
           * Parmağın image'a değdiği anda
           * parent ScrollView kapanır.
           */
          onGestureStart={() => {
            setScrollEnabled(false);
          }}
          /*
           * Parmağın bırakılması veya
           * gesture'ın iptal edilmesiyle
           * normal dikey scroll geri gelir.
           */
          onGestureEnd={() => {
            setScrollEnabled(true);
          }}
        />

        <ThemedView style={styles.content}>
          <ThemedText variant="title">{deal.title}</ThemedText>

          <ThemedText variant="secondary" style={styles.cause}>
            {deal.cause}
          </ThemedText>

          <ThemedText style={styles.description}>{deal.description}</ThemedText>

          {deal.user && (
            <View style={styles.userSection}>
              <ThemedText variant="secondary">Offered by:</ThemedText>

              <ThemedText>{deal.user.name}</ThemedText>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button title="Buy this deal" onPress={openDealUrl} />
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    padding: 16,
  },

  cause: {
    marginTop: 4,
  },

  description: {
    marginTop: 16,

    lineHeight: 22,
  },

  userSection: {
    marginTop: 20,
  },

  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
});
