import { DealDetail, DealSummary } from "../types/deal";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not configured");
}

export async function getDeals(): Promise<DealSummary[]> {
  const response = await fetch(`${API_URL}/api/deals`);

  if (!response.ok) {
    throw new Error(`Deals could not be loaded: ${response.status}`);
  }

  const data: DealSummary[] = await response.json();

  return data;
}

export async function getDeal(id: string): Promise<DealDetail> {
  const response = await fetch(`${API_URL}/api/deals/${id}`);

  if (!response.ok) {
    throw new Error(`Deal could not be loaded: ${response.status}`);
  }

  const data: DealDetail = await response.json();

  return data;
}

export async function searchDeals(searchTerm: string): Promise<DealSummary[]> {
  const query = encodeURIComponent(searchTerm);

  const response = await fetch(`${API_URL}/api/deals?searchTerm=${query}`);

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data: DealSummary[] = await response.json();

  return data;
}
