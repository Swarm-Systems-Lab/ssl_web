export type ContentKind = "news" | "research" | "team";

export type ContentItem = {
  slug: string;
  title: string;
  date?: string;
  role?: string;
  summary: string;
  body: string;
  tags: string[];
  image?: string;
};

const sources = {
  news: import.meta.glob("../content/news/*.md", { eager: true, query: "?raw", import: "default" }),
  research: import.meta.glob("../content/research/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  }),
  team: import.meta.glob("../content/team/*.md", { eager: true, query: "?raw", import: "default" }),
};

function parseFrontmatter(raw: string, path: string): ContentItem {
  const [, frontmatter = "", body = ""] = raw.split(/^---\s*$/m);
  const fields = Object.fromEntries(
    frontmatter
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        return [
          line.slice(0, separator).trim(),
          line
            .slice(separator + 1)
            .trim()
            .replace(/^['"]|['"]$/g, ""),
        ];
      }),
  );
  const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "entry";

  return {
    slug,
    title: fields.title ?? slug,
    date: fields.date,
    role: fields.role,
    summary: fields.summary ?? "",
    body: body.trim(),
    tags:
      fields.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) ?? [],
    image: fields.image,
  };
}

export function getContent(kind: ContentKind): ContentItem[] {
  return Object.entries(sources[kind])
    .map(([path, raw]) => parseFrontmatter(raw as string, path))
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function getContentItem(kind: ContentKind, slug: string) {
  return getContent(kind).find((item) => item.slug === slug);
}
