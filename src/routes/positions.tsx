import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";

export const Route = createFileRoute("/positions")({
  head: () => ({
    meta: [
      { title: "Open Positions — Swarm Systems Lab" },
      { name: "description", content: "Open PhD, postdoctoral, and engineering positions at the Swarm Systems Lab." },
      { property: "og:title", content: "Open Positions — Swarm Systems Lab" },
      { property: "og:description", content: "Join our lab — open PhD, postdoc, and research positions." },
    ],
  }),
  component: PositionsPage,
});

const positions = [
  { type: "PhD", title: "Multi-Agent Reinforcement Learning", deadline: "Jan 15, 2025", commit: "4 years • Fully funded", desc: "Develop scalable learning algorithms for large heterogeneous swarms operating in unstructured environments." },
  { type: "Postdoc", title: "Bio-inspired Swarm Dynamics", deadline: "Rolling", commit: "2 years • Full-time", desc: "Bridge biology and robotics: model and replicate collective behavior observed in social insects and fish schools." },
  { type: "Engineer", title: "Embedded Hardware Specialist", deadline: "Feb 28, 2025", commit: "Full-time • On-site", desc: "Design and prototype next-generation micro-robot platforms and their firmware." },
  { type: "Intern", title: "Summer Research Internship 2025", deadline: "Mar 1, 2025", commit: "12 weeks • Paid", desc: "Hands-on swarm experiments alongside PhDs and postdocs. Open to advanced undergraduate and master's students." },
];

function PositionsPage() {
  return (
    <>
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Now Recruiting"
          title={<>JOIN THE <span className="text-muted">SWARM.</span></>}
          description="We seek exceptional researchers and engineers with strong backgrounds in control theory, machine learning, and hardware prototyping."
        />
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-1">
          {positions.map((p) => (
            <article key={p.title} className="bg-surface/40 border border-border p-8 hover:border-accent/50 hover:bg-surface transition-colors group flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="font-display text-[10px] text-accent uppercase tracking-widest border border-accent/30 px-2 py-1">{p.type}</div>
                <div className="font-display text-[10px] text-muted uppercase tracking-widest">Deadline: {p.deadline}</div>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight mb-4 group-hover:text-accent transition-colors">{p.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{p.desc}</p>
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <span className="font-display text-[11px] text-muted tracking-wider">{p.commit}</span>
                <a href="mailto:apply@swarmsystemslab.example" className="font-display text-[10px] uppercase tracking-widest text-accent border-b border-accent/30 pb-0.5 hover:border-accent">
                  Apply →
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 border border-border bg-surface/30 p-10 text-center">
          <div className="font-display text-[10px] text-muted uppercase tracking-widest mb-3">General Inquiries</div>
          <h3 className="font-display text-2xl font-bold mb-4">Don't see your role?</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            We always welcome speculative applications from candidates whose research aligns with our mission.
          </p>
          <a href="mailto:hello@swarmsystemslab.example" className="inline-block font-display text-xs uppercase tracking-widest px-5 py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
            Get in touch →
          </a>
        </div>
      </section>
    </>
  );
}
