import { AppShell } from "@/components/layout/AppShell";

export default function AuthenticatedShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
