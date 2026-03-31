import { BarChart2 } from "lucide-react";
import type { GradeDistribution } from "@/domain/entities/stats";
import ChartTitle from "../../components/chart-title";
import GradeDistributionChart from "./chart";

export default function GradeDistributionBlock({
  distribution,
}: {
  distribution: GradeDistribution;
}) {
  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Distribución de Notas" icon={BarChart2} />
      <div className="relative h-72 flex-grow">
        <GradeDistributionChart distribution={distribution} />
      </div>
    </section>
  );
}
