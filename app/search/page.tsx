"use client";

import { useEffect, useState } from "react";

import type {
  RecommendationRequest,
  RecommendationResponse,
} from "@/lib/types";
import { getRecommendations } from "@/lib/api/recommendations";
import { toTitleCase } from "@/lib/utils/text";
import { getServices } from "@/lib/api/services";
import {
  HEALTH_SERVICES,
  type HealthService,
} from "@/domain/types/services.types";

import MapboxSection from "../../components/MapboxSection";
import Tooltip from "../../components/ui/Tooltip";
import {
  ArrowLeft,
  Clock,
  Loader,
  MapPin,
  Phone,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [selectedServices, setSelectedServices] = useState<HealthService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  const [userLocation, setUserLocation] = useState<
    { latitude: number; longitude: number } | undefined
  >(undefined);

  // Fetch services on component mount
  useEffect(() => {
    // Services are statically defined in HEALTH_SERVICES; just unblock loading.
    // getServices() is still called to validate the API is reachable.
    async function fetchServices() {
      try {
        await getServices();
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  function getLocation(): Promise<GeolocationPosition> {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      const getErrorMessage = (error: GeolocationPositionError): string => {
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            return "User denied the request for Geolocation.";
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            return "Location information is unavailable.";
          case GeolocationPositionError.TIMEOUT:
            return "The request to get user location timed out.";
          default:
            return "An unknown error occurred.";
        }
      };

      // First attempt with high accuracy
      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          // If timeout or position unavailable, retry with lower accuracy
          if (
            error.code === GeolocationPositionError.TIMEOUT ||
            error.code === GeolocationPositionError.POSITION_UNAVAILABLE
          ) {
            console.log(
              "High accuracy location failed, retrying with lower accuracy...",
            );

            navigator.geolocation.getCurrentPosition(
              resolve,
              (fallbackError) => {
                // Fallback also failed, return appropriate error
                reject(new Error(getErrorMessage(fallbackError)));
              },
              {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000, // Accept cached position up to 1 minute old
              },
            );
          } else {
            // Permission denied or other error - don't retry
            reject(new Error(getErrorMessage(error)));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 25000,
          maximumAge: 10000,
        },
      );
    });
  }

  async function handleSearch() {
    try {
      if (selectedServices.length === 0) {
        setLocationError(
          "Please select at least one service before searching.",
        );
        return;
      }

      setLocationError(null);
      setIsLoading(true);
      setRecommendations(null);

      const position = await getLocation();
      const { latitude, longitude, accuracy } = position.coords;
      console.log("Location:", { latitude, longitude, accuracy });
      console.log("Selected services:", selectedServices);

      // Store user location for map
      setUserLocation({ latitude, longitude });

      const request: RecommendationRequest = {
        latitude,
        longitude,
        services: selectedServices,
        top_n: 5,
        use_ml: true,
      };
      console.log("Sending request to ML worker:", request);

      const result = await getRecommendations(request);
      console.log("Recommendations received:", result);
      console.log(`Found ${result.recommendations.length} hospitals`);

      setRecommendations(result);
    } catch (error) {
      console.error("Error getting location or recommendations:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to get recommendations.",
      );
      setRecommendations(null);
    } finally {
      setIsLoading(false);
    }
  }

  const handleServiceChange = (service: HealthService) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const formatDistance = (distance?: number): string => {
    if (!distance) return "N/A";
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(2)}km`;
  };

  const getServiceFields = (
    hospital: RecommendationResponse["recommendations"][number],
  ): HealthService[] => {
    if (Array.isArray(hospital.services)) {
      // Cast is safe: the API contract guarantees values match HealthService.
      return hospital.services as HealthService[];
    }
    return [];
  };

  return (
    <div className="bg-background dark:bg-foreground flex min-h-screen cursor-default flex-col lg:h-screen lg:overflow-hidden">
      {/* Navigation — no extra padding per requirement */}
      <header className="border-text/10 shrink-0 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between sm:h-16">
            <Link
              href="/"
              className="text-text hover:text-primary flex w-16 shrink-0 items-center gap-1.5 transition-colors sm:w-20 sm:gap-2"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm font-medium sm:text-base">Back</span>
            </Link>
            <p className="text-primary min-w-0 flex-1 cursor-default px-2 text-center font-serif text-xl font-bold sm:text-4xl">
              Find Healthcare Providers
            </p>
            <div className="w-16 shrink-0 sm:w-20" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:overflow-hidden">
        {/* Left — Service selection panel */}
        <div className="w-full shrink-0 lg:w-96 lg:self-center xl:w-125">
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
            <h2 className="text-text mb-1 text-base font-bold">
              Select Medical Services
            </h2>
            <p className="text-text/70 mb-3 text-xs">Check services you need</p>

            <div className="max-h-48 overflow-y-auto lg:max-h-none lg:overflow-visible">
              {HEALTH_SERVICES.map((service) => (
                <label
                  key={service}
                  className="hover:bg-primary/5 flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceChange(service)}
                    className="accent-primary h-3.5 w-3.5 shrink-0 cursor-pointer"
                  />
                  <span className="text-text flex-1 text-sm">{service}</span>
                </label>
              ))}
            </div>

            {/* Selected services summary */}
            <div className="bg-primary/5 mt-4 rounded-lg p-3">
              <p className="text-text mb-2 text-xs font-medium">
                Selected: <strong>{selectedServices.length}</strong>
              </p>
              {selectedServices.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedServices.map((svc) => (
                    <span
                      key={svc}
                      className="bg-primary inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs text-white"
                    >
                      {svc}
                      <button
                        onClick={() => handleServiceChange(svc)}
                        className="hover:text-white/70"
                      >
                        <X className="h-3 w-3 cursor-pointer" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-text/70 text-xs">No services selected</p>
              )}
            </div>

            {locationError && (
              <div className="mt-3 rounded-lg border border-red-200/20 bg-red-500/10 p-3">
                <p className="text-xs font-medium text-red-700">
                  {locationError}
                </p>
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={isLoading || selectedServices.length === 0}
              className="bg-primary mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Hospitals
                </>
              )}
            </button>

            <div className="border-secondary/30 bg-secondary/10 mt-3 rounded-lg border p-3">
              <p className="text-text/70 text-xs">
                <strong>Note:</strong> This demo shows hospitals in Ermita,
                Manila. Location access will be requested when you search.
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE — Map (always visible; fixed height on mobile, fills remaining height on desktop) */}
        <div className="min-h-[320px] flex-1 lg:min-h-0">
          <div className="h-[320px] overflow-hidden rounded-xl shadow-sm lg:h-full">
            <MapboxSection
              userLocation={userLocation}
              recommendations={recommendations?.recommendations}
              zoomLevel={12}
            />
          </div>
        </div>

        {/* Right — Recommendations */}
        {recommendations && (
          <div className="w-full shrink-0 lg:w-96 lg:overflow-y-auto xl:w-125">
            <div className="rounded-xl bg-white p-4 shadow-sm lg:h-full lg:overflow-y-auto dark:bg-zinc-800">
              <div className="mb-4">
                <h2 className="text-base font-bold">Recommended Hospitals</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Found {recommendations.count} hospital
                  {recommendations.count !== 1 ? "s" : ""} · Ranked by
                  relevance, distance, and service match
                </p>
              </div>

              {recommendations.recommendations.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No hospitals found for the given criteria.
                </p>
              ) : (
                <div className="space-y-3">
                  {recommendations.recommendations.map((hospital, index) => {
                    const serviceFields = getServiceFields(hospital);
                    const classification = hospital.classification;
                    const philhealth = hospital.insurance?.philhealth;
                    const hmo = hospital.insurance?.hmo;
                    const otherHmoList =
                      Array.isArray(hospital.other_list_of_hmo) &&
                      hospital.other_list_of_hmo.length > 0
                        ? hospital.other_list_of_hmo.map((item) =>
                            toTitleCase(item),
                          )
                        : [];
                    const otherHmoRemaining = otherHmoList.slice(5).join(", ");

                    return (
                      <div
                        key={index}
                        className="border-text/10 hover:border-primary rounded-lg border-2 p-3 transition-colors"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="text-text text-sm leading-snug font-semibold">
                            {hospital.name_of_healthcare_facility ||
                              `Hospital ${index + 1}`}
                          </h3>
                          <div className="flex shrink-0 flex-wrap gap-1">
                            {classification && (
                              <span
                                className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                                  classification === "Public"
                                    ? "bg-accent/20 text-accent"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {classification}
                              </span>
                            )}
                            {philhealth === true && (
                              <span className="bg-accent/20 text-accent rounded px-1.5 py-0.5 text-xs font-medium">
                                PhilHealth
                              </span>
                            )}
                            {hmo === true && (
                              <span className="bg-secondary/30 text-secondary rounded px-1.5 py-0.5 text-xs font-medium">
                                HMO
                              </span>
                            )}
                          </div>
                        </div>

                        {hospital.address && (
                          <p className="text-text/60 mb-1.5 flex items-start gap-1 text-xs">
                            <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                            {hospital.address}
                          </p>
                        )}

                        <div className="text-text/60 mb-2 flex flex-wrap items-center gap-2 text-xs">
                          {hospital.contact_number && (
                            <span className="flex items-center gap-1 break-all">
                              <Phone className="h-3 w-3 shrink-0" />
                              {hospital.contact_number}
                            </span>
                          )}
                          {hospital.operating_hours && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 shrink-0" />
                              {hospital.operating_hours}
                            </span>
                          )}
                          {hospital.distance !== undefined && (
                            <span className="text-primary font-medium">
                              {formatDistance(hospital.distance)} away
                            </span>
                          )}
                        </div>

                        {serviceFields.length > 0 && (
                          <div className="border-text/10 mt-2 border-t pt-2">
                            <p className="text-text/60 mb-1.5 text-xs font-medium">
                              Available Services:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {[...serviceFields]
                                .sort((a, b) => {
                                  const aSel = selectedServices.includes(a);
                                  const bSel = selectedServices.includes(b);
                                  if (aSel === bSel) return a.localeCompare(b);
                                  return aSel ? -1 : 1;
                                })
                                .map((service) => {
                                  const isSelected =
                                    selectedServices.includes(service);
                                  return (
                                    <span
                                      key={service}
                                      className={`rounded px-1.5 py-0.5 text-xs ${
                                        isSelected
                                          ? "bg-primary/15 text-primary font-medium"
                                          : "bg-text/5 text-text/60"
                                      }`}
                                    >
                                      {service}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>
                        )}

                        {Array.isArray(hospital.hmo_coverage) &&
                          hospital.hmo_coverage.length > 0 && (
                            <div className="border-text/10 mt-2 border-t pt-2">
                              <p className="text-text/60 mb-1.5 text-xs font-medium">
                                Insurance Accepted:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {hospital.hmo_coverage.map((hmoItem) => (
                                  <span
                                    key={hmoItem}
                                    className="bg-secondary/20 text-secondary rounded px-1.5 py-0.5 text-xs"
                                  >
                                    {hmoItem}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        {Array.isArray(hospital.other_list_of_hmo) &&
                          hospital.other_list_of_hmo.length > 0 && (
                            <div className="border-text/10 mt-2 border-t pt-2">
                              <p className="text-text/60 mb-1.5 text-xs font-medium">
                                Other HMOs:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {hospital.other_list_of_hmo
                                  .slice(0, 5)
                                  .map((hmoItem) => (
                                    <span
                                      key={hmoItem}
                                      className="bg-text/5 text-text/70 rounded px-1.5 py-0.5 text-xs"
                                    >
                                      {toTitleCase(hmoItem)}
                                    </span>
                                  ))}
                                {hospital.other_list_of_hmo.length > 5 && (
                                  <Tooltip
                                    content={otherHmoRemaining}
                                    side="right"
                                  >
                                    <span className="text-primary bg-primary/10 cursor-pointer rounded px-1.5 py-0.5 text-xs">
                                      + {otherHmoList.length - 5} more
                                    </span>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
