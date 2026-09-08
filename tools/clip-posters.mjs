/**
 * Pulls a still out of every clip in content/, so a video can be shown as a
 * picture wherever a picture is expected: the gallery, a listing, a link
 * preview, the frame behind a play button.
 *
 * The still is written next to the clip as `_poster.<name>.jpg`. The leading
 * underscore keeps it out of the galleries that scan those folders, while
 * leaving it a normal file that Astro can optimise like any other.
 *
 * Runs before the build and does nothing when the stills are already there and
 * newer than their clips, so it costs nothing on a rebuild. Without ffmpeg it
 * says so and carries on: a clip with no still is shown as a video element,
 * which is what it did before.
 */
import { execFile } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const CLIPS = /\.(mp4|webm)$/i;

export const posterFor = (clip) =>
  join(dirname(clip), `_poster.${basename(clip, extname(clip))}.jpg`);

async function* clipsUnder(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) yield* clipsUnder(path);
    else if (CLIPS.test(entry.name)) yield path;
  }
}

const newer = async (a, b) => {
  try {
    return (await stat(a)).mtimeMs >= (await stat(b)).mtimeMs;
  } catch {
    return false;
  }
};

export default async function clipPosters(root = "content") {
  const missing = [];
  for await (const clip of clipsUnder(root)) {
    if (!(await newer(posterFor(clip), clip))) missing.push(clip);
  }
  if (missing.length === 0) return;

  try {
    await run("ffmpeg", ["-version"]);
  } catch {
    console.warn(
      `[clip-posters] ffmpeg not found; ${missing.length} clip(s) will be shown ` +
        `as a video element rather than a still.`,
    );
    return;
  }

  for (const clip of missing) {
    const poster = posterFor(clip);
    // -frames:v 1 takes the opening frame; -q:v 3 keeps it sharp enough to
    // stand in for the video at full width.
    await run("ffmpeg", [
      "-loglevel",
      "error",
      "-y",
      "-i",
      clip,
      "-frames:v",
      "1",
      "-q:v",
      "3",
      poster,
    ]);
    console.log(`[clip-posters] ${poster}`);
  }
}

if (import.meta.main || process.argv[1]?.endsWith("clip-posters.mjs")) await clipPosters();
