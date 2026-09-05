/**
 * Builds the one-line summary shown in listings from the text of a post,
 * for posts that do not spell one out in their frontmatter.
 *
 * It is deliberately blunt: strip the Markdown, take whole sentences until the
 * limit, and fall back to a word boundary. Anything that needs to read better
 * than that deserves a hand-written `summary:`.
 */

const MAX = 220;

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function summarise(markdown: string, max: number = MAX): string {
  const text = stripMarkdown(markdown);
  if (text.length <= max) return text;

  // Prefer ending on a full sentence, as long as that keeps most of the room.
  const window = text.slice(0, max + 1);
  const lastStop = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("! "),
    window.lastIndexOf("? "),
  );
  if (lastStop > max * 0.6) return window.slice(0, lastStop + 1).trim();

  return `${window
    .slice(0, max)
    .replace(/\s+\S*$/, "")
    .replace(/[,;:.\s]+$/, "")}…`;
}
