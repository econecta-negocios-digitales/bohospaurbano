# Consultas públicas de Sanity

Las consultas están en `apps/web/src/lib/sanity/queries.ts`. Usan proyecciones explícitas y no `...`.

## Reglas comunes

- IDs de singletons canónicos: `siteSettings`, `homePage`, `aboutPage`, `servicesPage`, `giftCardsPage`, `corporatePage`, `contactPage`, `faqPage`, `navigation`, `footer`, `giftCardPolicy`, `legalPage.privacy` y `legalPage.terms`.
- `perspective: "published"` se configura en el cliente.
- Se conserva un filtro defensivo contra `drafts.**`.
- Documentos archivados se excluyen con `archived != true`.
- Los órdenes usan `order`, nombre/título y `_id` como desempate determinista.

## Proyecciones reales

Las proyecciones se basan en `apps/studio/schemas/documents.ts`, `objects/shared.ts` y `objects/home.ts`. En particular, `siteSettings` proyecta `contact`, `socialLinks`, `organizationData` y `localBusinessData`; no supone `title`, `description`, `logo` ni `seo` directos.

Servicios usan `name`, `slug`, `category`, `shortDescription`, `mainContent`, `duration`, `price`, CTAs, `mainImage`, `featured`, `order`, `landingEnabled` y `seo`. Una ruta individual exige categoría, slug y `landingEnabled == true`.

Promociones usan `startsAt` y `endsAt`, ambas fechas Sanity, con `$now` recibido como ISO UTC desde el loader.

Testimonios públicos exigen simultáneamente `authorization == true`, `visible == true` y `archived != true`. FAQs públicas exigen `visible == true` y `archived != true`.

## Loaders

`loadSingleton` tipa `null` para documentos ausentes. Los loaders de colecciones tipan arrays y devuelven `[]` cuando la API responde una colección vacía. Errores reales de API se propagan.

## Límites actuales

No se implementan páginas, rutas dinámicas, renderizado Portable Text, preview, Visual Editing, importación ni publicación de contenido.
