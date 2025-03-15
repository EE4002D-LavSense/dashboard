"use client";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Circle,
  LoadScript,
} from "@react-google-maps/api";
import {
  color,
  defaultMapCenter,
  defaultMapContainerStyle,
  defaultMapOptions,
  defaultMapZoom,
  locationsData,
} from "@/lib/map/constants";
import { useState, useEffect, useRef } from "react";
import Loader from "./loader";

export default function MainMap() {
  const [activeMarker, setActiveMarker] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const centerSetRef = useRef(false);

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
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API!}
        loadingElement={<Loader />}
      >
        <GoogleMap
          mapContainerStyle={defaultMapContainerStyle}
          center={mapCenter}
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
      </LoadScript>
    </div>
  );
}
