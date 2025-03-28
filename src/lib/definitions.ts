export type ToiletDashboardData = {
  id: number;
  name: string;
  location: string;
  gender: string;
  occupancy: string;
  smell: string;
};

export type ToiletInfo = {
  id?: number;
  location?: string | null;
  building: string;
  floor: string;
  type: string;
};

export type ToiletReportData = {
  id: number;
  location: string;
  description: string;
  remarks?: string;
  createdAt: string;
};

export type LogData = {
  id: number;
  method: string;
  timestamp: string;
  data: string;
  status: string;
};

export type ToiletReportTable = {
  id: number;
  location: string;
  description: string;
  remarks?: string;
  createdAt: string;
  fileUrls?: string[];
  status: string;
};

export type Esp32ToiletData = {
  node_id: string;
  cleanliness: number;
  occupancy: number;
  water_leak: number;
  temperature: number;
  humidity: number;
};

export type ToiletSensorData = {
  id: number;
  toiletId: number;
  timestamp: string;
  cleanliness: number;
  occupancy: number;
  humidity: number;
  waterLeak: boolean;
  temperature: number;
};
