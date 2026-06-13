import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";
import { MediaReel, type MediaItem } from "@/components/media-reel";
import notePaths from "@/assets/note-paths.jpg";
import noteHardware from "@/assets/note-hardware.jpg";
import noteCluster from "@/assets/note-cluster.jpg";
import media1 from "@/assets/media-1.jpg";
import media4 from "@/assets/media-4.jpg";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Research Notes — Swarm Systems Lab" },
      { name: "description", content: "Preliminary results, raw data, and live experiments from the bench." },
      { property: "og:title", content: "Research Notes — Swarm Systems Lab" },
      { property: "og:description", content: "Preliminary results and live experiments from the lab." },
    ],
  }),
  component: NotesPage,
});

type Note = {
  ts: string;
  title: string;
  body: string;
  tags: string;
  media?: MediaItem[];
  author: string;
};

const notes: Note[] = [
  {
    ts: "2024.05.12_14:22",
    title: "Multi-Agent Pathfinding in Dense Obstacle Fields",
    body: "We tested a new dynamic-field potential method on a 64-agent simulation with randomly placed obstacles at 35% density. Inter-agent collision rates dropped 14% versus our previous baseline. Edge case: when obstacle density exceeds 50%, agents form transient deadlocks that resolve within ~3s — investigating whether explicit role assignment helps.",
    tags: "#ALGORITHMS #SWARM #PATHFINDING",
    media: [
      { kind: "image", src: notePaths, alt: "Pathfinding visualization" },
      { kind: "youtube", id: "dQw4w9WgXcQ", title: "Pathfinding sim walkthrough" },
      { kind: "image", src: noteCluster, alt: "Cluster behavior plot" },
    ],
    author: "S. Chen",
  },
  {
    ts: "2024.05.08_09:10",
    title: "Sub-10g Micro-Propulsion Prototype",
    body: "First successful tethered hover for our 8.4g actuator prototype. Battery life is still well below target (~22s) but thrust-to-weight is now positive across the full duty cycle. Next: integrate the new MEMS IMU and run an untethered test.",
    tags: "#HARDWARE #MICRO-ROBOTICS",
    media: [
      { kind: "image", src: noteHardware, alt: "Micro-propulsion prototype" },
      { kind: "youtube", id: "dQw4w9WgXcQ", title: "Tethered hover test" },
    ],
    author: "J. Mendez",
  },
  {
    ts: "2024.04.29_23:00",
    title: "Decentralized Task Allocation Benchmarks",
    body: "Fault-tolerant leader election holds up at 1024 agents with simulated 12% node failure rate. Convergence is roughly logarithmic in the number of agents. Plotting saturation curves now.",
    tags: "#CONTROL #THEORY",
    media: [{ kind: "image", src: noteCluster, alt: "Convergence plot" }],
    author: "I. Watts",
  },
  {
    ts: "2024.04.21_11:45",
    title: "Forest Field Test — Run 04",
    body: "Six ground rovers ran an autonomous waypoint sweep at dusk through mixed-density underbrush. Localization drift stayed under 0.6m over a 240m loop. Two rovers triggered emergency stops due to leaf-litter false positives in the obstacle classifier.",
    tags: "#FIELD-TEST #PERCEPTION",
    media: [
      { kind: "image", src: media4, alt: "Forest field test" },
      { kind: "image", src: media1, alt: "Rover perception view" },
      { kind: "youtube", id: "dQw4w9WgXcQ", title: "Field test 04 highlights" },
    ],
    author: "M. Thorne",
  },
  {
    ts: "2024.04.11_16:30",
    title: "Indoor Drone Choreography Stress Test",
    body: "100-drone indoor flight, formation transitions every 4s. No collisions. Packet loss spiked to 17% mid-run when we deliberately injected interference — recovery was clean within 1.2s. Video uploaded to the channel.",
    tags: "#AERIAL #FORMATION",
    media: [
      { kind: "youtube", id: "dQw4w9WgXcQ", title: "100-drone choreography full run" },
      { kind: "image", src: media1, alt: "Drone formation snapshot" },
    ],
    author: "T. Kovac",
  },
  {
    ts: "2024.04.02_19:18",
    title: "Pheromone-Inspired Marking — Failure Case",
    body: "Our virtual-pheromone trail scheme breaks down in regions of high environmental symmetry. Agents end up oscillating between equivalent waypoints. Drafting a tie-breaker rule based on local entropy.",
    tags: "#BIO-INSPIRED #NEGATIVE-RESULT",
    author: "A. Nakamura",
  },
];

function NotesPage() {
  return (
    <>
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="LAB_LOG"
          title={<>RESEARCH <span className="text-muted">NOTES.</span></>}
          description="Preliminary results, raw data, and live experiments from the bench. Updated as the work happens."
        />
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-10">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="size-1.5 bg-accent rounded-full animate-pulse" />
            Live Stream
          </h2>
          <div className="h-px flex-1 bg-border" />
          <span className="font-display text-[10px] text-muted tracking-widest">[{notes.length} ENTRIES]</span>
        </div>

        <div className="space-y-1">
          {notes.map((n, idx) => (
            <article key={idx} className="grid md:grid-cols-12 gap-6 bg-surface/30 border border-border p-6 hover:border-accent/50 hover:bg-surface/60 transition-colors group">
              <div className="md:col-span-2">
                <div className="font-display text-[9px] text-muted tracking-widest mb-2">TIMESTAMP</div>
                <div className="font-display text-xs text-foreground">{n.ts}</div>
                <div className="font-display text-[10px] text-accent mt-4 tracking-widest">{n.author}</div>
              </div>
              {n.media && n.media.length > 0 && (
                <div className="md:col-span-5">
                  <MediaReel items={n.media} grayscale />
                </div>
              )}
              <div className={n.media && n.media.length > 0 ? "md:col-span-5" : "md:col-span-10"}>
                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-accent transition-colors">{n.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{n.body}</p>
                <div className="text-accent text-[10px] font-display tracking-widest">{n.tags}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
