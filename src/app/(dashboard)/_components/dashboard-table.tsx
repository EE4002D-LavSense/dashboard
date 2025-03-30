"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  type ChipProps,
} from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import DashboardHeader from "@/components/common/dashboard-header";
import {
  DASHBOARD_COLUMNS,
  REPORT_ROW_PER_PAGE,
} from "@/components/table/constants";
import { fetchMainDashboard, fetchMainDashboardCount } from "@/lib/actions";
import { type ToiletDashboardData } from "@/lib/definitions";

const cleanlinessColorMap: Record<string, ChipProps["color"]> = {
  0: "success",
  1: "warning",
  2: "danger",
};

const mapCleanlinessValue = (value: number) => {
  switch (value) {
    case 0:
      return "Clean";
    case 1:
      return "Moderate";
    case 2:
      return "Dirty";
    default:
      return "Unknown";
  }
};

const genderColorMap: Record<string, string> = {
  MALE: "primary",
  FEMALE: "danger",
};

const getDashboardColumnByKey = (key: string) => {
  return DASHBOARD_COLUMNS.find((col) => col.uid === key);
};

// Function to get responsive columns based on screen size
const getResponsiveDashboardColumns = () => {
  return DASHBOARD_COLUMNS;
};

export default function DashboardTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL or fallback to default
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialRows = Number(searchParams.get("rows")) || REPORT_ROW_PER_PAGE;

  const [page, setPage] = useState(initialPage);
  const [rowPerPage, setRowPerPage] = useState(initialRows);

  const queryClient = useQueryClient();

  const { isFetching, data } = useQuery({
    queryKey: ["mainDashboard", page, rowPerPage],
    queryFn: () => fetchMainDashboard(page, rowPerPage),
  });

  const getTotalPage = async () => {
    const totalRows = await fetchMainDashboardCount();
    return Math.ceil(totalRows / rowPerPage);
  };

  const totalPageQuery = useQuery({
    queryKey: ["rowPerPage", rowPerPage],
    queryFn: getTotalPage,
  });

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ["mainDashboard"] });
  };

  const handleReset = () => {
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["mainDashboard"] });
    queryClient.invalidateQueries({ queryKey: ["rowPerPage"] });
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    // Update URL when state changes
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("rows", String(rowPerPage));
    router.replace(`?${params.toString()}`);
  }, [page, rowPerPage, router]);

  const renderCell = React.useCallback(
    (toilet: ToiletDashboardData, columnKey: React.Key) => {
      const cellValue = toilet[columnKey as keyof ToiletDashboardData];
      const timestamp = toilet.timestamp
        ? new Date(toilet.timestamp).getTime()
        : 0;
      const isOnline =
        new Date().getTime() - new Date(timestamp).getTime() <
        24 * 60 * 60 * 1000;

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col md:flex-row md:items-center">
              <span
                className="ml-2 text-xs md:hidden"
                style={{ color: isOnline ? "green" : "red" }}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
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
        case "cleanliness":
          return (
            <Chip
              className="capitalize"
              color={cleanlinessColorMap[toilet.cleanliness ?? 0]}
              size="sm"
              variant="flat"
            >
              {mapCleanlinessValue(Number(cellValue) ?? 0)}
            </Chip>
          );
        case "timestamp":
          return (
            <Chip
              className="capitalize"
              color={isOnline ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {isOnline ? "Online" : "Offline"}
            </Chip>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div>
      <DashboardHeader
        handleReload={handleReload}
        loading={isFetching}
        totalPage={totalPageQuery.data || 0}
        page={page}
        handlePageChange={handlePageChange}
        rowPerPage={rowPerPage}
        setRowPerPage={setRowPerPage}
        handleReset={handleReset}
      />
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
        <TableBody
          items={data || []}
          loadingContent={<Spinner />}
          loadingState={isFetching ? "loading" : "idle"}
        >
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
