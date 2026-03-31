"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-12 text-center">
      <p className="text-muted-foreground">
        {error.message || "Ocurrió un error inesperado."}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
      >
        Reintentar
      </button>
    </div>
  );
}
