export type SanityRef = { _ref: string; _type: "reference" };

export type PortableTextSpan = {
  _key: string;
  _type: "span";
  text: string;
  marks?: string[];
};

export type PortableTextBlock = {
  _key: string;
  _type: "block";
  children: PortableTextSpan[];
  markDefs?: unknown[];
  style?: "normal" | "h2" | "h3" | "blockquote" | string;
  listItem?: "bullet" | "number" | string;
  level?: number;
};

export type ImageWithAlt = {
  asset?: {
    _ref?: string;
    _type?: string;
    crop?: { top?: number; bottom?: number; left?: number; right?: number };
    hotspot?: { x?: number; y?: number; height?: number; width?: number };
  };
  alt?: string;
  caption?: string;
};

export type Seo = {
  title?: string;
  description?: string;
  image?: ImageWithAlt;
  noIndex?: boolean;
};

export type LegalPage = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  content?: PortableTextBlock[];
  updatedAt?: string;
  seo?: Seo;
};

export type Cta = {
  label: string;
  style?: "primary" | "secondary" | "text";
  link?: {
    type?: "internal" | "external" | "whatsapp" | "booking";
    internalReference?: SanityRef;
    externalUrl?: string;
  };
};

export type SiteSettings = {
  _id: "siteSettings";
  contact?: Record<string, unknown>;
  socialLinks?: Array<{ network?: string; url?: string; label?: string }>;
  organizationData?: {
    commercialName?: string;
    legalName?: string;
    logo?: ImageWithAlt;
    foundingDate?: string;
    founders?: string[];
  };
  localBusinessData?: {
    businessType?: string;
    areaServed?: string;
    representativeImage?: ImageWithAlt;
  };
};

export type HomePage = {
  _id: "homePage";
  hero?: Record<string, unknown>;
  experiences?: Record<string, unknown>;
  giftCards?: Record<string, unknown>;
  categories?: Record<string, unknown>;
  brunch?: Record<string, unknown>;
  about?: Record<string, unknown>;
  testimonials?: Record<string, unknown>;
  contactLocation?: Record<string, unknown>;
  conversionClose?: Record<string, unknown>;
  seo?: Seo;
};

export type HomeBlock = {
  eyebrow?: string;
  title?: string;
  description?: string;
  content?: PortableTextBlock[];
  image?: ImageWithAlt;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  tertiaryCta?: Cta;
  variant?: string;
  visible?: boolean;
  featuredServices?: Service[];
};

export type ContentPage = {
  _id: string;
  title?: string;
  description?: string;
  intro?: PortableTextBlock[];
  content?: PortableTextBlock[];
  image?: ImageWithAlt;
  teamMembers?: TeamMember[];
  categories?: ServiceCategory[];
  featuredServices?: Service[];
  cta?: Cta;
  seo?: Seo;
};

export type Navigation = {
  _id: "navigation";
  mainItems?: Cta[];
  primaryCta?: Cta;
  visible?: boolean;
  ariaLabel?: string;
};

export type Footer = {
  _id: "footer";
  columns?: Array<{ title?: string; links?: Cta[]; visible?: boolean }>;
  showSocialLinks?: boolean;
  socialPlacement?: "top" | "bottom" | "inline";
  legalLinks?: Cta[];
};

export type ServiceCategory = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  content?: PortableTextBlock[];
  image?: ImageWithAlt;
  seo?: Seo;
  order?: number;
};

export type Service = {
  _id: string;
  name: string;
  slug?: string;
  category?: { _id: string; name?: string; slug?: string };
  shortDescription?: string;
  mainContent?: PortableTextBlock[];
  duration?: { cabinetMinutes?: number; recommendedMinutes?: number };
  price?: {
    amount?: number;
    currency?: string;
    label?: string;
    fromPrice?: boolean;
  };
  showPrice?: boolean;
  modality?: "individual" | "shared";
  maxPeople?: number;
  coordinateByWhatsapp?: boolean;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  mainImage?: ImageWithAlt;
  featured?: boolean;
  order?: number;
  landingEnabled?: boolean;
  seo?: Seo;
};

export type Promotion = {
  _id: string;
  title: string;
  description?: string;
  image?: ImageWithAlt;
  startsAt?: string;
  endsAt?: string;
  active?: boolean;
  conditions?: PortableTextBlock[];
  benefit?: string;
  cta?: Cta;
  featured?: boolean;
  order?: number;
};

export type GiftCard = {
  _id: string;
  name: string;
  slug?: string;
  kind?: "service" | "experience" | "openAmount";
  relatedService?: { _id: string; name?: string; slug?: string };
  shortDescription: string;
  content?: PortableTextBlock[];
  image?: ImageWithAlt;
  price?: {
    amount?: number;
    currency?: string;
    label?: string;
    fromPrice?: boolean;
  };
  showPrice?: boolean;
  modality?: "individual" | "shared";
  people?: number;
  deliveryFormat?: "digital" | "physical" | "both";
  coordinateByWhatsapp?: boolean;
  cta?: Cta;
  featured?: boolean;
  order?: number;
};

export type CorporateExperience = {
  _id: string;
  name: string;
  description: string;
  content?: PortableTextBlock[];
  image?: ImageWithAlt;
  benefits?: PortableTextBlock[];
  minPeople?: number;
  maxPeople?: number;
  modality?: "individual" | "shared";
  priceOrBudget?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  featured?: boolean;
  order?: number;
  seo?: Seo;
};

export type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  shortBio?: string;
  biography?: PortableTextBlock[];
  training?: PortableTextBlock[];
  specialties?: string[];
  photo?: ImageWithAlt;
  order?: number;
  featured?: boolean;
  isFounder?: boolean;
  isDirector?: boolean;
};

export type Testimonial = {
  _id: string;
  publicName: string;
  initials?: string;
  text: string;
  source?: string;
  originalUrl?: string;
  date?: string;
  featured?: boolean;
  order?: number;
};

export type Faq = {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  order?: number;
  relatedService?: { _id: string; name?: string; slug?: string };
};

export type SingletonResult =
  SiteSettings | HomePage | ContentPage | Navigation | Footer | null;
