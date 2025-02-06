import { cn } from "@/lib/utils";
import { Code } from "bright";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
const handleInnerLink = link =>
  "/docs/" +
  decodeURIComponent(link.split("/").pop())
    .replace(/\.mdx?$/, "")
    .replace(" ", "_");
function CustomLink({ className, href, ...props }) {
  const isOuter = href.startsWith("http");

  const newlink = isOuter ? href : handleInnerLink(href);
  if (isOuter) {
    return (
      <a
        target="_blank"
        rel="noreferrer"
        href={newlink}
        className={cn("flex items-center text-primary", className)}
      >
        <Button className="pr-1" variant="link" {...props}></Button>
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  }
  return <Link className="text-primary underline" href={newlink} {...props}></Link>;
}
export const mdxComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn("scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn("mt-6 scroll-m-20 text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <Image
      src={`/api/image?src=${props.src}`}
      alt={alt}
      className={cn(
        "inset-0 bg-gradient-to-br from-primary/10 to-background object-cover",
        className,
      )}
      priority
      width={1600}
      height={900}
      style={{ width: "90%", height: "auto" }}
    />
  ),
  a: CustomLink,
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  pre: Code,
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded bg-primary/20 px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className,
      )}
      {...props}
    />
  ),
};
