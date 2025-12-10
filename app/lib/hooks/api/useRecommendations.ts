import useSWR from "swr";
import { getRecommendations } from "../../api/recommendations";
import type { RecommendationRequest, RecommendationResponse } from "../../types";

/**
 * SWR key generator for recommendation requests
 */
function getRecommendationKey(request: RecommendationRequest | null): string | null {
  if (!request) return null;
  return JSON.stringify({
    latitude: request.latitude,
    longitude: request.longitude,
    services: request.services.sort(), // Sort for consistent caching
    top_n: request.top_n,
    use_ml: request.use_ml,
  });
}

/**
 * Hook to fetch hospital recommendations
 * @param request - Recommendation request parameters (null to disable)
 * @param options - SWR options
 * @returns SWR response with recommendations data
 */
export function useRecommendations(
  request: RecommendationRequest | null,
  options?: {
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    refreshInterval?: number;
  }
) {
  const key = getRecommendationKey(request);

  const { data, error, isLoading, mutate } = useSWR<RecommendationResponse>(
    key,
    () => {
      if (!request) {
        throw new Error("Request is required");
      }
      return getRecommendations(request);
    },
    {
      revalidateOnFocus: options?.revalidateOnFocus ?? false,
      revalidateOnReconnect: options?.revalidateOnReconnect ?? true,
      refreshInterval: options?.refreshInterval,
    }
  );

  return {
    recommendations: data?.recommendations ?? [],
    total: data?.count,
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    mutate, // Allow manual revalidation
  };
}
