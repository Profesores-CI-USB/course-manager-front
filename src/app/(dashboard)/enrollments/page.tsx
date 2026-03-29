import { CourseRepository } from "@/infrastructure/repositories/course.repository";
import { EnrollmentRepository } from "@/infrastructure/repositories/enrollment.repository";
import { StudentRepository } from "@/infrastructure/repositories/student.repository";
import { getAccessToken } from "@/lib/session";
import EnrollmentsClient from "./client";

export default async function EnrollmentsPage() {
  const token = await getAccessToken();
  const repo = new EnrollmentRepository();
  const courseRepo = new CourseRepository();
  const studentRepo = new StudentRepository();

  const [enrollments, courses, students] = await Promise.all([
    repo.list({ limit: 100 }, token!),
    courseRepo.list({ limit: 100 }, token!),
    studentRepo.list({ limit: 100 }, token!),
  ]);

  return (
    <EnrollmentsClient
      initialData={enrollments}
      courses={courses}
      students={students}
    />
  );
}
