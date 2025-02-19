import { ToiletReportData } from "@/lib/definitions";

export const reportsMockData: ToiletReportData[] = [
  {
    id: 1,
    createdAt: "2024-02-17T08:30:00Z",
    location: "E2-1-MALE",
    description: "Clogged toilet in stall 3.",
    remarks: "Needs urgent maintenance.",
  },
  {
    id: 2,
    createdAt: "2024-02-17T09:15:00Z",
    location: "E2-2-FEMALE",
    description: "Water leakage from sink.",
    remarks: "Water pooling on the floor.",
  },
  {
    id: 3,
    createdAt: "2024-02-17T10:00:00Z",
    location: "E3-1-UNISEX",
    description: "Foul smell in the restroom.",
    remarks: "Possible drainage issue.",
  },
];
