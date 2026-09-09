import { displayForPath } from "./display";

/**
 * Reading the date out of a file name, and the caption out of its folder.
 *
 * Shared by the media gallery and by the pictures found next to a post:
 *
 *   2026-04-17_group-photo.jpg  →  dated 2026-04-17
 *   2026-04-17.jpg              →  dated 2026-04-17
 *   02-busan-keynote.jpg        →  no date; the order prefix only sorts it
 *
 * The words in a name are for whoever is looking at the folder. They are not
 * shown: a caption read off a file name cannot be translated, and would leave
 * one language's words on a page written in another. Captions come from the
 * folder's media.yaml, or a picture simply has none.
 */

// The words after the date are optional: a file may be named for its date
// alone, in which case the date is all it has to tell us.
const DATED = /^(\d{4}-\d{2}-\d{2})(?:[_-](.*))?$/;

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

  return { file, date: dated?.[1], caption: displayForPath(path)?.caption };
}
