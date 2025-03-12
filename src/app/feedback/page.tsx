import ReportForm from "@/app/feedback/_components/report-form";
import { getAllToilets } from "@/lib/queries/select";

export default async function AdminPage() {
  const toiletData = await getAllToilets();
  return (
    <div className="flex justify-center p-8">
      <ReportForm toiletData={toiletData} />
    </div>
  );
}
