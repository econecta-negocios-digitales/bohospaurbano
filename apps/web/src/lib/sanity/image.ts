import { createImageUrlBuilder } from "@sanity/image-url";

import { sanityClient } from "./client";
import type { ImageWithAlt } from "./types";

const builder = createImageUrlBuilder(sanityClient);

export type SanityImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
  crop?: string;
  hotspot?: { x: number; y: number };
};

export function sanityImageUrl(
  source: ImageWithAlt | null | undefined,
  options: SanityImageOptions = {},
): string | null {
  if (!source?.asset?._ref) return null;

  let image = builder.image(source.asset);
  if (options.width) image = image.width(options.width);
  if (options.height) image = image.height(options.height);
  if (options.crop) image = image.crop(options.crop as never);
  if (options.hotspot)
    image = image.focalPoint(options.hotspot.x, options.hotspot.y);
  if (options.quality) image = image.quality(options.quality);

  return image.auto("format").url();
}
