import { redirect } from "next/navigation";
import {
  CourseAveragesBlock,
  CoursePassRateBlock,
  GradeDistributionBlock,
  StatsMetrics,
} from "@/components/chart-blocks";
import Container from "@/components/container";
import { PageHeader } from "@/components/page-header";
import type { StatsResponse } from "@/domain/entities/stats";
import { statsRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";

export default async function Home() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  let stats: StatsResponse | null = null;
  try {
    stats = await statsRepo.getCourseStats(token);
  } catch {
    // stats stays null — show empty state
  }

  return (
    <div>
      <PageHeader title="Dashboard" />
      {stats ? (
        <>
          <StatsMetrics summary={stats.summary} />
          <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-3 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
            <Container className="py-4 laptop:col-span-2">
              <CourseAveragesBlock courses={stats.courses} />
            </Container>
            <Container className="py-4 laptop:col-span-1">
              <GradeDistributionBlock
                distribution={stats.summary.overall_grade_distribution}
              />
            </Container>
          </div>
          <div className="grid grid-cols-1 border-b border-border">
            <Container className="py-4">
              <CoursePassRateBlock courses={stats.courses} />
            </Container>
          </div>
        </>
      ) : (
        <Container className="py-12 text-center text-muted-foreground">
          No se pudieron cargar las estadísticas. Verifica que el backend esté disponible.
        </Container>
      )}
    </div>
  );
}
