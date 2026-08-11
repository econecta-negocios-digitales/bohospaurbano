# Política de imágenes y assets

## Masters

Los archivos fuente de `C:\Users\adolf\Documents\Cari\MaterialSitio\...` son masters. Nunca modificarlos, sobrescribirlos, recomprimirlos in-place ni eliminarlos.

## Pipeline obligatorio

Para toda nueva imagen raster local destinada a publicación:

`master PNG/JPG → procesamiento → resize adecuado → WebP optimizado → apps/web/public/images/... → referencia .webp en código`

No copiar directamente PNG/JPG a `public` salvo excepción técnica justificada.

## Formato, compresión y resolución

- WebP es el formato raster estándar del sitio.
- Excepciones: SVG, vectores, favicons/formatos especiales, casos técnicamente justificados e imágenes dinámicas de Sanity/CDN.
- Para fotografía, iniciar aproximadamente en WebP quality 84 y ajustar individualmente sin sacrificar calidad visual.
- Dimensionar según el uso real, mantener resolución suficiente para retina (aproximadamente hasta 2x del máximo render razonable), no hacer upscale, conservar aspect ratio y evitar crops destructivos.
- Cuidar piel, rostros, manos, texturas, gradientes y color.

## Semántica y limpieza

La imagen debe representar correctamente el contenido. No reutilizar imágenes que generen asociaciones incorrectas ni repetir la misma imagen en una página salvo decisión explícita.

Al sustituir un JPG/PNG, actualizar referencias, confirmar que no quedan usos y eliminar el duplicado antiguo de `public` sólo cuando corresponda al alcance autorizado.

## Informe de incorporación

Informar master utilizado, WebP generado, dimensiones, peso, destino, dónde se usa y excepciones.

La optimización ocurre al incorporar el asset, no al final del proyecto.
