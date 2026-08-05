import type { SchemaTypeDefinition } from "sanity";

export const placeholder = {
  name: "placeholderTecnico",
  title: "Placeholder técnico",
  type: "document",
  fields: [
    {
      name: "titulo",
      title: "Título",
      type: "string",
    },
  ],
} satisfies SchemaTypeDefinition;
