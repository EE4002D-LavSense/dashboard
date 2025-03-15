"use client";

import { useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  Spinner,
} from "@nextui-org/react";
import { LogData } from "@/lib/definitions";
import DashboardHeader from "@/components/common/dashboard-header";
import { fetchApiLogs, fetchLogsCount } from "@/lib/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LOG_ROW_PER_PAGE } from "@/lib/constants";

const statusColorMap: Record<string, ChipProps["color"]> = {
  Success: "success",
  Warning: "warning",
  Error: "danger",
};

export default function LogTable() {
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(LOG_ROW_PER_PAGE);

  const queryClient = useQueryClient();

  const { isPending, data } = useQuery({
    queryKey: ["logs", page, rowPerPage],
    queryFn: () => fetchApiLogs(page, rowPerPage),
    staleTime: Infinity,
  });

  const getTotalPage = async () => {
    const totalRows = await fetchLogsCount();
    return Math.ceil(totalRows / rowPerPage);
  };

  const totalPageQuery = useQuery({
    queryKey: ["totalPage", rowPerPage],
    queryFn: getTotalPage,
    staleTime: Infinity,
  });

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ["logs"] });
    totalPageQuery.refetch();
  };

  const handleReset = () => {
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["logs"] });
    queryClient.invalidateQueries({ queryKey: ["totalPage"] });
    totalPageQuery.refetch();
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
        loading={isPending}
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
          loadingState={isPending ? "loading" : "idle"}
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
