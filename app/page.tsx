"use client";

import { getRecommendations } from "@/lib/api/recommendations";
import type { RecommendationRequest } from "@/lib/types";

export default function Home() {
  function getLocation() {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
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
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout for high accuracy
          maximumAge: 0,
        }
      );
    });
  }

  async function handleSearch() {
    try {
      const position = await getLocation();
      const { latitude, longitude, accuracy } = position.coords;
      console.log("Location:", { latitude, longitude, accuracy });

      // Mock services for testing
      const mockServices: string[] = ["Ultrasound", "Pulmonology", "Cardiology"];

      const request: RecommendationRequest = {
        latitude,
        longitude,
        services: mockServices,
        top_n: 5,
        use_ml: true,
      };
      console.log("Sending request to ML worker:", request);

      const result = await getRecommendations(request);
      console.log("Recommendations received:", result);
      console.log(`Found ${result.recommendations.length} hospitals`);

      if (result.recommendations.length > 0) {
        alert(`Found ${result.recommendations.length} hospitals!\nCheck console for details.`);
      } else {
        alert("No hospitals found for the given criteria.");
      }
    } catch (error) {
      console.error("Error getting location or recommendations:", error);
      alert(error instanceof Error ? error.message : "Failed to get recommendations.");
    }
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-start bg-zinc-50 font-sans dark:bg-black p-4">
      Hospital Recommendation System Demo
      <input
        name="services"
        placeholder="Look for specific service"
        type="text"
        className="border-2 border-zinc-300 rounded-lg p-2 w-full max-w-md"
      />
      <select name="hospital-type" id="hospital-type">
        <option value="all">All</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
      <button
        className="bg-blue-500 text-white rounded-lg p-2 w-full max-w-md hover:bg-blue-600 cursor-pointer"
        onClick={async () => {
          await handleSearch();
        }}
      >
        Search
      </button>
    </div>
  );
}
