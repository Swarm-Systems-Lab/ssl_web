import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-3xl"}>
      {eyebrow && (
        <div className="font-display text-accent text-xs mb-4 flex items-center gap-2 uppercase tracking-widest">
          <span className="opacity-50">[00]</span>
          <span>{eyebrow}</span>
        </div>
      )}
      <h1 className="text-4xl md:text-6xl font-display font-bold leading-[0.95] tracking-tighter text-balance">
        {title}
      </h1>
      {description && (
        <p className="mt-6 text-muted-foreground leading-relaxed text-pretty max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6 mb-12">
      <h2 className="font-display text-xs uppercase tracking-[0.2em] flex items-center gap-3 shrink-0">
        <span className="size-1.5 bg-accent rounded-full" />
        {label}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
