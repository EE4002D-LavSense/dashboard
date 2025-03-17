import { Suspense } from "react";

import LogTable from "./_components/log-table";
import { TableShell } from "@/components/layouts/table-shell";

export default function DashboardPage() {
  return (
    <>
      <h1 className="ml-2 mt-4 text-4xl font-bold">Log Dashboard</h1>
      <TableShell>
        <Suspense>
          <LogTable />
        </Suspense>
      </TableShell>
    </>
  );
}
