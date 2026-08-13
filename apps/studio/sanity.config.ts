import { esESLocale } from "@sanity/locale-es-es";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemas";
import { structure } from "./schemas/structure";
import { presentationResolve } from "./presentation-resolve";

const protectedTypes = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "servicesPage",
  "giftCardsPage",
  "corporatePage",
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
  plugins: [
    structureTool({ structure }),
    presentationTool({
      title: "Vista previa",
      previewUrl: {
        initial: `${(process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:4321").replace(/\/$/, "")}/preview/`,
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      allowOrigins: ["http://localhost:4321"],
      resolve: presentationResolve,
    }),
    esESLocale(),
  ],
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
