import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentEntry } from "@/components/content-entry";
import { getContentItem } from "@/lib/content";

export const Route = createFileRoute("/news/$slug")({ component: NewsEntryPage });

function NewsEntryPage() {
  const item = getContentItem("news", Route.useParams().slug);
  return (
    <EntryLayout backLabel="All news" backTo="/news">
      {item ? <ContentEntry item={item} /> : <p>Entry not found.</p>}
    </EntryLayout>
  );
}

function EntryLayout({
  children,
  backLabel,
  backTo,
}: {
  children: React.ReactNode;
  backLabel: string;
  backTo: "/news" | "/research" | "/team";
}) {
  return (
    <section className="px-6 pt-24 pb-24 max-w-7xl mx-auto">
      <Link to={backTo} className="font-display text-[10px] uppercase tracking-widest text-accent">
        ← {backLabel}
      </Link>
      <div className="mt-12">{children}</div>
    </section>
  );
}
