import { defineArrayMember, defineField, defineType } from "sanity";

const text = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "string",
    validation: required ? (Rule) => Rule.required() : undefined,
  });
const rich = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "portableText",
    validation: required ? (Rule) => Rule.required() : undefined,
  });
const refs = (name: string, title: string, types: string[]) =>
  defineField({
    name,
    title,
    type: "array",
    of: types.map((type) =>
      defineArrayMember({
        name: `reference-${type}`,
        type: "reference",
        to: [{ type }],
      }),
    ),
  });
const seo = () =>
  defineField({
    name: "seo",
    title: "SEO",
    type: "seo",
    validation: (Rule) =>
      Rule.custom((value, context) =>
        context.document?._id?.startsWith("drafts.") || value
          ? true
          : "El SEO es obligatorio para publicar este documento.",
      ),
  });
const archived = () =>
  defineField({
    name: "archived",
    title: "Archivado",
    type: "boolean",
    initialValue: false,
  });
const visible = () =>
  defineField({
    name: "visible",
    title: "Visible",
    type: "boolean",
    initialValue: true,
  });
const order = () =>
  defineField({
    name: "order",
    title: "Orden",
    type: "number",
    validation: (Rule) => Rule.integer().positive(),
  });
const price = () =>
  defineField({
    name: "price",
    title: "Precio",
    type: "price",
    validation: (Rule: any) =>
      Rule.custom(
        (
          value: { amount?: number; label?: string } | undefined,
          context: { document?: unknown },
        ) => {
          const doc = context.document as { showPrice?: boolean } | undefined;
          return (
            !doc?.showPrice ||
            Boolean(value?.amount !== undefined || value?.label) ||
            "Si se muestra el precio, debe indicar importe o etiqueta."
          );
        },
      ),
  });
const showPrice = () =>
  defineField({
    name: "showPrice",
    title: "Mostrar precio",
    type: "boolean",
    initialValue: false,
  });
const pagePreview = { select: { title: "title" } };
const draftOr = (message: string) => (Rule: any) =>
  Rule.custom((value: unknown, context: { document?: { _id?: string } }) =>
    context.document?._id?.startsWith("drafts.") || Boolean(value) || message,
  );

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configuración del sitio",
  type: "document",
  fields: [
    defineField({
      name: "contact",
      title: "Contacto",
      type: "contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "socialLinks",
      title: "Redes sociales",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "organizationData",
      title: "Datos de la organización",
      type: "organizationData",
      validation: draftOr(
        "Los datos de la organización son obligatorios para publicar.",
      ),
    }),
    defineField({
      name: "localBusinessData",
      title: "Datos del negocio local",
      type: "localBusinessData",
      validation: draftOr(
        "Los datos del negocio local son obligatorios para publicar.",
      ),
    }),
  ],
  preview: { prepare: () => ({ title: "Configuración del sitio" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Inicio",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "1. Hero",
      type: "homeHero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "experiences",
      title: "2. Experiencias Boho",
      type: "homeExperiences",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "giftCards",
      title: "3. Gift Cards",
      type: "homeGiftCards",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "4. Categorías de servicios",
      type: "homeCategories",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brunch",
      title: "5. Brunch",
      type: "homeBrunch",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "about",
      title: "6. Historia de Boho",
      type: "homeAbout",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "testimonials",
      title: "7. Testimonios",
      type: "homeTestimonials",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactLocation",
      title: "8. Contacto y ubicación",
      type: "homeContactLocation",
      validation: (Rule) => Rule.required(),
    }),
    seo(),
  ],
  preview: { prepare: () => ({ title: "Inicio" }) },
});

const page = (
  name: string,
  title: string,
  fields: ReturnType<typeof defineField>[],
) =>
  defineType({
    name,
    title,
    type: "document",
    fields: [...fields, seo()],
    preview: pagePreview,
  });
