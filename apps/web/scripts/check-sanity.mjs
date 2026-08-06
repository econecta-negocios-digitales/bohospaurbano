import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

const envPath = resolve(process.cwd(), "apps/web/.env");
const fileEnv = {};
try {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) fileEnv[match[1]] = match[2].trim();
  }
} catch {}

const env = { ...fileEnv, ...process.env };
const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET;
const apiVersion = env.PUBLIC_SANITY_API_VERSION;

if (projectId !== "15z3a7sh") throw new Error("Sanity project ID inválido.");
if (dataset !== "production") throw new Error("Sanity dataset inválido.");
if (!/^\d{4}-\d{2}-\d{2}$/.test(apiVersion ?? ""))
  throw new Error("Versión de API inválida.");
if (env.SANITY_AUTH_TOKEN || env.PUBLIC_SANITY_TOKEN)
  throw new Error("Se detectó un token no permitido.");

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: false,
  withCredentials: false,
});
const singleton = await client.fetch(
  '*[_id == "__boho_missing_singleton__"][0]{_id}',
);
const collection = await client.fetch(
  '*[_type == "__boho_missing_collection__"]{_id}',
);
const draft = await client.fetch('*[_id match "drafts.*"][0]{_id}');

if (singleton !== null)
  throw new Error("El singleton técnico ausente no devolvió null.");
if (!Array.isArray(collection) || collection.length !== 0)
  throw new Error("La colección técnica ausente no devolvió [].");
if (draft !== null)
  throw new Error("La perspectiva publicada devolvió un draft.");

console.log(
  "Sanity check OK: proyecto, dataset, perspectiva publicada, sin token, null/[] controlados y drafts no accesibles.",
);
