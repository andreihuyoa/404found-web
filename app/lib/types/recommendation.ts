export interface RecommendationRequest {
  latitude: number;
  longitude: number;
  services: string[];
  top_n?: number;
  use_ml?: boolean;
}

export interface HospitalRecommendation {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
  score?: number;
  services?: string[];
}

export interface RecommendationResponse {
  recommendations: HospitalRecommendation[];
  total?: number;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
}
