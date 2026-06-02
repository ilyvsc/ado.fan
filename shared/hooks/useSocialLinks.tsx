import clsx from "clsx";

import Link from "next/link";

import type { SocialLink } from "@/types/social";

export function useSocialLinks({
  links,
  className,
}: {
  links: readonly SocialLink[];
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
        <span aria-hidden="true">{icon}</span>
        <span>{name}</span>
      </Link>
    );
  });
}
