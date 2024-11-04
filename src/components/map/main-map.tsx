"use client";

import { GoogleMap } from "@react-google-maps/api";
import {
  defaultMapCenter,
  defaultMapContainerStyle,
  defaultMapOptions,
  defaultMapZoom,
} from "@/lib/map/constants";

export default function MainMap() {
  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      ></GoogleMap>
    </div>
  );
}
