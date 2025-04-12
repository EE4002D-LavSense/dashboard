import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LavSense | Smart Toilet Dashboard",
    short_name: "LavSense",
    description:
      "LavSense is a smart toilet dashboard that monitors cleanliness, occupancy, and maintenance in real-time, with alerts for cleaners and user feedback support.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
