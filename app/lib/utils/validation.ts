import type { RecommendationRequest } from "../types";

/**
 * Validates recommendation request
 * @param request - Request to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validateRecommendationRequest(request: unknown): {
  isValid: boolean;
  error?: string;
} {
  if (!request || typeof request !== "object") {
    return { isValid: false, error: "Request body must be an object" };
  }

  const req = request as Record<string, unknown>;

  // Validate latitude
  if (typeof req.latitude !== "number" || isNaN(req.latitude)) {
    return { isValid: false, error: "Latitude must be a valid number" };
  }

  if (req.latitude < -90 || req.latitude > 90) {
    return {
      isValid: false,
      error: "Latitude must be between -90 and 90 degrees",
    };
  }

  // Validate longitude
  if (typeof req.longitude !== "number" || isNaN(req.longitude)) {
    return { isValid: false, error: "Longitude must be a valid number" };
  }

  if (req.longitude < -180 || req.longitude > 180) {
    return {
      isValid: false,
      error: "Longitude must be between -180 and 180 degrees",
    };
  }

  // Validate services
  if (!Array.isArray(req.services)) {
    return { isValid: false, error: "Services must be an array" };
  }

  if (req.services.length === 0) {
    return { isValid: false, error: "At least one service must be provided" };
  }

  if (!req.services.every((service) => typeof service === "string" && service.trim().length > 0)) {
    return { isValid: false, error: "All services must be non-empty strings" };
  }

  // Validate optional fields
  if (req.top_n !== undefined) {
    if (typeof req.top_n !== "number" || req.top_n < 1) {
      return {
        isValid: false,
        error: "top_n must be a positive number if provided",
      };
    }
  }

  if (req.use_ml !== undefined && typeof req.use_ml !== "boolean") {
    return { isValid: false, error: "use_ml must be a boolean if provided" };
  }

  return { isValid: true };
}

/**
 * Normalizes request to RecommendationRequest type
 * Assumes validation has already passed
 */
export function normalizeRecommendationRequest(
  request: Record<string, unknown>
): RecommendationRequest {
  return {
    latitude: request.latitude as number,
    longitude: request.longitude as number,
    services: request.services as string[],
    ...(request.top_n !== undefined && { top_n: request.top_n as number }),
    ...(request.use_ml !== undefined && { use_ml: request.use_ml as boolean }),
  };
}
