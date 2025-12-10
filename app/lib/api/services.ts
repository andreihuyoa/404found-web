import { API_CONFIG } from "../config/api.config";
import type { ServicesResponse } from "../types";

/**
 * Get available services from backend
 * @returns Promise resolving to array of service names (strings)
 * @throws {Error} When API call fails
 */
export async function getServices(): Promise<string[]> {
  const url = `${API_CONFIG.MODEL_BASE_URL}/csrp/services`;

  console.log("Fetching services from:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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

  const data = (await response.json()) as ServicesResponse;

  // Validate response structure
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response format from API: expected object with services array");
  }

  if (!Array.isArray(data.services)) {
    throw new Error("Invalid response format from API: services must be an array");
  }

  // Validate that all services are strings
  const invalidServices = data.services.filter((service) => typeof service !== "string");
  if (invalidServices.length > 0) {
    throw new Error("Invalid response format from API: all services must be strings");
  }

  return data.services;
}
