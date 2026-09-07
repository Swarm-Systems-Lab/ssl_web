/**
 * A very small Markdown renderer for single-line text held in YAML.
 *
 * YAML has no way to mark up a link, so fields such as an intro paragraph or a
 * position summary accept the familiar `[label](https://…)` and `**bold**`.
 * Only inline marks are supported - anything needing paragraphs, lists, or
 * headings belongs in a Markdown file instead.
 */

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (char) => ESCAPES[char]!);
}

/** Only addresses a content file has any business linking to. */
function safeHref(href: string): string | undefined {
  return /^(https?:\/\/|mailto:|\/|#)/.test(href) ? href : undefined;
}

export function inlineMarkdown(text: string): string {
  let html = escapeHtml(text);

  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label: string, href: string) => {
    const target = safeHref(href);
    if (!target) return whole;
    const external = target.startsWith("http");
    const attrs = external ? ' rel="noopener"' : "";
    return `<a href="${target}"${attrs}>${label}</a>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  return html;
}
