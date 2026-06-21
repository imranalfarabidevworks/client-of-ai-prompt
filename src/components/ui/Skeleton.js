export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse space-y-3">
      <div className="flex gap-2"><div className="h-5 w-16 bg-surface-border rounded-full" /><div className="h-5 w-20 bg-surface-border rounded-full" /></div>
      <div className="h-4 bg-surface-border rounded w-3/4" />
      <div className="h-4 bg-surface-border rounded w-full" />
      <div className="h-4 bg-surface-border rounded w-2/3" />
      <div className="flex gap-2 pt-2"><div className="h-6 w-12 bg-surface-border rounded-full" /><div className="h-6 w-12 bg-surface-border rounded-full" /></div>
      <div className="h-9 bg-surface-border rounded-xl mt-2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-surface-border" />
      <div className="flex-1 space-y-2"><div className="h-3 bg-surface-border rounded w-1/3" /><div className="h-3 bg-surface-border rounded w-1/4" /></div>
      <div className="h-6 w-16 bg-surface-border rounded-full" />
    </div>
  );
}
