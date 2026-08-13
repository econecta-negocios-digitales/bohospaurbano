import { defineArrayMember, defineField, defineType } from "sanity";

const base = (
  name: string,
  title: string,
  variants: { title: string; value: string }[],
  extraFields: ReturnType<typeof defineField>[] = [],
) =>
  defineType({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "eyebrow", title: "Texto pequeño sobre el título", type: "string" }),
      defineField({
        name: "title",
        title: "Título de esta sección",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: "description", title: "Texto debajo del título", type: "text" }),
      defineField({
        name: "content",
        title: "Contenido editorial de la sección",
        type: "portableText",
      }),
      defineField({ name: "image", title: "Imagen", type: "imageWithAlt" }),
      defineField({ name: "video", title: "Video externo", type: "video" }),
      defineField({ name: "primaryCta", title: "Botón principal", type: "cta" }),
      defineField({
        name: "secondaryCta",
        title: "Botón secundario",
        type: "cta",
      }),
      defineField({
        name: "visible",
        title: "Visible",
        type: "boolean",
        initialValue: true,
      }),
      defineField({
        name: "variant",
        title: "Composición de la sección",
        type: "string",
        options: { list: variants },
        validation: (Rule) => Rule.required(),
      }),
      ...extraFields,
    ],
  });

export const homeHero = base("homeHero", "Hero del inicio", [
  { title: "Imagen a la izquierda", value: "imageLeft" },
  { title: "Imagen a la derecha", value: "imageRight" },
  { title: "Imagen de fondo", value: "imageBackground" },
]);
export const homeExperiences = base("homeExperiences", "Experiencias Boho", [
  { title: "Tarjetas", value: "cards" },
  { title: "Destacada y tarjetas", value: "featureAndCards" },
], [
  defineField({
    name: "featuredServices",
    title: "Experiencias destacadas",
    description: "Elegí y ordená los servicios que aparecen en esta sección de Inicio.",
    type: "array",
    of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
  }),
]);
export const homeGiftCards = base("homeGiftCards", "Gift Cards", [
  { title: "Tarjetas", value: "cards" },
  { title: "Destacada", value: "featured" },
]);
export const homeCategories = base(
  "homeCategories",
  "Categorías de servicios",
  [
    { title: "Grilla", value: "grid" },
    { title: "Grilla destacada", value: "featuredGrid" },
  ],
);
export const homeBrunch = base("homeBrunch", "Brunch", [
  { title: "Imagen a la izquierda", value: "imageLeft" },
  { title: "Imagen a la derecha", value: "imageRight" },
]);
export const homeAbout = base("homeAbout", "Historia de Boho", [
  { title: "Imagen a la izquierda", value: "imageLeft" },
  { title: "Imagen a la derecha", value: "imageRight" },
  { title: "Texto primero", value: "textFirst" },
]);
export const homeTestimonials = base("homeTestimonials", "Testimonios", [
  { title: "Grilla", value: "grid" },
  { title: "Destacados", value: "featured" },
]);
export const homeContactLocation = base(
  "homeContactLocation",
  "Contacto y ubicación",
  [
    { title: "Mapa a la izquierda", value: "mapLeft" },
    { title: "Mapa a la derecha", value: "mapRight" },
    { title: "Apilado", value: "stacked" },
  ],
  [defineField({ name: "tertiaryCta", title: "CTA terciario", type: "cta" })],
);
export const homeConversionClose = defineType({
  name: "homeConversionClose",
  title: "Cierre de conversión",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Antetítulo", type: "string" }),
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({ name: "description", title: "Descripción", type: "text" }),
    defineField({ name: "primaryCta", title: "CTA principal", type: "cta" }),
  ],
});
export const homeObjects = [
  homeHero,
  homeExperiences,
  homeGiftCards,
  homeCategories,
  homeBrunch,
  homeAbout,
  homeTestimonials,
  homeContactLocation,
  homeConversionClose,
];
