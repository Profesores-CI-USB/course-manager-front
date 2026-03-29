import { redirect } from "next/navigation";
import type { UserOut } from "@/domain/entities/auth";
import { UserRepository } from "@/infrastructure/repositories/auth.repository";
import { SideNav } from "@/components/nav";
import { getAccessToken } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  let user: UserOut | null = null;
  try {
    const repo = new UserRepository();
    user = await repo.getMe(token);
  } catch {
    // user stays null — sidebar shows placeholder
  }

  return (
    <div className="flex min-h-[100dvh]">
      <SideNav user={user} />
      <div className="flex-grow overflow-auto">{children}</div>
    </div>
  );
}
