"use client";

import { useEffect, useState } from "react";
import { getRecommendations } from "@/lib/api/recommendations";
import { getServices } from "@/lib/api/services";
import { toTitleCase } from "@/lib/utils/text";
import type { RecommendationRequest, RecommendationResponse } from "@/lib/types";
import MapboxSection from "../components/MapboxSection";
import Tooltip from "../components/ui/Tooltip";

export default function Home() {
  const [services, setServices] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [userLocation, setUserLocation] = useState<
    { latitude: number; longitude: number } | undefined
  >(undefined);
  const [showInfo, setShowInfo] = useState(false);

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
            console.log("High accuracy location failed, retrying with lower accuracy...");

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
              }
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

  const getServiceFields = (
    hospital: RecommendationResponse["recommendations"][number]
  ): string[] => {
    if (Array.isArray(hospital.services)) {
      return hospital.services;
    }
    return [];
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-start bg-zinc-50 font-sans dark:bg-black p-4">
      <h1 className="text-2xl font-bold">Ermita Healthcare Facility Finder Thesis Project</h1>

      {/* Information Section */}
      <div className="w-full max-w-4xl">
        <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full flex items-center justify-between text-left transition-colors duration-200 rounded p-2 -m-2"
          >
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              ℹ️ About this application
            </h2>
            <span
              className={`text-blue-600 dark:text-blue-400 text-xl transition-transform duration-300 hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer ${
                showInfo ? "rotate-0" : "rotate-90"
              }`}
            >
              {showInfo ? "−" : "+"}
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showInfo ? "max-h-[3000px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <div className="space-y-4 text-sm text-blue-900 dark:text-blue-200">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-3">
                <h3 className="font-semibold mb-1 text-base">⚠️ Important Notes:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong>Coverage:</strong> This application currently only recommends healthcare
                    facilities located in Ermita, Manila. We plan to expand the coverage to other
                    areas in the future.
                  </li>
                  <li>
                    <strong>Location Permission Required:</strong> This application needs access to
                    your location to provide accurate recommendations.
                  </li>
                  <li>
                    <strong>Service Selection:</strong> You must select at least one service before
                    searching.
                  </li>
                  <li>
                    <strong>Results Limit:</strong> The system returns up to 5 top-ranked
                    recommendations to keep results relevant.
                  </li>
                  <li>
                    <strong>Accuracy:</strong> Location accuracy depends on the device&apos;s GPS
                    capabilities and network conditions.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-base">What is this application?</h3>
                <p className="mb-2">
                  This Hospital Recommendation System is a healthcare facility finder that helps
                  users discover nearby hospitals based on their location and specific medical
                  service needs. The system uses machine learning algorithms to provide personalized
                  recommendations, ranking hospitals by relevance, distance, and service
                  availability.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base">How to use:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong>Select Medical Services:</strong> In the dropdown menu below, select one
                    or more medical services you need. You can select multiple services by holding
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded text-xs mx-1">
                      Ctrl
                    </kbd>
                    (Windows/Linux) or
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded text-xs mx-1">
                      Cmd
                    </kbd>
                    (Mac) while clicking. The selected services will be highlighted, and you&apos;ll
                    see a count of how many services you&apos;ve selected.
                  </li>
                  <li>
                    <strong>Click the Search Button:</strong> Once you&apos;ve selected at least one
                    service, click the &quot;Search&quot; button. The application will:
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li>Request your location permission (if not already granted)</li>
                      <li>Use your current geographic location to find nearby hospitals</li>
                      <li>Filter hospitals that offer your selected services</li>
                      <li>
                        Rank results using ML algorithms based on distance, service match, and other
                        factors
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Review Results:</strong> After searching, you&apos;ll see:
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li>
                        <strong>Interactive Map:</strong> A map showing your location (blue marker)
                        and recommended hospitals (red markers). Click on markers to see more
                        details.
                      </li>
                      <li>
                        <strong>Hospital List:</strong> A detailed list of up to 5 recommended
                        hospitals, sorted by relevance. Each entry includes:
                        <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                          <li>Hospital name and classification (Public/Private)</li>
                          <li>Full address and contact information</li>
                          <li>Distance from your location</li>
                          <li>Available services (with your selected services highlighted)</li>
                          <li>Insurance coverage (PhilHealth, HMO, and other HMO providers)</li>
                          <li>Operating hours and location details</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Explore Recommendations:</strong> Scroll through the hospital list to
                    compare options. Services you selected are highlighted in blue, while other
                    available services are shown in gray. Hover over the &quot;+ X more&quot;
                    tooltip to see additional HMO providers.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Map and Recommendations Section */}
      <div
        className={`w-full max-w-7xl mt-6 ${
          recommendations
            ? "flex flex-col lg:flex-row gap-6 justify-between"
            : "flex justify-center"
        }`}
      >
        {/* Map Section - Always visible */}
        <div className={recommendations ? "w-full lg:w-1/2" : "w-full max-w-4xl"}>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 w-full h-[420px] lg:h-[600px]">
            {/* <h2 className="text-xl font-bold mb-4">Map</h2> */}
            <div className="h-full">
              <MapboxSection
                userLocation={userLocation}
                recommendations={recommendations?.recommendations}
              />
            </div>
          </div>
        </div>

        {/* Recommendations Section - Only shown when recommendations exist */}
        {recommendations && (
          <div className="w-full lg:w-1/2">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-full h-[420px] lg:h-[600px] flex flex-col">
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
                <div className="space-y-4 overflow-y-auto flex-1">
                  {recommendations.recommendations.map((hospital, index) => {
                    const serviceFields = getServiceFields(hospital);
                    const classification = hospital.classification;
                    const philhealth = hospital.insurance?.philhealth;
                    const hmo = hospital.insurance?.hmo;
                    const otherHmoList =
                      Array.isArray(hospital.other_list_of_hmo) &&
                      hospital.other_list_of_hmo.length > 0
                        ? hospital.other_list_of_hmo.map((item) => toTitleCase(item))
                        : [];
                    const otherHmoRemaining = otherHmoList.slice(5).join(", ");

                    return (
                      <div
                        key={index}
                        className="border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:border-blue-800 dark:hover:border-blue-800 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">
                            {hospital.name_of_healthcare_facility || `Hospital ${index + 1}`}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            {classification && (
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  classification === "Public"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                }`}
                              >
                                {classification}
                              </span>
                            )}
                            {philhealth === true && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                PhilHealth
                              </span>
                            )}
                            {hmo === true && (
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"}`}
                              >
                                HMO
                              </span>
                            )}

                            {/* {hospital.preference_score !== undefined && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                Score: {hospital.preference_score.toFixed(2)}
                              </span>
                            )} */}
                          </div>
                        </div>

                        {hospital.address && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            📍 {hospital.address}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-zinc-700 dark:text-zinc-300">
                          {hospital.municipality && <span>{hospital.municipality}</span>}
                          {hospital.region && <span>{hospital.region}</span>}
                          {hospital.contact_number && (
                            <span className="break-all">☎ {hospital.contact_number}</span>
                          )}
                          {hospital.operating_hours && <span>🕒 {hospital.operating_hours}</span>}
                          {hospital.distance !== undefined && (
                            <span className="font-medium">
                              Distance: {formatDistance(hospital.distance)}
                            </span>
                          )}
                        </div>

                        {serviceFields.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                            <p className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                              Available Services:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {[...serviceFields]
                                .sort((a, b) => {
                                  const aSel = selectedServices.includes(a);
                                  const bSel = selectedServices.includes(b);
                                  if (aSel === bSel) return a.localeCompare(b);
                                  return aSel ? -1 : 1;
                                })
                                .map((service) => {
                                  const isSelected = selectedServices.includes(service);
                                  return (
                                    <span
                                      key={service}
                                      className={`px-2 py-1 rounded text-xs ${
                                        isSelected
                                          ? "bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                                          : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100"
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
                            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                              <p className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                                HMO Coverage:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {hospital.hmo_coverage.map((hmoItem) => (
                                  <span
                                    key={hmoItem}
                                    className="px-2 py-1 bg-purple-50 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded text-xs"
                                  >
                                    {hmoItem}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        {Array.isArray(hospital.other_list_of_hmo) &&
                          hospital.other_list_of_hmo.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                              <p className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                                Other HMOs:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {hospital.other_list_of_hmo.slice(0, 5).map((hmoItem) => (
                                  <span
                                    key={hmoItem}
                                    className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded text-xs"
                                  >
                                    {toTitleCase(hmoItem)}
                                  </span>
                                ))}
                                {hospital.other_list_of_hmo.length > 5 && (
                                  <Tooltip content={otherHmoRemaining}>
                                    <span className="px-2 py-1 bg-zinc-200 dark:bg-zinc-600 rounded text-xs cursor-pointer">
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
