import { type Metadata } from "next";
import { Suspense } from "react";

import ToiletFeedbackTable from "@/app/admin/(dashboard)/_components/toilet-feedback-table";
import Title from "@/components/common/title";
import { TableShell } from "@/components/layouts/table-shell";

export const metadata: Metadata = {
  title: "Feedback Dashboard",
};

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
