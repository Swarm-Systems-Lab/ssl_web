import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentEntry } from "@/components/content-entry";
import { getContentItem } from "@/lib/content";

export const Route = createFileRoute("/research/$slug")({ component: ResearchEntryPage });

function ResearchEntryPage() {
  const item = getContentItem("research", Route.useParams().slug);
  return (
    <section className="px-6 pt-24 pb-24 max-w-7xl mx-auto">
      <Link
        to="/research"
        className="font-display text-[10px] uppercase tracking-widest text-accent"
      >
        ← All research
      </Link>
      <div className="mt-12">{item ? <ContentEntry item={item} /> : <p>Entry not found.</p>}</div>
    </section>
  );
}
