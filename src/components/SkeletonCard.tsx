export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden animate-pulse-soft">
      <div className="bg-surface-secondary pt-8 pb-2 px-4 flex justify-center">
        <div className="h-28 w-28 rounded-full bg-border" />
      </div>
      <div className="p-4 text-center space-y-3">
        <div className="mx-auto h-4 w-24 rounded-lg bg-border" />
        <div className="mx-auto h-6 w-16 rounded-lg bg-border" />
      </div>
    </div>
  );
}
