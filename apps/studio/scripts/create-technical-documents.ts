import { getCliClient } from "sanity/cli";

const documents = [
  ["siteSettings", "siteSettings"],
  ["homePage", "homePage"],
  ["aboutPage", "aboutPage"],
  ["servicesPage", "servicesPage"],
  ["giftCardsPage", "giftCardsPage"],
  ["corporatePage", "corporatePage"],
  ["contactPage", "contactPage"],
  ["faqPage", "faqPage"],
  ["navigation", "navigation"],
  ["footer", "footer"],
  ["giftCardPolicy", "giftCardPolicy"],
  ["legalPage.privacy", "legalPage"],
  ["legalPage.terms", "legalPage"],
  ["serviceCategory.experiencias-boho", "serviceCategory"],
  ["serviceCategory.masajes-bienestar", "serviceCategory"],
  ["serviceCategory.cuidado-facial-corporal", "serviceCategory"],
  ["serviceCategory.belleza-consciente", "serviceCategory"],
] as const;
const client = getCliClient({ apiVersion: "2024-01-01" });

async function main() {
  const ids = documents.map(([id]) => id);
  const existing = await client.fetch<Array<{ _id: string; _type: string }>>(
    "*[_id in $ids || _id in $draftIds]{_id, _type}",
    { ids, draftIds: ids.map((id) => `drafts.${id}`) },
  );
  const byId = new Map(existing.map((document) => [document._id, document]));
  const report = {
    created: [] as string[],
    draftExists: [] as string[],
    publishedExists: [] as string[],
    bothExist: [] as string[],
    typeConflict: [] as string[],
    error: [] as string[],
  };
  for (const [id, type] of documents) {
    const draftId = `drafts.${id}`;
    const draft = byId.get(draftId);
    const published = byId.get(id);
    if (
      (draft && draft._type !== type) ||
      (published && published._type !== type)
    ) {
      report.typeConflict.push(id);
      continue;
    }
    if (draft && published) {
      report.bothExist.push(id);
      continue;
    }
    if (draft) {
      report.draftExists.push(id);
      continue;
    }
    if (published) {
      report.publishedExists.push(id);
      continue;
    }
    try {
      await client.createIfNotExists({ _id: draftId, _type: type });
      report.created.push(draftId);
    } catch (error) {
      report.error.push(
        `${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  console.log(JSON.stringify(report, null, 2));
}

void main();
