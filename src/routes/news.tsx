import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";
import { getContent } from "@/lib/content";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "News — Swarm Systems Lab" }] }),
  component: NewsPage,
});

function NewsPage() {
  const news = getContent("news");

  return (
    <>
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="News"
          title={
            <>
              LAB <span className="text-muted">NEWS.</span>
            </>
          }
          description="Announcements and updates from the Swarm Systems Lab."
        />
      </section>
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="border-t border-border">
          {news.map((item) => (
            <article key={item.slug} className="py-10 border-b border-border">
              <div className="font-display text-[10px] text-accent tracking-widest mb-3">
                {item.date}
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight mb-3">
                <Link
                  to="/news/$slug"
                  params={{ slug: item.slug }}
                  className="hover:text-accent transition-colors"
                >
                  {item.title}
                </Link>
              </h2>
              <p className="text-muted-foreground leading-relaxed">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
