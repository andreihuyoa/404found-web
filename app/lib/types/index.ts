export interface RecommendationRequest {
  latitude: number;
  longitude: number;
  services: string[];
  top_n?: number;
  use_ml?: boolean;
}

export interface Recommendation {
  [key: string]: string | number | undefined;
  Address?: string;
  Classification?: string;
  Distance?: number;
  HMO?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
}

export interface RecommendationQuery {
  latitude: number;
  longitude: number;
  services: string[];
  top_n?: number;
}

export interface RecommendationResponse {
  count: number;
  ml_enabled: boolean;
  query: RecommendationQuery;
  recommendations: Recommendation[];
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

export interface ServicesResponse {
  count: number;
  services: string[];
}
