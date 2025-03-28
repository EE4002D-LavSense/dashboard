"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Chip,
} from "@heroui/react";
import type { Selection } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

import { renderFileDropdown } from "./dropdown";

import DashboardHeader from "@/components/common/dashboard-header";
import {
  REPORTS_COLUMNS,
  REPORT_ROW_PER_PAGE,
} from "@/components/table/constants";
import {
  fetchReports,
  fetchReportsCount,
  toggleReportStatusAction,
} from "@/lib/actions";
import { type ToiletReportTable } from "@/lib/definitions";

export default function ToiletFeedbackTable() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get values from URL or fallback to default
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialRows = Number(searchParams.get("rows")) || REPORT_ROW_PER_PAGE;

  const [page, setPage] = useState(initialPage);
  const [rowPerPage, setRowPerPage] = useState(initialRows);

  const queryClient = useQueryClient();

  const toggleReportStatusMutation = useMutation({
    mutationFn: (reportIds: number[]) => {
      return toggleReportStatusAction(reportIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", page] });
      setSelectedKeys(new Set());
    },
  });

  useEffect(() => {
    // Update URL when state changes
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("rows", String(rowPerPage));
    router.replace(`?${params.toString()}`);
  }, [page, rowPerPage, router]);

  const { isFetching, data } = useQuery({
    queryKey: ["reports", page, rowPerPage],
    queryFn: () => fetchReports(page, rowPerPage),
  });

  const getTotalPage = async () => {
    const totalRows = await fetchReportsCount();
    return Math.ceil(totalRows / rowPerPage);
  };
  const totalPageQuery = useQuery({
    queryKey: ["rowPerPage", rowPerPage],
    queryFn: getTotalPage,
  });

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ["reports"] });
  };

  const handleReset = () => {
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    queryClient.invalidateQueries({ queryKey: ["rowPerPage"] });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", { timeZone: "Asia/Singapore" });
  };

  const renderCell = useCallback(
    (report: ToiletReportTable, columnKey: React.Key) => {
      const cellValue = report[columnKey as keyof ToiletReportTable];
      if (columnKey === "createdAt" && cellValue)
        return formatDate(cellValue as string);
      if (columnKey === "fileUrls")
        return renderFileDropdown(cellValue as string[]);
      if (columnKey === "status")
        return (
          <Chip
            color={cellValue === "pending" ? "warning" : "success"}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      return cellValue;
    },
    [],
  );

  const getColumnByKey = (key: string) => {
    return REPORTS_COLUMNS.find((col) => col.uid === key);
  };

  const getResponsiveColumns = () => {
    return REPORTS_COLUMNS;
  };

  const ToggleButton = () => {
    return (
      <Button
        className="max-w-fit"
        onPress={() => {
          const idsToToggle =
            selectedKeys === "all"
              ? (data?.map((item) => item.id) ?? [])
              : (Array.from(selectedKeys) as number[]);

          toggleReportStatusMutation.mutate(idsToToggle);
        }}
      >
        Toggle Status
      </Button>
    );
  };

  if (!isClient) return <Spinner />;

  return (
    <>
      <DashboardHeader
        handleReload={handleReload}
        setRowPerPage={setRowPerPage}
        loading={isFetching}
        totalPage={totalPageQuery.data || 0}
        page={page}
        rowPerPage={rowPerPage}
        handlePageChange={handlePageChange}
        handleReset={handleReset}
        ToggleButton={<ToggleButton />}
      />
      <div className="w-full overflow-x-auto">
        <Table
          aria-label="Toilet Reports Table"
          className="min-w-full"
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader columns={getResponsiveColumns()}>
            {(column) => (
              <TableColumn
                key={column.uid}
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
                      getColumnByKey(columnKey as string)?.hideOnMobile
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
    </>
  );
}
