import clsx from "clsx";

import Link from "next/link";

import type { SocialLink } from "@/types/Social";

export function useSocialLinks({
  links,
  className,
}: {
  links: ReadonlyArray<SocialLink>;
  className?: string;
}) {
  return links.map(({ url, description, icon, name }) => {
    return (
      <Link
        key={url}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={description}
        title={description}
        className={clsx("flex items-center gap-2", className)}
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  });
}
