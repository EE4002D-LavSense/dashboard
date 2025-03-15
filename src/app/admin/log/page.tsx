import LogTable from "./_components/log-table";

export default function DashboardPage() {
  return (
    <>
      <h1 className="ml-10 mt-4 text-4xl font-bold">Log Dashboard</h1>
      <div className="ml-10 mr-10 flex h-screen flex-col">
        <LogTable />
      </div>
    </>
  );
}
