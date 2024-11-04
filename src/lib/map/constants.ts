export const defaultMapContainerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "15px 0px 0px 15px",
};

export const defaultMapCenter = {
  lat: 1.299361111111111,
  lng: 103.77119444444445,
};

export const defaultMapZoom = 18;

export const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "roadmap",
};

// Sample data with multiple locations and toilets
export const locationsData = [
  {
    id: "E2",
    name: "E2 Block",
    position: { lat: 1.299361111111111, lng: 103.77119444444445 },
    toilets: [
      { floor: 1, type: "MALE" },
      { floor: 2, type: "FEMALE" },
      { floor: 3, type: "MALE" },
      { floor: 4, type: "FEMALE" },
      { floor: 5, type: "MALE" },
      { floor: 6, type: "FEMALE" },
    ],
  },
  {
    id: "E5",
    name: "E5 Block",
    position: { lat: 1.2979141676258208, lng: 103.77248251375033 },
    toilets: [
      { floor: 1, type: "MALE" },
      { floor: 2, type: "FEMALE" },
      { floor: 3, type: "FEMALE" },
    ],
  },
  // Add more blocks as needed
];

export const color = {
  "google-blue 100": `#4285F4`,
  "google-blue-dark 100": `#61a0bf`,
  "google-blue-light 100": `#1bb6ff`,
  "white 100": `rgb(255,255,255)`,
};
