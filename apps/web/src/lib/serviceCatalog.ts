import type { Service } from "./sanity/types";

export type ServiceCatalogGroup = {
  name: string;
  slug: string;
  href: string;
  services: string[];
};

const canonicalCatalog: ServiceCatalogGroup[] = [
  {
    name: "Experiencias Boho",
    slug: "experiencias-boho",
    href: "/experiencias-boho/",
    services: [
      "Boho Spa Day",
      "Experiencia Summer",
      "Experiencia Armonía",
      "Experiencia Full Body",
      "Experiencia Felicidad",
    ],
  },
  {
    name: "Masajes & Bienestar",
    slug: "masajes-bienestar",
    href: "/masajes-bienestar/",
    services: [
      "Masaje Renovación Integral",
      "Masaje Corporal Relajante",
      "Reflexología Podal",
      "Drenaje Linfático Manual",
      "Reiki",
    ],
  },
  {
    name: "Belleza Consciente",
    slug: "belleza-consciente",
    href: "/belleza-consciente/",
    services: [
      "Belleza de manos",
      "Belleza de pies",
      "Manicura Japonesa",
      "Kapping",
      "Softgel",
      "Diseño y perfilado de cejas",
      "Laminado de cejas",
      "Lifting de pestañas",
    ],
  },
  {
    name: "Cuidado Facial & Corporal",
    slug: "cuidado-facial-corporal",
    href: "/cuidado-facial-corporal/",
    services: ["Ritual Natural Glow", "Limpieza Facial Boho", "Ritual Pro Age", "Dermaplaning"],
  },
];

const canonicalServiceName = (value: string): string | undefined => {
  const name = value.trim();
  if (/^belleza de manos y pies\b/i.test(name)) return undefined;
  if (/^belleza de manos\b/i.test(name)) return "Belleza de manos";
  if (/^belleza de pies\b/i.test(name)) return "Belleza de pies";
  if (/^manicura japonesa\b/i.test(name)) return "Manicura Japonesa";
  if (/^masaje integral corporal\b/i.test(name)) return "Masaje Renovación Integral";

  return name
    .replace(/\s*[·—-]\s*\d+\s*(?:min(?:utos?)?)\b.*$/i, "")
    .replace(/\s+(?:individual|para\s+(?:dos|tres|cuatro))$/i, "")
    .trim();
};

export function serviceCatalogGroups(services: Service[] = []): ServiceCatalogGroup[] {
  return canonicalCatalog.map((group) => {
    const publishedNames = services
      .filter((service) => service.category?.slug === group.slug && service.name)
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
      .map((service) => canonicalServiceName(service.name))
      .filter((name): name is string => Boolean(name));

    return {
      ...group,
      services: [...group.services, ...publishedNames.filter((name) => !group.services.includes(name))].filter(
        (name, index, list) => list.indexOf(name) === index,
      ),
    };
  });
}
