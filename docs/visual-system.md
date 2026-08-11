# Sistema visual Boho Spa Urbano

Home es la referencia visual principal del sistema.

## Dirección visual

**Modern Editorial with Tactile Depth.** Boho debe sentirse como un spa urbano boutique: contemporáneo, cálido, humano, editorial, cuidado y premium sin ostentación.

Mantener warm cream, ink brown, moss, terracotta, serif editorial, sans limpia, fotografía real protagonista, fondos tonales, asimetría controlada, profundidad táctil sutil y sombras moderadas. Los tokens comprobados viven en `apps/web/src/styles/global.css` (`--cream`, `--ink`, `--moss`, `--terracotta`, entre otros); reutilizarlos en lugar de inventar códigos hex.

## Evitar

- Estética clínica o médica salvo contexto específico.
- Spa/hotel genérico, boho hippie o beige monocorde.
- UI SaaS, exceso de cards, sombras pesadas o gradients decorativos injustificados.
- Iconografía genérica innecesaria.

## Páginas y componentes

Las páginas internas pertenecen al sistema de Home sin copiar mecánicamente su estructura. Se permiten ritmo editorial específico, composiciones asimétricas, alternancia imagen/texto y jerarquías según el contenido.

No rediseñar trabajo aprobado sin instrucción. Si cambia una imagen, no alterar copy/layout; si cambia copy, no alterar lo visual salvo necesidad. Revisar regresiones al tocar componentes compartidos.

## Responsive y accesibilidad

Revisar desktop, mobile, jerarquía, legibilidad, crops, spacing, overflow, HTML semántico, headings, alt text, contraste y enlaces/botones reconocibles.
