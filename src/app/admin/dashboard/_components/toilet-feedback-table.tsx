"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { ToiletReportTable } from "@/lib/definitions";
import { ChevronDown } from "lucide-react";
import { getReportsAction } from "@/lib/actions";
import { ReloadIcon } from "@/app/log/_components/log-table";

const reports_columns = [
  { uid: "createdAt", name: "Date & Time" },
  { uid: "location", name: "Location" },
  { uid: "description", name: "Description" },
  { uid: "remarks", name: "Remarks" },
  { uid: "fileUrls", name: "Files" },
];

export default function ToiletFeedbackTable() {
  const [reportsData, setReportsData] = React.useState<ToiletReportTable[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await getReportsAction();
    setReportsData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCell = React.useCallback(
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
        return date.toLocaleString();
      }

      return cellValue;
    },
    [],
  );

  return (
    <>
      <div className="mb-4 mt-4 flex items-center justify-start">
        <Button
          isIconOnly
          onClick={fetchData}
          isLoading={loading}
          color="default"
          variant="bordered"
        >
          <ReloadIcon />
        </Button>
      </div>
      <Table aria-label="Toilet Reports Table">
        <TableHeader columns={reports_columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={reportsData}>
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
