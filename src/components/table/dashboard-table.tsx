"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
} from "@nextui-org/react";
import { dashboard_columns } from "./contants";
import { mockData } from "./mock-data";
import { ToiletDashboardData } from "@/lib/definitions";

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

const genderColorMap: Record<string, String> = {
  MALE: "bg-blue-200",
  FEMALE: "bg-pink-200",
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
              classNames={{
                base: `capitalize ${genderColorMap[toilet.gender]}`,
              }}
              size="sm"
              variant="flat"
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
    <Table aria-label="Example table with custom cells">
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
