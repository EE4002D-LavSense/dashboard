import ToiletFeedbackTable from "@/app/admin/dashboard/_components/toilet-feedback-table";

export default async function AdminDashboardPage() {
  return (
    <div className="flex justify-center p-8">
      <ToiletFeedbackTable />
    </div>
  );
}
