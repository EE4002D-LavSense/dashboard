import { Marker, CircleF } from "@react-google-maps/api";

import { color } from "@/lib/map/constants";

export default function UserLocationMarker({
  userLocation,
}: {
  userLocation: { lat: number; lng: number; accuracy: number } | null;
}) {
  if (!userLocation) return null;

  return (
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
      <CircleF
        center={{ lat: userLocation.lat, lng: userLocation.lng }}
        radius={userLocation.accuracy}
        options={{
          fillColor: color["google-blue 100"],
          fillOpacity: 0.1,
          strokeColor: color["google-blue 100"],
          strokeOpacity: 0.5,
          strokeWeight: 1,
        }}
      />
    </>
  );
}
