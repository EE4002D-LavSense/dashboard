"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import { ToiletReportTable } from "@/lib/definitions";
import { REPORTS_COLUMNS, REPORT_ROW_PER_PAGE } from "@/lib/constants";
import { fetchReports, fetchReportsCount } from "@/lib/actions";
import { renderFileDropdown } from "./dropdown";
import DashboardHeader from "@/components/common/dashboard-header";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ToiletFeedbackTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL or fallback to default
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialRows = Number(searchParams.get("rows")) || REPORT_ROW_PER_PAGE;

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

  const { isPending, data } = useQuery({
    queryKey: ["reports", page, rowPerPage],
    queryFn: () => fetchReports(page, rowPerPage),
    staleTime: Infinity,
  });

  const getTotalPage = async () => {
    const totalRows = await fetchReportsCount();
    return Math.ceil(totalRows / rowPerPage);
  };
  const totalPageQuery = useQuery({
    queryKey: ["totalPage", rowPerPage],
    queryFn: getTotalPage,
    staleTime: Infinity,
  });

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    totalPageQuery.refetch();
  };

  const handleReset = () => {
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    queryClient.invalidateQueries({ queryKey: ["totalPage"] });
    totalPageQuery.refetch();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB");
  };

  const renderCell = useCallback(
    (report: ToiletReportTable, columnKey: React.Key) => {
      const cellValue = report[columnKey as keyof ToiletReportTable];
      if (columnKey === "createdAt" && cellValue)
        return formatDate(cellValue as string);
      if (columnKey === "fileUrls")
        return renderFileDropdown(cellValue as string[]);
      return cellValue;
    },
    [],
  );

  return (
    <>
      <DashboardHeader
        handleReload={handleReload}
        setRowPerPage={setRowPerPage}
        loading={isPending}
        totalPage={totalPageQuery.data || 0}
        page={page}
        rowPerPage={rowPerPage}
        handlePageChange={handlePageChange}
        handleReset={handleReset}
      />
      <Table aria-label="Toilet Reports Table">
        <TableHeader columns={REPORTS_COLUMNS}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
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
