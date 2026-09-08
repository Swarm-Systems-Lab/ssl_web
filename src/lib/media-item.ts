import { youtubeId } from "./video";
import type { Media } from "./images";

/**
 * What a piece of media is, which is all a page needs in order to decide what
 * to do with it - lay it out as a picture, or give it a play button.
 *
 *   image  a photograph, a plot, a GIF, a vector: something to look at
 *   clip   an .mp4 or .webm of our own, played where it sits
 *   video  a video that lives elsewhere, currently YouTube
 *
 * A GIF counts as an image rather than a clip: it has no controls, no sound,
 * and nothing to press, so it behaves like a picture that happens to move.
 */
export type MediaKind = "image" | "clip" | "video";

export type MediaItem = {
  src: Media;
  kind: MediaKind;
  caption?: string;
  alt?: string;
  /** From the file name, where there is one: YYYY-MM-DD. */
  date?: string;
  /** Declared as the one to lead with, ahead of anything else in the folder. */
  cover?: boolean;
};

const CLIP = /\.(mp4|webm)(\?|$)/i;

export function kindOf(src: Media): MediaKind {
  if (typeof src !== "string") return "image";
  if (youtubeId(src)) return "video";
  return CLIP.test(src) ? "clip" : "image";
}

/** True for anything that has to be played rather than simply looked at. */
export const isPlayable = (item: { kind: MediaKind }) => item.kind !== "image";
