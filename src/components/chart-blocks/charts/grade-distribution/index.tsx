"use client";

import { VChart } from "@visactor/react-vchart";
import type {
  IBarChartSpec,
  IPieChartSpec,
  IRadarChartSpec,
} from "@visactor/vchart";
import { BarChart2, PieChart, Target } from "lucide-react";
import { useState } from "react";
import type { GradeDistribution } from "@/domain/entities/stats";
import { ChartTypeToggle } from "../../components/chart-type-toggle";
import ChartTitle from "../../components/chart-title";

type ChartType = "bar" | "pie" | "radar";
type GradeDatum = { grade: string; count: number; color: string };

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

const CHART_OPTIONS = [
  { value: "bar" as const, icon: BarChart2, label: "Barras" },
  { value: "pie" as const, icon: PieChart, label: "Circular" },
  { value: "radar" as const, icon: Target, label: "Radar" },
];

function buildValues(distribution: GradeDistribution) {
  return (Object.keys(distribution) as (keyof GradeDistribution)[]).map(
    (key) => ({
      grade: GRADE_LABELS[key],
      count: distribution[key],
      color: GRADE_COLORS[key],
    }),
  );
}

function BarSpec(distribution: GradeDistribution): IBarChartSpec {
  const values = buildValues(distribution);
  return {
    type: "bar",
    data: [{ id: "gradeData", values }],
    xField: "grade",
    yField: "count",
    bar: {
      style: {
        cornerRadius: [6, 6, 0, 0],
        fill: (datum) => (datum as GradeDatum).color,
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
            key: (d) => (d as GradeDatum).grade,
            value: (d) => String((d as GradeDatum).count),
          },
        ],
      },
    },
  };
}

function PieSpec(distribution: GradeDistribution): IPieChartSpec {
  const values = buildValues(distribution);
  return {
    type: "pie",
    data: [{ id: "gradeData", values }],
    valueField: "count",
    categoryField: "grade",
    outerRadius: 0.9,
    innerRadius: 0.6,
    padAngle: 0.4,
    pie: { style: { cornerRadius: 4 } },
    color: (Object.keys(distribution) as (keyof GradeDistribution)[]).map(
      (k) => GRADE_COLORS[k],
    ),
    legends: [{ visible: true, orient: "bottom", type: "discrete" }],
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        content: [
          {
            key: (d) => (d as GradeDatum).grade,
            value: (d) => String((d as GradeDatum).count),
          },
        ],
      },
    },
  };
}

function RadarSpec(distribution: GradeDistribution): IRadarChartSpec {
  const values = buildValues(distribution);
  return {
    type: "radar",
    data: [{ id: "gradeData", values }],
    categoryField: "grade",
    valueField: "count",
    area: { visible: true, style: { fillOpacity: 0.2 } },
    point: { visible: true },
    axes: [
      { orient: "radius", label: { visible: true, style: { fontSize: 10 } } },
      { orient: "angle", label: { style: { fontSize: 10 } } },
    ],
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        content: [
          {
            key: (d) => (d as GradeDatum).grade,
            value: (d) => String((d as GradeDatum).count),
          },
        ],
      },
    },
  };
}

export default function GradeDistributionBlock({
  distribution,
}: {
  distribution: GradeDistribution;
}) {
  const [type, setType] = useState<ChartType>("bar");

  const spec =
    type === "pie"
      ? PieSpec(distribution)
      : type === "radar"
        ? RadarSpec(distribution)
        : BarSpec(distribution);

  return (
    <section className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <ChartTitle title="Distribución de Notas" icon={BarChart2} />
        <ChartTypeToggle
          options={CHART_OPTIONS}
          value={type}
          onChange={setType}
        />
      </div>
      <div className="relative h-72 flex-grow">
        <VChart spec={spec} />
      </div>
    </section>
  );
}
