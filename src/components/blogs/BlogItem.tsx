import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
type Meta = {
  tags: string[];
  author: string;
};
type Blog = {
  title: string;
  description: string;
  slug: string;
  metadata: Meta;
  updatedAt: Date;
};
export default function BlogItem({ blog, className }: { blog: Blog; className: string }) {
  const { title, description, slug } = blog;
  const imageUrl = null;
  return (
    <Link
      href={`/blogs/${slug}`}
      className={
        "group block h-fit w-full rounded-xl border-0 bg-secondary text-inherit no-underline"
      }
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:bg-accent/5 hover:shadow-xl group-hover:border-primary/50",
          className,
        )}
      >
        {imageUrl ? (
          // 有图片的布局
          <>
            <div className="relative aspect-video overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-background/0" />
            </div>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="pointer-events-none">
                  {slug}
                </Badge>
                <span className="text-sm text-muted-foreground">{title}</span>
              </div>
              <h3 className="text-xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary">
                {title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-muted-foreground">{description}</p>
            </CardContent>
          </>
        ) : (
          // 无图片的布局
          <>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                {blog.metadata?.tags &&
                  blog.metadata.tags?.slice(0, 3).map((tag, index) => (
                    <Badge
                      variant="secondary"
                      key={`tag_${index}`}
                      className="pointer-events-none whitespace-nowrap"
                    >
                      {tag}
                    </Badge>
                  ))}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{blog.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary">
                {title}
              </h3>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="line-clamp-3 text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                {/* <span className="h-1 w-1 rounded-full bg-muted-foreground" /> */}
                {/* <span>{`${description.length} 字`}</span> */}
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </Link>
  );
}
