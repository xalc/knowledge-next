import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="border-t border-border shadow-sm md:max-h-[calc(100vh_-_132px)]">
      <div className="hidden md:block">
        <div className="flex">
          <aside className="w-[260px] border-r p-6">
            <Skeleton className="mb-6 h-6 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={`nav-skeleton-${index}`} className="h-4 w-full" />
              ))}
            </div>
          </aside>
          <main className="flex-1 p-8">
            <div className="mb-6 flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-1/2" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-8/12" />
            </div>
          </main>
        </div>
      </div>

      <div className="block md:hidden">
        <div className="container p-4">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-9/12" />
          </div>
        </div>
      </div>
    </div>
  );
}
