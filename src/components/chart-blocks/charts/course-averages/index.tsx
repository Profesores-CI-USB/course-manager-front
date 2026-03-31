import { TrendingUp } from "lucide-react";
import type { CourseStats } from "@/domain/entities/stats";
import ChartTitle from "../../components/chart-title";
import CourseAveragesChart from "./chart";

export default function CourseAveragesBlock({
  courses,
}: {
  courses: CourseStats[];
}) {
  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Promedio por Curso (escala 1–5)" icon={TrendingUp} />
      <div className="relative h-80 flex-grow">
        <CourseAveragesChart courses={courses} />
      </div>
    </section>
  );
}
