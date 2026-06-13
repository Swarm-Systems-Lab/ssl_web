import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Swarm Systems Lab" },
      { name: "description", content: "Meet the principal investigator, researchers, students, and visiting scholars of the Swarm Systems Lab." },
      { property: "og:title", content: "Team — Swarm Systems Lab" },
      { property: "og:description", content: "Researchers, students, and visiting scholars of the Swarm Systems Lab." },
    ],
  }),
  component: TeamPage,
});

const members = [
  { name: "Dr. Elena Vance", role: "Principal Investigator", focus: "Distributed control & collective intelligence", initials: "EV" },
  { name: "Marcus Thorne", role: "Senior Research Scientist", focus: "Multi-agent reinforcement learning", initials: "MT" },
  { name: "Dr. Ami Nakamura", role: "Postdoctoral Researcher", focus: "Bio-inspired swarm dynamics", initials: "AN" },
  { name: "Sarah Chen", role: "PhD Candidate", focus: "Graph neural networks for swarm control", initials: "SC" },
  { name: "Javier Mendez", role: "PhD Candidate", focus: "Decentralized hardware platforms", initials: "JM" },
  { name: "Isaac Watts", role: "PhD Candidate", focus: "Stability analysis & formation control", initials: "IW" },
  { name: "Priya Rao", role: "MSc Researcher", focus: "Aerial swarm path planning", initials: "PR" },
  { name: "Tomáš Kovac", role: "Research Engineer", focus: "Embedded systems & firmware", initials: "TK" },
];

const visitors = [
  { name: "Prof. Hannah Miller", from: "ETH Zürich", period: "Spring 2024", note: "Joint work on robust consensus protocols." },
  { name: "Dr. Rafael Ortiz", from: "MIT CSAIL", period: "Winter 2023", note: "Collaboration on heterogeneous agent learning." },
  { name: "Yuki Tanaka", from: "U. Tokyo", period: "Summer 2024", note: "Visiting scholar — bio-swarm modeling." },
];

function TeamPage() {
  return (
    <>
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="The Collective"
          title={<>THE <span className="text-muted">TEAM.</span></>}
          description="A multidisciplinary unit of roboticists, control theorists, and machine learning researchers."
        />
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="size-1.5 bg-accent rounded-full" />
            Core Members
          </h2>
          <div className="h-px flex-1 bg-border" />
          <span className="font-display text-[10px] text-muted tracking-widest">[{members.length}]</span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {members.map((m, idx) => (
            <article key={m.name} className="group bg-surface/40 border border-border p-6 hover:border-accent/50 hover:bg-surface transition-colors">
              <div className="aspect-[4/5] bg-surface-2 border border-border mb-5 relative overflow-hidden">
                <div className="absolute inset-0 grid place-items-center font-display text-5xl font-bold text-muted/40 group-hover:text-accent/60 transition-colors">
                  {m.initials}
                </div>
                <div className="absolute top-3 left-3 font-display text-[9px] text-muted tracking-widest">
                  ID_{String(idx + 1).padStart(3, "0")}
                </div>
              </div>
              <div className="font-display text-[10px] text-accent uppercase tracking-widest mb-1">{m.role}</div>
              <h3 className="font-display text-base font-bold mb-2">{m.name}</h3>
              <p className="text-xs text-muted-foreground leading-snug">{m.focus}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="size-1.5 bg-accent rounded-full" />
            Visiting Scholars & Collaborators
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid md:grid-cols-3 gap-1">
          {visitors.map((v) => (
            <article key={v.name} className="bg-surface/40 border border-border p-6 hover:border-accent/50 transition-colors">
              <div className="aspect-video bg-surface-2 border border-border mb-5 grid place-items-center font-display text-[10px] text-muted tracking-widest">
                PHOTO / GROUP_VISIT
              </div>
              <div className="font-display text-[10px] text-accent uppercase tracking-widest mb-2">{v.period}</div>
              <h3 className="font-display text-base font-bold mb-1">{v.name}</h3>
              <div className="font-display text-[11px] text-muted tracking-wider mb-3">{v.from}</div>
              <p className="text-xs text-muted-foreground leading-snug">{v.note}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
