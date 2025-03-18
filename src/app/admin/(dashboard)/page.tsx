import { Suspense } from "react";

import ToiletFeedbackTable from "@/app/admin/(dashboard)/_components/toilet-feedback-table";
import Title from "@/components/common/title";
import { TableShell } from "@/components/layouts/table-shell";
import { Metadata } from "next";

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
