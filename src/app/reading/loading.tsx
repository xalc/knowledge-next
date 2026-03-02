import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const BookSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-4">
      <div className="flex gap-4">
        <Skeleton className="h-24 w-16 rounded-sm" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Loading() {
  return (
    <div className="mx-8 mt-8 flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="space-y-6">
        <div className="hidden flex-wrap gap-3 sm:flex">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-40" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>

        <Card className="space-y-6">
          <CardContent>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <BookSkeleton key={`book-skeleton-${index}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
