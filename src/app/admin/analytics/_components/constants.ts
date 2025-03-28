import { type ChartConfig } from "@/components/ui/chart";

export const timeRanges = [
  { value: "90d", label: "Last 3 months" },
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
];

export const categories = [
  { value: "occupancy", label: "Occupancy" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "waterLeak", label: "Water Leak" },
  { value: "temperature", label: "Temperature" },
  { value: "humidity", label: "Humidity" },
];

export const chartConfig = {
  occupancy: {
    label: "Occupancy",
    color: "hsl(var(--chart-1))",
  },
  cleanliness: {
    label: "Cleanliness",
    color: "hsl(var(--chart-2))",
  },
  waterLeak: {
    label: "Water Leak",
    color: "hsl(var(--chart-3))",
  },
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-4))",
  },
  humidity: {
    label: "Humidity",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;
