import NextImage, { type ImageProps } from "next/image";

import { cn } from "@/shared/lib/utils";

export const getAssetUrl = (path: string) =>
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  `${process.env.NEXT_PUBLIC_CDN_URL}/${path.replace(/^\/+/, "")}`;

type Props = ImageProps & {
  lowQualitySrc?: string;
};

export function Image({ className, lowQualitySrc, ...props }: Props) {
  return (
    <NextImage
      {...props}
      className={cn("transition-opacity duration-300", className)}
      placeholder={lowQualitySrc ? "blur" : "empty"}
      blurDataURL={lowQualitySrc}
      draggable={false}
    />
  );
}
