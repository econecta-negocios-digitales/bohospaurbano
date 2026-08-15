import type { SanityClient } from "@sanity/client";

import {
  loadCategories,
  loadFeaturedGiftCards,
  loadFeaturedServices,
  loadFooter,
  loadHomePage,
  loadNavigation,
  loadSiteSettings,
} from "./sanity";
import type { HomeBlock, Service, ServiceCategory } from "./sanity/types";

export type HomeView = {
  home: Awaited<ReturnType<typeof loadHomePage>>;
  settings: Awaited<ReturnType<typeof loadSiteSettings>>;
  navigation: Awaited<ReturnType<typeof loadNavigation>>;
  footer: Awaited<ReturnType<typeof loadFooter>>;
  categoryData: ServiceCategory[];
  selectedExperienceData: Service[];
  featuredGiftCards: Awaited<ReturnType<typeof loadFeaturedGiftCards>>;
  homeExperienceBlock: HomeBlock | undefined;
  giftBlock: HomeBlock;
  title: string;
  description: string;
};

const fallbackCategories: ServiceCategory[] = [
  { _id: "fallback-experiencias", name: "Experiencias Boho", slug: "experiencias-boho", order: 1 },
  { _id: "fallback-masajes", name: "Masajes & Bienestar", slug: "masajes-bienestar", order: 2 },
  { _id: "fallback-facial", name: "Cuidado Facial & Corporal", slug: "cuidado-facial-corporal", order: 3 },
  { _id: "fallback-belleza", name: "Belleza Consciente", slug: "belleza-consciente", order: 4 },
];

const block = (value: unknown) => value as HomeBlock | undefined;

export const loadHomeView = async (client?: SanityClient): Promise<HomeView> => {
  const [home, settings, navigation, footer, categories, featuredServices, featuredGiftCards] = await Promise.all([
    loadHomePage(client), loadSiteSettings(client), loadNavigation(client), loadFooter(client),
    loadCategories(client), loadFeaturedServices(client), loadFeaturedGiftCards(client),
  ]);
  const categoryData = categories.length ? categories : fallbackCategories;
  const homeExperienceBlock = block(home?.experiences);
  const selectedExperienceData = homeExperienceBlock?.featuredServices?.length
    ? homeExperienceBlock.featuredServices
    : featuredServices;
  const giftBlock = { ...(block(home?.giftCards) || {}) };
  if (featuredGiftCards.length) {
    const first = featuredGiftCards[0];
    if (!giftBlock.image && first?.image) giftBlock.image = first.image;
  }
  return {
    home, settings, navigation, footer, categoryData, selectedExperienceData,
    featuredGiftCards, homeExperienceBlock, giftBlock,
    title: home?.seo?.title || "Boho Spa Urbano | Bienestar boutique en Bahía Blanca",
    description: home?.seo?.description || "Masajes, experiencias de spa, tratamientos faciales y corporales y Gift Cards en Santa Fe 157, Bahía Blanca.",
  };
};
