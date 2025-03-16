import { Button, Pagination, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

import { ReloadIcon } from "@/components/common/reload-icon";

// Define row options with key and label
const rowOptions = [
  { key: "8", label: "8" },
  { key: "10", label: "10" },
  { key: "15", label: "15" },
  { key: "20", label: "20" },
  { key: "25", label: "25" },
  { key: "50", label: "50" },
];

export default function DashboardHeader({
  handleReload,
  loading,
  totalPage,
  page,
  handlePageChange,
  rowPerPage,
  setRowPerPage,
  handleReset,
}: {
  handleReload: () => void;
  loading: boolean;
  totalPage: number;
  page: number;
  handlePageChange: (newPage: number) => void;
  rowPerPage: number;
  setRowPerPage: (rowPerPage: number) => void;
  handleReset: () => void;
}) {
  // Find the current row option or create a new one if not found
  const getRowOption = (value: number) => {
    const existingOption = rowOptions.find(
      (option) => Number(option.key) === value,
    );
    return existingOption || { key: value.toString(), label: `${value} rows` };
  };

  // Ensure current rowPerPage is in options
  const [allRowOptions, setAllRowOptions] = useState(() => {
    const currentOption = getRowOption(rowPerPage);
    // If the current rowPerPage is not in the default options, add it
    if (!rowOptions.some((option) => option.key === currentOption.key)) {
      return [currentOption, ...rowOptions].sort(
        (a, b) => Number(a.key) - Number(b.key),
      );
    }
    return rowOptions;
  });

  // Update options if rowPerPage changes externally
  useEffect(() => {
    const currentOption = getRowOption(rowPerPage);
    if (!allRowOptions.some((option) => option.key === currentOption.key)) {
      setAllRowOptions((prev) =>
        [currentOption, ...prev].sort((a, b) => Number(a.key) - Number(b.key)),
      );
    }
  }, [rowPerPage, allRowOptions]);

  const handleRowChange = (value: string) => {
    setRowPerPage(Number(value));
    handleReset();
  };

  return (
    <div className="mb-4 mt-4 flex items-center justify-between gap-4">
      <div className="flex items-center">
        <Button
          isIconOnly
          onClick={handleReload}
          isLoading={loading}
          color="default"
          variant="bordered"
        >
          <ReloadIcon />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {totalPage > 0 && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPage}
            onChange={handlePageChange}
          />
        )}

        <Select
          label="Show"
          labelPlacement="inside"
          defaultSelectedKeys={[`${rowPerPage}`]}
          onChange={(e) => handleRowChange(e.target.value)}
          className="w-28"
          size="sm"
          items={allRowOptions}
        >
          {(option) => <SelectItem key={option.key}>{option.label}</SelectItem>}
        </Select>
      </div>
    </div>
  );
}
