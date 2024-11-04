"use client";

import { GoogleMap, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import {
  color,
  defaultMapCenter,
  defaultMapContainerStyle,
  defaultMapOptions,
  defaultMapZoom,
  locationsData,
} from "@/lib/map/constants";
import { useState, useEffect } from "react";

export default function MainMap() {
  const [activeMarker, setActiveMarker] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);

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
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy, // Get accuracy in meters
          });
        },
        (error) => console.error("Error getting user location:", error),
        { enableHighAccuracy: true },
      );

      // Clean up geolocation watcher when component unmounts
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={userLocation || defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
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
              <InfoWindow
                key={location.id}
                position={location.position}
                onCloseClick={() => setActiveMarker("")}
              >
                <div>
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
              </InfoWindow>
            ),
        )}

        {/* User location marker and accuracy circle */}
        {userLocation && (
          <>
            <Marker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
              icon={{
                fillColor: color["google-blue 100"],
                fillOpacity: 1,
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                strokeColor: color["white 100"],
                strokeWeight: 2,
              }}
            />
            <Circle
              center={{ lat: userLocation.lat, lng: userLocation.lng }}
              radius={userLocation.accuracy}
              options={{
                strokeColor: "#4285F4",
                strokeOpacity: 0.3,
                strokeWeight: 1,
                fillColor: "#4285F4",
                fillOpacity: 0.1,
              }}
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
}
