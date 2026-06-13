import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type MediaItem =
  | { kind: "image"; src: string; alt?: string }
  | { kind: "gif"; src: string; alt?: string }
  | { kind: "video"; src: string; poster?: string; alt?: string }
  | { kind: "youtube"; id: string; title?: string };

type Props = {
  items: MediaItem[];
  aspect?: string;
  className?: string;
  grayscale?: boolean;
};

export function MediaReel({ items, aspect = "aspect-video", className, grayscale = false }: Props) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!items.length) return null;

  const isSingle = items.length === 1;

  return (
    <div className={cn("relative bg-surface-2 border border-border overflow-hidden group/reel", className)}>
      <Carousel setApi={setApi} opts={{ loop: items.length > 1 }} className="w-full">
        <CarouselContent className="ml-0">
          {items.map((item, i) => (
            <CarouselItem key={i} className="pl-0 basis-full">
              <div className={cn(aspect, "bg-black w-full overflow-hidden")}>
                <MediaFrame item={item} grayscale={grayscale} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {!isSingle && (
          <>
            <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-background/70 border-border opacity-0 group-hover/reel:opacity-100 transition-opacity" />
            <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-background/70 border-border opacity-0 group-hover/reel:opacity-100 transition-opacity" />
          </>
        )}
      </Carousel>

      <div className="absolute top-2 right-2 flex items-center gap-2 font-display text-[9px] tracking-widest text-foreground/80 bg-background/70 border border-border px-2 py-1">
        <span className="size-1.5 rounded-full bg-accent" />
        {kindLabel(items[current])}
        {!isSingle && (
          <span className="text-muted">
            {String(current + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
          </span>
        )}
      </div>

      {!isSingle && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to media ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-1 w-5 transition-colors",
                i === current ? "bg-accent" : "bg-border hover:bg-muted",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function kindLabel(item: MediaItem) {
  switch (item.kind) {
    case "image":
      return "IMG";
    case "gif":
      return "GIF";
    case "video":
      return "VIDEO";
    case "youtube":
      return "YT";
  }
}

function MediaFrame({ item, grayscale }: { item: MediaItem; grayscale: boolean }) {
  const imgClass = cn(
    "w-full h-full object-cover",
    grayscale && "grayscale hover:grayscale-0 transition-all duration-700",
  );
  switch (item.kind) {
    case "image":
      return <img src={item.src} alt={item.alt ?? ""} loading="lazy" className={imgClass} />;
    case "gif":
      return <img src={item.src} alt={item.alt ?? ""} loading="lazy" className="w-full h-full object-cover" />;
    case "video":
      return (
        <video
          src={item.src}
          poster={item.poster}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-cover bg-black"
        />
      );
    case "youtube":
      return (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${item.id}`}
          title={item.title ?? "YouTube video"}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      );
  }
}
