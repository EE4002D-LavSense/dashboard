"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  type ChipProps,
} from "@heroui/react";
import React from "react";

import { dashboard_columns } from "@/components/table/contants";
import { mockData } from "@/components/table/mock-data";
import { type ToiletDashboardData } from "@/lib/definitions";

const occupancyColorMap: Record<string, ChipProps["color"]> = {
  Free: "success",
  Busy: "warning",
  Full: "danger",
};

const smellColorMap: Record<string, ChipProps["color"]> = {
  Good: "success",
  Moderate: "warning",
  Bad: "danger",
};

const genderColorMap: Record<string, string> = {
  MALE: "primary",
  FEMALE: "danger",
};

const toilets = mockData;

export default function DashboardTable() {
  const renderCell = React.useCallback(
    (toilet: ToiletDashboardData, columnKey: React.Key) => {
      const cellValue = toilet[columnKey as keyof ToiletDashboardData];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "location":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "gender":
          return (
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={genderColorMap[toilet.gender] as ChipProps["color"]}
            >
              {cellValue}
            </Chip>
          );
        case "occupancy":
          return (
            <Chip
              className="capitalize"
              color={occupancyColorMap[toilet.occupancy]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "smell":
          return (
            <Chip
              className="capitalize"
              color={smellColorMap[toilet.smell]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <Table aria-label="Main Dashboard Table">
      <TableHeader columns={dashboard_columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={toilets}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
