import type { PortableTextBlock } from "./sanity/types";

type FaqInlineSegment = { text: string; bold: boolean };

const blockText = (block: PortableTextBlock) =>
  block.children?.map((child) => child.text || "").join("") || "";

export function faqAnswerParagraphs(blocks: PortableTextBlock[] | undefined): string[] {
  const source = (blocks || [])
    .map(blockText)
    .join("\n\n")
    .replace(/\r/g, "")
    .trim();

  return source
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^[-*]\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

export function faqInlineSegments(text: string): FaqInlineSegment[] {
  const segments: FaqInlineSegment[] = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index), bold: false });
    segments.push({ text: match[1] || "", bold: true });
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor), bold: false });
  return segments.length ? segments : [{ text, bold: false }];
}

export function faqAnswerText(blocks: PortableTextBlock[] | undefined): string {
  return faqAnswerParagraphs(blocks)
    .map((paragraph) => paragraph.replace(/\*\*(.+?)\*\*/g, "$1"))
    .join(" ");
}
