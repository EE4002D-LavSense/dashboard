"use client";

import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import {
  defaultMapCenter,
  defaultMapContainerStyle,
  defaultMapOptions,
  defaultMapZoom,
  locationsData,
} from "@/lib/map/constants";
import { useState } from "react";

export default function MainMap() {
  const [activeMarker, setActiveMarker] = useState("");

  const handleMarkerClick = (markerId: string) => {
    setActiveMarker(markerId);
  };

  const handleMapClick = () => {
    setActiveMarker("");
  };

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
        onClick={handleMapClick} // Close the InfoWindow when the map is clicked
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
                      <li key={index}>
                        {`${location.id}-${toilet.floor}-${toilet.type}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </InfoWindow>
            ),
        )}
      </GoogleMap>
    </div>
  );
}
