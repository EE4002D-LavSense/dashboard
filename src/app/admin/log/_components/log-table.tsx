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
  Spinner,
} from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

import DashboardHeader from "@/components/common/dashboard-header";
import { LOG_ROW_PER_PAGE } from "@/components/table/constants";
import { fetchApiLogs, fetchLogsCount } from "@/lib/actions";
import { type LogData } from "@/lib/definitions";

const statusColorMap: Record<string, ChipProps["color"]> = {
  Success: "success",
  Warning: "warning",
  Error: "danger",
};

export default function LogTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL or fallback to default
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialRows = Number(searchParams.get("rows")) || LOG_ROW_PER_PAGE;

  const [page, setPage] = useState(initialPage);
  const [rowPerPage, setRowPerPage] = useState(initialRows);

  const queryClient = useQueryClient();

  useEffect(() => {
    // Update URL when state changes
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("rows", String(rowPerPage));
    router.replace(`?${params.toString()}`);
  }, [page, rowPerPage, router]);

  const { isFetching, data } = useQuery({
    queryKey: ["logs", page, rowPerPage],
    queryFn: () => fetchApiLogs(page, rowPerPage),
  });

  const getTotalPage = async () => {
    const totalRows = await fetchLogsCount();
    return Math.ceil(totalRows / rowPerPage);
  };

  const totalPageQuery = useQuery({
    queryKey: ["totalPage", rowPerPage],
    queryFn: getTotalPage,
  });

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ["logs"] });
  };

  const handleReset = () => {
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["logs"] });
    queryClient.invalidateQueries({ queryKey: ["totalPage"] });
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
  };

  const renderCell = useCallback((log: LogData, columnKey: React.Key) => {
    const cellValue = log[columnKey as keyof LogData];

    switch (columnKey) {
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

  return (
    <>
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
      <Table aria-label="Log Table">
        <TableHeader>
          <TableColumn key="timestamp">Timestamp</TableColumn>
          <TableColumn key="method">Method</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="data">Message</TableColumn>
        </TableHeader>
        <TableBody
          items={data || []}
          loadingContent={<Spinner />}
          loadingState={isFetching ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
