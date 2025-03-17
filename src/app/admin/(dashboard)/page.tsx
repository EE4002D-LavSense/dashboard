import { Suspense } from "react";

import ToiletFeedbackTable from "@/app/admin/(dashboard)/_components/toilet-feedback-table";
import { TableShell } from "@/components/layouts/table-shell";

export default async function AdminDashboardPage() {
  return (
    <>
      <h1 className="ml-2 mt-4 text-4xl font-bold">Feedback Dashboard</h1>
      <TableShell>
        <Suspense>
          <ToiletFeedbackTable />
        </Suspense>
      </TableShell>
    </>
  );
}
