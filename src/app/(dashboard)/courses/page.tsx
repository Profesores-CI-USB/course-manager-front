import { redirect } from "next/navigation";
import { courseRepo, subjectRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import CoursesClient from "./client";

export default async function CoursesPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const [courses, subjects] = await Promise.all([
    courseRepo.list({ limit: 100 }, token),
    subjectRepo.list({ limit: 100 }, token),
  ]);

  return <CoursesClient initialData={courses} subjects={subjects} />;
}
