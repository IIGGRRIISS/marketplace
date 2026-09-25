export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-64 rounded-2xl bg-zinc-100 mb-12" />
      <div className="h-8 w-40 bg-zinc-100 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
            <div className="aspect-square bg-zinc-100" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-zinc-100 rounded w-3/4" />
              <div className="h-3 bg-zinc-100 rounded w-1/2" />
              <div className="h-5 bg-zinc-100 rounded w-1/3 mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}