import { site } from "./data";
import { photoEntries, assetEntries, type Picture } from "./images";

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
 * An optional line under `coverCaptions:` in site.yaml gives it a caption,
 * which doubles as the alt text.
 */

const FOLDER = "/content/covers/";

const byPage = new Map<string, Picture>(
  ([...photoEntries, ...assetEntries] as [string, Picture][])
    .filter(([path]) => path.startsWith(FOLDER) && !path.slice(FOLDER.length).includes("/"))
    .map(([path, src]) => [path.slice(FOLDER.length).replace(/\.[^.]+$/, ""), src]),
);

export type Cover = { src: Picture; caption?: string };

export function coverFor(page: string): Cover | undefined {
  const src = byPage.get(page);
  return src ? { src, caption: site.coverCaptions[page] } : undefined;
}
