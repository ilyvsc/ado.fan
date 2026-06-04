import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";

const IMAGE_FORMAT = "webp";
type ImageVariant = "minQuality" | "maxQuality";

/**
 * Generates a CDN URL for a static asset.
 *
 * The provided path should be relative to the CDN root and must not include
 * a file extension. The configured image format is automatically appended.
 *
 * Example:
 * ```ts
 * getAssetUrl("songs/all-night-radio") // https://r2.ado.fan/songs/all-night-radio.webp
 * ```
 *
 * @param path Relative asset path without a leading slash or file extension.
 * @returns Fully qualified CDN URL including the configured image format.
 */
export const getAssetUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_CDN_URL}/${path.replace(/^\/+/, "")}.${IMAGE_FORMAT}`;

/**
 * Generates the CDN URLs for an image's available quality variants.
 *
 * The provided path should be relative to the CDN root and must not include
 * a file extension. The standard image is treated as the maximum quality
 * version, while the `.min` suffix is used for the low-quality placeholder.
 *
 * Example:
 * ```ts
 * getImageUrls("songs/all-night-radio") // { minQuality: "<url>", maxQuality: "<url>" }
 * ```
 *
 * @param path Relative asset path without a leading slash or file extension.
 * @returns URLs for both the low-quality and maximum-quality image variants.
 */
export function getImageUrls(path: string): Record<ImageVariant, string> {
  const minQuality = getAssetUrl(`${path}.min`); // webp minified (70% compression)
  const maxQuality = getAssetUrl(path); // original format -> webp (no compression)
  return { minQuality: minQuality, maxQuality: maxQuality };
}

type Props = ImageProps & {
  lowQualitySrc?: string;
};

/**
 * Next.js Image component with optional progressive image loading.
 *
 * When a `lowQualitySrc` is provided, a low-resolution placeholder is rendered
 * immediately while the full-quality image loads in the background.
 *
 * This helps reduce perceived loading times and prevents abrupt image swaps,
 * for large assets served from the CDN. Once the full-quality image loads, it's removed from the DOM.
 *
 * Example:
 * ```tsx
 * const { minQuality, maxQuality } = getImageUrls(song.coverArt);
 *
 * <Image
 *   src={maxQuality}
 *   lowQualitySrc={minQuality}
 *   alt={song.title.english}
 *   width={500}
 *   height={500}
 * />
 * ```
 *
 * @param lowQualitySrc Optional low-quality image.
 * @param props All standard Next.js Image props.
 * @returns Next.js Image component.
 */
export function Image({ className, lowQualitySrc, ...props }: Props) {
  const [isImageLoading, setImageLoading] = useState(false);

  if (!lowQualitySrc) return <NextImage {...props} />;

  return (
    <>
      <NextImage
        {...props}
        src={lowQualitySrc}
        className={isImageLoading ? "opacity-0" : "opacity-100"}
      />

      <NextImage
        {...props}
        src={props.src}
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isImageLoading ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => {
          setImageLoading(true);
        }}
      />
    </>
  );
}
