import type { Cta, ImageWithAlt, SiteSettings } from "./sanity/types";

export const localImages = {
  hero: "/images/home/space-hero.webp",
  intro: "/images/home/products.webp",
  experiences: "/images/home/brunch-boho.webp",
  massage: "/images/home/massage.webp",
  facial: "/images/home/facial.webp",
  beauty: "/images/home/beauty.webp",
  giftCard: "/images/home/gift-card.webp",
  ambience: "/images/home/contact-ambience.webp",
} as const;

export function localImageSrcSet(source: string, widths: readonly number[]): string {
  const extension = source.lastIndexOf(".");
  const base = extension > -1 ? source.slice(0, extension) : source;
  return widths.map((width) => `${base}-${width}.webp ${width}w`).join(", ");
}

export const BOHO_WHATSAPP_NUMBER = "5492916412343";
export const BOHO_WHATSAPP_URL = `https://wa.me/${BOHO_WHATSAPP_NUMBER}`;
export const BOHO_BOOKING_URL = "https://bohospaurbano.site.agendapro.com/ar/sucursal/412054";

export const publicRoutes = {
  servicios: "/servicios/",
  experiencias: "/experiencias-boho/",
  "experiencias boho": "/experiencias-boho/",
  "masajes & bienestar": "/masajes-bienestar/",
  "cuidado facial & corporal": "/cuidado-facial-corporal/",
  "belleza consciente": "/belleza-consciente/",
  "gift cards": "/gift-cards/",
  nosotros: "/nosotros/",
  "regalos corporativos": "/regalos-corporativos/",
  privacidad: "/privacidad/",
  "términos y condiciones": "/terminos-y-condiciones/",
  "terminos y condiciones": "/terminos-y-condiciones/",
} as const;

export function routeForLabel(label: string | undefined, home = false): string | undefined {
  const key = label?.trim().toLowerCase();
  if (!key) return undefined;
  if (home) {
    const homeAnchors: Record<string, string> = {
      servicios: "/servicios/",
      experiencias: "/experiencias-boho/",
      "experiencias boho": "/experiencias-boho/",
      "masajes & bienestar": "/masajes-bienestar/",
      "cuidado facial & corporal": "/cuidado-facial-corporal/",
      "belleza consciente": "/belleza-consciente/",
      "gift cards": "/gift-cards/",
      nosotros: "/nosotros/",
      "regalos corporativos": "/regalos-corporativos/",
    };
    return homeAnchors[key];
  }
  return publicRoutes[key as keyof typeof publicRoutes];
}

export function currentPhaseRoute(label: string | undefined, home = false): string {
  const route = routeForLabel(label, home);
  if (home || route === "/servicios/" || route === "/nosotros/" || route === "/experiencias-boho/" || route === "/masajes-bienestar/" || route === "/cuidado-facial-corporal/" || route === "/belleza-consciente/" || route === "/gift-cards/" || route === "/regalos-corporativos/" || route === "/privacidad/" || route === "/terminos-y-condiciones/") return route || "#contacto";
  return "#contacto";
}

export function hrefForCta(cta: Cta | undefined, fallback: string): string {
  if (!cta?.link) return fallback;
  if (cta.link.type === "whatsapp") return whatsappHref();
  if (cta.link.type === "booking") return bookingHref();
  if (cta.link.externalUrl) return cta.link.externalUrl;
  const internalReference = cta.link.internalReference?._ref;
  if (internalReference === "legalPage.privacy") return "/privacidad/";
  if (internalReference === "legalPage.terms") return "/terminos-y-condiciones/";
  return fallback;
}

export function whatsappHref(_settings?: SiteSettings | null): string {
  const value = _settings?.contact?.whatsapp;
  return typeof value === "string" && value.startsWith("https://wa.me/") ? value : BOHO_WHATSAPP_URL;
}

export function bookingHref(_settings?: SiteSettings | null): string {
  const value = _settings?.contact?.bookingUrl;
  return typeof value === "string" && value.startsWith("https://") ? value : BOHO_BOOKING_URL;
}

export function experienceHref(_slug?: string): string {
  return publicRoutes.experiencias;
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
    paragraph.push(line
      .replace(/^\*\*(.+?)\*\*$/, "$1")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/`(.+?)`/g, "$1"));
  }
  flushParagraph();
  return sections;
}
