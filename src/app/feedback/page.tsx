import ReportForm from "@/app/feedback/_components/report-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
};

export default async function AdminPage() {
  return (
    <div className="flex justify-center p-8">
      <ReportForm />
    </div>
  );
}
