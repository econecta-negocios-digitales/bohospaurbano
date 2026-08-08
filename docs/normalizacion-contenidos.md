# Normalización de contenidos

Los documentos normalizados incluyen `canonicalId`, `draftId`, `_type`, `source`, `sourceSection`, `sourceHash`, `status`, `data`, `managedFields`, `references`, `missingFields`, `warnings`, `blockingErrors`, `readyForImport`, `schemaValid` y `readyForPublish`.

## Reglas

- conservar el copy de origen;
- registrar cualquier transformación;
- no completar vacíos;
- no importar AgendaPro sin normalización;
- usar slugs deterministas;
- mantener referencias canónicas;
- distinguir validez estructural de publicabilidad.

Un documento puede estar listo para preparar como draft y todavía no ser válido para publicar si faltan imágenes, SEO, datos operativos o revisión editorial.

## Servicios

La fuente actual contiene estructura y reglas, pero no fichas normalizadas de servicios. Por eso `services.json` informa el catálogo como pendiente y no genera servicios ficticios.

## Imágenes

La Fase A solo inventaría assets existentes. No carga imágenes ni inventa textos alternativos definitivos.
