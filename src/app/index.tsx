import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "expo-router";

import { ThemedView } from "../components/themed-view";

import { DealCard } from "../components/deal/DealCard";

import { SearchBar } from "../components/ui/SearchBar";

import { getDeals, searchDeals } from "../services/dealsApi";

import { SafeAreaView } from "react-native-safe-area-context";
import { DealSummary } from "../types/deal";

export default function HomeScreen() {
  const router = useRouter();

  const [deals, setDeals] = useState<DealSummary[]>([]);

  const [searchResults, setSearchResults] = useState<DealSummary[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadDeals() {
      try {
        setLoading(true);
        setError(null);

        const result = await getDeals();

        if (!ignore) {
          setDeals(result);
        }
      } catch {
        if (!ignore) {
          setError(
            "Deals could not be loaded.Check your API server." +
              process.env.EXPO_PUBLIC_API_URL +
              "/deals",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDeals();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const term = searchTerm.trim();

    if (!term) {
      setSearchResults([]);

      return;
    }

    let ignore = false;

    const timer = setTimeout(async () => {
      try {
        const result = await searchDeals(term);

        if (!ignore) {
          setSearchResults(result);
        }
      } catch {
        if (!ignore) {
          setSearchResults([]);
        }
      }
    }, 300);

    return () => {
      ignore = true;

      clearTimeout(timer);
    };
  }, [searchTerm]);

  const openDeal = useCallback(
    (id: string) => {
      router.push({
        pathname: "/deal/[id]",
        params: { id },
      });
    },
    [router],
  );

  const renderDeal = useCallback(
    ({ item }: { item: DealSummary }) => (
      <DealCard deal={item} onPress={() => openDeal(item.id)} />
    ),
    [openDeal],
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const isSearching = searchTerm.trim().length > 0;

  const dealsToDisplay = isSearching ? searchResults : deals;

  return (
    <ThemedView>
      <SafeAreaView>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <FlatList
          data={dealsToDisplay}
          keyExtractor={(item) => item.id}
          renderItem={renderDeal}
          ListEmptyComponent={<Text>No deals found.</Text>}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
});
