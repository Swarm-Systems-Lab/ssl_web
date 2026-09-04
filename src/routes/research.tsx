import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";
import { getContent } from "@/lib/content";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research — Swarm Systems Lab" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const entries = getContent("research");

  return (
    <>
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Research"
          title={
            <>
              RESEARCH <span className="text-muted">AREAS.</span>
            </>
          }
          description="The questions and systems that guide our work."
        />
      </section>
      <section className="px-6 pb-24 max-w-4xl mx-auto space-y-1">
        {entries.map((item) => (
          <article
            key={item.slug}
            className="border border-border p-8 hover:border-accent/50 transition-colors"
          >
            <div className="font-display text-[10px] text-accent uppercase tracking-widest mb-3">
              {item.role}
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">
              <Link
                to="/research/$slug"
                params={{ slug: item.slug }}
                className="hover:text-accent transition-colors"
              >
                {item.title}
              </Link>
            </h2>
            <p className="text-muted-foreground leading-relaxed">{item.summary}</p>
          </article>
        ))}
      </section>
    </>
  );
}
