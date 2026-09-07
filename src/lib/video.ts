/**
 * Video that is not a file.
 *
 * A YouTube video has nothing to drop in a folder, so it travels through the
 * site as the string "youtube:<id>" - the same shape a GIF or an .mp4 takes,
 * which is why it can be a page's cover, a carousel slide, or a listing
 * thumbnail without anything along the way having to know what it is.
 */

const REF = /^youtube:([\w-]{6,20})$/;

/** Every URL shape YouTube hands out, plus a bare id. */
const FROM_URL =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([\w-]{6,20})/;
const BARE_ID = /^[\w-]{6,20}$/;

/** Turns what someone wrote in a YAML file into "youtube:<id>". */
export function youtubeRef(value: string): string {
  const id = FROM_URL.exec(value)?.[1] ?? (BARE_ID.test(value.trim()) ? value.trim() : undefined);
  if (!id) {
    throw new Error(
      `"${value}" is not a YouTube video.\n` +
        `Give the id (dQw4w9WgXcQ) or the link you copied from the browser.\n`,
    );
  }
  return `youtube:${id}`;
}

/** The id, for anything already carrying a reference; undefined otherwise. */
export function youtubeId(src: unknown): string | undefined {
  return typeof src === "string" ? (REF.exec(src)?.[1] ?? undefined) : undefined;
}

/**
 * The still YouTube keeps for a video. Used as the thumbnail in listings, as
 * the link preview, and as the poster the player is built on top of.
 */
export function youtubePoster(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Where the video plays without us: the fallback when the script has not run. */
export function youtubeWatch(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * nocookie, so nothing is loaded from youtube.com until someone asks to watch.
 * `enablejsapi` is what lets the page pause it again - a carousel scrolling
 * away from a playing video should not leave it talking off-screen.
 */
export function youtubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&enablejsapi=1`;
}

/**
 * Stops whatever is playing inside an element: a clip of our own, or a YouTube
 * embed, which only answers to a message.
 */
export function pauseMedia(root: ParentNode): void {
  for (const clip of root.querySelectorAll<HTMLVideoElement>("video")) clip.pause();

  for (const frame of root.querySelectorAll<HTMLIFrameElement>("iframe")) {
    if (!/youtube(-nocookie)?\.com/.test(frame.src)) continue;
    frame.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
      "*",
    );
  }
}
