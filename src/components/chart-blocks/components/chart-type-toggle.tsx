"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChartTypeOption<T extends string> {
  value: T;
  icon: LucideIcon;
  label: string;
}

export function ChartTypeToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: ChartTypeOption<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-0.5 rounded-md border border-border bg-muted/40 p-0.5">
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="ghost"
          size="icon"
          title={opt.label}
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-6 w-6 rounded-sm",
            value === opt.value &&
              "bg-background text-foreground shadow-sm",
          )}
        >
          <opt.icon size={13} />
        </Button>
      ))}
    </div>
  );
}
