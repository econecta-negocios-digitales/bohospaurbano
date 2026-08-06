import { esESLocale } from "@sanity/locale-es-es";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemas";
import { structure } from "./schemas/structure";

const protectedTypes = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "servicesPage",
  "giftCardsPage",
  "corporatePage",
  "contactPage",
  "faqPage",
  "navigation",
  "footer",
  "giftCardPolicy",
  "legalPage",
  "serviceCategory",
]);
const collectionTypes = new Set([
  "service",
  "promotion",
  "giftCard",
  "corporateExperience",
  "teamMember",
  "testimonial",
  "faq",
]);

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

if (!projectId) {
  throw new Error("SANITY_STUDIO_PROJECT_ID is required to run Sanity Studio.");
}

export default defineConfig({
  name: "boho-spa-urbano",
  title: "Boho Spa Urbano",
  projectId,
  dataset,
  basePath: "/studio",
  releases: { enabled: false },
  scheduledPublishing: { enabled: false },
  scheduledDrafts: { enabled: false },
  plugins: [structureTool({ structure }), esESLocale()],
  document: {
    actions: (previous, context) =>
      protectedTypes.has(context.schemaType)
        ? previous.filter(
            (action) =>
              action.action !== "delete" && action.action !== "duplicate",
          )
        : previous,
  },
  schema: {
    types: schemaTypes,
    templates: (previous) =>
      previous.filter((template) => collectionTypes.has(template.schemaType)),
  },
});
