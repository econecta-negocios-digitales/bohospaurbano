# Revisión editorial de la carga inicial

La revisión editorial ocurre después de validar y ejecutar el dry-run, nunca durante una mutación automática.

## Revisar

- fuentes y estados;
- nombres y slugs;
- categorías;
- servicios y condiciones;
- referencias;
- faltantes y contradicciones;
- testimonios y autorizaciones;
- textos legales;
- datos operativos;
- imágenes y derechos;
- campos publicables.

## Conflictos

La comparación por campo propone completar solo campos vacíos. Un campo ya poblado y distinto se marca como conflicto y conserva prioridad editorial de Sanity hasta una reconciliación explícita.

## Publicación

La publicación es manual y posterior. Requiere contenido completo, referencias válidas, imágenes aprobadas, SEO mínimo, datos operativos confirmados, autorizaciones y revisión legal cuando corresponda.

## Rollback futuro

Antes de una importación real deberán guardarse `_id`, `_type`, `_rev` y estado previo. El rollback solo podrá eliminar drafts creados por esa importación o restaurar drafts preexistentes si `_rev` no cambió. Nunca se tocarán versiones publicadas.
