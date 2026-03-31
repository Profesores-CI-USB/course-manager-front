"use client";

import { VChart } from "@visactor/react-vchart";
import type {
  IBarChartSpec,
  ILineChartSpec,
  IRadarChartSpec,
} from "@visactor/vchart";
import { BarChart2, LineChart, Target } from "lucide-react";
import { useState } from "react";
import type { CourseStats } from "@/domain/entities/stats";
import { ChartTypeToggle } from "../../components/chart-type-toggle";
import ChartTitle from "../../components/chart-title";

type ChartType = "bar" | "line" | "radar";
type PassRateDatum = { course: string; rate: number; graded: number; enrolled: number };

const CHART_OPTIONS = [
  { value: "bar" as const, icon: BarChart2, label: "Barras" },
  { value: "line" as const, icon: LineChart, label: "Línea" },
  { value: "radar" as const, icon: Target, label: "Radar" },
];

function buildValues(courses: CourseStats[]) {
  return courses.map((c) => ({
    course: `${c.subject_code} ${c.year}`,
    rate: c.pass_rate != null ? Math.round(c.pass_rate * 100) : 0,
    graded: c.graded_count,
    enrolled: c.total_enrolled,
  }));
}

const TOOLTIP_CONTENT = [
  {
    key: (d: unknown) => (d as PassRateDatum).course,
    value: (d: unknown) => `${(d as PassRateDatum).rate}% aprobación`,
  },
  {
    key: () => "Calificados / Inscritos",
    value: (d: unknown) =>
      `${(d as PassRateDatum).graded} / ${(d as PassRateDatum).enrolled}`,
  },
];

function BarSpec(courses: CourseStats[]): IBarChartSpec {
  return {
    type: "bar",
    data: [{ id: "passRate", values: buildValues(courses) }],
    xField: "course",
    yField: "rate",
    axes: [
      { orient: "bottom", label: { style: { fontSize: 11 } } },
      {
        orient: "left",
        min: 0,
        max: 100,
        label: {
          style: { fontSize: 11 },
          formatMethod: (v: unknown) => `${v}%`,
        },
      },
    ],
    bar: {
      style: {
        cornerRadius: [6, 6, 0, 0],
        fill: (datum) => {
          const rate = (datum as PassRateDatum).rate;
          return rate >= 70 ? "#22c55e" : rate >= 50 ? "#eab308" : "#ef4444";
        },
      },
    },
    tooltip: { trigger: ["click", "hover"], mark: { content: TOOLTIP_CONTENT } },
  };
}

function LineSpec(courses: CourseStats[]): ILineChartSpec {
  return {
    type: "line",
    data: [{ id: "passRate", values: buildValues(courses) }],
    xField: "course",
    yField: "rate",
    axes: [
      { orient: "bottom", label: { style: { fontSize: 11 } } },
      {
        orient: "left",
        min: 0,
        max: 100,
        label: {
          style: { fontSize: 11 },
          formatMethod: (v: unknown) => `${v}%`,
        },
      },
    ],
    line: { style: { stroke: "#3b82f6", lineWidth: 2 } },
    point: { visible: true, style: { fill: "#3b82f6", size: 6 } },
    tooltip: { trigger: ["click", "hover"], mark: { content: TOOLTIP_CONTENT } },
  };
}

function RadarSpec(courses: CourseStats[]): IRadarChartSpec {
  return {
    type: "radar",
    data: [{ id: "passRate", values: buildValues(courses) }],
    categoryField: "course",
    valueField: "rate",
    area: { visible: true, style: { fillOpacity: 0.2 } },
    point: { visible: true },
    axes: [
      {
        orient: "radius",
        min: 0,
        max: 100,
        label: {
          visible: true,
          style: { fontSize: 10 },
          formatMethod: (v: unknown) => `${v}%`,
        },
      },
      { orient: "angle", label: { style: { fontSize: 10 } } },
    ],
    tooltip: { trigger: ["click", "hover"], mark: { content: TOOLTIP_CONTENT } },
  };
}

export default function CoursePassRateBlock({
  courses,
}: {
  courses: CourseStats[];
}) {
  const [type, setType] = useState<ChartType>("bar");

  const spec =
    type === "line"
      ? LineSpec(courses)
      : type === "radar"
        ? RadarSpec(courses)
        : BarSpec(courses);

  return (
    <section className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <ChartTitle title="Tasa de Aprobación por Curso" icon={BarChart2} />
        <ChartTypeToggle
          options={CHART_OPTIONS}
          value={type}
          onChange={setType}
        />
      </div>
      <div className="relative h-80 flex-grow">
        <VChart spec={spec} />
      </div>
    </section>
  );
}
