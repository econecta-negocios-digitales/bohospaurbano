# Workflow de desarrollo y QA

## Flujo

1. Debate y definición.
2. Implementación por CX.
3. Informe.
4. QA.
5. Revisión de diff.
6. Staging.
7. Review del staged diff.
8. Commit.
9. Push.
10. Validación posterior cuando corresponda.

## Git

- Trabajar en la branch indicada y no cambiarla sin instrucción.
- No hacer commit ni push automáticos.
- Preservar cambios existentes del usuario.
- Evitar `git add .` si puede incluir artefactos fuera de alcance.
- Revisar `git status`, el diff y el staged diff.
- Ejecutar `git diff --cached --check` antes del commit.
- No mezclar tareas independientes.

## QA

Antes de cualquier QA indicar, por ejemplo:

`QA — entorno: LOCAL`

Durante desarrollo, LOCAL es el entorno por defecto salvo instrucción diferente. Para cambios de UI revisar desktop, mobile, responsive, imágenes y crops, links, overflow horizontal, navegación y componentes compartidos afectados. Si se modifica un componente usado en Home, revisar Home.

## Validaciones

Antes de cerrar una implementación ejecutar los comandos reales del workspace correspondiente:

```powershell
npm run typecheck
npm run build
```

No declarar exitoso un comando que falló.

## Artefactos y seguridad

- Las screenshots de QA son temporales; `qa-*.png` no se versionan.
- No dejar `console.log`, debugging ni archivos temporales.
- `.env` nunca se versiona.
- Secretos y tokens nunca aparecen en código o documentación.
- `.env.example` sólo contiene nombres y valores seguros o ficticios.
