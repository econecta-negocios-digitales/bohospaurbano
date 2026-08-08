import type { StructureResolver } from "sanity/structure";

const documentItem = (
  S: Parameters<StructureResolver>[0],
  id: string,
  type: string,
  title: string,
) =>
  S.listItem()
    .title(title)
    .child(S.document().schemaType(type).documentId(id).title(title));
const categories: Array<[string, string]> = [
  ["serviceCategory.experiencias-boho", "Experiencias Boho"],
  ["serviceCategory.masajes-bienestar", "Masajes y bienestar"],
  ["serviceCategory.cuidado-facial-corporal", "Cuidado facial y corporal"],
  ["serviceCategory.belleza-consciente", "Belleza consciente"],
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido editorial")
    .items([
      S.listItem()
        .title("Contenido general")
        .child(
          S.list()
            .title("Contenido general")
            .items([
              documentItem(
                S,
                "siteSettings",
                "siteSettings",
                "Configuración del sitio",
              ),
              documentItem(S, "navigation", "navigation", "Navegación"),
              documentItem(S, "footer", "footer", "Pie de página"),
            ]),
        ),
      S.listItem()
        .title("Páginas")
        .child(
          S.list()
            .title("Páginas")
            .items([
              documentItem(S, "homePage", "homePage", "Inicio"),
              documentItem(S, "aboutPage", "aboutPage", "Nosotros"),
              documentItem(S, "servicesPage", "servicesPage", "Servicios"),
              documentItem(S, "giftCardsPage", "giftCardsPage", "Gift Cards"),
              documentItem(
                S,
                "corporatePage",
                "corporatePage",
                "Regalos corporativos",
              ),
              documentItem(S, "faqPage", "faqPage", "Preguntas frecuentes"),
              documentItem(S, "legalPage.privacy", "legalPage", "Privacidad"),
              documentItem(
                S,
                "legalPage.terms",
                "legalPage",
                "Términos y condiciones",
              ),
            ]),
        ),
      S.listItem()
        .title("Servicios")
        .child(
          S.list()
            .title("Servicios")
            .items([
              S.listItem()
                .title("Categorías principales")
                .child(
                  S.list()
                    .title("Categorías principales")
                    .items(
                      categories.map(([id, title]) =>
                        documentItem(S, id, "serviceCategory", title),
                      ),
                    ),
                ),
              S.listItem()
                .title("Servicios")
                .child(S.documentTypeList("service").title("Servicios")),
            ]),
        ),
      S.listItem()
        .title("Propuestas comerciales")
        .child(
          S.list()
            .title("Propuestas comerciales")
            .items([
              S.listItem()
                .title("Promociones")
                .child(S.documentTypeList("promotion").title("Promociones")),
              S.listItem()
                .title("Gift Cards personales")
                .child(
                  S.documentTypeList("giftCard").title("Gift Cards personales"),
                ),
              S.listItem()
                .title("Experiencias corporativas")
                .child(
                  S.documentTypeList("corporateExperience").title(
                    "Experiencias corporativas",
                  ),
                ),
            ]),
        ),
      S.listItem()
        .title("Contenido institucional")
        .child(
          S.list()
            .title("Contenido institucional")
            .items([
              S.listItem()
                .title("Equipo")
                .child(S.documentTypeList("teamMember").title("Equipo")),
              S.listItem()
                .title("Testimonios")
                .child(S.documentTypeList("testimonial").title("Testimonios")),
              S.listItem()
                .title("Preguntas frecuentes")
                .child(S.documentTypeList("faq").title("Preguntas frecuentes")),
            ]),
        ),
      documentItem(
        S,
        "giftCardPolicy",
        "giftCardPolicy",
        "Política general de Gift Cards",
      ),
    ]);
