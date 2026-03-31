import { CheckCircle } from "lucide-react";
import type { CourseStats } from "@/domain/entities/stats";
import ChartTitle from "../../components/chart-title";
import CoursePassRateChart from "./chart";

export default function CoursePassRateBlock({
  courses,
}: {
  courses: CourseStats[];
}) {
  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Tasa de Aprobación por Curso" icon={CheckCircle} />
      <div className="relative h-80 flex-grow">
        <CoursePassRateChart courses={courses} />
      </div>
    </section>
  );
}