export const aboutPage = page("aboutPage", "Nosotros", [
  text("title", "Título", true),
  rich("intro", "Introducción", true),
  defineField({ name: "image", title: "Imagen", type: "imageWithAlt" }),
  defineField({ name: "video", title: "Video", type: "video" }),
  refs("teamMembers", "Equipo", ["teamMember"]),
  defineField({ name: "cta", title: "CTA", type: "cta" }),
]);
export const servicesPage = page("servicesPage", "Servicios", [
  text("title", "Título", true),
  defineField({ name: "description", title: "Descripción", type: "text" }),
  rich("content", "Contenido", true),
  refs("categories", "Categorías", ["serviceCategory"]),
  refs("featuredServices", "Servicios destacados", ["service"]),
  defineField({ name: "cta", title: "CTA", type: "cta" }),
]);
export const giftCardsPage = page("giftCardsPage", "Gift Cards", [
  text("title", "Título", true),
  defineField({ name: "description", title: "Descripción", type: "text" }),
  rich("content", "Contenido", true),
  refs("featuredGiftCards", "Gift Cards destacadas", ["giftCard"]),
  defineField({ name: "cta", title: "CTA", type: "cta" }),
]);
export const corporatePage = page("corporatePage", "Regalos corporativos", [
  text("title", "Título", true),
  defineField({ name: "description", title: "Descripción", type: "text" }),
  rich("content", "Contenido", true),
  refs("experiences", "Experiencias", ["corporateExperience"]),
  defineField({ name: "cta", title: "CTA", type: "cta" }),
]);
export const faqPage = page("faqPage", "Preguntas frecuentes", [
  text("title", "Título", true),
  defineField({ name: "description", title: "Descripción", type: "text" }),
  defineField({
    name: "topics",
    title: "Temas",
    type: "array",
    of: [defineArrayMember({ type: "faqTopicGroup" })],
  }),
]);

