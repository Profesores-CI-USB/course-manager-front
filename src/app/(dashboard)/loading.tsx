export default function DashboardLoading() {
  return (
    <div className="animate-pulse p-6">
      <div className="mb-6 h-8 w-48 rounded-md bg-muted" />
      <div className="overflow-hidden rounded-lg border border-border">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-border px-4 py-3 last:border-0">
            <div className="h-4 w-1/4 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-4 w-1/5 rounded bg-muted" />
            <div className="h-4 w-1/6 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
