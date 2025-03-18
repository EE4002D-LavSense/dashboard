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

import { DASHBOARD_COLUMNS } from "@/components/table/constants";
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

const getDashboardColumnByKey = (key: string) => {
  return DASHBOARD_COLUMNS.find((col) => col.uid === key);
};

// Function to get responsive columns based on screen size
const getResponsiveDashboardColumns = () => {
  return DASHBOARD_COLUMNS;
};

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
    <div className="w-full overflow-x-auto">
      <Table aria-label="Main Dashboard Table">
        <TableHeader columns={getResponsiveDashboardColumns()}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              className={column.hideOnMobile ? "hidden md:table-cell" : ""}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={toilets}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell
                  className={
                    getDashboardColumnByKey(columnKey as string)?.hideOnMobile
                      ? "hidden md:table-cell"
                      : ""
                  }
                >
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
