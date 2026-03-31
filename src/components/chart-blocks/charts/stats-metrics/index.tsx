import Container from "@/components/container";
import type { StatsSummary } from "@/domain/entities/stats";
import MetricCard from "./components/metric-card";

export default function StatsMetrics({ summary }: { summary: StatsSummary }) {
  const metrics = [
    {
      title: "Total Cursos",
      value: String(summary.total_courses),
      subtitle: "cursos activos",
    },
    {
      title: "Total Inscritos",
      value: String(summary.total_enrolled),
      subtitle: `${summary.pending_students} pendientes por calificar`,
    },
    {
      title: "Promedio Global",
      value: summary.global_avg_scale_grade != null
        ? summary.global_avg_scale_grade.toFixed(2)
        : "—",
      subtitle: summary.global_avg_grade != null
        ? `${summary.global_avg_grade.toFixed(1)} / 100 en escala base`
        : "Sin calificaciones aún",
    },
    {
      title: "Tasa de Aprobación",
      value: summary.global_pass_rate != null
        ? `${Math.round(summary.global_pass_rate * 100)}%`
        : "—",
      subtitle: `${summary.graded_students} estudiantes calificados`,
    },
  ];

  return (
    <Container className="grid grid-cols-1 gap-y-6 border-b border-border py-4 phone:grid-cols-2 laptop:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </Container>
  );
}
