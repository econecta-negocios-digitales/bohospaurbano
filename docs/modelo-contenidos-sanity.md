# Modelo de contenidos Sanity

La Tarea 002 implementa schemas editoriales sin importar contenido real. Los datos operativos tienen una única fuente: `siteSettings.contact` y `siteSettings.socialLinks`. `organizationData` no contiene redes; el futuro `sameAs` se derivará desde `socialLinks`.

El Home es un singleton con ocho bloques fijos y variantes cerradas. Las colecciones editoriales usan `archived`; los singletons estructurales no se archivan. Las páginas legales usan un único `_type: legalPage` con IDs `legalPage.privacy` y `legalPage.terms`.

La visibilidad de precios vive en el documento padre (`showPrice`). `price` solo contiene `amount`, `currency`, `label` y `fromPrice`. `duration` utiliza `cabinetMinutes` y `recommendedMinutes`.

FAQ se agrupa desde `faqPage.topics` mediante objetos embebidos `faqTopicGroup`; `faq` no referencia temas.

Sanity Free no impide modificaciones realizadas por administradores o APIs externas. Las acciones del Studio, Structure Tool y templates controlan la experiencia editorial, no son un límite de seguridad absoluto.
