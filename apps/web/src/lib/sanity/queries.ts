import { sanityEnv } from "./env";

const published = `_id != null && !(_id in path("drafts.**"))`;
const visibility = sanityEnv.perspective === "drafts" ? `_id != null` : published;
const image = `{asset{asset, alt, crop, hotspot}, caption}`;
const seo = `{title, description, image${image}, noIndex}`;
const cta = `{label, style, link{type, internalReference, externalUrl}}`;
const portableText = `[]{_key, _type, children[]{_key, _type, text, marks}, markDefs, style, listItem, level}`;
const categoryProjection = `_id, name, "slug": slug.current, description, content${portableText}, cta${cta}, image${image}, seo${seo}, order`;
const serviceProjection = `_id, name, "slug": slug.current, category->{_id, name, "slug": slug.current}, shortDescription, mainContent${portableText}, duration, price, showPrice, modality, maxPeople, coordinateByWhatsapp, primaryCta${cta}, secondaryCta${cta}, mainImage${image}, featured, order, landingEnabled, seo${seo}`;
const giftCardProjection = `_id, name, "slug": slug.current, kind, relatedService->{_id, name, "slug": slug.current}, shortDescription, content${portableText}, image${image}, price, showPrice, modality, people, deliveryFormat, coordinateByWhatsapp, cta${cta}, featured, order`;
const corporateProjection = `_id, name, description, content${portableText}, image${image}, benefits${portableText}, minPeople, maxPeople, modality, priceOrBudget, primaryCta${cta}, secondaryCta${cta}, featured, order, seo${seo}`;
const faqProjection = `_id, question, answer${portableText}, order, visible, archived, relatedPages[]->{_id, _type}, relatedService->{_id, name, "slug": slug.current}`;

const singleton = (id: string, projection: string) =>
  `*[_id == "${id}" && ${visibility}][0]{${projection}}`;

export const singletonQueries = {
  siteSettings: singleton(
    "siteSettings",
    `
    _id, contact, socialLinks, organizationData{commercialName, legalName, logo${image}, foundingDate, founders},
    localBusinessData{businessType, areaServed, representativeImage${image}}
  `,
  ),
  homePage: singleton(
    "homePage",
    `
    _id, hero, experiences{..., featuredServices[]->{${serviceProjection}}}, giftCards, categories, brunch, about, testimonials, contactLocation, conversionClose, seo${seo}
  `,
  ),
  aboutPage: singleton(
    "aboutPage",
    `_id, title, intro${portableText}, image${image}, video, teamMembers[]->{_id, name, role, shortBio, photo${image}, order, featured}, cta${cta}, seo${seo}`,
  ),
  servicesPage: singleton(
    "servicesPage",
    `_id, title, description, content${portableText}, categories[]->{${categoryProjection}}, featuredServices[]->{${serviceProjection}}, cta${cta}, seo${seo}`,
  ),
  giftCardsPage: singleton(
    "giftCardsPage",
    `_id, title, description, content${portableText}, featuredGiftCards, cta${cta}, seo${seo}`,
  ),
  corporatePage: singleton(
    "corporatePage",
    `_id, title, description, content${portableText}, experiences, cta${cta}, seo${seo}`,
  ),
  faqPage: singleton(
    "faqPage",
    `_id, title, description, topics[visible != false] | order(order asc, key asc){key, label, description, order, visible, faqs[@->.visible == true && @->.archived != true] | order(coalesce(@->.order, 9999) asc, @->.question asc, @->_id asc)->{${faqProjection}}}, seo${seo}`,
  ),
  navigation: singleton(
    "navigation",
    `_id, mainItems[]${cta}, primaryCta${cta}, visible, ariaLabel`,
  ),
  footer: singleton(
    "footer",
    `_id, columns[]{title, links[]${cta}, visible}, showSocialLinks, socialPlacement, legalLinks[]${cta}`,
  ),
  giftCardPolicy: singleton(
    "giftCardPolicy",
    `_id, title, content${portableText}, updatedAt, seo${seo}`,
  ),
  privacy: singleton(
    "legalPage.privacy",
    `_id, title, slug{current}, content${portableText}, updatedAt, seo${seo}`,
  ),
  terms: singleton(
    "legalPage.terms",
    `_id, title, slug{current}, content${portableText}, updatedAt, seo${seo}`,
  ),
} as const;

export const collectionQueries = {
  categories: `*[_type == "serviceCategory" && ${visibility} && archived != true] | order(order asc, name asc, _id asc){${categoryProjection}}`,
  services: `*[_type == "service" && ${visibility} && archived != true && defined(category)] | order(coalesce(order, 9999) asc, name asc, _id asc){${serviceProjection}}`,
  featuredServices: `*[_type == "service" && ${visibility} && archived != true && featured == true && defined(category)] | order(coalesce(order, 9999) asc, name asc, _id asc){${serviceProjection}}`,
  landingServices: `*[_type == "service" && ${visibility} && archived != true && landingEnabled == true && defined(category) && defined(slug.current)] | order(coalesce(order, 9999) asc, name asc, _id asc){${serviceProjection}}`,
  serviceByCategoryAndSlug: `*[_type == "service" && ${visibility} && archived != true && landingEnabled == true && category->slug.current == $categorySlug && slug.current == $serviceSlug][0]{${serviceProjection}}`,
  promotions: `*[_type == "promotion" && ${visibility} && active == true && archived != true && (!defined(startsAt) || startsAt <= $now) && (!defined(endsAt) || endsAt >= $now)] | order(coalesce(order, 9999) asc, title asc, _id asc){_id, title, description, image${image}, startsAt, endsAt, active, conditions${portableText}, benefit, cta${cta}, featured, order}`,
  giftCards: `*[_type == "giftCard" && ${visibility} && visible == true && archived != true] | order(coalesce(order, 9999) asc, name asc, _id asc){${giftCardProjection}}`,
  featuredGiftCards: `*[_type == "giftCard" && ${visibility} && visible == true && archived != true && featured == true] | order(coalesce(order, 9999) asc, name asc, _id asc){${giftCardProjection}}`,
  corporateExperiences: `*[_type == "corporateExperience" && ${visibility} && archived != true] | order(coalesce(order, 9999) asc, name asc, _id asc){${corporateProjection}}`,
  team: `*[_type == "teamMember" && ${visibility} && visible == true && archived != true] | order(coalesce(order, 9999) asc, name asc, _id asc){_id, name, role, shortBio, biography${portableText}, training${portableText}, specialties, photo${image}, order, featured, isFounder, isDirector}`,
  featuredTeam: `*[_type == "teamMember" && ${visibility} && visible == true && archived != true && featured == true] | order(coalesce(order, 9999) asc, name asc, _id asc){_id, name, role, shortBio, photo${image}, order, featured, isFounder, isDirector}`,
  testimonials: `*[_type == "testimonial" && ${visibility} && authorization == true && visible == true && archived != true] | order(coalesce(order, 9999) asc, coalesce(date, "") desc, _id asc){_id, publicName, initials, text, source, originalUrl, date, featured, order}`,
  faqs: `*[_type == "faq" && ${visibility} && visible == true && archived != true] | order(coalesce(order, 9999) asc, question asc, _id asc){${faqProjection}}`,
} as const;
