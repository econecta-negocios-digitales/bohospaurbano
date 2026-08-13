import { createClient, type ClientPerspective, type SanityClient } from "@sanity/client";

import { sanityEnv } from "./env";

const studioUrl = import.meta.env.SANITY_STUDIO_URL ?? "http://localhost:3333";

type SanityClientOptions = {
  perspective: ClientPerspective;
  token?: string;
  stega?: boolean;
};

export const createSanityClient = ({
  perspective,
  token,
  stega = false,
}: SanityClientOptions): SanityClient =>
  createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    perspective,
    token,
    useCdn: false,
    withCredentials: false,
    stega: stega ? { enabled: true, studioUrl } : false,
  });

export const sanityClient = createSanityClient({
  perspective: sanityEnv.perspective,
  token: sanityEnv.token,
});

const parsePerspective = (value?: string): ClientPerspective => {
  if (!value) return "drafts";
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value));
    return Array.isArray(parsed) ? parsed as ClientPerspective : "drafts";
  } catch {
    return value === "published" ? "published" : "drafts";
  }
};

export const createPreviewSanityClient = (
  token: string,
  perspectiveCookie?: string,
): SanityClient =>
  createSanityClient({
    perspective: parsePerspective(perspectiveCookie),
    token,
    stega: true,
  });
