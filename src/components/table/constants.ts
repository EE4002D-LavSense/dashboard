export const DASHBOARD_COLUMNS = [
  { name: "NAME", uid: "name", hideOnMobile: false },
  { name: "LOCATION", uid: "location", hideOnMobile: true },
  { name: "GENDER", uid: "gender", hideOnMobile: true },
  { name: "OCCUPANCY", uid: "occupancy" },
  { name: "SMELL", uid: "smell" },
];

export const REPORTS_COLUMNS = [
  { uid: "createdAt", name: "Date & Time", hideOnMobile: true },
  { uid: "location", name: "Location", hideOnMobile: false },
  { uid: "description", name: "Description" },
  { uid: "remarks", name: "Remarks", hideOnMobile: true },
  { uid: "fileUrls", name: "Files" },
];

export const REPORT_ROW_PER_PAGE = 8;

export const LOG_ROW_PER_PAGE = 15;
