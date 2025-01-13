import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto">
      <div className="mx-12 my-16 ">
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <div className="mx-12 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_240px]">

        <article className="mb-36 space-y-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
        </article>

        <div className="hidden 2xl:block">
          <div className="sticky top-20 space-y-6">

            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    </div>

  );
}
