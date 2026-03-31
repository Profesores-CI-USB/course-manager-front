import { redirect } from "next/navigation";
import { enrollmentRepo, evaluationRepo, gradeRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import GradesClient from "./client";

export default async function GradesPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const [grades, evaluations, enrollments] = await Promise.all([
    gradeRepo.list({ limit: 100 }, token),
    evaluationRepo.list({ limit: 100 }, token),
    enrollmentRepo.list({ limit: 100 }, token),
  ]);

  return (
    <GradesClient
      initialData={grades}
      evaluations={evaluations}
      enrollments={enrollments}
    />
  );
}
