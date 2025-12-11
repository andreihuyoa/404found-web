"use client";

import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import type { Recommendation } from "@/lib/types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface MapboxSectionProps {
  userLocation?: { latitude: number; longitude: number };
  recommendations?: Recommendation[];
  zoomLevel?: number;
}

export default function MapboxSection({
  userLocation,
  recommendations = [],
  zoomLevel = 10,
}: MapboxSectionProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token is not set.");
      return;
    }

    const defaultCenter: [number, number] = [120.9825, 14.5861]; // Ermita

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: defaultCenter,
        zoom: zoomLevel,
      });

      mapRef.current = map;

      map.on("error", (e) => {
        // Ignore telemetry errors (ERR_BLOCKED_BY_CLIENT from ad blockers)
        if (
          e.error?.message?.includes("events.mapbox.com") ||
          e.error?.message?.includes("ERR_BLOCKED_BY_CLIENT")
        ) {
          console.warn(
            "Mapbox telemetry blocked by ad blocker (this is harmless):",
            e.error?.message
          );
          return;
        }
        console.error("Mapbox error:", e);
      });

      // Wait for map to load before adding controls
      map.on("load", () => {
        if (!map.hasControl(new mapboxgl.NavigationControl())) {
          map.addControl(new mapboxgl.NavigationControl(), "top-right");
        }
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map when user location changes
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const map = mapRef.current;
    const center: [number, number] = [userLocation.longitude, userLocation.latitude];

    // Fly to user location
    map.flyTo({
      center,
      zoom: zoomLevel + 3,
      duration: 1500,
    });

    // Add or update user location marker
    interface MarkerWithUserLocation extends mapboxgl.Marker {
      _userLocation?: boolean;
    }
    const existingUserMarker = markersRef.current.find(
      (m) => (m as MarkerWithUserLocation)._userLocation
    ) as MarkerWithUserLocation | undefined;
    if (existingUserMarker) {
      existingUserMarker.setLngLat(center);
    } else {
      // Create custom marker element for user location
      const el = document.createElement("div");
      el.className = "user-marker";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#3b82f6";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

      const userMarker = new mapboxgl.Marker({ element: el })
        .setLngLat(center)
        .addTo(map) as MarkerWithUserLocation;
      userMarker._userLocation = true;
      markersRef.current.push(userMarker);
    }
  }, [userLocation, zoomLevel]);

  // Update hospital markers when recommendations change
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Remove existing hospital markers (keep user location marker)
    interface MarkerWithUserLocation extends mapboxgl.Marker {
      _userLocation?: boolean;
    }
    markersRef.current = markersRef.current.filter((marker) => {
      if ((marker as MarkerWithUserLocation)._userLocation) {
        return true;
      }
      marker.remove();
      return false;
    });

    // Add markers for each hospital
    recommendations.forEach((hospital) => {
      const lat = hospital.latitude;
      const lng = hospital.longitude;

      if (lat && lng) {
        const hospitalName = hospital.name_of_healthcare_facility || "Hospital";

        // Create popup with hospital info
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2 rounded-4xl">
            <h3 class="font-semibold text-md text-black">${hospitalName}</h3>
            ${hospital.address ? `<p class="text-xs text-gray-600">${hospital.address}</p>` : ""}
            ${
              hospital.distance !== undefined
                ? `<p class="text-xs text-gray-600 mt-1">Distance from you: ${
                    hospital.distance < 1000
                      ? `${Math.round(hospital.distance)}m`
                      : `${(hospital.distance / 1000).toFixed(2)}km`
                  }</p>`
                : ""
            }
          </div>`
        );

        // Create custom marker element for hospitals using pushpin icon
        const el = document.createElement("img");
        el.src = "/pushpin-icon.png";
        el.className = "hospital-marker";
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.cursor = "pointer";
        el.style.userSelect = "none";
        el.style.pointerEvents = "auto";

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: "bottom", // Anchor at bottom center of pushpin icon
        })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      }
    });

    // Fit bounds to show all markers if there are recommendations
    if (recommendations.length > 0 && userLocation) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([userLocation.longitude, userLocation.latitude]);

      recommendations.forEach((hospital) => {
        if (hospital.latitude && hospital.longitude) {
          bounds.extend([hospital.longitude, hospital.latitude]);
        }
      });

      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15,
      });
    }
  }, [recommendations, userLocation]);

  // Hide logo and attribution
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .mapboxgl-ctrl-logo {
        display: none !important;
      }
      .mapboxgl-ctrl-attrib {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[400px]"
        style={{ minHeight: "400px" }}
      />
      {!mapboxgl.accessToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600">
          <p>Mapbox access token not configured</p>
        </div>
      )}
    </div>
  );
}
