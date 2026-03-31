"use client";

import { VChart } from "@visactor/react-vchart";
import type {
  IAreaChartSpec,
  IBarChartSpec,
  ILineChartSpec,
} from "@visactor/vchart";
import { AreaChart, BarChart2, LineChart } from "lucide-react";
import { useState } from "react";
import type { CourseStats } from "@/domain/entities/stats";
import { ChartTypeToggle } from "../../components/chart-type-toggle";
import ChartTitle from "../../components/chart-title";

type ChartType = "bar" | "line" | "area";
type CourseAvgDatum = { course: string; avg: number; enrolled: number };

const CHART_OPTIONS = [
  { value: "bar" as const, icon: BarChart2, label: "Barras" },
  { value: "line" as const, icon: LineChart, label: "Línea" },
  { value: "area" as const, icon: AreaChart, label: "Área" },
];

const MARK_LINE = [
  {
    y: 3,
    line: {
      style: { stroke: "#ef4444", lineWidth: 2, lineDash: [4, 4] },
    },
    label: {
      text: "Aprobación (3)",
      style: { fill: "#ef4444", fontSize: 11 },
      position: "insideEndTop" as const,
    },
  },
];

function buildValues(courses: CourseStats[]) {
  return courses.map((c) => ({
    course: `${c.subject_code} ${c.year}`,
    avg: c.avg_scale_grade != null ? Number(c.avg_scale_grade.toFixed(2)) : 0,
    enrolled: c.total_enrolled,
  }));
}

function BarSpec(courses: CourseStats[]): IBarChartSpec {
  return {
    type: "bar",
    data: [{ id: "courseAvg", values: buildValues(courses) }],
    xField: "course",
    yField: "avg",
    axes: [
      { orient: "bottom", label: { style: { fontSize: 11 } } },
      { orient: "left", min: 0, max: 5, label: { style: { fontSize: 11 } } },
    ],
    bar: {
      style: {
        cornerRadius: [6, 6, 0, 0],
        fill: "#3b82f6",
      },
    },
    markLine: MARK_LINE,
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        content: [
          {
            key: (d) => (d as CourseAvgDatum).course,
            value: (d) => `Promedio: ${(d as CourseAvgDatum).avg}`,
          },
          {
            key: () => "Inscritos",
            value: (d) => String((d as CourseAvgDatum).enrolled),
          },
        ],
      },
    },
  };
}

function LineSpec(courses: CourseStats[]): ILineChartSpec {
  return {
    type: "line",
    data: [{ id: "courseAvg", values: buildValues(courses) }],
    xField: "course",
    yField: "avg",
    axes: [
      { orient: "bottom", label: { style: { fontSize: 11 } } },
      { orient: "left", min: 0, max: 5, label: { style: { fontSize: 11 } } },
    ],
    line: { style: { stroke: "#3b82f6", lineWidth: 2 } },
    point: {
      visible: true,
      style: { fill: "#3b82f6", size: 6 },
    },
    markLine: MARK_LINE,
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        content: [
          {
            key: (d) => (d as CourseAvgDatum).course,
            value: (d) => `Promedio: ${(d as CourseAvgDatum).avg}`,
          },
          {
            key: () => "Inscritos",
            value: (d) => String((d as CourseAvgDatum).enrolled),
          },
        ],
      },
    },
  };
}

function AreaSpec(courses: CourseStats[]): IAreaChartSpec {
  return {
    type: "area",
    data: [{ id: "courseAvg", values: buildValues(courses) }],
    xField: "course",
    yField: "avg",
    axes: [
      { orient: "bottom", label: { style: { fontSize: 11 } } },
      { orient: "left", min: 0, max: 5, label: { style: { fontSize: 11 } } },
    ],
    area: { style: { fillOpacity: 0.2, fill: "#3b82f6" } },
    line: { style: { stroke: "#3b82f6", lineWidth: 2 } },
    point: { visible: true, style: { fill: "#3b82f6", size: 5 } },
    markLine: MARK_LINE,
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        content: [
          {
            key: (d) => (d as CourseAvgDatum).course,
            value: (d) => `Promedio: ${(d as CourseAvgDatum).avg}`,
          },
          {
            key: () => "Inscritos",
            value: (d) => String((d as CourseAvgDatum).enrolled),
          },
        ],
      },
    },
  };
}

export default function CourseAveragesBlock({
  courses,
}: {
  courses: CourseStats[];
}) {
  const [type, setType] = useState<ChartType>("bar");

  const spec =
    type === "line"
      ? LineSpec(courses)
      : type === "area"
        ? AreaSpec(courses)
        : BarSpec(courses);

  return (
    <section className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <ChartTitle title="Promedio por Curso (escala 1–5)" icon={BarChart2} />
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
