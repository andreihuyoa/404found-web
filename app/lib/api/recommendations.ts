import { API_CONFIG } from "../config/api.config";
import type { RecommendationRequest, RecommendationResponse } from "../types";

/**
 * Get hospital recommendations from ML service
 * @param request - Recommendation request parameters
 * @returns Promise resolving to recommendation response
 * @throws {Error} When API call fails
 */
export async function getRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const url = `${API_CONFIG.MODEL_BASE_URL}/csrp/recommend`;

  console.log("Calling:", url);
  console.log("Request:", JSON.stringify(request, null, 2));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude: request.latitude,
      longitude: request.longitude,
      services: request.services,
      ...(request.top_n !== undefined && { top_n: request.top_n }),
      ...(request.use_ml !== undefined && { use_ml: request.use_ml }),
    }),
  });

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use default message
    }

    const error = new Error(errorMessage);
    (error as Error & { statusCode: number }).statusCode = response.status;
    throw error;
  }

  const data = (await response.json()) as RecommendationResponse;

  // Validate response structure
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response format from API");
  }

  return data;
}
