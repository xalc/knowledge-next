import { Skeleton } from "@/components/ui/skeleton";

export default function DocPageLoading() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none duration-1000 animate-in fade-in-50">
      {/* Title Skeleton */}
      <Skeleton className="mb-8 h-10 w-[300px]" />

      {/* Lead Paragraph Skeleton */}
      <Skeleton className="mb-8 h-4 w-full max-w-[600px]" />

      {/* Content Sections */}
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="mb-8 space-y-4">
          {/* Section Title */}
          <Skeleton className="h-8 w-[250px]" />

          {/* Paragraphs */}
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, paraIndex) => (
              <Skeleton key={paraIndex} className="h-4 w-full" />
            ))}
          </div>

          {/* List Items */}
          <div className="space-y-2 pl-4">
            {Array.from({ length: 3 }).map((_, listIndex) => (
              <Skeleton key={listIndex} className="h-4 w-[90%]" />
            ))}
          </div>
        </div>
      ))}

      {/* Info Card Skeleton */}
      <div className="my-8 rounded-lg border p-6">
        <Skeleton className="mb-2 h-6 w-[150px]" />
        <Skeleton className="h-4 w-full max-w-[500px]" />
      </div>

      {/* Navigation Links */}
      <div className="mt-8 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-[200px]" />
        ))}
      </div>
    </div>
  );
}
