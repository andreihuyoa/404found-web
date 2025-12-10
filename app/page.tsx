"use client";

import { useEffect, useState } from "react";
import { getRecommendations } from "@/lib/api/recommendations";
import { getServices } from "@/lib/api/services";
import type { RecommendationRequest, RecommendationResponse } from "@/lib/types";

export default function Home() {
  const [services, setServices] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);

  // Fetch services on component mount
  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        const fetchedServices = await getServices();
        console.log("Fetched services:", fetchedServices);
        console.log("Services count:", fetchedServices.length);
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
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

      // First attempt with high accuracy
      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          // If timeout or position unavailable, retry with lower accuracy
          if (
            error.code === GeolocationPositionError.TIMEOUT ||
            error.code === GeolocationPositionError.POSITION_UNAVAILABLE
          ) {
            console.log("High accuracy location failed, retrying with lower accuracy...");

            navigator.geolocation.getCurrentPosition(
              resolve,
              (fallbackError) => {
                // Fallback also failed, return appropriate error
                let errorMessage = "Failed to get location.";
                switch (fallbackError.code) {
                  case GeolocationPositionError.PERMISSION_DENIED:
                    errorMessage = "User denied the request for Geolocation.";
                    break;
                  case GeolocationPositionError.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable.";
                    break;
                  case GeolocationPositionError.TIMEOUT:
                    errorMessage = "The request to get user location timed out.";
                    break;
                  default:
                    errorMessage = "An unknown error occurred.";
                    break;
                }
                reject(new Error(errorMessage));
              },
              {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000, // Accept cached position up to 1 minute old
              }
            );
          } else {
            // Permission denied or other error - don't retry
            let errorMessage = "Failed to get location.";
            switch (error.code) {
              case GeolocationPositionError.PERMISSION_DENIED:
                errorMessage = "User denied the request for Geolocation.";
                break;
              case GeolocationPositionError.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
              case GeolocationPositionError.TIMEOUT:
                errorMessage = "The request to get user location timed out.";
                break;
              default:
                errorMessage = "An unknown error occurred.";
                break;
            }
            reject(new Error(errorMessage));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  async function handleSearch() {
    try {
      if (selectedServices.length === 0) {
        alert("Please select at least one service before searching.");
        return;
      }

      setIsLoading(true);
      setRecommendations(null);

      const position = await getLocation();
      const { latitude, longitude, accuracy } = position.coords;
      console.log("Location:", { latitude, longitude, accuracy });
      console.log("Selected services:", selectedServices);

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
      alert(error instanceof Error ? error.message : "Failed to get recommendations.");
      setRecommendations(null);
    } finally {
      setIsLoading(false);
    }
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedServices(selectedOptions);
  };

  const formatDistance = (distance?: number): string => {
    if (!distance) return "N/A";
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(2)}km`;
  };

  const getServiceFields = (recommendation: {
    [key: string]: string | number | undefined;
  }): Array<{ name: string; value: number }> => {
    const serviceFields: Array<{ name: string; value: number }> = [];
    const excludedFields = [
      "Address",
      "Classification",
      "Distance",
      "HMO",
      "name",
      "latitude",
      "longitude",
      "score",
      "preference_score",
      "Preference Score",
      "preferenceScore",
    ];

    Object.keys(recommendation).forEach((key) => {
      if (
        !excludedFields.includes(key) &&
        typeof recommendation[key] === "number" &&
        recommendation[key] === 1 // Only show services that are available (value = 1)
      ) {
        serviceFields.push({ name: key, value: recommendation[key] });
      }
    });

    return serviceFields;
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-start bg-zinc-50 font-sans dark:bg-black p-4">
      <h1 className="text-2xl font-bold">Hospital Recommendation System Demo</h1>

      <div className="w-full max-w-md flex flex-col gap-2">
        <label htmlFor="services" className="text-sm font-medium">
          Select Services (Hold Ctrl/Cmd for multiple)
        </label>
        <select
          id="services"
          name="services"
          multiple
          size={5}
          value={selectedServices}
          onChange={handleServiceChange}
          disabled={isLoading}
          className="border-2 border-zinc-300 rounded-lg p-2 w-full min-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <option value="" disabled>
              Loading services...
            </option>
          ) : services.length === 0 ? (
            <option value="" disabled>
              No services available
            </option>
          ) : (
            services.map((service, index) => (
              <option key={`service-${index}`} value={service}>
                {service}
              </option>
            ))
          )}
        </select>
        {selectedServices.length > 0 && (
          <p className="text-sm text-zinc-600">{selectedServices.length} service(s) selected</p>
        )}
      </div>

      {/* <select
        name="hospital-type"
        id="hospital-type"
        className="border-2 border-zinc-300 rounded-lg p-2 w-full max-w-md"
      >
        <option value="all">All</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select> */}

      <button
        className="bg-blue-500 text-white rounded-lg p-2 w-full max-w-md hover:bg-blue-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={async () => {
          await handleSearch();
        }}
        disabled={isLoading || selectedServices.length === 0}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>

      {recommendations && (
        <div className="w-full max-w-4xl mt-6">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Recommended Hospitals</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Found {recommendations.count} hospital{recommendations.count !== 1 ? "s" : ""}
                {/* {recommendations.ml_enabled && " (ML-enabled)"} */}
              </p>
            </div>

            {recommendations.recommendations.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                No hospitals found for the given criteria.
              </p>
            ) : (
              <div className="space-y-4">
                {recommendations.recommendations.map((hospital, index) => {
                  const serviceFields = getServiceFields(hospital);
                  return (
                    <div
                      key={index}
                      className="border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:border-blue-800 dark:hover:border-blue-800 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">
                          {hospital.name || `Hospital ${index + 1}`}
                        </h3>
                        <div className="flex gap-2">
                          {hospital.Classification && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                hospital.Classification === "Public"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {hospital.Classification}
                            </span>
                          )}
                          {hospital.HMO && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                hospital.HMO.toLowerCase() === "yes"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                              }`}
                            >
                              HMO: {hospital.HMO}
                            </span>
                          )}
                        </div>
                      </div>

                      {hospital.Address && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                          📍 {hospital.Address}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mb-3">
                        {hospital.Distance !== undefined && (
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Distance: {formatDistance(hospital.Distance)}
                          </span>
                        )}
                      </div>

                      {serviceFields.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                          <p className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                            Available Services:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {serviceFields.map((service) => (
                              <span
                                key={service.name}
                                className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded text-xs"
                              >
                                {service.name}
                              </span>
                            ))}
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
  );
}
