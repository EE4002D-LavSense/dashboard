export const DASHBOARD_COLUMNS = [
  { name: "NAME", uid: "name", hideOnMobile: false },
  { name: "LOCATION", uid: "location", hideOnMobile: true },
  { name: "GENDER", uid: "gender", hideOnMobile: true },
  { name: "OCCUPANCY", uid: "occupancy", hideOnMobile: false },
  { name: "SMELL", uid: "smell", hideOnMobile: false },
];

export const REPORTS_COLUMNS = [
  { uid: "createdAt", name: "Date & Time", hideOnMobile: true },
  { uid: "location", name: "Location", hideOnMobile: false },
  { uid: "description", name: "Description", hideOnMobile: false },
  { uid: "remarks", name: "Remarks", hideOnMobile: true },
  { uid: "status", name: "Status", hideOnMobile: false },
  { uid: "fileUrls", name: "Files", hideOnMobile: false },
];

export const LOG_COLUMNS = [
  { uid: "timestamp", name: "Timestamp", hideOnMobile: false },
  { uid: "method", name: "Method", hideOnMobile: true },
  { uid: "status", name: "Status", hideOnMobile: true },
  { uid: "data", name: "Message", hideOnMobile: false },
];
export const REPORT_ROW_PER_PAGE = 8;

export const LOG_ROW_PER_PAGE = 15;
