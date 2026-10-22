import { apiClient } from "./client";
import { PaginatedResponse } from "@/types/api";

const MAX_PAGES = 100;

export async function getAllPages<T>(
  initialUrl: string,
): Promise<PaginatedResponse<T>> {
  const seen = new Set<string>();
  const results: T[] = [];
  let next: string | null = initialUrl;
  let count = 0;
  let previous: string | null = null;
  let page = 0;

  while (next && !seen.has(next) && page < MAX_PAGES) {
    seen.add(next);
    const { data }: { data: PaginatedResponse<T> } = await apiClient.get(next);

    if (page === 0) {
      count = data.count;
      previous = data.previous;
    }

    results.push(...data.results);
    next = data.next;
    page += 1;
  }

  return { count, next, previous, results };
}