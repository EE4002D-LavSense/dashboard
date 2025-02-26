"use client";

import React, { useEffect } from "react";
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
import { LogData } from "@/lib/definitions";

const statusColorMap: Record<string, ChipProps["color"]> = {
  Success: "success",
  Warning: "warning",
  Error: "danger",
};

export default function LogTable() {
  const [logData, setLogData] = React.useState<LogData[]>([]);
  const renderCell = React.useCallback((log: LogData, columnKey: React.Key) => {
    const cellValue = log[columnKey as keyof typeof log];

    switch (columnKey) {
      case "timestamp":
        return new Date(cellValue).toLocaleString(); // Formats in local time
      case "status":
        return (
          <Chip color={statusColorMap[log.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        setLogData(data.logs);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Table aria-label="Log Table">
      <TableHeader>
        <TableColumn key="timestamp">Timestamp</TableColumn>
        <TableColumn key="method">Method</TableColumn>
        <TableColumn key="status">Status</TableColumn>
        <TableColumn key="data">Message</TableColumn>
      </TableHeader>
      <TableBody items={logData}>
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
