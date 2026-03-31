import { redirect } from "next/navigation";
import { courseRepo, enrollmentRepo, studentRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import EnrollmentsClient from "./client";

export default async function EnrollmentsPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const [enrollments, courses, students] = await Promise.all([
    enrollmentRepo.list({ limit: 100 }, token),
    courseRepo.list({ limit: 100 }, token),
    studentRepo.list({ limit: 100 }, token),
  ]);

  return (
    <EnrollmentsClient
      initialData={enrollments}
      courses={courses}
      students={students}
    />
  );
}
