import { defineDocuments, defineLocations } from "sanity/presentation";

export const presentationResolve = {
  mainDocuments: defineDocuments([{ route: "/preview/", type: "homePage" }]),
  locations: {
    homePage: defineLocations({
      select: { title: "hero.title" },
      resolve: (document) => ({
        locations: [{ title: document?.title ?? "Inicio", href: "/preview/" }],
      }),
    }),
  },
};
