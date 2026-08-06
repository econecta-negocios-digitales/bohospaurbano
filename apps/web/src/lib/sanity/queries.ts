const published = `_id != null && !(_id in path("drafts.**"))`;
const image = `{asset{asset, alt, crop, hotspot}, caption}`;
const seo = `{title, description, image${image}, noIndex}`;
const cta = `{label, style, link{type, internalReference, externalUrl}}`;
const portableText = `[]{_key, _type, children[]{_key, _type, text, marks}, markDefs, style, listItem, level}`;

const singleton = (id: string, projection: string) =>
  `*[_id == "${id}" && ${published}][0]{${projection}}`;

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
    _id, hero, experiences, giftCards, categories, brunch, about, testimonials, contactLocation, seo${seo}
  `,
  ),
  aboutPage: singleton(
    "aboutPage",
    `_id, title, intro${portableText}, image${image}, video, teamMembers, cta${cta}, seo${seo}`,
  ),
  servicesPage: singleton(
    "servicesPage",
    `_id, title, description, content${portableText}, categories, featuredServices, cta${cta}, seo${seo}`,
  ),
  giftCardsPage: singleton(
    "giftCardsPage",
    `_id, title, description, content${portableText}, featuredGiftCards, cta${cta}, seo${seo}`,
  ),
  corporatePage: singleton(
    "corporatePage",
    `_id, title, description, content${portableText}, experiences, cta${cta}, seo${seo}`,
  ),
  contactPage: singleton(
    "contactPage",
    `_id, title, description, content${portableText}, visibleBlocks, formTexts, seo${seo}`,
  ),
  faqPage: singleton(
    "faqPage",
    `_id, title, description, topics[]{key, label, description, order, visible, faqs}`,
  ),
  navigation: singleton(
    "navigation",
    `_id, mainItems${cta}, primaryCta${cta}, visible, ariaLabel`,
  ),
  footer: singleton(
    "footer",
    `_id, columns[]{title, links${cta}, visible}, showSocialLinks, socialPlacement, legalLinks${cta}`,
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

const categoryProjection = `_id, name, "slug": slug.current, description, image${image}, seo${seo}, order`;
const serviceProjection = `_id, name, "slug": slug.current, category->{_id, name, "slug": slug.current}, shortDescription, mainContent${portableText}, duration, price, showPrice, modality, maxPeople, coordinateByWhatsapp, primaryCta${cta}, secondaryCta${cta}, mainImage${image}, featured, order, landingEnabled, seo${seo}`;
const giftCardProjection = `_id, name, "slug": slug.current, kind, relatedService->{_id, name, "slug": slug.current}, shortDescription, content${portableText}, image${image}, price, showPrice, modality, people, deliveryFormat, coordinateByWhatsapp, cta${cta}, featured, order`;
const corporateProjection = `_id, name, description, content${portableText}, image${image}, benefits${portableText}, minPeople, maxPeople, modality, priceOrBudget, primaryCta${cta}, secondaryCta${cta}, featured, order, seo${seo}`;

export const collectionQueries = {
  categories: `*[_type == "serviceCategory" && ${published} && archived != true] | order(order asc, name asc, _id asc){${categoryProjection}}`,
  services: `*[_type == "service" && ${published} && archived != true && defined(category)] | order(coalesce(order, 9999) asc, name asc, _id asc){${serviceProjection}}`,
  featuredServices: `*[_type == "service" && ${published} && archived != true && featured == true && defined(category)] | order(coalesce(order, 9999) asc, name asc, _id asc){${serviceProjection}}`,
  landingServices: `*[_type == "service" && ${published} && archived != true && landingEnabled == true && defined(category) && defined(slug.current)] | order(coalesce(order, 9999) asc, name asc, _id asc){${serviceProjection}}`,
  serviceByCategoryAndSlug: `*[_type == "service" && ${published} && archived != true && landingEnabled == true && category->slug.current == $categorySlug && slug.current == $serviceSlug][0]{${serviceProjection}}`,
  promotions: `*[_type == "promotion" && ${published} && active == true && archived != true && (!defined(startsAt) || startsAt <= $now) && (!defined(endsAt) || endsAt >= $now)] | order(coalesce(order, 9999) asc, title asc, _id asc){_id, title, description, image${image}, startsAt, endsAt, active, conditions${portableText}, benefit, cta${cta}, featured, order}`,
  giftCards: `*[_type == "giftCard" && ${published} && visible == true && archived != true] | order(coalesce(order, 9999) asc, name asc, _id asc){${giftCardProjection}}`,
  featuredGiftCards: `*[_type == "giftCard" && ${published} && visible == true && archived != true && featured == true] | order(coalesce(order, 9999) asc, name asc, _id asc){${giftCardProjection}}`,
  corporateExperiences: `*[_type == "corporateExperience" && ${published} && archived != true] | order(coalesce(order, 9999) asc, name asc, _id asc){${corporateProjection}}`,
  team: `*[_type == "teamMember" && ${published} && visible == true && archived != true] | order(coalesce(order, 9999) asc, name asc, _id asc){_id, name, role, shortBio, biography${portableText}, training${portableText}, specialties, photo${image}, order, featured, isFounder, isDirector}`,
  featuredTeam: `*[_type == "teamMember" && ${published} && visible == true && archived != true && featured == true] | order(coalesce(order, 9999) asc, name asc, _id asc){_id, name, role, shortBio, photo${image}, order, featured, isFounder, isDirector}`,
  testimonials: `*[_type == "testimonial" && ${published} && authorization == true && visible == true && archived != true] | order(coalesce(order, 9999) asc, coalesce(date, "") desc, _id asc){_id, publicName, initials, text, source, originalUrl, date, featured, order}`,
  faqs: `*[_type == "faq" && ${published} && visible == true && archived != true] | order(coalesce(order, 9999) asc, question asc, _id asc){_id, question, answer${portableText}, order, relatedService->{_id, name, "slug": slug.current}}`,
} as const;
