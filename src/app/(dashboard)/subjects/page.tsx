import { SubjectRepository } from "@/infrastructure/repositories/subject.repository";
import { getAccessToken } from "@/lib/session";
import SubjectsClient from "./client";

export default async function SubjectsPage() {
  const token = await getAccessToken();
  const repo = new SubjectRepository();
  const subjects = await repo.list({ limit: 100 }, token!);

  return <SubjectsClient initialData={subjects} />;
}
