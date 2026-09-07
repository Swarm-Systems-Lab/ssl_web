import { displayForPath } from "./display";

/**
 * Turning a file name into a caption and a date.
 *
 * Shared by the media gallery and by the pictures found next to a post, so
 * both follow the same convention:
 *
 *   2026-04-17_group-photo.jpg  →  "Group photo", dated 2026-04-17
 *   02-busan-keynote.jpg        →  "Busan keynote"
 *   IMG_4231.jpg                →  no caption; the name says nothing useful
 *
 * A caption written in the folder's images.yaml wins over the file name, for
 * the pictures whose name cannot say what needs saying.
 */

const DATED = /^(\d{4}-\d{2}-\d{2})[_-](.*)$/;
const ORDER_PREFIX = /^\d{1,3}[_-]/;
const CAMERA_NAME = /^(img|dsc|dscn|dji|gopro|photo|image|screenshot|p)[ _-]?\d+$/i;

export type FileDescription = {
  file: string;
  date?: string;
  /** Undefined when the file name carries no meaning worth showing. */
  caption?: string;
};

export function describeFile(path: string, captions: Record<string, string> = {}): FileDescription {
  const file = path.split("/").pop() ?? path;
  const stem = file.replace(/\.[^.]+$/, "");
  const dated = DATED.exec(stem);
  const words = (dated?.[2] ?? stem).replace(ORDER_PREFIX, "").replace(/[_-]+/g, " ").trim();

  const auto = CAMERA_NAME.test(words) ? undefined : words.charAt(0).toUpperCase() + words.slice(1);
  const sheet = displayForPath(path);

  return { file, date: dated?.[1], caption: sheet?.caption ?? captions[file] ?? auto };
}
