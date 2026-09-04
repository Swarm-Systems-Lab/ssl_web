import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";

export const Route = createFileRoute("/publications")({
  head: () => ({
    meta: [
      { title: "Publications — Swarm Systems Lab" },
      {
        name: "description",
        content:
          "Peer-reviewed publications from the Swarm Systems Lab, featured in Science Robotics, IEEE TRO, ICRA, and more.",
      },
      { property: "og:title", content: "Publications — Swarm Systems Lab" },
      { property: "og:description", content: "Selected publications from the Swarm Systems Lab." },
    ],
  }),
  component: PublicationsPage,
});

type Pub = {
  authors: string;
  title: string;
  venue: string;
  year: number;
  links: { label: string; href: string }[];
};

const pubs: Pub[] = [
  {
    year: 2024,
    authors: "A. Chen, J. Smith, R. Miller, E. Vance",
    title: "Adaptive Swarm Morphologies via Graph Neural Networks",
    venue: "IEEE Transactions on Robotics",
    links: [
      { label: "PDF", href: "#" },
      { label: "BibTeX", href: "#" },
      { label: "Project", href: "#" },
    ],
  },
  {
    year: 2024,
    authors: "S. Kovac, T. Wang",
    title: "Kinetic Resilience in Large-Scale Drone Swarms",
    venue: "International Journal of Robotics Research",
    links: [
      { label: "PDF", href: "#" },
      { label: "BibTeX", href: "#" },
    ],
  },
  {
    year: 2024,
    authors: "J. Mendez, A. Nakamura",
    title: "Reactive Navigation in Unstructured Environments via Particle Swarm Optimization",
    venue: "IEEE ICRA 2024",
    links: [
      { label: "PDF", href: "#" },
      { label: "Video", href: "#" },
    ],
  },
  {
    year: 2023,
    authors: "E. Vance, I. Watts",
    title:
      "Stability Analysis of Decentralized Swarm Formations under Variable Communication Range",
    venue: "IEEE Transactions on Control of Network Systems",
    links: [
      { label: "PDF", href: "#" },
      { label: "BibTeX", href: "#" },
    ],
  },
  {
    year: 2023,
    authors: "S. Chen, E. Vance, et al.",
    title: "Bio-inspired Consensus Protocols for High-Density Micro-Swarms",
    venue: "Science Robotics",
    links: [
      { label: "Article", href: "#" },
      { label: "Code", href: "#" },
    ],
  },
  {
    year: 2023,
    authors: "M. Thorne, E. Vance",
    title: "Emergent Foraging Behavior in Decentralized Modular Systems",
    venue: "Nature Machine Intelligence",
    links: [{ label: "Article", href: "#" }],
  },
];

const grouped = pubs.reduce<Record<number, Pub[]>>((acc, p) => {
  (acc[p.year] ||= []).push(p);
  return acc;
}, {});
const years = Object.keys(grouped)
  .map(Number)
  .sort((a, b) => b - a);

function PublicationsPage() {
  return (
    <>
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Archive"
          title={
            <>
              PUBLI<span className="text-muted">CATIONS.</span>
            </>
          }
          description="Peer-reviewed work in Science Robotics, IEEE TRO, IJRR, ICRA, and more."
        />
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          <aside className="md:w-1/4">
            <div className="md:sticky md:top-24">
              <div className="font-display text-[10px] uppercase tracking-widest text-muted mb-4">
                Years
              </div>
              <div className="space-y-1">
                {years.map((y) => (
                  <a
                    key={y}
                    href={`#y-${y}`}
                    className="flex justify-between items-center py-2 border-b border-border text-sm font-display hover:text-accent transition-colors"
                  >
                    <span>{y}</span>
                    <span className="text-muted text-xs">
                      [{grouped[y].length.toString().padStart(2, "0")}]
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className="md:w-3/4 space-y-16">
            {years.map((year) => (
              <div key={year} id={`y-${year}`}>
                <div className="flex items-baseline gap-4 mb-8">
                  <h2 className="font-display text-4xl font-bold tracking-tighter">{year}</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-10">
                  {grouped[year].map((p, idx) => (
                    <article key={p.title} className="group grid grid-cols-[40px_1fr] gap-4">
                      <span className="font-display text-xs text-muted pt-1.5">
                        {String(idx + 1).padStart(2, "0")}/
                      </span>
                      <div>
                        <h3 className="text-lg font-display font-medium leading-snug group-hover:text-accent transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {p.authors} • <span className="text-foreground italic">{p.venue}</span>
                        </p>
                        <div className="mt-4 flex gap-4 text-[10px] font-display uppercase tracking-widest">
                          {p.links.map((l, i) => (
                            <a
                              key={l.label}
                              href={l.href}
                              className={
                                i === 0
                                  ? "text-accent border-b border-accent/30 pb-0.5"
                                  : "text-muted hover:text-foreground"
                              }
                            >
                              {l.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
