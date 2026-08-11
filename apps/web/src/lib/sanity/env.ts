type SanityEnv = {
  projectId: string;
  dataset: string;
  apiVersion: string;
  perspective: "published" | "drafts";
  token?: string;
};

const apiVersionPattern = /^\d{4}-\d{2}-\d{2}$/;

function required(name: string, value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Falta la variable de entorno obligatoria ${name}.`);
  }

  return value.trim();
}

function validateApiVersion(value: string): string {
  if (!apiVersionPattern.test(value)) {
    throw new Error(
      "PUBLIC_SANITY_API_VERSION debe usar el formato YYYY-MM-DD.",
    );
  }

  return value;
}

const publicToken = import.meta.env.PUBLIC_SANITY_TOKEN;

if (publicToken) {
  throw new Error(
    "No se permite PUBLIC_SANITY_TOKEN en la capa pública de Astro.",
  );
}

const useDrafts =
  import.meta.env.DEV && import.meta.env.SANITY_USE_DRAFTS === "true";
const token = import.meta.env.SANITY_AUTH_TOKEN;

if (useDrafts && (!token || !token.trim())) {
  throw new Error(
    "SANITY_USE_DRAFTS=true requiere SANITY_AUTH_TOKEN sólo en el entorno local.",
  );
}

export const sanityEnv: SanityEnv = {
  projectId: required(
    "PUBLIC_SANITY_PROJECT_ID",
    import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  ),
  dataset: required(
    "PUBLIC_SANITY_DATASET",
    import.meta.env.PUBLIC_SANITY_DATASET,
  ),
  apiVersion: validateApiVersion(
    required(
      "PUBLIC_SANITY_API_VERSION",
      import.meta.env.PUBLIC_SANITY_API_VERSION,
    ),
  ),
  perspective: useDrafts ? "drafts" : "published",
  token: useDrafts ? token : undefined,
};
