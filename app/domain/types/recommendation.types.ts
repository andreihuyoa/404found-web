/**
 * Domain layer: Core types and interfaces for hospital recommendations
 * No external dependencies - pure TypeScript types
 */

/**
 * Request payload for hospital recommendation
 */
export interface RecommendationRequest {
  latitude: number;
  longitude: number;
  services: string[];
  top_n?: number;
  use_ml?: boolean;
}

/**
 * Hospital recommendation result
 */
export interface HospitalRecommendation {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
  score?: number;
  services?: string[];
  // [key: string]: unknown; // Allow additional fields from API
}

/**
 * Response from recommendation API
 */
export interface RecommendationResponse {
  recommendations: HospitalRecommendation[];
  total?: number;
  [key: string]: unknown; // Allow additional fields from API
}

/**
 * Domain error types
 */
export class RecommendationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "RecommendationError";
  }
}

export class ValidationError extends RecommendationError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class ApiError extends RecommendationError {
  constructor(
    message: string,
    statusCode: number = 500,
    public readonly originalError?: unknown,
  ) {
    super(message, statusCode, "API_ERROR");
    this.name = "ApiError";
  }
}
