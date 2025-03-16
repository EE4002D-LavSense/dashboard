import { Suspense } from "react";

import ToiletFeedbackTable from "@/app/admin/dashboard/_components/toilet-feedback-table";

export default async function AdminDashboardPage() {
  return (
    <>
      <h1 className="ml-10 mt-4 text-4xl font-bold">Feedback Dashboard</h1>
      <div className="ml-10 mr-10 flex h-screen flex-col">
        <Suspense>
          <ToiletFeedbackTable />
        </Suspense>
      </div>
    </>
  );
}
