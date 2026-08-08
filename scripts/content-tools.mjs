import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { createClient } from "@sanity/client";

const ROOT = process.cwd();
const MATERIAL = resolve(ROOT, "..", "MaterialSitio");
const DATA = resolve(ROOT, "scripts", "content-data");
const NORMALIZED = join(DATA, "normalized");
const MANIFESTS = join(DATA, "manifests");
const GENERATED = join(DATA, "generated");
const PUBLIC_SOURCE_ROOT = "../MaterialSitio";

const paths = {
  inventory: join(DATA, "source-inventory.json"),
  technical: join(NORMALIZED, "technical-documents.json"),
  services: join(NORMALIZED, "services.json"),
  collections: join(NORMALIZED, "collections.json"),
  references: join(DATA, "references.json"),
  manifest: join(MANIFESTS, "import-manifest.json"),
  validation: join(GENERATED, "validation-report.json"),
  dryRun: join(GENERATED, "dry-run-report.json"),
  importReport: join(GENERATED, "import-report.json"),
  report: join(GENERATED, "content-report.json"),
};

const authorizedManualOverwrites = new Set([
  "drafts.homePage|about",
  "drafts.homePage|contactLocation",
  "drafts.aboutPage|intro",
]);

const sourceFiles = {
  guidelines: `${PUBLIC_SOURCE_ROOT}/contenido/00-lineamientos-generales.md`,
  home: `${PUBLIC_SOURCE_ROOT}/contenido/01-home.md`,
  about: `${PUBLIC_SOURCE_ROOT}/contenido/02-nosotros.md`,
  services: `${PUBLIC_SOURCE_ROOT}/contenido/03-servicios.md`,
  experiences: `${PUBLIC_SOURCE_ROOT}/contenido/04-experiencias-boho.md`,
  massages: `${PUBLIC_SOURCE_ROOT}/contenido/05-masajes-bienestar.md`,
  facial: `${PUBLIC_SOURCE_ROOT}/contenido/06-cuidado-facial-corporal.md`,
  beauty: `${PUBLIC_SOURCE_ROOT}/contenido/07-belleza-consciente.md`,
  giftCards: `${PUBLIC_SOURCE_ROOT}/contenido/08-gift-cards.md`,
  corporate: `${PUBLIC_SOURCE_ROOT}/contenido/09-regalos-corporativos.md`,
  contact: `${PUBLIC_SOURCE_ROOT}/contenido/10-contacto.md`,
  faqs: `${PUBLIC_SOURCE_ROOT}/contenido/11-preguntas-frecuentes.md`,
  legal: `${PUBLIC_SOURCE_ROOT}/contenido/12-legales.md`,
  servicePending: `${PUBLIC_SOURCE_ROOT}/servicios/pendientes-editoriales.md`,
  serviceOrigin: `${PUBLIC_SOURCE_ROOT}/servicios/servicios-agendapro-origen.md`,
  serviceNormalized: `${PUBLIC_SOURCE_ROOT}/servicios/servicios-normalizados.md`,
  verbal: `${PUBLIC_SOURCE_ROOT}/marca/identidad-verbal.md`,
  visual: `${PUBLIC_SOURCE_ROOT}/marca/identidad-visual.md`,
};

const canonical = (type, slug) => `${type}.${slug}`;
const draftId = (id) => `drafts.${id}`;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const json = (value) => JSON.stringify(value, null, 2) + "\n";

function ensureDirectories() {
  for (const directory of [DATA, NORMALIZED, MANIFESTS, GENERATED]) {
    mkdirSync(directory, { recursive: true });
  }
}

function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, json(value), "utf8");
}

function allFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    return entry.isDirectory() ? allFiles(full) : [full];
  });
}

function text(file) {
  return readFileSync(file, "utf8");
}

function relativeSource(file) {
  return `${PUBLIC_SOURCE_ROOT}/${relative(MATERIAL, file).replaceAll("\\", "/")}`;
}

function markdownStatus(content) {
  const match = content.match(/\*\*(?:Estado editorial|Estado):\*\*\s*([^\n]+)/i);
  if (!match) return "unclassified";
  const value = match[1].toLowerCase();
  if (value.includes("aprobado")) return value.includes("pendiente") ? "provisional" : "approved";
  if (value.includes("pendiente")) return "pending";
  if (value.includes("fuente sin normalizar")) return "provisional";
  return "provisional";
}

