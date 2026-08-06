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

export const loadSingleton = <T>(query: string): Promise<T | null> =>
  sanityClient.fetch<T | null>(query);

export const loadSiteSettings = (): Promise<SiteSettings | null> =>
  loadSingleton<SiteSettings>(singletonQueries.siteSettings);
export const loadHomePage = (): Promise<HomePage | null> =>
  loadSingleton<HomePage>(singletonQueries.homePage);
export const loadAboutPage = (): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.aboutPage);
export const loadServicesPage = (): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.servicesPage);
export const loadGiftCardsPage = (): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.giftCardsPage);
export const loadCorporatePage = (): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.corporatePage);
export const loadContactPage = (): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.contactPage);
export const loadFaqPage = (): Promise<ContentPage | null> =>
  loadSingleton<ContentPage>(singletonQueries.faqPage);
export const loadNavigation = (): Promise<Navigation | null> =>
  loadSingleton<Navigation>(singletonQueries.navigation);
export const loadFooter = (): Promise<Footer | null> =>
  loadSingleton<Footer>(singletonQueries.footer);

export const loadCategories = (): Promise<ServiceCategory[]> =>
  sanityClient.fetch<ServiceCategory[]>(collectionQueries.categories);
export const loadServices = (): Promise<Service[]> =>
  sanityClient.fetch<Service[]>(collectionQueries.services);
export const loadFeaturedServices = (): Promise<Service[]> =>
  sanityClient.fetch<Service[]>(collectionQueries.featuredServices);
export const loadLandingServices = (): Promise<Service[]> =>
  sanityClient.fetch<Service[]>(collectionQueries.landingServices);
export const loadServiceByCategoryAndSlug = (
  categorySlug: string,
  serviceSlug: string,
): Promise<Service | null> =>
  sanityClient.fetch<Service | null>(
    collectionQueries.serviceByCategoryAndSlug,
    { categorySlug, serviceSlug },
  );
export const loadPromotions = (
  now = new Date().toISOString(),
): Promise<Promotion[]> =>
  sanityClient.fetch<Promotion[]>(collectionQueries.promotions, { now });
export const loadGiftCards = (): Promise<GiftCard[]> =>
  sanityClient.fetch<GiftCard[]>(collectionQueries.giftCards);
export const loadFeaturedGiftCards = (): Promise<GiftCard[]> =>
  sanityClient.fetch<GiftCard[]>(collectionQueries.featuredGiftCards);
export const loadCorporateExperiences = (): Promise<CorporateExperience[]> =>
  sanityClient.fetch<CorporateExperience[]>(
    collectionQueries.corporateExperiences,
  );
export const loadTeam = (): Promise<TeamMember[]> =>
  sanityClient.fetch<TeamMember[]>(collectionQueries.team);
export const loadFeaturedTeam = (): Promise<TeamMember[]> =>
  sanityClient.fetch<TeamMember[]>(collectionQueries.featuredTeam);
export const loadTestimonials = (): Promise<Testimonial[]> =>
  sanityClient.fetch<Testimonial[]>(collectionQueries.testimonials);
export const loadFaqs = (): Promise<Faq[]> =>
  sanityClient.fetch<Faq[]>(collectionQueries.faqs);
