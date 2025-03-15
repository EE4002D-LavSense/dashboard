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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Pagination,
} from "@nextui-org/react";
import { ToiletReportTable } from "@/lib/definitions";
import { ChevronDown } from "lucide-react";
import { getReportsAction, getReportsCountAction } from "@/lib/actions";
import { ReloadIcon } from "@/app/log/_components/log-table";

const reports_columns = [
  { uid: "createdAt", name: "Date & Time" },
  { uid: "location", name: "Location" },
  { uid: "description", name: "Description" },
  { uid: "remarks", name: "Remarks" },
  { uid: "fileUrls", name: "Files" },
];

export default function ToiletFeedbackTable() {
  const ROW_PER_PAGE = 8;
  const [reportsData, setReportsData] = useState<ToiletReportTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);

  const initData = async () => {
    setLoading(true);
    const totalRows = await getReportsCountAction();
    setTotalPage(Math.ceil(totalRows / ROW_PER_PAGE));
    const data = await getReportsAction(page, ROW_PER_PAGE);
    setReportsData(data);
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const data = await getReportsAction(page, ROW_PER_PAGE);
    setReportsData(data);
    setLoading(false);
  };

  const fetchNewPage = async (newPage: number) => {
    setLoading(true);
    setPage(newPage);
    const data = await getReportsAction(newPage, ROW_PER_PAGE);
    setReportsData(data);
    setLoading(false);
  };

  useEffect(() => {
    initData();
  }, []);

  const renderCell = useCallback(
    (report: ToiletReportTable, columnKey: React.Key) => {
      const cellValue = report[columnKey as keyof ToiletReportTable];

      if (columnKey === "fileUrls") {
        const urls = cellValue as string[];

        if (!urls || urls.length === 0) {
          return <span className="text-gray-400">No files</span>;
        }

        return (
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                size="sm"
                endContent={<ChevronDown className="h-4 w-4" />}
              >
                {urls.length} {urls.length === 1 ? "File" : "Files"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Files">
              {urls.map((url, index) => (
                <DropdownItem key={index} textValue={`File ${index + 1}`}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    File {index + 1}
                  </a>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        );
      }

      // Format date if it's the createdAt column
      if (columnKey === "createdAt" && cellValue) {
        const date = new Date(cellValue as string);
        return date.toLocaleString("en-GB");
      }

      return cellValue;
    },
    [],
  );

  return (
    <>
      <div className="mb-4 mt-4 flex items-center justify-between">
        <Button
          isIconOnly
          onClick={fetchData}
          isLoading={loading}
          color="default"
          variant="bordered"
        >
          <ReloadIcon />
        </Button>

        {totalPage > 0 ? (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPage}
            onChange={(newPage) => fetchNewPage(newPage)}
          />
        ) : null}
      </div>
      <Table aria-label="Toilet Reports Table">
        <TableHeader columns={reports_columns}>
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
