import { Link } from "@tanstack/react-router";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/news", label: "News" },
  { to: "/team", label: "Team" },
  { to: "/publications", label: "Publications" },
  { to: "/research", label: "Research" },
  { to: "/media", label: "Media" },
  { to: "/positions", label: "Positions" },
] as const;

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-display text-[11px] uppercase tracking-widest">
        <Link to="/" className="flex items-center gap-3">
          <span className="size-2 bg-accent animate-pulse" aria-hidden />
          <span className="font-bold text-foreground">Swarm Systems Lab</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-muted">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-accent transition-colors"
              activeProps={{ className: "text-accent" }}
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-border" aria-hidden />
          <span className="text-accent">SYS.LOG [ACTIVE]</span>
        </div>
      </div>
    </nav>
  );
}