export const navigation = defineType({
  name: "navigation",
  title: "Navegación",
  type: "document",
  fields: [
    defineField({
      name: "mainItems",
      title: "Enlaces principales",
      type: "array",
      of: [defineArrayMember({ type: "cta" })],
    }),
    defineField({
      name: "primaryCta",
      title: "CTA principal",
      type: "cta",
      validation: (Rule) => Rule.required(),
    }),
    visible(),
    defineField({
      name: "ariaLabel",
      title: "Etiqueta ARIA",
      type: "string",
      initialValue: "Navegación principal",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Navegación" }) },
});
export const footer = defineType({
  name: "footer",
  title: "Pie de página",
  type: "document",
  fields: [
    defineField({
      name: "columns",
      title: "Columnas",
      type: "array",
      of: [defineArrayMember({ type: "footerColumn" })],
    }),
    defineField({
      name: "showSocialLinks",
      title: "Mostrar redes sociales",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "socialPlacement",
      title: "Ubicación de redes",
      type: "string",
      options: {
        list: [
          { title: "Arriba", value: "top" },
          { title: "Abajo", value: "bottom" },
          { title: "En línea", value: "inline" },
        ],
      },
      initialValue: "bottom",
    }),
    defineField({
      name: "legalLinks",
      title: "Enlaces legales",
      type: "array",
      of: [defineArrayMember({ type: "cta" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Pie de página" }) },
});
export const giftCardPolicy = defineType({
  name: "giftCardPolicy",
  title: "Política general de Gift Cards",
  type: "document",
  fields: [
    text("title", "Título", true),
    rich("content", "Contenido", true),
    defineField({
      name: "updatedAt",
      title: "Fecha de actualización",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    seo(),
  ],
  preview: { prepare: () => ({ title: "Política general de Gift Cards" }) },
});
export const legalPage = defineType({
  name: "legalPage",
  title: "Página legal",
  type: "document",
  fields: [
    text("title", "Título", true),
    defineField({
      name: "slug",
      title: "Slug técnico",
      type: "slug",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    rich("content", "Contenido", true),
    defineField({
      name: "updatedAt",
      title: "Fecha de actualización",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    seo(),
    archived(),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});

export const serviceCategory = defineType({
  name: "serviceCategory",
  title: "Categoría principal",
  type: "document",
  fields: [
    text("name", "Nombre visible", true),
    defineField({
      name: "slug",
      title: "Slug técnico",
      type: "slug",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Descripción", type: "text" }),
    rich("content", "Contenido editorial"),
    defineField({ name: "cta", title: "CTA", type: "cta" }),
    defineField({ name: "image", title: "Imagen", type: "imageWithAlt" }),
    seo(),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1).max(4),
    }),
    archived(),
  ],
  preview: { select: { title: "name", subtitle: "slug.current" } },
});

const landingRequired = (message: string) => (Rule: any) =>
  Rule.custom(
    (value: unknown, context: { document?: unknown }) =>
      !(context.document as { landingEnabled?: boolean })?.landingEnabled ||
      Boolean(value) ||
      message,
  );
const landingContentRequired = (message: string) => (Rule: any) =>
  Rule.custom((value: unknown, context: { document?: unknown }) => {
    const document = context.document as {
      landingEnabled?: boolean;
      includes?: unknown;
      benefits?: unknown;
      idealFor?: unknown;
      development?: unknown;
    };
    return (
      !document?.landingEnabled ||
      Boolean(
        value ||
        document.includes ||
        document.benefits ||
        document.idealFor ||
        document.development,
      ) ||
      message
    );
  });
const landingSeo = () =>
  defineField({
    name: "seo",
    title: "SEO",
    type: "seo",
    validation: (Rule: any) =>
      Rule.custom(
        (
          value: { title?: string; description?: string } | undefined,
          context: { document?: unknown },
        ) => {
          const document = context.document as { landingEnabled?: boolean };
          return (
            !document?.landingEnabled ||
            Boolean(value?.title && value.description) ||
            "Una landing necesita título y descripción SEO."
          );
        },
      ),
  });
export const service = defineType({
  name: "service",
  title: "Servicio",
  type: "document",
  fields: [
    text("name", "Nombre", true),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: landingRequired("El slug es obligatorio para una landing."),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "serviceCategory" }],
      validation: landingRequired(
        "La categoría es obligatoria para una landing.",
      ),
    }),
    defineField({
      name: "shortDescription",
      title: "Descripción breve",
      type: "text",
      validation: landingRequired(
        "La descripción breve es obligatoria para una landing.",
      ),
    }),
    defineField({
      name: "mainContent",
      title: "Contenido principal",
      type: "portableText",
      validation: landingRequired(
        "El contenido es obligatorio para una landing.",
      ),
    }),
    defineField({
      name: "includes",
      title: "Qué incluye",
      type: "portableText",
      validation: landingContentRequired(
        "Una landing necesita al menos un bloque de contenido descriptivo.",
      ),
    }),
    defineField({
      name: "benefits",
      title: "Beneficios",
      type: "portableText",
      validation: landingContentRequired(
        "Una landing necesita al menos un bloque de contenido descriptivo.",
      ),
    }),
    defineField({
      name: "idealFor",
      title: "Ideal para",
      type: "portableText",
      validation: landingContentRequired(
        "Una landing necesita al menos un bloque de contenido descriptivo.",
      ),
    }),
    defineField({
      name: "development",
      title: "Desarrollo",
      type: "portableText",
      validation: landingContentRequired(
        "Una landing necesita al menos un bloque de contenido descriptivo.",
      ),
    }),
    defineField({
      name: "duration",
      title: "Duración",
      type: "duration",
      validation: landingRequired(
        "La duración es obligatoria para una landing.",
      ),
    }),
    price(),
    showPrice(),
    defineField({
      name: "modality",
      title: "Modalidad",
      type: "string",
      options: {
        list: [
          { title: "Individual", value: "individual" },
          { title: "Compartida", value: "shared" },
        ],
      },
      validation: landingRequired(
        "La modalidad es obligatoria para una landing.",
      ),
    }),
    defineField({
      name: "maxPeople",
      title: "Cantidad máxima de personas",
      type: "number",
      hidden: ({ parent }) => parent?.modality !== "shared",
      validation: (Rule) =>
        Rule.custom(
          (value, context) =>
            (context.document as { modality?: string })?.modality !==
              "shared" ||
            Boolean(value && value > 0) ||
            "La cantidad máxima es obligatoria en modalidad compartida.",
        ),
    }),
    defineField({
      name: "coordinateByWhatsapp",
      title: "Coordinar por WhatsApp",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "primaryCta",
      title: "CTA principal",
      type: "cta",
      validation: landingRequired(
        "El CTA principal es obligatorio para una landing.",
      ),
    }),
    defineField({ name: "secondaryCta", title: "CTA secundario", type: "cta" }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "imageWithAlt",
      validation: landingRequired(
        "La imagen principal es obligatoria para una landing.",
      ),
    }),
    defineField({ name: "gallery", title: "Galería", type: "gallery" }),
    rich("preparation", "Preparación"),
    rich("contraindications", "Contraindicaciones"),
    rich("aftercare", "Cuidados posteriores"),
    refs("faqs", "Preguntas frecuentes", ["faq"]),
    refs("relatedServices", "Servicios relacionados", ["service"]),
    defineField({
      name: "featured",
      title: "Destacado",
      type: "boolean",
      initialValue: false,
    }),
    order(),
    archived(),
    defineField({
      name: "landingEnabled",
      title: "Habilitar landing",
      type: "boolean",
      initialValue: false,
    }),
    landingSeo(),
  ],
  preview: { select: { title: "name", subtitle: "category.name" } },
});

export const promotion = defineType({
  name: "promotion",
  title: "Promoción",
  type: "document",
  fields: [
    text("title", "Título", true),
    defineField({ name: "description", title: "Descripción", type: "text" }),
    defineField({ name: "image", title: "Imagen", type: "imageWithAlt" }),
    defineField({ name: "startsAt", title: "Fecha de inicio", type: "date" }),
    defineField({
      name: "endsAt",
      title: "Fecha de finalización",
      type: "date",
    }),
    defineField({
      name: "active",
      title: "Activa",
      type: "boolean",
      initialValue: false,
    }),
    rich("conditions", "Condiciones"),
    text("benefit", "Precio o beneficio"),
    defineField({ name: "cta", title: "CTA", type: "cta" }),
    defineField({
      name: "featured",
      title: "Destacada",
      type: "boolean",
      initialValue: false,
    }),
    order(),
    archived(),
  ],
  preview: pagePreview,
});
export const giftCard = defineType({
  name: "giftCard",
  title: "Gift Card personal",
  type: "document",
  fields: [
    text("name", "Nombre", true),
    defineField({
      name: "slug",
      title: "Slug interno",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Servicio", value: "service" },
          { title: "Experiencia", value: "experience" },
          { title: "Monto abierto", value: "openAmount" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "relatedService",
      title: "Servicio relacionado",
      type: "reference",
      to: [{ type: "service" }],
      hidden: ({ parent }) => parent?.kind !== "service",
    }),
    defineField({
      name: "shortDescription",
      title: "Descripción breve",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    rich("content", "Contenido"),
    defineField({ name: "image", title: "Imagen", type: "imageWithAlt" }),
    price(),
    showPrice(),
    defineField({
      name: "modality",
      title: "Modalidad",
      type: "string",
      options: {
        list: [
          { title: "Individual", value: "individual" },
          { title: "Compartida", value: "shared" },
        ],
      },
    }),
    defineField({
      name: "people",
      title: "Cantidad de personas",
      type: "number",
      hidden: ({ parent }) => parent?.modality !== "shared",
    }),
    defineField({
      name: "deliveryFormat",
      title: "Formato de entrega",
      type: "string",
      options: {
        list: [
          { title: "Digital", value: "digital" },
          { title: "Físico", value: "physical" },
          { title: "Ambos", value: "both" },
        ],
      },
    }),
    defineField({
      name: "coordinateByWhatsapp",
      title: "Coordinar por WhatsApp",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "cta", title: "CTA", type: "cta" }),
    defineField({
      name: "featured",
      title: "Destacada",
      type: "boolean",
      initialValue: false,
    }),
    order(),
    visible(),
    archived(),
    rich("particularConditions", "Condiciones particulares"),
  ],
  preview: { select: { title: "name" } },
});
export const corporateExperience = defineType({
  name: "corporateExperience",
  title: "Experiencia corporativa",
  type: "document",
  fields: [
    text("name", "Nombre", true),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    rich("content", "Contenido"),
    defineField({ name: "image", title: "Imagen", type: "imageWithAlt" }),
    rich("benefits", "Beneficios"),
    defineField({
      name: "minPeople",
      title: "Mínimo de personas",
      type: "number",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "maxPeople",
      title: "Máximo de personas",
      type: "number",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "modality",
      title: "Modalidad",
      type: "string",
      options: {
        list: [
          { title: "Individual", value: "individual" },
          { title: "Compartida", value: "shared" },
        ],
      },
    }),
    text("priceOrBudget", "Precio o presupuesto"),
    defineField({ name: "primaryCta", title: "CTA principal", type: "cta" }),
    defineField({ name: "secondaryCta", title: "CTA secundario", type: "cta" }),
    defineField({
      name: "featured",
      title: "Destacada",
      type: "boolean",
      initialValue: false,
    }),
    order(),
    archived(),
    seo(),
  ],
  preview: { select: { title: "name" } },
});
export const teamMember = defineType({
  name: "teamMember",
  title: "Integrante del equipo",
  type: "document",
  fields: [
    text("name", "Nombre", true),
    text("role", "Rol"),
    defineField({
      name: "shortBio",
      title: "Presentación breve",
      type: "text",
    }),
    rich("biography", "Biografía"),
    rich("training", "Formación"),
    defineField({
      name: "specialties",
      title: "Especialidades",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    refs("relatedServices", "Servicios relacionados", ["service"]),
    defineField({ name: "photo", title: "Fotografía", type: "imageWithAlt" }),
    order(),
    visible(),
    defineField({
      name: "featured",
      title: "Destacada",
      type: "boolean",
      initialValue: false,
    }),
    archived(),
    defineField({
      name: "isFounder",
      title: "Es fundadora",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isDirector",
      title: "Es directora",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonio",
  type: "document",
  fields: [
    text("publicName", "Nombre público", true),
    text("initials", "Iniciales"),
    defineField({
      name: "text",
      title: "Texto",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    text("source", "Fuente"),
    defineField({ name: "originalUrl", title: "Enlace original", type: "url" }),
    defineField({ name: "date", title: "Fecha", type: "date" }),
    defineField({
      name: "authorization",
      title: "Autorización",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "relatedService",
      title: "Servicio relacionado",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({
      name: "featured",
      title: "Destacado",
      type: "boolean",
      initialValue: false,
    }),
    order(),
    visible(),
    archived(),
  ],
  preview: { select: { title: "publicName", subtitle: "text" } },
});
export const faq = defineType({
  name: "faq",
  title: "Pregunta frecuente",
  type: "document",
  fields: [
    text("question", "Pregunta", true),
    rich("answer", "Respuesta", true),
    visible(),
    archived(),
    order(),
    refs("relatedPages", "Páginas relacionadas", [
      "homePage",
      "aboutPage",
      "servicesPage",
      "giftCardsPage",
      "corporatePage",
      "faqPage",
    ]),
    defineField({
      name: "relatedService",
      title: "Servicio relacionado",
      type: "reference",
      to: [{ type: "service" }],
    }),
  ],
  preview: { select: { title: "question" } },
});

export const documents = [
  siteSettings,
  homePage,
  aboutPage,
  servicesPage,
  giftCardsPage,
  corporatePage,
  faqPage,
  navigation,
  footer,
  giftCardPolicy,
  legalPage,
  serviceCategory,
  service,
  promotion,
  giftCard,
  corporateExperience,
  teamMember,
  testimonial,
  faq,
];
