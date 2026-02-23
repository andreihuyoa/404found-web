/**
 * List of health services.
 * Update this list when new services are added/removed.
 */
export const HEALTH_SERVICES = [
  "Teleconsultation",
  "Laboratory",
  "X-Ray",
  "CT Scan",
  "MRI",
  "Ultrasound",
  "Pediatrics",
  "General Surgeon",
  "Psychiatry",
  "Internal Medicine",
  "Dermatology",
  "Ob-gynecology",
  "Cardiology",
  "Pulmonology",
  "Neurology",
] as const;

export type HealthService = (typeof HEALTH_SERVICES)[number];
