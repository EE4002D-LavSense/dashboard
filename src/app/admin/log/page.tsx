import { Suspense } from "react";

import LogTable from "./_components/log-table";
import { TableShell } from "@/components/layouts/table-shell";
import Title from "@/components/common/title";

export default function DashboardPage() {
  return (
    <>
      <Title title="Log Dashboard" />
      <TableShell>
        <Suspense>
          <LogTable />
        </Suspense>
      </TableShell>
    </>
  );
}
