"use client";

import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import type { CourseStats } from "@/domain/entities/stats";

export default function CoursePassRateChart({
  courses,
}: {
  courses: CourseStats[];
}) {
  const values = courses.map((c) => ({
    course: `${c.subject_code} ${c.year}`,
    rate: c.pass_rate != null ? Math.round(c.pass_rate * 100) : 0,
    graded: c.graded_count,
    enrolled: c.total_enrolled,
  }));

  const spec: IBarChartSpec = {
    type: "bar",
    data: [{ id: "passRate", values }],
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
          const rate = (datum as { rate: number }).rate;
          return rate >= 70 ? "#22c55e" : rate >= 50 ? "#eab308" : "#ef4444";
        },
      },
    },
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        content: [
          {
            key: (d) => (d as { course: string }).course,
            value: (d) => `${(d as { rate: number }).rate}% aprobación`,
          },
          {
            key: () => "Calificados / Inscritos",
            value: (d) =>
              `${(d as { graded: number }).graded} / ${(d as { enrolled: number }).enrolled}`,
          },
        ],
      },
    },
  };

  return <VChart spec={spec} />;
}
