"use client";

import { Button, Skeleton } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { categories, chartConfig, timeRanges } from "./constants";

import { ReloadIcon } from "@/components/common/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchAllToiletIdWithSensorsData,
  fetchAllToiletSensorsData,
  fetchChartData,
} from "@/lib/actions";

export default function AnalyticsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: toiletIdList } = useQuery({
    queryKey: ["toiletIdList"],
    queryFn: () => fetchAllToiletIdWithSensorsData(),
  });

  const initialTimeRange = searchParams.get("timeRange") || "90d";
  const initialCategory = searchParams.get("category") || "occupancy";
  const initialToiletId =
    (Number(searchParams.get("toiletId")) || toiletIdList?.[0]?.toiletId) ?? 0;

  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [category, setCategory] = useState(initialCategory);
  const [toiletId, setToiletId] = useState(initialToiletId);

  const queryClient = useQueryClient();

  const { isFetching, data: chartData } = useQuery({
    queryKey: ["analytics", category, toiletId],
    queryFn: () => {
      return fetchChartData(category, toiletId);
    },
  });

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
    queryClient.invalidateQueries({ queryKey: ["toiletIdList"] });
  };

  const handleDownload = async () => {
    const allData = await fetchAllToiletSensorsData();

    const headers = Object.keys(allData[0]).join(",");
    const csvRows = allData.map((row) => Object.values(row).join(","));

    const csvContent = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "toilet_analytics_data.csv");
  };

  useEffect(() => {
    // Update URL when state changes
    const params = new URLSearchParams();
    params.set("category", String(category));
    params.set("timeRange", String(timeRange));
    params.set("toiletId", String(toiletId));
    router.replace(`?${params.toString()}`);
  }, [category, timeRange, toiletId, router]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Toilet Analytics - Interactive</CardTitle>
          <CardDescription>
            Showing cleanliness, occupancy, and other sensor data over the last
            3 months
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            aria-label="Reload"
            isIconOnly
            onPress={handleReload}
            isLoading={isFetching}
            color="default"
            variant="bordered"
          >
            <ReloadIcon />
          </Button>
          <Button onPress={handleDownload} color="default" variant="bordered">
            Export Data
          </Button>
        </div>
        <Select
          value={toiletId?.toString()}
          onValueChange={(value) => setToiletId(Number(value))}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select Toilet"
          >
            <SelectValue placeholder="Select Toilet" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {toiletIdList?.map(({ toiletId, name }) => (
              <SelectItem
                key={toiletId}
                value={toiletId.toString()}
                className="rounded-lg"
              >
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a category"
          >
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {categories.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="rounded-lg">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {timeRanges.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="rounded-lg">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!isFetching ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                {Object.entries(chartConfig).map(([key, { color }]) => (
                  <linearGradient
                    key={key}
                    id={`fill${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleString("en-GB", {
                    month: "short",
                    day: "numeric",
                    timeZone: "Asia/Singapore",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return value.toLocaleString("en-GB", {
                        timeZone: "Asia/Singapore",
                      });
                    }}
                  />
                }
              />
              {Object.entries(chartConfig).map(([key, { color }]) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="linear"
                  fill={`url(#fill${key})`}
                  stroke={color}
                  stackId="a"
                />
              ))}
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-[250px] w-full">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
