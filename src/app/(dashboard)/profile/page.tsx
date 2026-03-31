import { redirect } from "next/navigation";
import { userRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import ProfileClient from "./client";

export default async function ProfilePage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const [user, smtp] = await Promise.all([
    userRepo.getMe(token),
    userRepo.getSmtp(token).catch(() => null),
  ]);

  return <ProfileClient user={user} smtp={smtp} />;
}
