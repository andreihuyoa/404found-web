export interface RecommendationRequest {
  latitude: number;
  longitude: number;
  services: string[];
  top_n?: number;
  use_ml?: boolean;
}

export interface Recommendation {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
  score?: number;
  services?: string[];
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  total?: number;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}
