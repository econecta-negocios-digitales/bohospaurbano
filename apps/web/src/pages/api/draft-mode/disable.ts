import type { APIRoute } from "astro";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";

export const prerender = false;

export const GET: APIRoute = ({ cookies, redirect }) => {
  cookies.delete(perspectiveCookieName, { path: "/" });
  cookies.delete(perspectiveCookieName, { path: "/", partitioned: true });
  return redirect("/", 307);
};
