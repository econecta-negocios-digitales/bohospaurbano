import type { PortableTextBlock, Service, ServiceCategory } from "./sanity/types";
import { seoValue } from "./site";

export type CategoryServiceView = {
  name: string;
  slug?: string;
  description?: string;
  detail?: string;
};

export type EditorialSectionView = {
  heading: string;
  fields: Record<string, string>;
  paragraphs: string[];
};

const blockText = (block: PortableTextBlock) =>
  (block.children || []).map((child) => child.text || "").join("").trim();

const cleanMarkup = (value: string) =>
  value.replace(/^\*\*(.+?)\*\*$/, "$1").replace(/^\*\*(.+?):\*\*\s*/, "").trim();

export function categorySections(category: ServiceCategory): EditorialSectionView[] {
  const lines = (category.content || [])
    .map(blockText)
    .filter(Boolean)
    .flatMap((block) => block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
  const sections: EditorialSectionView[] = [];
  let current: EditorialSectionView | undefined;
  for (const line of lines) {
    const heading = line.match(/^##+\s+(.+)$/);
    if (heading) {
      current = { heading: heading[1]!.replace(/^\d+\.\s*/, "").trim(), fields: {}, paragraphs: [] };
      sections.push(current);
      continue;
    }
    if (!current || line === "---") continue;
    const field = line.match(/^\*\*(.+?):\*\*\s*(.*)$/);
    if (field) {
      current.fields[field[1]!.trim().toLowerCase()] = field[2]!.trim();
      continue;
    }
    if (/^\*\*(.+?)\*\*$/.test(line)) {
      current.paragraphs.push(cleanMarkup(line));
      continue;
    }
    current.paragraphs.push(line);
  }
  return sections;
}

export function sectionByHeading(category: ServiceCategory, matcher: RegExp): EditorialSectionView | undefined {
  return categorySections(category).find((section) => matcher.test(section.heading));
}

export function categoryField(category: ServiceCategory, label: string, matcher?: RegExp): string {
  const sections = categorySections(category);
  const candidates = matcher ? sections.filter((section) => matcher.test(section.heading)) : sections;
  return candidates.find((section) => section.fields[label.toLowerCase()])?.fields[label.toLowerCase()] || "";
}

export function sectionTitle(section: EditorialSectionView | undefined): string {
  return section?.fields.título || section?.fields["título de servicios"] || "";
}

export function sectionEyebrow(section: EditorialSectionView | undefined, fallback: string): string {
  return section?.fields.antetítulo || fallback;
}

export function serviceView(category: ServiceCategory, service: Service): CategoryServiceView {
  const section = service.slug
    ? sectionByHeading(category, new RegExp(service.slug.replace(/-/g, " ").split(" ").join("|"), "i"))
    : undefined;
  const detail = section?.paragraphs.find((paragraph) => paragraph !== service.shortDescription) || "";
  return { name: service.name, slug: service.slug, description: service.shortDescription, detail };
}

export function servicesForCategory(category: ServiceCategory, services: Service[]): CategoryServiceView[] {
  return services
    .filter((service) => service.category?.slug === category.slug)
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .map((service) => serviceView(category, service));
}

export function technicalCategoryTitle(category: ServiceCategory): string {
  const fallbacks: Record<string, string> = {
    "experiencias-boho": "Experiencias de spa en Bahía Blanca | Boho Spa Urbano",
    "masajes-bienestar": "Masajes y bienestar en Bahía Blanca | Boho Spa Urbano",
    "belleza-consciente": "Belleza consciente y manicuría en Bahía Blanca | Boho",
    "cuidado-facial-corporal": "Tratamientos faciales y corporales en Bahía Blanca | Boho",
  };
  return seoValue(category.seo?.title, fallbacks[category.slug || ""] || "Servicios de spa en Bahía Blanca | Boho Spa Urbano", "Bahía Blanca");
}

export function technicalCategoryDescription(category: ServiceCategory): string {
  const fallbacks: Record<string, string> = {
    "experiencias-boho": "Experiencias de spa individuales y compartidas con masajes, cuidado facial, rituales corporales y propuestas de bienestar en Bahía Blanca.",
    "masajes-bienestar": "Masajes relajantes, descontracturantes, reflexología y drenaje linfático manual con atención personalizada en Bahía Blanca.",
    "belleza-consciente": "Cuidado de manos y pies, Manicura Japonesa y técnicas manuales sin torno en Boho Spa Urbano, Bahía Blanca.",
    "cuidado-facial-corporal": "Tratamientos faciales y corporales personalizados con cosmética natural y atención profesional en Bahía Blanca.",
  };
  return seoValue(category.seo?.description, fallbacks[category.slug || ""] || "Servicios de spa, bienestar y belleza en Bahía Blanca.", "Bahía Blanca");
}
