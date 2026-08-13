import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;

if (!projectId) {
  throw new Error("SANITY_STUDIO_PROJECT_ID is required to run Sanity CLI.");
}

export default defineCliConfig({
  api: {
    projectId,
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
  deployment: {
    appId: "ohkdi347nwwdzsnk82ddbfg9",
  },
});
