import { redirect } from "next/navigation";
import { studentRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import StudentsClient from "./client";

export default async function StudentsPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");
  const students = await studentRepo.list({ limit: 100 }, token);

  return <StudentsClient initialData={students} />;
}
