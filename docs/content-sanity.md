# Contenido y Sanity

## Fuente editorial

Sanity es la fuente de verdad para el contenido estructurado disponible. Los documentos editoriales pueden contener instrucciones de trabajo que no son contenido público.

## Drafts y producción

La implementación actual permite drafts sólo en desarrollo local cuando `SANITY_USE_DRAFTS=true` y existe `SANITY_AUTH_TOKEN`. En producción se usa la perspectiva `published`. El token es sólo de servidor: `SANITY_AUTH_TOKEN` nunca se expone al cliente ni se versiona, y `PUBLIC_SANITY_TOKEN` está prohibido.

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
