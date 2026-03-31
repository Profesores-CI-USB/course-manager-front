import { redirect } from "next/navigation";
import { courseRepo, evaluationRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import EvaluationsClient from "./client";

export default async function EvaluationsPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const [evaluations, courses] = await Promise.all([
    evaluationRepo.list({ limit: 100 }, token),
    courseRepo.list({ limit: 100 }, token),
  ]);

  return <EvaluationsClient initialData={evaluations} courses={courses} />;
}
