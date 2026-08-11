import type { Cta, ImageWithAlt, SiteSettings } from "./sanity/types";

export const localImages = {
  hero: "/images/home/space-hero.webp",
  intro: "/images/home/products.webp",
  experiences: "/images/home/brunch-boho.webp",
  massage: "/images/home/massage.webp",
  facial: "/images/home/facial.webp",
  beauty: "/images/home/beauty.webp",
  giftCard: "/images/home/gift-card.webp",
  whyBoho: "/images/home/why-detail.webp",
  ambience: "/images/home/contact-ambience.webp",
} as const;

export const BOHO_WHATSAPP_NUMBER = "5492916412343";
export const BOHO_WHATSAPP_URL = `https://wa.me/${BOHO_WHATSAPP_NUMBER}`;

export const publicRoutes = {
  servicios: "/servicios/",
  experiencias: "/experiencias-boho/",
  "experiencias boho": "/experiencias-boho/",
  "gift cards": "/gift-cards/",
  nosotros: "/nosotros/",
} as const;

export function routeForLabel(label: string | undefined, home = false): string | undefined {
  const key = label?.trim().toLowerCase();
  if (!key) return undefined;
  if (home) {
    const homeAnchors: Record<string, string> = {
      servicios: "/servicios/",
      experiencias: "#experiencias",
      "gift cards": "#gift-cards",
      nosotros: "/nosotros/",
    };
    return homeAnchors[key];
  }
  return publicRoutes[key as keyof typeof publicRoutes];
}

export function currentPhaseRoute(label: string | undefined, home = false): string {
  const route = routeForLabel(label, home);
  if (home || route === "/servicios/" || route === "/nosotros/") return route || "#contacto";
  return "#contacto";
}

export function hrefForCta(cta: Cta | undefined, fallback: string): string {
  if (!cta?.link) return fallback;
  if (cta.link.externalUrl) return cta.link.externalUrl;
  if (cta.link.type === "whatsapp") return whatsappHref();
  if (cta.link.type === "booking") return bookingHref();
  return fallback;
}

export function whatsappHref(_settings?: SiteSettings | null): string {
  return BOHO_WHATSAPP_URL;
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

export type EditorialSection = {
  level: 2 | 3;
  heading: string;
  paragraphs: string[];
};

export function editorialSource(value: unknown): string {
  return portableTextToString(value).replace(/\r/g, "").trim();
}

export function editorialField(value: unknown, label: string): string {
  const source = editorialSource(value);
  const match = source.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*\\n?([^\\n]+)`, "i"));
  return match?.[1]?.trim() || "";
}

export type HomeAboutContent = {
  eyebrow: string;
  title: string;
  mainText: string;
  highlights: string[];
  institutional: string;
  cta: string;
};

function homeAboutField(source: string, label: string): string {
  const match = source.match(
    new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\*[^*]+:\\*\\*|\\n\\s*---|$)`, "i"),
  );
  return (match?.[1] || "")
    .replace(/\\r/g, "")
    .replace(/\\s+/g, " ")
    .trim();
}

export function parseHomeAboutContent(value: unknown): HomeAboutContent {
  const source = editorialSource(value);
  const highlightsSource = homeAboutField(source, "Puntos destacados");
  return {
    eyebrow: homeAboutField(source, "Antetítulo"),
    title: homeAboutField(source, "Título"),
    mainText: homeAboutField(source, "Texto principal"),
    highlights: highlightsSource
      .split(/\\n|;/)
      .map((item) => item.replace(/^[-•]\\s*/, "").trim())
      .filter(Boolean),
    institutional: homeAboutField(source, "Texto institucional breve"),
    cta: homeAboutField(source, "CTA"),
  };
}

export function editorialSections(value: unknown): EditorialSection[] {
  const lines = editorialSource(value).split("\n");
  const sections: EditorialSection[] = [];
  let current: EditorialSection | undefined;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
    if (text && current) current.paragraphs.push(text);
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const heading = line.match(/^(##|###)\s+(.+)$/);
    if (heading) {
      flushParagraph();
      current = { level: heading[1] === "##" ? 2 : 3, heading: (heading[2] || "").trim(), paragraphs: [] };
      sections.push(current);
      continue;
    }
    if (!line || line === "---") {
      flushParagraph();
      continue;
    }
    if (/^\*\*(?:Antetítulo|Título|Texto|CTA[^:]*|Criterio editorial):\*\*$/i.test(line)) {
      flushParagraph();
      continue;
    }
    paragraph.push(line.replace(/^\*\*(.+?)\*\*$/, "$1"));
  }
  flushParagraph();
  return sections;
}
