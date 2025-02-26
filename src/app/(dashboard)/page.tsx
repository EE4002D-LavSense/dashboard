import DashboardTable from "@/app/(dashboard)/_components/dashboard-table";

export default function DashboardPage() {
  return (
    <>
      <h1 className="m-10 text-4xl font-bold">Dashboard</h1>
      <div className="m-10 flex h-screen flex-col items-center">
        <DashboardTable />
      </div>
    </>
  );
}
