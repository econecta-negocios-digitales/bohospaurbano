# Arquitectura inicial

El repositorio usa npm workspaces sin Turborepo ni Nx.

- `apps/web`: sitio público estático basado en Astro 6, TypeScript estricto y Tailwind CSS 4.
- `apps/studio`: Sanity Studio local, con React requerido por Sanity y localización española.
- `scripts`: reservado para automatizaciones futuras.
- `docs`: documentación técnica inicial.

La Etapa 1 no define páginas reales, componentes finales, schemas editoriales ni integraciones externas.
