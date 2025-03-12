import ToiletFeedbackTable from "@/app/admin/dashboard/_components/toilet-feedback-table";
import { ToiletReportTable } from "@/lib/definitions";
import { getToiletReports } from "@/lib/queries/select";

export default async function AdminDashboardPage() {
  const reportsData: ToiletReportTable[] = await getToiletReports();
  return (
    <div className="flex justify-center p-8">
      <ToiletFeedbackTable reportsData={reportsData} />
    </div>
  );
}
