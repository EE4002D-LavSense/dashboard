import { Suspense } from "react";

import LogTable from "./_components/log-table";

import Title from "@/components/common/title";
import { TableShell } from "@/components/layouts/table-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Api Log",
};

export default function ApiLogPage() {
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
