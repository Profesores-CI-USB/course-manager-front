import { CourseRepository } from "@/infrastructure/repositories/course.repository";
import { EvaluationRepository } from "@/infrastructure/repositories/evaluation.repository";
import { getAccessToken } from "@/lib/session";
import EvaluationsClient from "./client";

export default async function EvaluationsPage() {
  const token = await getAccessToken();
  const repo = new EvaluationRepository();
  const courseRepo = new CourseRepository();

  const [evaluations, courses] = await Promise.all([
    repo.list({ limit: 100 }, token!),
    courseRepo.list({ limit: 100 }, token!),
  ]);

  return <EvaluationsClient initialData={evaluations} courses={courses} />;
}
