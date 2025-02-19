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
  location?: string;
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
