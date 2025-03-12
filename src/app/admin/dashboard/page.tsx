import ToiletFeedbackTable from "@/app/admin/dashboard/_components/toilet-feedback-table";

export default async function AdminDashboardPage() {
  return (
    <>
      <h1 className="m-10 -mb-10 text-4xl font-bold">Feedback Dashboard</h1>
      <div className="m-10 flex h-screen flex-col">
        <ToiletFeedbackTable />
      </div>
    </>
  );
}
