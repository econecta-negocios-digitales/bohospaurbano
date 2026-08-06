type PublicEnv = {
  projectId: string;
  dataset: string;
  apiVersion: string;
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

const token =
  import.meta.env.SANITY_AUTH_TOKEN ?? import.meta.env.PUBLIC_SANITY_TOKEN;

if (token) {
  throw new Error(
    "No se permite SANITY_AUTH_TOKEN ni PUBLIC_SANITY_TOKEN en la capa pública de Astro.",
  );
}

export const sanityEnv: PublicEnv = {
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
};
