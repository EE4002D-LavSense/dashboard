import { Button, Pagination, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

import { ReloadIcon } from "@/components/common/icons";

// Define row options with key and label
const rowOptions = [
  { key: "8", label: "8 rows" },
  { key: "10", label: "10 rows" },
  { key: "15", label: "15 rows" },
  { key: "20", label: "20 rows" },
  { key: "25", label: "25 rows" },
  { key: "50", label: "50 rows" },
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
  ToggleButton = null,
}: {
  handleReload: () => void;
  loading: boolean;
  totalPage: number;
  page: number;
  handlePageChange: (newPage: number) => void;
  rowPerPage: number;
  setRowPerPage: (rowPerPage: number) => void;
  handleReset: () => void;
  ToggleButton?: React.ReactElement | null;
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
    <div className="mb-4 flex flex-col gap-4 md:flex-row">
      {/* Top section: Reload button and select dropdown */}
      <div className="flex w-full gap-2">
        <Button
          aria-label="Reload"
          isIconOnly
          onPress={handleReload}
          isLoading={loading}
          color="default"
          variant="bordered"
        >
          <ReloadIcon />
        </Button>

        <Select
          aria-label="Rows per page"
          defaultSelectedKeys={[`${rowPerPage}`]}
          onChange={(e) => handleRowChange(e.target.value)}
          className="w-32"
          size="md"
          items={allRowOptions}
        >
          {(option) => <SelectItem key={option.key}>{option.label}</SelectItem>}
        </Select>
        {ToggleButton ? ToggleButton : null}
      </div>

      {/* Pagination below on mobile, inline on larger screens */}
      {totalPage > 1 && (
        <div className="flex w-full justify-end">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPage}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
