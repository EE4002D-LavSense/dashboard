import DashboardTable from "@/components/table/dashboard-table";

export default function DashboardPage() {
  return (
    <>
      <h1 className="text-4xl font-bold m-10">Dashboard</h1>
      <div className="flex flex-col items-center h-screen m-10">
        <DashboardTable />
      </div>
    </>
  );
}
