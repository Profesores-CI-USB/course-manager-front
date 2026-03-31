"use client";

import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import type { CourseStats } from "@/domain/entities/stats";

export default function CourseAveragesChart({
  courses,
}: {
  courses: CourseStats[];
}) {
  const values = courses.map((c) => ({
    course: `${c.subject_code} ${c.year}`,
    avg: c.avg_scale_grade != null ? Number(c.avg_scale_grade.toFixed(2)) : 0,
    enrolled: c.total_enrolled,
  }));

  const spec: IBarChartSpec = {
    type: "bar",
    data: [{ id: "courseAvg", values }],
    xField: "course",
    yField: "avg",
    axes: [
      { orient: "bottom", label: { style: { fontSize: 11 } } },
      {
        orient: "left",
        min: 0,
        max: 5,
        label: { style: { fontSize: 11 } },
      },
    ],
    bar: {
      style: {
        cornerRadius: [6, 6, 0, 0],
        fill: "#3b82f6",
      },
    },
    markLine: [
      {
        y: 3,
        line: {
          style: {
            stroke: "#ef4444",
            lineWidth: 2,
            lineDash: [4, 4],
          },
        },
        label: {
          text: "Aprobación (3)",
          style: { fill: "#ef4444", fontSize: 11 },
          position: "insideEndTop",
        },
      },
    ],
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        content: [
          {
            key: (d) => (d as { course: string }).course,
            value: (d) => `Promedio: ${(d as { avg: number }).avg}`,
          },
          {
            key: () => "Inscritos",
            value: (d) => String((d as { enrolled: number }).enrolled),
          },
        ],
      },
    },
  };

  return <VChart spec={spec} />;
}
