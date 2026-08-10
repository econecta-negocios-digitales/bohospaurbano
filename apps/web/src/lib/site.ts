import type { Cta, ImageWithAlt, SiteSettings } from "./sanity/types";

export const localImages = {
  hero: "/images/home/space-hero.jpg",
  intro: "/images/home/products.jpg",
  experiences: "/images/home/brunch-boho.jpg",
  massage: "/images/home/massage.jpg",
  facial: "/images/home/facial.jpg",
  beauty: "/images/home/beauty.jpg",
  giftCard: "/images/home/gift-card.jpg",
  whyBoho: "/images/home/why-detail.jpg",
  ambience: "/images/home/contact-ambience.jpg",
} as const;

export function hrefForCta(cta: Cta | undefined, fallback: string): string {
  if (!cta?.link) return fallback;
  if (cta.link.externalUrl) return cta.link.externalUrl;
  if (cta.link.type === "whatsapp") return whatsappHref();
  if (cta.link.type === "booking") return bookingHref();
  return fallback;
}

export function whatsappHref(settings?: SiteSettings | null): string {
  const value = settings?.contact?.whatsapp ?? settings?.contact?.phone;
  if (typeof value !== "string" || !value.trim()) return "#contacto";
  const digits = value.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function bookingHref(settings?: SiteSettings | null): string {
  const value = settings?.contact?.bookingUrl;
  return typeof value === "string" && value.trim() ? value : "#contacto";
}

export function imageAlt(image: ImageWithAlt | undefined, fallback: string) {
  return image?.alt || fallback;
}

export function portableTextToString(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value
    .flatMap((block) =>
      Array.isArray(block?.children)
        ? block.children.map((child: { text?: string }) => child.text || "")
        : [],
    )
    .join(" ")
    .trim();
}
