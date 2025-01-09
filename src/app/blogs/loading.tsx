import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
const BlogItemSkeleton = () => (
  <Card
    className={
      "h-fit w-full overflow-hidden rounded-xl border-0 bg-secondary transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    }
  >
    <CardHeader className="space-y-2">
      <Skeleton className="h-12" />
      <Skeleton className="h-16" />
    </CardHeader>
    <CardContent className="space-y-2 pt-2">
      <Skeleton className="h-8" />
      <Skeleton className="h-8" />
      <Skeleton className="h-8" />
    </CardContent>
  </Card>
);

export default function Loading() {
  return (
    <div className="container mx-auto flex flex-col items-center gap-8 lg:max-w-[1024px]">
      <h1>Blogs</h1>

      <section className="container px-4 py-4">
        <div className="space-y-12">
          <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3 [&>*]:break-inside-avoid-column">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <BlogItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
