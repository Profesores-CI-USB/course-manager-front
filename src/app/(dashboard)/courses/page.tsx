import { CourseRepository } from "@/infrastructure/repositories/course.repository";
import { SubjectRepository } from "@/infrastructure/repositories/subject.repository";
import { getAccessToken } from "@/lib/session";
import CoursesClient from "./client";

export default async function CoursesPage() {
  const token = await getAccessToken();
  const repo = new CourseRepository();
  const subjectRepo = new SubjectRepository();

  const [courses, subjects] = await Promise.all([
    repo.list({ limit: 100 }, token!),
    subjectRepo.list({ limit: 100 }, token!),
  ]);

  return <CoursesClient initialData={courses} subjects={subjects} />;
}
