import { defineArrayMember, defineField, defineType } from "sanity";

const ref = (to: string[]) =>
  defineArrayMember({
    name: `reference-${to.join("-")}`,
    type: "reference",
    to: to.map((type) => ({ type })),
  });
const image = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Texto alternativo",
        type: "string",
        validation: (Rule) => (required ? Rule.required() : Rule),
      }),
    ],
    validation: required ? (Rule) => Rule.required() : undefined,
  });

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Título SEO",
      type: "string",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "description",
      title: "Descripción SEO",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    image("image", "Imagen SEO"),
    defineField({
      name: "noIndex",
      title: "No indexar",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Imagen con texto alternativo",
  type: "object",
  fields: [
    image("asset", "Imagen", true),
    defineField({ name: "caption", title: "Epígrafe", type: "string" }),
  ],
});

export const link = defineType({
  name: "link",
  title: "Enlace",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Interno", value: "internal" },
          { title: "Externo", value: "external" },
          { title: "WhatsApp", value: "whatsapp" },
          { title: "Agenda", value: "booking" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "internalReference",
      title: "Referencia interna",
      type: "reference",
      to: [
        { type: "homePage" },
        { type: "aboutPage" },
        { type: "servicesPage" },
        { type: "giftCardsPage" },
        { type: "corporatePage" },
        { type: "faqPage" },
        { type: "legalPage" },
        { type: "service" },
        { type: "giftCard" },
      ],
      hidden: (context) =>
        (context.parent as { type?: string } | undefined)?.type !== "internal",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          (context.parent as { type?: string } | undefined)?.type ===
            "internal" && !value
            ? "La referencia interna es obligatoria."
            : true,
        ),
    }),
    defineField({
      name: "externalUrl",
      title: "URL externa",
      type: "url",
      hidden: (context) =>
        (context.parent as { type?: string } | undefined)?.type !== "external",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          (context.parent as { type?: string } | undefined)?.type ===
            "external" && !value
            ? "La URL externa es obligatoria."
            : true,
        ),
    }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Llamada a la acción",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Texto",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Enlace",
      type: "link",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "style",
      title: "Estilo",
      type: "string",
      options: {
        list: [
          { title: "Principal", value: "primary" },
          { title: "Secundario", value: "secondary" },
          { title: "Texto", value: "text" },
        ],
      },
      initialValue: "primary",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const price = defineType({
  name: "price",
  title: "Precio",
  type: "object",
  fields: [
    defineField({
      name: "amount",
      title: "Importe",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "currency",
      title: "Moneda",
      type: "string",
      options: { list: [{ title: "Pesos argentinos", value: "ARS" }] },
      initialValue: "ARS",
      readOnly: true,
    }),
    defineField({ name: "label", title: "Etiqueta de precio", type: "string" }),
    defineField({
      name: "fromPrice",
      title: "Desde este precio",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
export const duration = defineType({
  name: "duration",
  title: "Duración",
  type: "object",
  fields: [
    defineField({
      name: "cabinetMinutes",
      title: "Duración del tratamiento",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "recommendedMinutes",
      title: "Tiempo total recomendado",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .integer()
          .positive()
          .custom(
            (value, context) =>
              !value ||
              value >=
                (context.parent as { cabinetMinutes?: number })
                  ?.cabinetMinutes! ||
              "Debe ser igual o mayor a la duración del tratamiento.",
          ),
    }),
  ],
});
export const portableText = defineType({
  name: "portableText",
  title: "Contenido enriquecido",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Título 2", value: "h2" },
        { title: "Título 3", value: "h3" },
        { title: "Cita", value: "blockquote" },
      ],
      lists: [
        { title: "Viñetas", value: "bullet" },
        { title: "Numerada", value: "number" },
      ],
    }),
  ],
});
export const gallery = defineType({
  name: "gallery",
  title: "Galería",
  type: "array",
  of: [defineArrayMember({ type: "imageWithAlt" })],
});
export const video = defineType({
  name: "video",
  title: "Video externo",
  type: "object",
  fields: [
    defineField({
      name: "provider",
      title: "Proveedor",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
          { title: "Otro", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "externalUrl",
      title: "URL externa",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Título accesible",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Descripción", type: "text" }),
    defineField({
      name: "lazy",
      title: "Carga diferida",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
export const socialLink = defineType({
  name: "socialLink",
  title: "Red social",
  type: "object",
  fields: [
    defineField({
      name: "network",
      title: "Red",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
          { title: "TikTok", value: "tiktok" },
          { title: "YouTube", value: "youtube" },
          { title: "LinkedIn", value: "linkedin" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "label", title: "Etiqueta", type: "string" }),
  ],
});
export const businessHours = defineType({
  name: "businessHours",
  title: "Horario de atención",
  type: "object",
  fields: [
    defineField({
      name: "day",
      title: "Día",
      type: "string",
      options: {
        list: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "closed",
      title: "Cerrado",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "open",
      title: "Apertura",
      type: "string",
      hidden: ({ parent }) => parent?.closed,
    }),
    defineField({
      name: "close",
      title: "Cierre",
      type: "string",
      hidden: ({ parent }) => parent?.closed,
    }),
  ],
});
export const contact = defineType({
  name: "contact",
  title: "Datos de contacto",
  type: "object",
  fields: [
    defineField({ name: "phone", title: "Teléfono", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp", type: "string" }),
    defineField({ name: "email", title: "Email", type: "email" }),
    defineField({ name: "address", title: "Dirección", type: "string" }),
    defineField({ name: "city", title: "Ciudad", type: "string" }),
    defineField({ name: "province", title: "Provincia", type: "string" }),
    defineField({ name: "postalCode", title: "Código postal", type: "string" }),
    defineField({
      name: "country",
      title: "País",
      type: "string",
      initialValue: "Argentina",
    }),
    defineField({ name: "latitude", title: "Latitud", type: "number" }),
    defineField({ name: "longitude", title: "Longitud", type: "number" }),
    defineField({
      name: "hours",
      title: "Horarios",
      type: "array",
      of: [defineArrayMember({ type: "businessHours" })],
    }),
    defineField({
      name: "bookingUrl",
      title: "URL general de agenda",
      type: "url",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "URL pública de Google Maps",
      type: "url",
    }),
  ],
});
export const organizationData = defineType({
  name: "organizationData",
  title: "Datos de la organización",
  type: "object",
  fields: [
    defineField({
      name: "commercialName",
      title: "Nombre comercial",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "legalName", title: "Razón social", type: "string" }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "imageWithAlt",
    }),
    defineField({
      name: "foundingDate",
      title: "Fecha de fundación",
      type: "date",
    }),
    defineField({
      name: "founders",
      title: "Fundadoras",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
});
export const localBusinessData = defineType({
  name: "localBusinessData",
  title: "Datos del negocio local",
  type: "object",
  fields: [
    defineField({
      name: "businessType",
      title: "Tipo de negocio",
      type: "string",
      options: {
        list: [
          { title: "Day spa", value: "daySpa" },
          { title: "Salud y belleza", value: "healthAndBeautyBusiness" },
        ],
      },
      initialValue: "daySpa",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "areaServed",
      title: "Área de atención",
      type: "string",
    }),
    defineField({
      name: "representativeImage",
      title: "Imagen representativa",
      type: "imageWithAlt",
    }),
  ],
});
export const footerColumn = defineType({
  name: "footerColumn",
  title: "Columna del pie de página",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "links",
      title: "Enlaces",
      type: "array",
      of: [defineArrayMember({ type: "cta" })],
    }),
    defineField({
      name: "visible",
      title: "Visible",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
export const faqTopicGroup = defineType({
  name: "faqTopicGroup",
  title: "Grupo de preguntas frecuentes",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Clave técnica",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Etiqueta",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Descripción", type: "text" }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "visible",
      title: "Visible",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "faqs",
      title: "Preguntas",
      type: "array",
      of: [ref(["faq"])],
    }),
  ],
});

export const sharedObjects = [
  seo,
  imageWithAlt,
  link,
  cta,
  price,
  duration,
  portableText,
  gallery,
  video,
  socialLink,
  businessHours,
  contact,
  organizationData,
  localBusinessData,
  footerColumn,
  faqTopicGroup,
];
