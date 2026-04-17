export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/5 bg-bg-card">
      {/* Image */}
      <div className="aspect-video skeleton" />
      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded skeleton" />
          <div className="h-5 w-14 rounded-full skeleton" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded skeleton" />
          <div className="h-3 w-3/4 rounded skeleton" />
        </div>
        <div className="flex gap-2 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-14 rounded skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}
