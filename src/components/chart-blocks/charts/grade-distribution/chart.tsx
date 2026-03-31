"use client";

import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import type { GradeDistribution } from "@/domain/entities/stats";

const GRADE_LABELS: Record<keyof GradeDistribution, string> = {
  five: "5 (85-100)",
  four: "4 (70-84)",
  three: "3 (50-69)",
  two: "2 (30-49)",
  one: "1 (0-29)",
  pending: "Pendiente",
};

const GRADE_COLORS: Record<keyof GradeDistribution, string> = {
  five: "#22c55e",
  four: "#84cc16",
  three: "#eab308",
  two: "#f97316",
  one: "#ef4444",
  pending: "#94a3b8",
};

export default function GradeDistributionChart({
  distribution,
}: {
  distribution: GradeDistribution;
}) {
  const values = (Object.keys(distribution) as (keyof GradeDistribution)[]).map(
    (key) => ({
      grade: GRADE_LABELS[key],
      count: distribution[key],
      color: GRADE_COLORS[key],
    }),
  );

  const spec: IBarChartSpec = {
    type: "bar",
    data: [{ id: "gradeData", values }],
    xField: "grade",
    yField: "count",
    bar: {
      style: {
        cornerRadius: [6, 6, 0, 0],
        fill: (datum) => (datum as { color: string }).color,
      },
    },
    axes: [
      { orient: "bottom", label: { style: { fontSize: 11 } } },
      { orient: "left", label: { style: { fontSize: 11 } } },
    ],
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        content: [
          {
            key: (d) => (d as { grade: string }).grade,
            value: (d) => String((d as { count: number }).count),
          },
        ],
      },
    },
  };

  return <VChart spec={spec} />;
}
