import type { APIRoute } from "astro";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";
import { sanityClient } from "sanity:client";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const token = import.meta.env.SANITY_API_READ_TOKEN ?? import.meta.env.SANITY_AUTH_TOKEN;
  if (!token) return new Response("Preview server is not configured", { status: 500 });

  const client = sanityClient.withConfig({ token });
  const { isValid, redirectTo = "/preview/", studioPreviewPerspective } =
    await validatePreviewUrl(client, request.url);
  if (!isValid) return new Response("Invalid preview secret", { status: 401 });

  const partitioned =
    request.headers.get("sec-fetch-dest") === "iframe" &&
    request.headers.get("sec-fetch-site") === "cross-site";
  cookies.set(perspectiveCookieName, studioPreviewPerspective ?? "drafts", {
    httpOnly: false,
    sameSite: "none",
    secure: true,
    path: "/",
    partitioned,
  });
  return redirect(redirectTo, 307);
};