function headings(content) {
  return [...content.matchAll(/^#{1,4}\s+(.+)$/gm)].map((match) => match[1].trim());
}

function candidatesFor(source) {
  const value = source.toLowerCase();
  if (value.includes("01-home")) return ["homePage"];
  if (value.includes("02-nosotros")) return ["aboutPage", "teamMember"];
  if (value.includes("03-servicios")) return ["servicesPage", "serviceCategory"];
  if (value.includes("04-experiencias")) return ["service"];
  if (value.includes("05-masajes")) return ["serviceCategory", "service"];
  if (value.includes("06-cuidado")) return ["serviceCategory", "service"];
  if (value.includes("07-belleza")) return ["serviceCategory", "service"];
  if (value.includes("08-gift")) return ["giftCardsPage", "giftCard", "giftCardPolicy"];
  if (value.includes("09-regalos")) return ["corporatePage", "corporateExperience"];
  if (value.includes("10-contacto")) return ["siteSettings"];
  if (value.includes("11-preguntas")) return ["faqPage", "faq"];
  if (value.includes("12-legales")) return ["legalPage.privacy", "legalPage.terms"];
  if (value.includes("servicios-")) return ["service"];
  if (value.includes("modelo-sanity")) return ["all"];
  return [];
}

function inventory() {
  const entries = allFiles(MATERIAL).map((file) => {
    const source = relativeSource(file);
    const extension = extname(file).toLowerCase();
    const isMarkdown = extension === ".md";
    const content = isMarkdown ? text(file) : "";
    const status = isMarkdown ? markdownStatus(content) : extension === ".gitkeep" ? "placeholder" : "unreviewed";
    return {
      path: source,
      type: isMarkdown ? "markdown" : extension === ".pdf" ? "pdf" : [".jpg", ".jpeg", ".png", ".webp"].includes(extension) ? "image" : "file",
      sizeBytes: statSync(file).size,
      sourceHash: sha256(readFileSync(file)),
      sectionsFound: isMarkdown ? headings(content) : [],
      status,
      possibleDocuments: isMarkdown ? candidatesFor(source) : [],
      missingFields: [],
      contradictions: [],
      observations: isMarkdown ? [] : [extension === ".gitkeep" ? "Placeholder; no visual asset is available." : "Requires manual review before use."],
    };
  });

  return {
    generatedBy: "scripts/content-tools.mjs",
    sourceRoot: PUBLIC_SOURCE_ROOT,
    rules: ["MaterialSitio is read-only", "approved content is the only publication candidate", "images are not imported in Phase A"],
    files: entries,
    summary: {
      totalFiles: entries.length,
      markdown: entries.filter((entry) => entry.type === "markdown").length,
      visualAssets: entries.filter((entry) => ["image", "pdf"].includes(entry.type)).length,
      placeholders: entries.filter((entry) => entry.status === "placeholder").length,
      approved: entries.filter((entry) => entry.status === "approved").length,
      provisional: entries.filter((entry) => entry.status === "provisional").length,
      pending: entries.filter((entry) => entry.status === "pending").length,
    },
  };
}

function portable(value, key) {
  return [{ _key: key, _type: "block", style: "normal", children: [{ _key: `${key}-span`, _type: "span", marks: [], text: value }] }];
}

function markdownSection(sourceKey, startHeading, endHeading, key) {
  const content = text(resolve(MATERIAL, sourceFiles[sourceKey].replace(`${PUBLIC_SOURCE_ROOT}/`, "")));
  const start = content.indexOf(startHeading);
  if (start < 0) return [];
  const end = endHeading ? content.indexOf(endHeading, start + startHeading.length) : content.length;
  const body = content.slice(start, end < 0 ? content.length : end).trim();
  return portable(body, key);
}

function legalDocument(section, title, slug, seoTitle, seoDescription) {
  return document({
    canonicalId: `legalPage.${section}`,
    type: "legalPage",
    source: ["legal"],
    section: title,
    status: "approved",
    data: {
      title,
      slug: { current: slug },
      content: legalContent(section),
      seo: { title: seoTitle, description: seoDescription },
    },
    managedFields: ["title", "slug", "content", "seo"],
    missingFields: ["updatedAt"],
    warnings: ["La fecha de actualización debe definirse antes de publicar."],
    schemaValid: false,
    readyForPublish: false,
  });
}

function legalContent(section) {
  const content = text(resolve(MATERIAL, sourceFiles.legal.replace(`${PUBLIC_SOURCE_ROOT}/`, "")));
  const heading = section === "privacy" ? "# Política de Privacidad" : "# Términos y Condiciones";
  const start = content.indexOf(heading);
  const nextLegal = content.indexOf("\n# ", start + heading.length);
  const sectionText = content.slice(start, nextLegal < 0 ? content.length : nextLegal);
  const bodyStart = sectionText.indexOf("## 1.");
  const bodyEnd = sectionText.indexOf("## SEO", bodyStart);
  return portable(sectionText.slice(bodyStart, bodyEnd < 0 ? sectionText.length : bodyEnd).trim(), `legal-${section}`);
}

function markdownHeading(sourceKey, heading, key) {
  const content = text(resolve(MATERIAL, sourceFiles[sourceKey].replace(`${PUBLIC_SOURCE_ROOT}/`, "")));
  const start = content.indexOf(heading);
  if (start < 0) return [];
  const bodyStart = content.indexOf("\n", start) + 1;
  const nextHeading = content.slice(bodyStart).search(/^#{1,3}\s+/m);
  const body = content.slice(bodyStart, nextHeading < 0 ? content.length : bodyStart + nextHeading).trim();
  return portable(body, key);
}

const serviceDefinitions = [
  ["boho-spa-day", "Boho Spa Day", "experiencias-boho", "experiences", "### Boho Spa Day"],
  ["experiencia-summer", "Experiencia Summer", "experiencias-boho", "experiences", "### Experiencia Summer"],
  ["experiencia-armonia", "Experiencia Armonía", "experiencias-boho", "experiences", "### Experiencia Armonía"],
  ["experiencia-full-body", "Experiencia Full Body", "experiencias-boho", "experiences", "### Experiencia Full Body"],
  ["experiencia-felicidad", "Experiencia Felicidad", "experiencias-boho", "experiences", "### Experiencia Felicidad"],
  ["masaje-renovacion-integral", "Masaje Renovación Integral", "masajes-bienestar", "massages", "### Masaje Renovación Integral"],
  ["masaje-corporal-relajante", "Masaje Corporal Relajante", "masajes-bienestar", "massages", "### Masaje Corporal Relajante"],
  ["reflexologia-podal", "Reflexología Podal", "masajes-bienestar", "massages", "### Reflexología Podal"],
  ["drenaje-linfatico-manual", "Drenaje Linfático Manual", "masajes-bienestar", "massages", "### Drenaje Linfático Manual"],
  ["ritual-natural-glow", "Ritual Natural Glow", "cuidado-facial-corporal", "facial", "### Ritual Natural Glow"],
  ["limpieza-facial-boho", "Limpieza Facial Boho", "cuidado-facial-corporal", "facial", "### Limpieza Facial Boho"],
  ["ritual-pro-age", "Ritual Pro Age", "cuidado-facial-corporal", "facial", "### Ritual Pro Age"],
  ["manicura-japonesa", "Manicura Japonesa", "belleza-consciente", "beauty", "### Manicura Japonesa"],
];

function serviceDocuments() {
  return serviceDefinitions.map(([slug, name, category, source, heading]) =>
    document({
      canonicalId: canonical("service", slug),
      type: "service",
      source: [source],
      section: name,
      status: "approved",
      data: {
        name,
        slug: { current: slug },
        category: { _ref: canonical("serviceCategory", category), _type: "reference" },
        mainContent: markdownHeading(source, heading, `service-${slug}`),
        landingEnabled: false,
        archived: false,
      },
      managedFields: ["name", "slug", "category", "mainContent", "landingEnabled", "archived"],
      missingFields: ["shortDescription", "duration", "price", "mainImage", "seo"],
      warnings: ["Landing deshabilitada; duración, precio, imagen y SEO individual quedan pendientes."],
      schemaValid: false,
      readyForPublish: false,
    }),
  );
}

const corporateDefinitions = [
  ["experiencia-esencial", "Experiencia Esencial", "### Experiencia Esencial"],
  ["experiencia-plus", "Experiencia Plus", "### Experiencia Plus"],
  ["boho-con-brunch", "Boho con Brunch", "### Boho con Brunch"],
];

function corporateDocuments() {
  return corporateDefinitions.map(([slug, name, heading]) =>
    document({
      canonicalId: canonical("corporateExperience", slug),
      type: "corporateExperience",
      source: ["corporate"],
      section: name,
      status: "approved",
      data: {
        name,
        description: name,
        content: markdownHeading("corporate", heading, `corporate-${slug}`),
        archived: false,
      },
      managedFields: ["name", "description", "content", "archived"],
      missingFields: ["seo", "image", "priceOrBudget", "primaryCta", "secondaryCta"],
      warnings: ["Precios, imágenes, SEO y condiciones comerciales adicionales quedan pendientes."],
      schemaValid: false,
      readyForPublish: false,
    }),
  );
}

const giftCardDefinitions = [
  ["servicio", "Regalá un servicio", "service", "### Regalá un servicio"],
  ["experiencia-boho", "Regalá una Experiencia Boho", "experience", "### Regalá una Experiencia Boho"],
  ["monto-abierto", "Elegí un monto", "openAmount", "### Elegí un monto"],
];

function giftCardDocuments() {
  return giftCardDefinitions.map(([slug, name, kind, heading]) =>
    document({
      canonicalId: canonical("giftCard", slug),
      type: "giftCard",
      source: ["giftCards"],
      section: name,
      status: "approved",
      data: {
        name,
        slug: { current: slug },
        kind,
        shortDescription: name,
        content: markdownHeading("giftCards", heading, `gift-card-${slug}`),
        deliveryFormat: "both",
        coordinateByWhatsapp: true,
        showPrice: false,
        visible: true,
        archived: false,
      },
      managedFields: ["name", "slug", "kind", "shortDescription", "content", "deliveryFormat", "coordinateByWhatsapp", "showPrice", "visible", "archived"],
      missingFields: ["image", "cta"],
      warnings: ["No se cargan precios ni imágenes."],
      schemaValid: false,
      readyForPublish: false,
    }),
  );
}

function faqDocuments() {
  const content = text(resolve(MATERIAL, sourceFiles.faqs.replace(`${PUBLIC_SOURCE_ROOT}/`, "")));
  const groups = [];
  let currentGroup = null;
  let order = 1;
  for (const match of content.matchAll(/^## (.+)$/gm)) {
    const title = match[1].trim();
    if (["Encabezado", "Contacto y reserva", "SEO", "Criterios de implementación"].includes(title)) continue;
    currentGroup = { key: title.toLowerCase().replaceAll(/[^a-z0-9áéíóúñ]+/gi, "-").replaceAll(/^-|-$/g, ""), label: title, order: groups.length + 1, faqs: [] };
    groups.push(currentGroup);
    const nextGroup = content.slice(match.index + match[0].length).search(/^## /m);
    const section = content.slice(match.index + match[0].length, nextGroup < 0 ? content.length : match.index + match[0].length + nextGroup);
    for (const question of section.matchAll(/^### (.+)$/gm)) {
      const questionText = question[1].trim();
      const answerStart = question.index + question[0].length;
      const nextQuestion = section.slice(answerStart).search(/^### /m);
      const answer = section.slice(answerStart, nextQuestion < 0 ? section.length : answerStart + nextQuestion).trim();
      const slug = `${currentGroup.key}-${order}`;
      const id = canonical("faq", slug);
      currentGroup.faqs.push({ _ref: id, _type: "reference" });
      order += 1;
      currentGroup._documents ??= [];
      currentGroup._documents.push(document({
        canonicalId: id,
        type: "faq",
        source: ["faqs"],
        section: questionText,
        status: "approved",
        data: { question: questionText, answer: portable(answer, `faq-${slug}`), visible: true, archived: false, order: order - 1 },
        managedFields: ["question", "answer", "visible", "archived", "order"],
        missingFields: [],
        warnings: [],
        schemaValid: false,
        readyForPublish: false,
      }));
    }
  }
  const documents = groups.flatMap((group) => group._documents ?? []);
  const topics = groups.map(({ _documents, ...group }) => group);
  return { documents, topics };
}

function sourceHashFor(keys) {
  return sha256(keys.map((key) => text(resolve(MATERIAL, sourceFiles[key].replace(`${PUBLIC_SOURCE_ROOT}/`, "")))).join("\n"));
}

function document({ canonicalId, type, source, section, status, data, managedFields, missingFields = [], warnings = [], blockingErrors = [], readyForImport = true, schemaValid = false, readyForPublish = false }) {
  return { canonicalId, draftId: draftId(canonicalId), _type: type, source: source.map((key) => sourceFiles[key] ?? key), sourceSection: section, sourceHash: sourceHashFor(source), status, data, managedFields, references: [], missingFields, warnings, blockingErrors, readyForImport, schemaValid, readyForPublish };
}

function normalize() {
  const categoryData = [
    ["experiencias-boho", "Experiencias Boho", "Rituales de spa urbano pensados para desconectar, compartir y regalarte tiempo.", 1, "experiences"],
    ["masajes-bienestar", "Masajes & Bienestar", "Masajes y terapias pensados para aliviar tensiones, bajar el ritmo y recuperar el equilibrio.", 2, "massages"],
    ["cuidado-facial-corporal", "Cuidado Facial & Corporal", "Tratamientos personalizados para cuidar la piel, renovar su apariencia y acompañar tu bienestar.", 3, "facial"],
    ["belleza-consciente", "Belleza Consciente", "Servicios de manos, pies, cejas y pestañas pensados para realzar tu belleza natural con cuidado y dedicación.", 4, "beauty"],
  ];
  const categories = categoryData.map(([slug, name, description, order, source]) => document({
    canonicalId: canonical("serviceCategory", slug), type: "serviceCategory", source: [source], section: name, status: "approved", data: { name, slug: { current: slug }, description, content: markdownSection(source, "## Encabezado", "## SEO", `category-${slug}`), order, archived: false }, managedFields: ["name", "slug", "description", "content", "order", "archived"], missingFields: ["image", "seo", "cta"], warnings: ["Image, SEO and CTA links are pending."], schemaValid: false, readyForPublish: false,
  }));
  const normalizedServices = serviceDocuments();
  const normalizedCorporate = corporateDocuments();
  const normalizedGiftCards = giftCardDocuments();
  const normalizedFaqs = faqDocuments();
  const featuredServiceIds = [
    "boho-spa-day",
    "experiencia-summer",
    "masaje-renovacion-integral",
    "ritual-natural-glow",
    "manicura-japonesa",
  ].map((slug) => ({ _ref: canonical("service", slug), _type: "reference" }));
  const giftCardRefs = normalizedGiftCards.map((doc) => ({ _ref: doc.canonicalId, _type: "reference" }));
  const corporateRefs = normalizedCorporate.map((doc) => ({ _ref: doc.canonicalId, _type: "reference" }));

  const technical = [
    document({ canonicalId: "siteSettings", type: "siteSettings", source: ["contact", "guidelines"], section: "Contacto y configuración general", status: "provisional", data: { contact: { address: "Santa Fe 157", city: "Bahía Blanca", country: "Argentina" }, organizationData: { commercialName: "Boho Spa Urbano" } }, managedFields: ["contact.address", "contact.city", "contact.country", "organizationData.commercialName"], missingFields: ["contact.phone", "contact.whatsapp", "contact.email", "contact.province", "contact.postalCode", "contact.latitude", "contact.longitude", "contact.hours", "contact.bookingUrl", "contact.googleMapsUrl", "organizationData.logo", "localBusinessData"], warnings: ["Operational data and images are pending."], schemaValid: false }),
    document({ canonicalId: "homePage", type: "homePage", source: ["home"], section: "Home", status: "approved", data: { experiences: { description: "Rituales de spa urbano pensados para desconectar, compartir y regalarte tiempo." }, categories: { description: "Categorías de servicios" }, brunch: { description: "Infusiones, frutas de estación, jugo de naranja y bocados dulces y salados, servido después del tratamiento en un espacio dedicado." }, about: { title: "Por qué elegir Boho", content: markdownSection("home", "## 6. Por qué elegir Boho", "## 7. Opiniones", "home-value"), variant: "textFirst" }, contactLocation: { eyebrow: "Tu momento empieza acá", title: "Estamos en Santa Fe 157, Bahía Blanca", content: markdownSection("home", "## 8. Ubicación y contacto", "## Header", "home-contact"), variant: "stacked" } }, managedFields: ["experiences.description", "categories.description", "brunch.description", "about", "contactLocation"], missingFields: ["hero", "experiences.title", "experiences.variant", "giftCards", "categories.title", "categories.variant", "brunch.title", "brunch.variant", "testimonials", "seo", "contactLocation.primaryCta", "contactLocation.secondaryCta", "contactLocation.tertiaryCta"], warnings: ["Imágenes, testimonios, SEO y enlaces operativos siguen pendientes."], schemaValid: false }),
    document({ canonicalId: "aboutPage", type: "aboutPage", source: ["about"], section: "Nosotros", status: "approved", data: { title: "Un espacio creado para salir de la rutina", intro: markdownSection("about", "## Encabezado", "## SEO", "about-intro") }, managedFields: ["title", "intro"], missingFields: ["seo", "teamMembers", "cta", "image"], warnings: ["Equipo, imagen, CTA y SEO requieren validación final."], schemaValid: false }),
    document({ canonicalId: "servicesPage", type: "servicesPage", source: ["services"], section: "Página general de servicios", status: "approved", data: { title: "Servicios", content: markdownSection("services", "## Encabezado", "## SEO", "services-content"), categories: categoryData.map(([slug]) => ({ _ref: canonical("serviceCategory", slug), _type: "reference" })), featuredServices: featuredServiceIds }, managedFields: ["title", "content", "categories", "featuredServices"], missingFields: ["seo", "cta"], warnings: ["SEO y CTA operativo quedan pendientes."], schemaValid: false }),
    document({ canonicalId: "giftCardsPage", type: "giftCardsPage", source: ["giftCards"], section: "Gift Cards", status: "approved", data: { title: "Regalá un momento para disfrutar", content: markdownSection("giftCards", "## Encabezado", "## SEO", "gift-card-page"), featuredGiftCards: giftCardRefs }, managedFields: ["title", "content", "featuredGiftCards"], missingFields: ["seo", "cta"], warnings: ["SEO y CTA operativo quedan pendientes."], schemaValid: false }),
    document({ canonicalId: "corporatePage", type: "corporatePage", source: ["corporate"], section: "Regalos corporativos", status: "approved", data: { title: "Regalos corporativos", content: markdownSection("corporate", "## 1. Encabezado", "## SEO", "corporate-content"), experiences: corporateRefs }, managedFields: ["title", "content", "experiences"], missingFields: ["seo", "cta"], warnings: ["SEO y CTA operativo quedan pendientes."], schemaValid: false }),
    document({ canonicalId: "faqPage", type: "faqPage", source: ["faqs"], section: "Preguntas frecuentes", status: "approved", data: { title: "Preguntas frecuentes", description: "Respuestas para ayudarte a elegir, reservar y prepararte para tu experiencia en Boho.", topics: normalizedFaqs.topics }, managedFields: ["title", "description", "topics"], missingFields: ["seo"], warnings: ["SEO queda pendiente."], schemaValid: false }),
    document({ canonicalId: "giftCardPolicy", type: "giftCardPolicy", source: ["giftCards"], section: "Política general de Gift Cards", status: "provisional", data: { title: "Política general de Gift Cards", content: portable("Vigencia de 30 días desde la entrega. Cambio por servicio de igual valor, diferencia abonable para uno de mayor valor, no transferible y no acumulable con promociones o descuentos.", "gift-card-policy") }, managedFields: ["title", "content"], missingFields: ["updatedAt", "seo"], warnings: ["Policy requires final editorial/legal review."], schemaValid: false }),
    document({ canonicalId: "navigation", type: "navigation", source: [], section: "Navegación", status: "pending", data: {}, managedFields: [], missingFields: ["mainItems", "primaryCta", "ariaLabel"], warnings: ["No source file was found."], schemaValid: false }),
    document({ canonicalId: "footer", type: "footer", source: [], section: "Footer", status: "pending", data: {}, managedFields: [], missingFields: ["columns", "legalLinks"], warnings: ["No source file was found."], schemaValid: false }),
    legalDocument("privacy", "Política de Privacidad", "privacidad", "Política de Privacidad | Boho Spa Urbano", "Conocé cómo Boho Spa Urbano recopila, utiliza y protege la información personal de quienes utilizan su sitio y canales digitales."),
    legalDocument("terms", "Términos y Condiciones", "terminos-y-condiciones", "Términos y Condiciones | Boho Spa Urbano", "Consultá las condiciones generales de uso, reservas, servicios y Gift Cards de Boho Spa Urbano."),
  ];

  const services = { documents: normalizedServices, sources: [sourceFiles.serviceNormalized, sourceFiles.serviceOrigin, sourceFiles.servicePending], missing: ["prices", "durations where not editorially confirmed", "images", "individual SEO"] };
  const collections = { documents: [...normalizedGiftCards, ...normalizedCorporate, ...normalizedFaqs.documents], detectedTypes: ["giftCard", "corporateExperience", "faq", "teamMember", "testimonial", "promotion"], missing: ["team records", "authorized testimonials", "current promotions", "prepared images"] };
  return { technicalDocuments: technical.concat(categories), services, collections };
}

function references(normalized) {
  const refs = [];
  const visit = (from, value) => {
    if (Array.isArray(value)) return value.forEach((item) => visit(from, item));
    if (!value || typeof value !== "object") return;
    if (value._ref) refs.push({ from, to: value._ref, _ref: value._ref, status: value._ref.startsWith("drafts.") ? "blockingError" : "canonical" });
    Object.values(value).forEach((item) => visit(from, item));
  };
  for (const doc of normalized.technicalDocuments.concat(normalized.services.documents, normalized.collections.documents)) visit(doc.canonicalId, doc.data);
  return { references: refs, invalidDraftReferences: refs.filter((ref) => ref._ref.startsWith("drafts.")) };
}

function classifyReferences(refReport, candidates, byId) {
  const candidateIds = new Set(candidates.map((doc) => doc.canonicalId));
  const classified = refReport.references.map((ref) => {
    const published = byId.get(ref._ref);
    const draft = byId.get(draftId(ref._ref));
    const classification = published ? "A" : draft ? "B" : candidateIds.has(ref._ref) ? "C" : "D";
    return { ...ref, classification, targetState: published ? "published" : draft ? "draftOnly" : candidateIds.has(ref._ref) ? "willBeDraft" : "missing", weak: classification === "B" || classification === "C" };
  });
  return {
    references: classified,
    summary: {
      total: classified.length,
      strong: classified.filter((ref) => !ref.weak).length,
      weak: classified.filter((ref) => ref.weak).length,
      publishedTargets: classified.filter((ref) => ref.classification === "A").length,
      existingDraftTargets: classified.filter((ref) => ref.classification === "B").length,
      importDraftTargets: classified.filter((ref) => ref.classification === "C").length,
      missing: classified.filter((ref) => ref.classification === "D").length,
    },
  };
}

function applyWeakReferenceStrategy(candidates, classification) {
  const weakBySource = new Map();
  for (const ref of classification.references) {
    if (ref.weak) {
      const list = weakBySource.get(ref.from) ?? [];
      list.push(ref._ref);
      weakBySource.set(ref.from, list);
    }
  }
  const isWeakTarget = (from, target) => (weakBySource.get(from) ?? []).includes(target);
  const clone = (from, value) => {
    if (Array.isArray(value)) return value.map((item) => clone(from, item));
    if (!value || typeof value !== "object") return value;
    if (value._type === "reference" && value._ref) {
      const next = { ...value, _ref: value._ref };
      if (isWeakTarget(from, value._ref)) {
        next._weak = true;
        delete next._strengthenOnPublish;
      } else {
        delete next._weak;
        delete next._strengthenOnPublish;
      }
      return next;
    }
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(from, item)]));
  };
  return candidates.map((doc) => ({ ...doc, data: clone(doc.canonicalId, doc.data) }));
}

function manifest(normalized) {
  return {
    policy: "External manifest only; no import metadata is added to Sanity documents.",
    documents: normalized.technicalDocuments.concat(normalized.services.documents, normalized.collections.documents).map((doc) => ({ canonicalId: doc.canonicalId, draftId: doc.draftId, _type: doc._type, source: doc.source, sourceHash: doc.sourceHash, managedFields: doc.managedFields, lastComparedAt: null, lastImportedAt: null, status: doc.status, warnings: doc.warnings, conflicts: [] })),
  };
}

function validate() {
  ensureDirectories();
  const source = inventory();
  const normalized = normalize();
  const refReport = references(normalized);
  const all = normalized.technicalDocuments.concat(normalized.services.documents, normalized.collections.documents);
  const errors = [];
  const warnings = [];
  const ids = new Set();
  for (const doc of all) {
    if (ids.has(doc.canonicalId)) errors.push(`Duplicate canonicalId: ${doc.canonicalId}`);
    ids.add(doc.canonicalId);
    if (doc.draftId !== draftId(doc.canonicalId)) errors.push(`Invalid draftId for ${doc.canonicalId}`);
    if (doc.references.some((ref) => ref._ref.startsWith("drafts."))) errors.push(`Draft reference in ${doc.canonicalId}`);
    warnings.push(...doc.warnings.map((warning) => `${doc.canonicalId}: ${warning}`));
  }
  errors.push(...refReport.invalidDraftReferences.map((ref) => `Draft reference: ${ref._ref}`));
  const report = { status: errors.length ? "blocked" : "ok", errors, warnings, summary: { documents: all.length, schemaValid: all.filter((doc) => doc.schemaValid).length, readyForImport: all.filter((doc) => doc.readyForImport).length, readyForPublish: all.filter((doc) => doc.readyForPublish).length, warnings: warnings.length, blockingErrors: errors.length }, generatedAt: new Date().toISOString() };
  writeJson(paths.inventory, source);
  writeJson(paths.technical, normalized.technicalDocuments);
  writeJson(paths.services, normalized.services);
  writeJson(paths.collections, normalized.collections);
  writeJson(paths.references, refReport);
  writeJson(paths.manifest, manifest(normalized));
  writeJson(paths.validation, report);
  console.log(`content:validate ${report.status}: ${report.summary.documents} documents, ${report.summary.warnings} warnings, ${report.summary.blockingErrors} blocking errors.`);
  if (errors.length) process.exitCode = 1;
}

function getAt(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function comparable(value, weakReferences = new Set()) {
  if (Array.isArray(value)) return value.map((item) => comparable(item, weakReferences));
  if (!value || typeof value !== "object") return value ?? null;
  if (value._type === "reference" && value._ref) {
    const reference = { ...value };
    if (weakReferences.has(value._ref)) reference._weak = true;
    else delete reference._weak;
    delete reference._strengthenOnPublish;
    return Object.fromEntries(Object.keys(reference).sort().map((key) => [key, comparable(reference[key], weakReferences)]));
  }
  const normalized = { ...value };
  if (normalized._type === "block" && (normalized.style === undefined || normalized.style === "normal")) delete normalized.style;
  return Object.fromEntries(Object.keys(normalized).sort().map((key) => [key, comparable(normalized[key], weakReferences)]));
}

function equal(a, b, weakReferences = new Set()) {
  return JSON.stringify(comparable(a, weakReferences)) === JSON.stringify(comparable(b, weakReferences));
}

async function dryRun() {
  ensureDirectories();
  if (!existsSync(paths.technical)) validate();
  const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN;
  if (!token) {
    const report = { status: "blocked-auth", readOnly: true, message: "Dry-run remoto detenido: SANITY_AUTH_TOKEN o SANITY_API_TOKEN no está disponible. No se intentó ninguna mutación.", documents: [], generatedAt: new Date().toISOString() };
    writeJson(paths.dryRun, report);
    console.error(report.message);
    process.exitCode = 2;
    return;
  }
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET;
  if (projectId !== "15z3a7sh" || dataset !== "production") throw new Error("Dry-run detenido: proyecto o dataset inválido.");
  const candidates = loadCandidates();
  const client = createClient({ projectId, dataset, apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2025-02-19", token, perspective: "raw", useCdn: false, withCredentials: false });
  const ids = candidates.flatMap((doc) => [doc.canonicalId, doc.draftId]);
  const remote = await client.fetch(`*[_id in $ids]{_id, _type, _rev, ...}`, { ids });
  const byId = new Map(remote.map((doc) => [doc._id, doc]));
  const classification = classifyReferences(references({ technicalDocuments: candidates, services: { documents: [] }, collections: { documents: [] } }), candidates, byId);
  if (classification.summary.missing) throw new Error(`Dry-run detenido: ${classification.summary.missing} referencias sin target válido.`);
  const importCandidates = applyWeakReferenceStrategy(candidates, classification);
  const weakReferences = new Set(classification.references.filter((ref) => ref.weak).map((ref) => ref._ref));
  const results = analyzeRemote(importCandidates, remote, weakReferences).map((result) => {
    const doc = result.candidate;
    const published = byId.get(doc.canonicalId);
    const draft = byId.get(doc.draftId);
    return { ...result, canonicalId: doc.canonicalId, draftId: doc.draftId, references: classification.references.filter((ref) => ref.from === doc.canonicalId), warnings: doc.warnings };
  });
  const report = { status: results.some((result) => result.blocked) ? "blocked" : "ok", readOnly: true, projectId, dataset, perspective: "raw", documents: results, referencePlan: classification, summary: { total: results.length, neitherExists: results.filter((r) => r.state === "neitherExists").length, draftOnly: results.filter((r) => r.state === "draftOnly").length, publishedOnly: results.filter((r) => r.state === "publishedOnly").length, bothExist: results.filter((r) => r.state === "bothExist").length, typeConflict: results.filter((r) => r.state === "typeConflict").length, conflicts: results.reduce((count, result) => count + result.fields.filter((field) => field.manualConflict).length, 0), references: classification.summary } , generatedAt: new Date().toISOString() };
  writeJson(paths.dryRun, report);
  writeJson(paths.references, { ...classification, invalidDraftReferences: classification.references.filter((ref) => ref._ref.startsWith("drafts.")) });
  const currentManifest = JSON.parse(readFileSync(paths.manifest, "utf8"));
  writeJson(paths.manifest, { ...currentManifest, referencePolicy: "Canonical _ref; _weak true for targets not yet published. No _strengthenOnPublish is emitted in the draft-only phase.", referenceSummary: classification.summary, references: classification.references, draftReferenceData: importCandidates.flatMap((doc) => classification.references.filter((ref) => ref.from === doc.canonicalId && ref.weak).map((ref) => ({ from: ref.from, fieldTarget: ref._ref, _ref: ref._ref, _weak: true }))) });
  console.log(`content:import -- --dry-run ${report.status}: ${report.summary.total} documents compared; no mutations executed.`);
  if (report.status !== "ok") process.exitCode = 1;
}

function loadCandidates() {
  const documents = JSON.parse(readFileSync(paths.technical, "utf8"));
  const serviceData = JSON.parse(readFileSync(paths.services, "utf8"));
  const collectionData = JSON.parse(readFileSync(paths.collections, "utf8"));
  return documents.concat(serviceData.documents, collectionData.documents);
}

function assertApprovedCandidates(candidates, approvedManifest) {
  const manifestDocs = approvedManifest.documents ?? [];
  const candidateKeys = candidates.map((doc) => `${doc.canonicalId}|${doc.draftId}|${doc._type}`).sort();
  const manifestKeys = manifestDocs.map((doc) => `${doc.canonicalId}|${doc.draftId}|${doc._type}`).sort();
  if (candidateKeys.length !== manifestKeys.length || candidateKeys.some((key, index) => key !== manifestKeys[index])) {
    throw new Error("Importación detenida: el conjunto de documentos normalizados difiere del manifest aprobado.");
  }
  for (const doc of candidates) {
    if (!doc.draftId.startsWith("drafts.")) throw new Error(`Importación detenida: ID no-draft ${doc.draftId}.`);
    if (doc._type === "contactPage" || doc.canonicalId === "contactPage" || doc.draftId === "drafts.contactPage") throw new Error("Importación detenida: contactPage está fuera de alcance.");
    if (doc.canonicalId === "legalPage" || doc.draftId === "drafts.legalPage") throw new Error("Importación detenida: página genérica de Legales fuera de alcance.");
  }
  const refs = references({ technicalDocuments: candidates, services: { documents: [] }, collections: { documents: [] } });
  if (refs.invalidDraftReferences.length) throw new Error(`Importación detenida: referencias a drafts detectadas (${refs.invalidDraftReferences.map((ref) => ref._ref).join(", ")}).`);
}

function analyzeRemote(candidates, remote, weakReferences = new Set()) {
  const byId = new Map(remote.map((doc) => [doc._id, doc]));
  return candidates.map((doc) => {
    const published = byId.get(doc.canonicalId);
    const draft = byId.get(doc.draftId);
    const state = published && draft ? "bothExist" : draft ? "draftOnly" : published ? "publishedOnly" : "neitherExists";
    const typeConflict = [published, draft].filter(Boolean).some((remoteDoc) => remoteDoc._type !== doc._type);
    const fields = doc.managedFields.map((field) => {
      const normalizedValue = getAt(doc.data, field);
      const remoteValue = getAt(draft, field);
      return { field, normalizedPresent: normalizedValue !== undefined, currentDraftPresent: remoteValue !== undefined, equal: equal(normalizedValue, remoteValue, weakReferences), manualConflict: remoteValue !== undefined && !equal(normalizedValue, remoteValue, weakReferences), action: remoteValue === undefined ? "complete" : equal(normalizedValue, remoteValue, weakReferences) ? "omit" : "review" };
    });
    return { candidate: doc, published, draft, state: typeConflict ? "typeConflict" : state, fields, references: doc.references, warnings: doc.warnings, blocked: typeConflict || state === "publishedOnly" || state === "bothExist" };
  });
}

function remoteSummary(results) {
  return {
    total: results.length,
    neitherExists: results.filter((r) => r.state === "neitherExists").length,
    draftOnly: results.filter((r) => r.state === "draftOnly").length,
    publishedOnly: results.filter((r) => r.state === "publishedOnly").length,
    bothExist: results.filter((r) => r.state === "bothExist").length,
    typeConflict: results.filter((r) => r.state === "typeConflict").length,
    conflicts: results.reduce((count, result) => count + result.fields.filter((field) => field.manualConflict).length, 0),
  };
}

async function importDrafts() {
  ensureDirectories();
  const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN;
  if (!token) throw new Error("Importación detenida: SANITY_AUTH_TOKEN o SANITY_API_TOKEN no está disponible.");
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET;
  if (projectId !== "15z3a7sh" || dataset !== "production") throw new Error("Importación detenida: proyecto o dataset inválido.");
  const approvedDryRun = JSON.parse(readFileSync(paths.dryRun, "utf8"));
  if (approvedDryRun.status !== "ok" || approvedDryRun.readOnly !== true) throw new Error("Importación detenida: no existe un dry-run aprobado y válido.");
  const candidates = loadCandidates();
  const approvedManifest = JSON.parse(readFileSync(paths.manifest, "utf8"));
  assertApprovedCandidates(candidates, approvedManifest);
  const client = createClient({ projectId, dataset, apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2025-02-19", token, perspective: "raw", useCdn: false, withCredentials: false });
  const ids = candidates.flatMap((doc) => [doc.canonicalId, doc.draftId]);
  const remoteBefore = await client.fetch(`*[_id in $ids]{_id, _type, _rev, ...}`, { ids });
  const classification = classifyReferences(references({ technicalDocuments: candidates, services: { documents: [] }, collections: { documents: [] } }), candidates, new Map(remoteBefore.map((doc) => [doc._id, doc])));
  if (classification.summary.missing) throw new Error(`Importación detenida: ${classification.summary.missing} referencias sin target válido.`);
  const importCandidates = applyWeakReferenceStrategy(candidates, classification);
  const weakReferences = new Set(classification.references.filter((ref) => ref.weak).map((ref) => ref._ref));
  const before = analyzeRemote(importCandidates, remoteBefore, weakReferences);
  const importById = new Map(importCandidates.map((doc) => [doc.canonicalId, doc]));
  for (const result of before) result.candidate = importById.get(result.candidate.canonicalId);
  const beforeSummary = remoteSummary(before);
  const approvedSummary = approvedDryRun.summary;
  for (const key of ["total", "neitherExists", "draftOnly", "publishedOnly", "bothExist", "typeConflict", "conflicts"]) {
    if (beforeSummary[key] !== approvedSummary[key]) throw new Error(`Importación detenida: diferencia respecto del dry-run aprobado en ${key} (${approvedSummary[key]} -> ${beforeSummary[key]}).`);
  }
  const manualConflicts = before.flatMap((result) => result.fields.filter((field) => field.manualConflict).map((field) => ({ id: result.candidate.draftId, field: field.field, key: `${result.candidate.draftId}|${field.field}` })));
  const unauthorizedConflicts = manualConflicts.filter((conflict) => !authorizedManualOverwrites.has(conflict.key));
  if (before.some((result) => result.blocked)) throw new Error("Importación detenida: el estado remoto presenta publicación o conflicto de tipo.");
  if (unauthorizedConflicts.length) throw new Error(`Importación detenida: conflicto manual no autorizado en ${unauthorizedConflicts.map((conflict) => `${conflict.id}.${conflict.field}`).join(", ")}.`);

  const created = [], updated = [], unchanged = [], errors = [];
  for (const result of before) {
    const doc = result.candidate;
    try {
      if (result.state === "neitherExists") {
        await client.createIfNotExists({ _id: doc.draftId, _type: doc._type, ...doc.data });
        created.push(doc.draftId);
      } else if (result.state === "draftOnly") {
        const changes = {};
        for (const field of doc.managedFields) {
          const value = getAt(doc.data, field);
          if (value !== undefined && !equal(value, getAt(result.draft, field), weakReferences)) changes[field] = value;
        }
        if (Object.keys(changes).length) {
          await client.patch(doc.draftId).set(changes).commit({ autoGenerateArrayKeys: false });
          updated.push(doc.draftId);
        } else unchanged.push(doc.draftId);
      } else {
        throw new Error(`estado no permitido ${result.state}`);
      }
    } catch (error) {
      errors.push({ id: doc.draftId, message: error instanceof Error ? error.message : String(error) });
      break;
    }
  }
  if (errors.length) throw new Error(`Importación detenida con error en ${errors[0].id}: ${errors[0].message}`);
  const remoteAfter = await client.fetch(`*[_id in $ids]{_id, _type, _rev, ...}`, { ids });
  const after = analyzeRemote(importCandidates, remoteAfter, weakReferences);
  const afterSummary = remoteSummary(after);
  if (afterSummary.neitherExists || afterSummary.publishedOnly || afterSummary.bothExist || afterSummary.typeConflict || afterSummary.conflicts) throw new Error("Importación finalizada con verificación remota inválida.");
  const report = { status: "ok", readOnly: false, projectId, dataset, manifestCount: candidates.length, created, updated, unchanged, errors, manualConflictsResolved: manualConflicts.length, unauthorizedConflicts: unauthorizedConflicts.length, mutations: created.length + updated.length, publications: 0, published: 0, before: beforeSummary, after: afterSummary, documents: after.map(({ candidate, state, fields }) => ({ canonicalId: candidate.canonicalId, draftId: candidate.draftId, _type: candidate._type, state, fields })), generatedAt: new Date().toISOString() };
  writeJson(paths.importReport, report);
  console.log(`content:import ok: ${candidates.length} drafts processed; created=${created.length}; updated=${updated.length}; unchanged=${unchanged.length}; publications=0.`);
}

function report() {
  ensureDirectories();
  const read = (file, fallback) => existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback;
  const inventoryData = read(paths.inventory, { summary: {}, files: [] });
  const validation = read(paths.validation, { status: "not-run", summary: {}, errors: [], warnings: [] });
  const dryRunData = read(paths.dryRun, { status: "not-run", summary: {}, documents: [] });
  const consolidated = { status: validation.status === "blocked" || dryRunData.status === "blocked" || dryRunData.status === "blocked-auth" ? "attention-required" : "ok", inventory: inventoryData.summary, validation: validation.summary, dryRun: dryRunData.status === "not-run" ? { status: "not-run" } : { status: dryRunData.status, summary: dryRunData.summary, message: dryRunData.message }, futureImport: { status: "not-authorized", mutations: 0, publications: 0 }, generatedAt: new Date().toISOString() };
  writeJson(paths.report, consolidated);
  writeJson(paths.importReport, { status: "not-authorized", mutations: 0, publications: 0, message: "Real import is not authorized in Phase A." });
  console.log(`content:report ${consolidated.status}: validation=${validation.status}; dry-run=${consolidated.dryRun.status}.`);
}

const command = process.argv[2];
try {
  if (command === "validate") validate();
  else if (command === "import" && process.argv.includes("--dry-run")) await dryRun();
  else if (command === "import") await importDrafts();
  else if (command === "report") report();
  else throw new Error("Uso: content-tools.mjs validate | import [--dry-run] | report");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
