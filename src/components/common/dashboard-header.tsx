import { ReloadIcon } from "@/app/log/_components/log-table";
import { Button, Pagination } from "@nextui-org/react";

export default function DashboardHeader({
  handleReload,
  loading,
  totalPage,
  page,
  handlePageChange,
}: {
  handleReload: () => void;
  loading: boolean;
  totalPage: number;
  page: number;
  handlePageChange: (newPage: number) => void;
}) {
  return (
    <div className="mb-4 mt-4 flex items-center justify-between">
      <Button
        isIconOnly
        onClick={handleReload}
        isLoading={loading}
        color="default"
        variant="bordered"
      >
        <ReloadIcon />
      </Button>
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
    </div>
  );
}
