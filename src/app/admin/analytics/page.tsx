import { type Metadata } from "next";
import { Suspense } from "react";

import AnalyticsPage from "./_components/analytics-page";

import Title from "@/components/common/title";
import { TableShell } from "@/components/layouts/table-shell";
import { checkAdmin } from "@/lib/server-utils";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
};

export default async function AdminDashboardPage() {
  await checkAdmin();
  return (
    <>
      <Title title="Analytics Dashboard" />
      <TableShell>
        <Suspense>
          <AnalyticsPage />
        </Suspense>
      </TableShell>
    </>
  );
}
