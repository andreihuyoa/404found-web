export interface RecommendationRequest {
  latitude: number;
  longitude: number;
  services: string[];
  top_n?: number;
  use_ml?: boolean;
}

export interface InsuranceCoverage {
  hmo: boolean;
  philhealth: boolean;
}

export interface Recommendation {
  name_of_healthcare_facility: string;
  type: "Hospital" | "Clinic";
  classification: "Private" | "Public";
  address: string;
  municipality: string;
  region: string;
  contact_number: string;
  operating_hours: string;
  latitude: number;
  longitude: number;
  services: string[];
  insurance: InsuranceCoverage;
  hmo_coverage: string[];
  other_list_of_hmo: string[];
  distance?: number;
  preference_score?: number;
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
