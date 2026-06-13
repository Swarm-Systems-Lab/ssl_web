import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";
import { MediaReel, type MediaItem } from "@/components/media-reel";
import media1 from "@/assets/media-1.jpg";
import media2 from "@/assets/media-2.jpg";
import media3 from "@/assets/media-3.jpg";
import noteHardware from "@/assets/note-hardware.jpg";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — Swarm Systems Lab" },
      { name: "description", content: "Announcements, awards, grants, and milestones from the Swarm Systems Lab." },
      { property: "og:title", content: "News — Swarm Systems Lab" },
      { property: "og:description", content: "Announcements, awards, and milestones from the lab." },
    ],
  }),
  component: NewsPage,
});

type NewsItem = {
  date: string;
  tag: string;
  title: string;
  body: string;
  media?: MediaItem[];
};

const news: NewsItem[] = [
  {
    date: "2024.05.02",
    tag: "Grant",
    title: "NSF awards $2.4M for Subterranean Swarm Research",
    body: "The lab will lead a five-year program developing autonomous swarms for search-and-rescue in unstructured underground environments.",
    media: [
      { kind: "image", src: media3, alt: "Subterranean test prototype" },
      { kind: "youtube", id: "dQw4w9WgXcQ", title: "Project overview" },
    ],
  },
  {
    date: "2024.04.18",
    tag: "Award",
    title: "Best Paper at IEEE ICRA 2024",
    body: "Our work on adaptive swarm morphologies via graph neural networks received the conference's best paper award.",
    media: [{ kind: "image", src: media2, alt: "ICRA 2024 presentation" }],
  },
  {
    date: "2024.04.03",
    tag: "Talk",
    title: "Keynote at the International Symposium on Distributed Robotics",
    body: "Dr. Elena Vance delivered the opening keynote on the future of decentralized coordination.",
    media: [
      { kind: "image", src: media1, alt: "Keynote stage" },
      { kind: "youtube", id: "dQw4w9WgXcQ", title: "Full keynote recording" },
    ],
  },
  {
    date: "2024.03.14",
    tag: "Hire",
    title: "Welcome to Dr. Ami Nakamura",
    body: "Ami joins us as a postdoctoral researcher working on bio-inspired swarm dynamics.",
  },
  {
    date: "2024.02.20",
    tag: "Media",
    title: "Featured in BBC Sci-Tech Podcast",
    body: "An hour-long conversation on collective intelligence and the engineering of emergence.",
    media: [{ kind: "youtube", id: "dQw4w9WgXcQ", title: "BBC Sci-Tech segment" }],
  },
  {
    date: "2024.01.10",
    tag: "Release",
    title: "Open-sourcing the SSL-Sim swarm simulator",
    body: "Our differentiable multi-agent simulator is now publicly available on GitHub.",
    media: [
      { kind: "image", src: noteHardware, alt: "Simulator screenshot" },
      { kind: "image", src: media2, alt: "Sim review session" },
    ],
  },
];

function NewsPage() {
  return (
    <>
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="News Reel"
          title={<>SIGNAL <span className="text-muted">STREAM.</span></>}
          description="Announcements, awards, grants, and milestones from across the lab."
        />
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="border-t border-border">
          {news.map((item, idx) => (
            <article key={idx} className="grid md:grid-cols-12 gap-6 py-10 border-b border-border group hover:bg-surface/30 transition-colors px-2 -mx-2">
              <div className="md:col-span-3 flex md:flex-col gap-3 md:gap-2">
                <div className="font-display text-[10px] text-muted tracking-widest">{item.date}</div>
                <div className="font-display text-[10px] text-accent uppercase tracking-widest border border-accent/30 px-2 py-0.5 self-start">{item.tag}</div>
              </div>
              <div className={item.media && item.media.length > 0 ? "md:col-span-5" : "md:col-span-9"}>
                <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-3 group-hover:text-accent transition-colors">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">{item.body}</p>
              </div>
              {item.media && item.media.length > 0 && (
                <div className="md:col-span-4">
                  <MediaReel items={item.media} grayscale />
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
