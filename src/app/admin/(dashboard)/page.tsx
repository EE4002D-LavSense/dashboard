import { Suspense } from "react";

import ToiletFeedbackTable from "@/app/admin/(dashboard)/_components/toilet-feedback-table";
import { TableShell } from "@/components/layouts/table-shell";
import Title from "@/components/common/title";

export default async function AdminDashboardPage() {
  return (
    <>
      <Title title="Feedback Dashboard" />
      <TableShell>
        <Suspense>
          <ToiletFeedbackTable />
        </Suspense>
      </TableShell>
    </>
  );
}
