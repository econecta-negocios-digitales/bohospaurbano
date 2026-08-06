# Documentos técnicos

`apps/studio/scripts/create-technical-documents.ts` crea drafts mínimos con `createIfNotExists`. Nunca utiliza `createOrReplace`, no clona publicaciones y no publica documentos.

Para cada identidad se comprueba el draft `drafts.<id>` y la versión publicada `<id>`:

- ninguno: crea el draft;
- solo draft: informa `draftExists`;
- solo publicada: informa `publishedExists` y no crea un draft vacío;
- ambos: informa `bothExist`;
- `_type` incompatible: informa `typeConflict`.

El script cubre los singletons, las cuatro categorías y las dos páginas legales. La salida JSON informa `created`, `draftExists`, `publishedExists`, `bothExist` y `typeConflict`.
