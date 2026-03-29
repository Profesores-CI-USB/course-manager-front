import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "error" | "success" | "info";
}

export function Alert({ className, variant = "error", children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        variant === "error" &&
          "border-destructive/30 bg-destructive/10 text-destructive",
        variant === "success" &&
          "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
        variant === "info" &&
          "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
