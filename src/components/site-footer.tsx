import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-black py-12 px-6 mt-24 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-display text-[10px] text-muted tracking-[0.2em]">
          © {new Date().getFullYear()} SWARM SYSTEMS LAB • COORDINATED INTELLIGENCE
        </div>
        <div className="flex items-center gap-8 font-display text-[10px] uppercase tracking-widest text-muted">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            YouTube
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            X / Twitter
          </a>
          <Link
            to="/positions"
            className="text-accent border border-accent/20 px-3 py-1 hover:bg-accent/10 transition-colors"
          >
            Join the Lab
          </Link>
        </div>
      </div>
    </footer>
  );
}
