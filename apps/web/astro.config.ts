import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  vite: {
    // Astro 6 and Sanity 6 resolve different Vite majors in the monorepo.
    plugins: [tailwindcss() as any],
  },
});
