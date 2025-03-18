import { type Metadata } from "next";

import MainMap from "@/app/map/_components/main-map";
import { MapProvider } from "@/lib/providers/map-provider";

export const metadata: Metadata = {
  title: "Map",
};

export default function MapPage() {
  return (
    <div className="m-4">
      <MapProvider>
        <MainMap />
      </MapProvider>
    </div>
  );
}
