import { displayForPath } from "./display";

/**
 * Turning a file name into a caption and a date.
 *
 * Shared by the media gallery and by the pictures found next to a post, so
 * both follow the same convention:
 *
 *   2026-04-17_group-photo.jpg  →  "Group photo", dated 2026-04-17
 *   2026-04-17.jpg              →  dated 2026-04-17, and nothing else to say
 *   02-busan-keynote.jpg        →  "Busan keynote"
 *   IMG_4231.jpg                →  no caption; the name says nothing useful
 *
 * A caption written in the folder's media.yaml wins over the file name, for
 * the pictures whose name cannot say what needs saying - that sheet is the
 * only other place a caption can come from.
 */

// The words after the date are optional: a file may be named for its date
// alone, in which case the date is all it has to tell us.
const DATED = /^(\d{4}-\d{2}-\d{2})(?:[_-](.*))?$/;
const ORDER_PREFIX = /^\d{1,3}[_-]/;
const CAMERA_NAME = /^(img|dsc|dscn|dji|gopro|photo|image|screenshot|p)[ _-]?\d+$/i;

export type FileDescription = {
  file: string;
  date?: string;
  /** Undefined when the file name carries no meaning worth showing. */
  caption?: string;
};

export function describeFile(path: string): FileDescription {
  const file = path.split("/").pop() ?? path;
  const stem = file.replace(/\.[^.]+$/, "");
  const dated = DATED.exec(stem);
  const rest = dated ? (dated[2] ?? "") : stem;
  const words = rest.replace(ORDER_PREFIX, "").replace(/[_-]+/g, " ").trim();

  const auto =
    !words || CAMERA_NAME.test(words) ? undefined : words.charAt(0).toUpperCase() + words.slice(1);
  const sheet = displayForPath(path);

  return { file, date: dated?.[1], caption: sheet?.caption ?? auto };
}
