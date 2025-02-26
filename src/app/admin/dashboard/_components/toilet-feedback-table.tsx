"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { reportsMockData } from "@/components/table/mock-reports";
import { ToiletReportData } from "@/lib/definitions";

const reports_columns = [
  { uid: "createdAt", name: "Date & Time" },
  { uid: "location", name: "Location" },
  { uid: "description", name: "Description" },
  { uid: "remarks", name: "Remarks" },
];

export default function ToiletFeedbackTable() {
  const renderCell = React.useCallback(
    (report: ToiletReportData, columnKey: React.Key) => {
      const cellValue = report[columnKey as keyof ToiletReportData];

      if (columnKey === "createdAt") {
        return cellValue ? new Date(cellValue).toLocaleString() : "N/A";
      }
      return cellValue;
    },
    [],
  );

  return (
    <Table aria-label="Toilet Reports Table">
      <TableHeader columns={reports_columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={reportsMockData}>
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
