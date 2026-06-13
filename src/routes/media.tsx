import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";
import media1 from "@/assets/media-1.jpg";
import media2 from "@/assets/media-2.jpg";
import media3 from "@/assets/media-3.jpg";
import media4 from "@/assets/media-4.jpg";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media — Swarm Systems Lab" },
      { name: "description", content: "Photos and videos from the Swarm Systems Lab — field tests, prototypes, and team moments." },
      { property: "og:title", content: "Media — Swarm Systems Lab" },
      { property: "og:description", content: "Photos and videos from the lab." },
    ],
  }),
  component: MediaPage,
});

const photos = [
  { src: media1, caption: "Indoor swarm test — drone formation, May 2024" },
  { src: media2, caption: "Simulation review session with the control team" },
  { src: media3, caption: "Hexapod prototype on the workbench" },
  { src: media4, caption: "Forest field test, dusk deployment" },
];

const videos = [
  { id: "dQw4w9WgXcQ", title: "100-Drone Choreography — Full Run" },
  { id: "dQw4w9WgXcQ", title: "Subterranean Navigation — Field Test 04" },
  { id: "dQw4w9WgXcQ", title: "Decentralized Task Allocation — Sim Walkthrough" },
];

function MediaPage() {
  return (
    <>
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Photo & Video"
          title={<>MEDIA <span className="text-muted">FEED.</span></>}
          description="Field tests, prototypes, and life around the lab. Videos hosted on YouTube."
        />
      </section>

      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-10">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="size-1.5 bg-accent rounded-full" />
            Videos
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid md:grid-cols-3 gap-1">
          {videos.map((v, i) => (
            <article key={i} className="bg-surface border border-border hover:border-accent/50 transition-colors group">
              <div className="aspect-video bg-black border-b border-border overflow-hidden">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-5">
                <div className="font-display text-[10px] text-muted tracking-widest mb-2">VIDEO_{String(i + 1).padStart(3, "0")}</div>
                <h3 className="font-display text-sm font-bold group-hover:text-accent transition-colors">{v.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-10">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="size-1.5 bg-accent rounded-full" />
            Photos
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid md:grid-cols-2 gap-1">
          {photos.map((p, i) => (
            <figure key={i} className="group bg-surface border border-border overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.src} alt={p.caption} loading="lazy" width={1024} height={768} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <figcaption className="p-4 border-t border-border flex items-center justify-between">
                <span className="font-display text-[10px] text-muted tracking-widest">IMG_{String(i + 1).padStart(3, "0")}</span>
                <span className="text-sm text-foreground">{p.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
