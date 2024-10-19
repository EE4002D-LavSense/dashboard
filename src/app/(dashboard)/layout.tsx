import { AppShell } from "@/components/layouts/app-shell";
import { AppNavBar } from "@/components/navigation/app-nav-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <AppNavBar />
      {children}
    </AppShell>
  );
}
