import { type Metadata } from "next";

import ReportForm from "@/app/feedback/_components/report-form";

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
