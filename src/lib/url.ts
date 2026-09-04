const base = import.meta.env.BASE_URL;

/** Prefix an internal path with the site's base path (set for project pages). */
export function url(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("mailto:")) return path;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`.replace(/\/$/, "") || "/";
}

/** True when `path` is the current page or one of its detail pages. */
export function isActive(current: string, path: string): boolean {
  const target = url(path);
  const here = current.replace(/\/$/, "") || "/";
  return here === target || here.startsWith(`${target}/`);
}
