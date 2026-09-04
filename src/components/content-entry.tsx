import type { ContentItem } from "@/lib/content";

export function ContentEntry({ item }: { item: ContentItem }) {
  return (
    <article className="max-w-3xl">
      <div className="font-display text-[10px] uppercase tracking-widest text-accent mb-4">
        {item.date ?? item.role ?? "Swarm Systems Lab"}
      </div>
      <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-balance">
        {item.title}
      </h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{item.summary}</p>
      {item.tags.length > 0 && (
        <div className="mt-6 text-xs font-display tracking-widest text-accent">
          {item.tags.join(" / ")}
        </div>
      )}
      <div className="mt-12 space-y-5 text-muted-foreground leading-relaxed">
        {item.body
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
      </div>
    </article>
  );
}
