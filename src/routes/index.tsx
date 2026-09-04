import { createFileRoute, Link } from "@tanstack/react-router";
import groupPhoto from "@/assets/group-photo.jpg";
import notePaths from "@/assets/note-paths.jpg";
import noteHardware from "@/assets/note-hardware.jpg";
import noteCluster from "@/assets/note-cluster.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swarm Systems Lab — Emergent Coordination Research" },
      {
        name: "description",
        content:
          "We investigate the mathematical principles of collective intelligence and deploy swarm robotics systems that adapt to unpredictable environments.",
      },
      { property: "og:title", content: "Swarm Systems Lab" },
      {
        property: "og:description",
        content: "Research on emergent coordination, decentralized control, and swarm robotics.",
      },
    ],
  }),
  component: Dashboard,
});

const research = [
  {
    img: notePaths,
    ts: "2024.05.12_14:22",
    title: "Multi-Agent Pathfinding in Dense Obstacle Fields",
    body: "Reduced inter-agent collision rates by 14% using dynamic field potential adjustments.",
    tags: "#ALGORITHMS #SWARM",
  },
  {
    img: noteHardware,
    ts: "2024.05.08_09:10",
    title: "Sub-10g Micro-Propulsion Prototype",
    body: "Testing the boundaries of miniaturization with bio-inspired actuation drives.",
    tags: "#HARDWARE #MICRO-ROBOTICS",
  },
  {
    img: noteCluster,
    ts: "2024.04.29_23:00",
    title: "Decentralized Task Allocation Benchmarks",
    body: "New results on fault-tolerant leadership election in 1000+ agent systems.",
    tags: "#CONTROL #THEORY",
  },
];

const news = [
  { date: "MAY 02", tag: "Grant", title: "NSF awards $2.4M for Subterranean Swarm Research." },
  {
    date: "APR 18",
    tag: "Award",
    title: "Best Paper Award — IEEE ICRA 2024 for adaptive morphologies.",
  },
  {
    date: "APR 03",
    tag: "Talk",
    title: "Keynote at the International Symposium on Distributed Robotics.",
  },
];

function Dashboard() {
  return (
    <>
      <section className="px-6 pt-24 pb-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <div className="font-display text-accent text-xs mb-4 flex items-center gap-2 uppercase tracking-widest">
              <span className="opacity-50">[00]</span>
              <span className="animate-[reveal-box_1s_var(--ease-out-expo)]">
                Emergent Coordination Lab
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[0.9] tracking-tighter text-balance mb-8">
              SELF-ORGANIZING <br />
              <span className="text-muted">AUTONOMY.</span>
            </h1>
            <p className="max-w-md text-muted-foreground leading-relaxed text-pretty">
              We investigate the mathematical principles of collective intelligence and deploy swarm
              robotics systems that adapt to unpredictable environments.
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link
                to="/publications"
                className="font-display text-xs uppercase tracking-widest px-4 py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
              >
                Read Publications →
              </Link>
              <Link
                to="/positions"
                className="font-display text-xs uppercase tracking-widest px-4 py-3 border border-border hover:border-accent/50 hover:text-accent transition-colors"
              >
                Open Positions
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative group overflow-hidden border border-border bg-surface">
              <img
                src={groupPhoto}
                alt="Swarm Systems Lab research team in the robotics laboratory"
                width={1280}
                height={896}
                className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 w-full p-4 bg-background/90 border-t border-border flex justify-between items-center">
                <span className="font-display text-[10px] text-accent uppercase tracking-widest">
                  SSL Research Team 2024
                </span>
                <span className="font-display text-[10px] text-muted uppercase tracking-widest">
                  [14 Members]
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-xs uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="size-1.5 bg-accent rounded-full" />
              Research Notes / Live Stream
            </h2>
            <div className="h-px flex-1 bg-border mx-8" />
            <Link
              to="/research"
              className="font-display text-[10px] uppercase text-muted hover:text-accent tracking-widest"
            >
              View All Log Entries
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-1">
            {research.map((n) => (
              <article
                key={n.title}
                className="group bg-background border border-border p-6 hover:border-accent/50 transition-colors"
              >
                <div className="font-display text-[9px] text-muted mb-4 tracking-widest">
                  TIMESTAMP: {n.ts}
                </div>
                <div className="w-full aspect-video bg-surface mb-6 overflow-hidden">
                  <img
                    src={n.img}
                    alt={n.title}
                    loading="lazy"
                    width={800}
                    height={512}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <h3 className="font-display text-sm font-bold mb-2">{n.title}</h3>
                <p className="text-sm text-muted-foreground leading-snug mb-4">{n.body}</p>
                <div className="text-accent text-[10px] font-display tracking-widest">{n.tags}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="size-1.5 bg-accent rounded-full" />
              <h2 className="font-display text-xs uppercase tracking-[0.2em]">News Reel</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
              Announcements, awards, and milestones from across the lab.
            </p>
            <Link
              to="/news"
              className="font-display text-xs uppercase tracking-widest text-accent border-b border-accent/30 pb-1 hover:border-accent"
            >
              Read all news →
            </Link>
          </div>
          <div className="lg:col-span-7 space-y-1">
            {news.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[80px_80px_1fr] gap-6 items-baseline py-5 border-b border-border last:border-0"
              >
                <span className="font-display text-[10px] text-muted tracking-widest">
                  {item.date}
                </span>
                <span className="font-display text-[10px] text-accent tracking-widest uppercase">
                  {item.tag}
                </span>
                <p className="text-sm md:text-base text-foreground">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
