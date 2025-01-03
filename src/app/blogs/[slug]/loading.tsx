import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-60 flex flex-col items-center gap-4 space-y-4">
      <Skeleton className="h-6 w-[400px]" />
      <Skeleton className="h-6 w-[400px]" />
      <Skeleton className="h-6 w-[400px]" />
      <Skeleton className="h-6 w-[400px]" />
      <Skeleton className="h-6 w-[400px]" />
      <Skeleton className="h-6 w-[400px]" />
    </div>
  );
}
