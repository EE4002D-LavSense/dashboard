"use client";

import { useCallback, useEffect, useState } from "react";
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
import { REPORTS_COLUMNS, ROW_PER_PAGE } from "@/lib/constants";
import { getReportsAction, getReportsCountAction } from "@/lib/actions";
import { renderFileDropdown } from "./dropdown";
import DashboardHeader from "@/components/common/dashboard-header";

export default function ToiletFeedbackTable() {
  const [reportsData, setReportsData] = useState<ToiletReportTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);

  const initData = async (page: number = 1) => {
    setLoading(true);
    const totalRows = await getReportsCountAction();
    setTotalPage(Math.ceil(totalRows / ROW_PER_PAGE));
    const data = await getReportsAction(page, ROW_PER_PAGE);
    setReportsData(data);
    setLoading(false);
  };

  useEffect(() => {
    initData();
  }, []);

  const handleReload = () => initData(page);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    setReportsData(await getReportsAction(newPage, ROW_PER_PAGE));
    setPage(newPage);
    setLoading(false);
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
        loading={loading}
        totalPage={totalPage}
        page={page}
        handlePageChange={handlePageChange}
      />
      <Table aria-label="Toilet Reports Table">
        <TableHeader columns={REPORTS_COLUMNS}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={reportsData}
          loadingContent={<Spinner />}
          loadingState={loading ? "loading" : "idle"}
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
