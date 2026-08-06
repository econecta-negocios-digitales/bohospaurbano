# Integración Astro ↔ Sanity

## Alcance actual

La capa en `apps/web/src/lib/sanity/` es de solo lectura y consulta únicamente contenido publicado. No usa token, sesión del CLI, preview de drafts ni mutaciones.

## Variables

Crear `apps/web/.env` localmente a partir de `.env.example`:

```env
PUBLIC_SANITY_PROJECT_ID=15z3a7sh
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-02-19
```

`env.ts` valida las tres variables, el formato de la versión y la ausencia de `SANITY_AUTH_TOKEN`/`PUBLIC_SANITY_TOKEN`. No crear ni versionar credenciales.

## Cliente

`client.ts` mantiene un único cliente con:

- `perspective: "published"`;
- `useCdn: false`;
- `withCredentials: false`;
- sin token.

El cliente se utiliza durante el build estático. Astro no expone la sesión del Studio ni consulta drafts.

## Estructura

```text
apps/web/src/lib/sanity/
├── client.ts
├── env.ts
├── image.ts
├── queries.ts
├── loaders.ts
├── types.ts
└── index.ts
```

Las consultas y los tipos se mantienen manuales hasta que schemas y páginas estén estabilizados. Sanity TypeGen puede evaluarse después.

## Contenido ausente y errores

Los singletons devuelven `null` y las colecciones `[]` cuando no existen documentos publicados. Los errores de configuración, red o API no se convierten silenciosamente en contenido vacío.

## Imágenes

`image.ts` genera URLs con `@sanity/image-url`, conserva crop/hotspot del asset y aplica `auto("format")`. El texto alternativo pertenece al resultado editorial y nunca es inventado por el helper.

## Portable Text

Solo se tipan los bloques existentes. El renderizador visual, enlaces controlados e imágenes embebidas quedan para la implementación de páginas. No se interpreta HTML editorial arbitrario.

## Build estático

El contenido publicado disponible en el momento del build se incorpora al resultado estático. La publicación manual en Sanity requiere un nuevo build. Webhook, Deploy Hook, SSR, ISR y preview quedan fuera del alcance actual.

## Comprobación

Desde la raíz:

```powershell
npm run sanity:check
```

El script confirma proyecto, dataset, perspectiva publicada, ausencia de token, respuesta `null` para un singleton técnico inexistente, `[]` para una colección inexistente y ausencia de drafts.
