import { StudentRepository } from "@/infrastructure/repositories/student.repository";
import { getAccessToken } from "@/lib/session";
import StudentsClient from "./client";

export default async function StudentsPage() {
  const token = await getAccessToken();
  const repo = new StudentRepository();
  const students = await repo.list({ limit: 100 }, token!);

  return <StudentsClient initialData={students} />;
}
