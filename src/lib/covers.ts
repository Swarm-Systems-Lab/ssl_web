import { site } from "./data";
import { displayForPath } from "./display";
import { photoEntries, assetEntries, type Media } from "./images";

/**
 * The picture across the top of a page.
 *
 * Drop a file in content/covers/ named after the page and it appears - there is
 * nothing to configure:
 *
 *   content/covers/home.png      the front page
 *   content/covers/news.jpg      /news
 *   content/covers/join-us.jpg   /join-us
 *
 * A caption comes from the folder's media.yaml, the same file that sets the
 * crop, or from `coverCaptions:` in site.yaml - whichever is written. It
 * doubles as the alt text.
 */

const FOLDER = "/content/covers/";

const byPage = new Map<string, { src: Media; path: string }>(
  ([...photoEntries, ...assetEntries] as [string, Media][])
    .filter(([path]) => path.startsWith(FOLDER) && !path.slice(FOLDER.length).includes("/"))
    .map(([path, src]) => [path.slice(FOLDER.length).replace(/\.[^.]+$/, ""), { src, path }]),
);

export type Cover = { src: Media; caption?: string };

export function coverFor(page: string): Cover | undefined {
  const found = byPage.get(page);
  if (!found) return undefined;
  // The file next to the picture is the more specific statement about it, so
  // it wins over the list in site.yaml.
  const caption = displayForPath(found.path)?.caption ?? site.coverCaptions[page];
  return { src: found.src, caption };
}
