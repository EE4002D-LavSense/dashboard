"use client";
import { GoogleMap, Marker, InfoWindowF } from "@react-google-maps/api";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";

import UserLocationMarker from "./user-location-marker";

import {
  defaultDarkMapOptions,
  defaultMapCenter,
  defaultMapContainerStyle,
  defaultMapOptions,
  defaultMapZoom,
  locationsData,
} from "@/lib/map/constants";

export default function MainMap() {
  const [activeMarker, setActiveMarker] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const centerSetRef = useRef(false);
  const { theme, systemTheme } = useTheme();
  const isDarkMode =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  const handleMarkerClick = (markerId: string) => {
    setActiveMarker(markerId);
  };

  const handleMapClick = () => {
    setActiveMarker("");
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log("User location updated:", position.coords);
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setUserLocation(newLocation);

          // Only set map center on first location update
          if (!centerSetRef.current && newLocation) {
            console.log("Setting map center to user location");
            setMapCenter({
              lat: newLocation.lat,
              lng: newLocation.lng,
            });
            centerSetRef.current = true;
          }
        },
        (error) => console.log("Error getting user location:", error),
        { enableHighAccuracy: false, timeout: 30000, maximumAge: Infinity },
      );

      // Clean up geolocation watcher when component unmounts
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={mapCenter}
        zoom={defaultMapZoom}
        options={isDarkMode ? defaultDarkMapOptions : defaultMapOptions}
        onClick={handleMapClick}
      >
        {locationsData.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            onClick={() => handleMarkerClick(location.id)}
          />
        ))}
        {locationsData.map(
          (location) =>
            activeMarker === location.id && (
              <InfoWindowF
                key={location.id}
                position={location.position}
                onCloseClick={() => setActiveMarker("")}
              >
                <div className="text-gray-800">
                  <h3 className="mb-2 font-semibold">
                    {location.name} Toilets
                  </h3>
                  <ul>
                    {location.toilets.map((toilet, index) => (
                      <li
                        key={index}
                      >{`${location.id}-${toilet.floor}-${toilet.type}`}</li>
                    ))}
                  </ul>
                </div>
              </InfoWindowF>
            ),
        )}
        {/* User location marker and accuracy circle */}
        {userLocation && <UserLocationMarker userLocation={userLocation} />}
      </GoogleMap>
    </div>
  );
}
