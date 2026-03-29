import { EnrollmentRepository } from "@/infrastructure/repositories/enrollment.repository";
import { EvaluationRepository } from "@/infrastructure/repositories/evaluation.repository";
import { GradeRepository } from "@/infrastructure/repositories/grade.repository";
import { getAccessToken } from "@/lib/session";
import GradesClient from "./client";

export default async function GradesPage() {
  const token = await getAccessToken();
  const repo = new GradeRepository();
  const evaluationRepo = new EvaluationRepository();
  const enrollmentRepo = new EnrollmentRepository();

  const [grades, evaluations, enrollments] = await Promise.all([
    repo.list({ limit: 100 }, token!),
    evaluationRepo.list({ limit: 100 }, token!),
    enrollmentRepo.list({ limit: 100 }, token!),
  ]);

  return (
    <GradesClient
      initialData={grades}
      evaluations={evaluations}
      enrollments={enrollments}
    />
  );
}
