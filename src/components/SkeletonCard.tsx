export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
      <div className="flex justify-center">
        <div className="h-28 w-28 rounded-full bg-slate-200 dark:bg-slate-600" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="mx-auto h-4 w-24 rounded bg-slate-200 dark:bg-slate-600" />
        <div className="mx-auto h-4 w-16 rounded bg-slate-300 dark:bg-slate-500" />
        <div className="mx-auto h-4 w-16 rounded bg-slate-300 dark:bg-slate-500" />
      </div>
    </div>
  );
}