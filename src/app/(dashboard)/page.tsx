import DashboardTable from "@/app/(dashboard)/_components/dashboard-table";
import Title from "@/components/common/title";
import { TableShell } from "@/components/layouts/table-shell";

export default function DashboardPage() {
  return (
    <>
      <div className="mt-4">
        <Title title="Dashboard" />
      </div>
      <TableShell>
        <DashboardTable />
      </TableShell>
    </>
  );
}
