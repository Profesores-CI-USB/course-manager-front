import { redirect } from "next/navigation";
import { subjectRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import SubjectsClient from "./client";

export default async function SubjectsPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");
  const subjects = await subjectRepo.list({ limit: 100 }, token);

  return <SubjectsClient initialData={subjects} />;
}
