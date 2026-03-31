import { getRequiredSession } from "@/lib/auth-helpers";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getRequiredSession();

  return <AppShell>{children}</AppShell>;
}
