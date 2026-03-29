import { UserRepository } from "@/infrastructure/repositories/auth.repository";
import { getAccessToken } from "@/lib/session";
import ProfileClient from "./client";

export default async function ProfilePage() {
  const token = await getAccessToken();
  const repo = new UserRepository();

  const [user, smtp] = await Promise.all([
    repo.getMe(token!),
    repo.getSmtp(token!).catch(() => null),
  ]);

  return <ProfileClient user={user} smtp={smtp} />;
}
