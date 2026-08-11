# Boho Spa Urbano — Project Agent Rules

## Precedencia

- Leer este archivo antes de trabajar.
- Leer los documentos específicos aplicables a la tarea.
- Las instrucciones explícitas prevalecen sólo cuando contradicen deliberada y claramente una regla general.
- Ante ambigüedad, mantener las reglas generales. No inventar requisitos.

## Stack comprobado

- Monorepo npm con `apps/web` y `apps/studio`.
- Web: Astro 6, TypeScript estricto y Tailwind CSS 4 mediante Vite.
- Contenido: Sanity; la web usa salida estática.
- Scripts de validación en la raíz: `npm run typecheck` y `npm run build`.

## Documentos obligatorios

- Git, workflow y QA → `docs/workflow.md`
- UI, visual y componentes → `docs/visual-system.md`
- Contenido y Sanity → `docs/content-sanity.md`
- Imágenes y assets → `docs/assets.md`

## Reglas críticas

- No hacer commit ni push salvo instrucción explícita.
- No modificar ni publicar Sanity salvo instrucción explícita.
- Nunca exponer secretos o tokens.
- Ejecutar typecheck y build antes de cerrar una implementación.
- Todo QA debe indicar explícitamente el entorno.
- No versionar artefactos QA o temporales.
- No inventar contenido comercial o editorial ni crear links públicos a rutas inexistentes.
- No rediseñar trabajo aprobado fuera del alcance solicitado.
- Revisar regresiones cuando se toca un componente compartido.
- Todo raster local publicado debe cumplir `docs/assets.md`.
- Los masters de `MaterialSitio` nunca se modifican.
- Mantener el alcance estricto; informar los problemas fuera de alcance.

## Informe de cierre

Informar archivos modificados, decisiones relevantes, typecheck, build, QA y entorno, pendientes/riesgos y si hubo commit/push.
