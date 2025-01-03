import Link from "next/link";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
const linkVariants = cva("underline decoration-primary text-primary");
const CustomLink = props => {
  const { children, className, ref, ...rest } = props;
  return (
    <Link ref={ref} {...rest} className={cn(linkVariants(), className)}>
      {children}
    </Link>
  );
};
export { CustomLink as Link };
