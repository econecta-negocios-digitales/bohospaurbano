# Contenido y Sanity

## Fuente editorial

Sanity es la fuente de verdad para el contenido estructurado disponible. Los documentos editoriales pueden contener instrucciones de trabajo que no son contenido público.

## Drafts y producción

La implementación actual permite drafts sólo en desarrollo local cuando `SANITY_USE_DRAFTS=true` y existe `SANITY_AUTH_TOKEN`. En producción se usa la perspectiva `published`. El token es sólo de servidor: `SANITY_AUTH_TOKEN` nunca se expone al cliente ni se versiona, y `PUBLIC_SANITY_TOKEN` está prohibido.

## Sanity Studio

El Studio utiliza el proyecto `15z3a7sh` y el dataset `production`. Está desplegado y validado en [https://bohospaurbano.sanity.studio/](https://bohospaurbano.sanity.studio/), con Deployment App ID `ohkdi347nwwdzsnk82ddbfg9`.

El Studio local se ejecuta desde `apps/studio` y utiliza el mismo proyecto y dataset. La web LOCAL puede leer drafts para desarrollo; la web de producción sólo lee `published`. Guardar un documento conserva un draft: no lo hace visible en producción. La acción `Publish` crea o actualiza la versión publicada en Sanity, pero tampoco actualiza por sí sola el sitio Astro estático.

Flujo editorial previsto:

`editar → guardar draft → revisar → Publish → rebuild/deploy web → contenido visible en producción`

La automatización `Sanity Publish → Vercel rebuild` se configurará posteriormente. Hasta entonces, después de publicar contenido en Sanity debe ejecutarse el rebuild/deploy de Astro para que lo incorpore.

Gift Cards y Regalos corporativos permanecen sin publicar mientras esperan su definición visual. Navigation y Footer también requieren revisión de sus documentos actuales antes de publicarse.

## Curaduría

No renderizar accidentalmente instrucciones editoriales como `##`, `**`, `Antetítulo:`, `Título:`, `CTA:`, `Comportamiento:`, `Encabezado`, `Cierre`, notas o instrucciones de implementación. Extraer sólo contenido público aprobado; no usar un render genérico que exponga la estructura interna.

## No inventar

No inventar precios, duraciones, horarios, disponibilidad, promociones, testimonios, beneficios, políticas, URLs, tratamientos ni claims comerciales. Si falta información, informarlo.

## Writes

No publicar, editar documentos, migrar contenido ni cambiar schemas salvo instrucción explícita.

## Reglas permanentes actuales

- No existe ruta pública `/contacto/`.
- El WhatsApp oficial está centralizado en `apps/web/src/lib/site.ts`: número `5492916412343`, URL `https://wa.me/5492916412343`. No hardcodear valores divergentes.
- Experiencia Summer es permanente. No agregar lógica estacional, fechas automáticas, ocultamiento por estación ni disponibilidad estacional.
- Las rutas futuras pueden existir en configuración interna, pero no deben renderizarse como links navegables hasta que sus páginas existan.
- CTAs: toda acción explícita de reservar, agendar o elegir turno debe dirigir a la agenda oficial de AgendaPro mediante la configuración central de `apps/web/src/lib/site.ts`; las acciones de consulta, contacto u orientación deben dirigir al WhatsApp oficial centralizado allí.
