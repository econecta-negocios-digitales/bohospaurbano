import type { SanityClient } from "@sanity/client";

import { sanityClient } from "./client";
import { collectionQueries, singletonQueries } from "./queries";
import type {
  ContentPage,
  CorporateExperience,
  Faq,
  Footer,
  GiftCard,
  HomePage,
  Navigation,
  Promotion,
  Service,
  ServiceCategory,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "./types";

export const loadSingleton = <T>(
  query: string,
  client: SanityClient = sanityClient,
): Promise<T | null> => client.fetch<T | null>(query);

export const loadSiteSettings = (client?: SanityClient): Promise<SiteSettings | null> =>
  loadSingleton<SiteSettings>(singletonQueries.siteSettings, client);
export const loadHomePage = (client?: SanityClient): Promise<HomePage | null> =>
  loadSingleton<HomePage>(singletonQueries.homePage, client);
export const loadAboutPage = (client?: SanityClient): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.aboutPage, client);
export const loadServicesPage = (client?: SanityClient): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.servicesPage, client);
export const loadGiftCardsPage = (client?: SanityClient): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.giftCardsPage, client);
export const loadCorporatePage = (client?: SanityClient): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.corporatePage, client);
export const loadFaqPage = (client?: SanityClient): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.faqPage, client);
export const loadNavigation = (client?: SanityClient): Promise<Navigation | null> =>
  loadSingleton<Navigation>(singletonQueries.navigation, client);
export const loadFooter = (client?: SanityClient): Promise<Footer | null> =>
  loadSingleton<Footer>(singletonQueries.footer, client);

export const loadCategories = (client: SanityClient = sanityClient): Promise<ServiceCategory[]> =>
  client.fetch<ServiceCategory[]>(collectionQueries.categories);
export const loadServices = (client: SanityClient = sanityClient): Promise<Service[]> =>
  client.fetch<Service[]>(collectionQueries.services);
export const loadFeaturedServices = (client: SanityClient = sanityClient): Promise<Service[]> =>
  client.fetch<Service[]>(collectionQueries.featuredServices);
export const loadLandingServices = (client: SanityClient = sanityClient): Promise<Service[]> =>
  client.fetch<Service[]>(collectionQueries.landingServices);
export const loadServiceByCategoryAndSlug = (
  categorySlug: string,
  serviceSlug: string,
  client: SanityClient = sanityClient,
): Promise<Service | null> =>
  client.fetch<Service | null>(
    collectionQueries.serviceByCategoryAndSlug,
    { categorySlug, serviceSlug },
  );
export const loadPromotions = (
  now = new Date().toISOString(),
  client: SanityClient = sanityClient,
): Promise<Promotion[]> =>
  client.fetch<Promotion[]>(collectionQueries.promotions, { now });
export const loadGiftCards = (client: SanityClient = sanityClient): Promise<GiftCard[]> =>
  client.fetch<GiftCard[]>(collectionQueries.giftCards);
export const loadFeaturedGiftCards = (client: SanityClient = sanityClient): Promise<GiftCard[]> =>
  client.fetch<GiftCard[]>(collectionQueries.featuredGiftCards);
export const loadCorporateExperiences = (client: SanityClient = sanityClient): Promise<CorporateExperience[]> =>
  client.fetch<CorporateExperience[]>(
    collectionQueries.corporateExperiences,
  );
export const loadTeam = (client: SanityClient = sanityClient): Promise<TeamMember[]> =>
  client.fetch<TeamMember[]>(collectionQueries.team);
export const loadFeaturedTeam = (client: SanityClient = sanityClient): Promise<TeamMember[]> =>
  client.fetch<TeamMember[]>(collectionQueries.featuredTeam);
export const loadTestimonials = (client: SanityClient = sanityClient): Promise<Testimonial[]> =>
  client.fetch<Testimonial[]>(collectionQueries.testimonials);
export const loadFaqs = (client: SanityClient = sanityClient): Promise<Faq[]> =>
  client.fetch<Faq[]>(collectionQueries.faqs);
