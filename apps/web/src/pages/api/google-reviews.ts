import type { APIRoute } from "astro";

export const prerender = false;

const PLACE_ID = import.meta.env.GOOGLE_PLACE_ID;
const API_KEY = import.meta.env.GOOGLE_PLACES_API_KEY;
const FIELD_MASK = "rating,userRatingCount,reviews,googleMapsUri,googleMapsLinks,attributions";

type PlacesAttribution = { displayName?: string; uri?: string };

export const GET: APIRoute = async () => {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (!PLACE_ID || !API_KEY) return new Response(null, { status: 204, headers });

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}?languageCode=es`,
      {
        headers: {
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        cache: "no-store",
      },
    );
    if (!response.ok) return new Response(null, { status: 204, headers });

    const place = await response.json();
    const reviews = Array.isArray(place.reviews)
      ? place.reviews.slice(0, 5).map((review: Record<string, unknown>) => {
          const author = (review.authorAttribution || {}) as Record<string, string | undefined>;
          const originalText = (review.originalText as { text?: string } | undefined)?.text;
          const translatedText = (review.text as { text?: string } | undefined)?.text;
          return {
            authorName: author.displayName,
            authorUri: author.uri,
            authorPhotoUri: author.photoUri,
            rating: typeof review.rating === "number" ? review.rating : undefined,
            text: originalText || translatedText,
            relativeDate: review.relativePublishTimeDescription,
            reviewUri: review.googleMapsUri,
            flagContentUri: review.flagContentUri,
          };
        })
      : [];
    if (!reviews.length) return new Response(null, { status: 204, headers });

    const mapsLinks = (place.googleMapsLinks || {}) as { reviewsUri?: string };
    const attributions = Array.isArray(place.attributions)
      ? place.attributions.map((attribution: PlacesAttribution) => ({
          displayName: attribution.displayName,
          uri: attribution.uri,
        }))
      : [];
    return new Response(JSON.stringify({
      rating: place.rating,
      userRatingCount: place.userRatingCount,
      googleMapsUri: place.googleMapsUri,
      reviewsUri: mapsLinks.reviewsUri,
      attributions,
      reviews,
    }), { status: 200, headers: new Headers({ ...Object.fromEntries(headers), "Content-Type": "application/json" }) });
  } catch {
    return new Response(null, { status: 204, headers });
  }
};
