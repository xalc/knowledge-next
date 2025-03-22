import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Blog } from "@/types/blogs";

export default function BlogItem({ blog, className }: { blog: Blog; className: string }) {
  const { title, description, slug } = blog;
  const cover = blog.cover;
  return (
    <Link
      href={`/blogs/${slug}`}
      className="group block h-fit w-full rounded-xl text-inherit no-underline"
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
          className,
        )}
      >
        {cover ? (
          <>
            <div className="relative aspect-video overflow-hidden rounded-t-xl">
              <Image
                src={cover}
                alt={title}
                sizes={"w-full"}
                className="absolute inset-0 bg-cover bg-center object-cover transition-all duration-500 group-hover:scale-105"
                fill
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </div>
            <CardHeader className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap justify-start gap-2">
                  {blog.metadata?.tags &&
                    blog.metadata.tags?.slice(0, 3).map((tag, index) => (
                      <Badge
                        variant="secondary"
                        key={`tag_${index}`}
                        className="pointer-events-none whitespace-nowrap bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                  <Calendar className="h-4 w-4" />
                  <span>{blog.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-primary">
                {title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-muted-foreground/90">{description}</p>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap justify-start gap-2">
                  {blog.metadata?.tags &&
                    blog.metadata.tags?.slice(0, 3).map((tag, index) => (
                      <Badge
                        variant="secondary"
                        key={`tag_${index}`}
                        className="pointer-events-none whitespace-nowrap bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                  <Calendar className="h-4 w-4" />
                  <span>{blog.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-primary">
                {title}
              </h3>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="line-clamp-5 text-muted-foreground/90">{description}</p>
            </CardContent>
          </>
        )}
      </Card>
    </Link>
  );
}
