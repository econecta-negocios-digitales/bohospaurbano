# Carga inicial de contenidos

La Fase A prepara contenidos de `MaterialSitio` sin mutar Sanity. El proceso produce inventario, datos normalizados, referencias, manifiesto externo, validación, dry-run y reportes.

## Fuentes y estados

`MaterialSitio` es solo lectura. El inventario distingue contenido aprobado, provisional, pendiente, no clasificado y assets sin revisar. No se completa información ausente ni se inventan precios, duraciones, credenciales, datos operativos o textos legales.

## Archivos intermedios

```text
scripts/content-data/
├── source-inventory.json
├── normalized/
│   ├── technical-documents.json
│   ├── services.json
│   └── collections.json
├── references.json
├── manifests/import-manifest.json
└── generated/
    ├── validation-report.json
    ├── dry-run-report.json
    ├── import-report.json
    └── content-report.json
```

El manifiesto mantiene la trazabilidad fuera de Sanity. No se agregan metadatos de importación a los schemas.

## Comandos

```powershell
npm run content:validate
npm run content:import -- --dry-run
npm run content:report
```

`content:validate` no necesita autenticación. El dry-run remoto requiere una credencial local (`SANITY_AUTH_TOKEN` o `SANITY_API_TOKEN`), no la imprime y solo ejecuta lecturas. Si no está disponible, se detiene sin mutar.

## IDs y referencias

Los documentos nuevos usan IDs canónicos como `service.<slug>` y sus futuros drafts serían `drafts.<id>`. Las referencias normalizadas siempre usan el ID canónico, nunca `drafts.*`.

## Estados remotos

El dry-run diferencia `neitherExists`, `draftOnly`, `publishedOnly`, `bothExist` y `typeConflict`. Un documento publicado sin draft no se sobrescribe ni recibe un draft vacío automáticamente.

## Importación futura

La importación real y la publicación requieren autorización posterior. Deberá comparar por campo, respetar `managedFields`, detectar ediciones manuales y usar snapshots locales no versionados para rollback.
