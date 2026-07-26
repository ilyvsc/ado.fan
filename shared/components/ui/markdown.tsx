import { type Components } from "react-markdown";

import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyList,
  TypographyP,
} from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export const proseComponents: Components = {
  h1: ({ node, className, ...props }) => (
    <TypographyH1 className={cn("mt-8 mb-4 first:mt-0", className)} {...props} />
  ),
  h2: ({ node, className, ...props }) => (
    <TypographyH2 className={cn("mt-8 mb-4 first:mt-0", className)} {...props} />
  ),
  h3: ({ node, className, ...props }) => (
    <TypographyH3 className={cn("mt-6 mb-3 first:mt-0", className)} {...props} />
  ),
  h4: ({ node, className, ...props }) => (
    <TypographyH4 className={cn("mt-5 mb-2 first:mt-0", className)} {...props} />
  ),
  p: ({ node, className, ...props }) => (
    <TypographyP className={cn("not-first:mt-4", className)} {...props} />
  ),
  ul: ({ node, className, ...props }) => (
    <TypographyList className={className} {...props} />
  ),
  blockquote: ({ node, className, ...props }) => (
    <TypographyBlockquote className={className} {...props} />
  ),
};
