import { readFileSync, writeFileSync } from "node:fs";
import { parseDocument } from "yaml";

/**
 * Fills in missing `doi:` and `pdf:` fields in content/publications.yaml.
 *
 * Google Scholar has no API and its terms forbid scraping, so this uses the
 * open scholarly infrastructure instead:
 *
 *   OpenAlex  - finds the paper by title and gives its DOI, plus the best
 *               open-access copy it knows about. Free, no key, no login.
 *   arXiv     - asked only when OpenAlex knows of no open copy, which is the
 *               usual case for our own recent preprints.
 *
 * Run it by hand rather than during the build: a site that reached out to two
 * APIs every time it compiled would be slow, would break when the network
 * hiccups, and would produce a different site each run.
 *
 *   bun run publications:enrich -- --dry-run     see what it would do
 *   bun run publications:enrich -- --verify      check the DOIs already there
 *   bun run publications:enrich                  write the changes
 *
 * Nothing already written in the file is ever overwritten. A title that does
 * not match closely enough is reported and left alone, because a wrong DOI is
 * far worse than a missing one.
 */

const FILE = "content/publications.yaml";
const MAILTO = "swarmsystemslab@gmail.com"; // OpenAlex asks callers to identify themselves
const PAUSE_MS = 400;

const dryRun = process.argv.includes("--dry-run");
const verify = process.argv.includes("--verify");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Politeness: back off and retry when an API asks us to slow down. */
async function get(url, attempt = 1) {
  const response = await fetch(url, {
    headers: { "User-Agent": `swarmsystemslab.eu (${MAILTO})` },
  });

  if (response.status === 429 && attempt <= 4) {
    const wait = 2000 * attempt;
    console.log(`  … rate limited, waiting ${wait / 1000}s`);
    await sleep(wait);
    return get(url, attempt + 1);
  }

  return response;
}

/** Compare titles loosely enough for punctuation, strictly enough to be safe. */
function normalise(title) {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function similar(a, b) {
  const left = new Set(normalise(a).split(" "));
  const right = new Set(normalise(b).split(" "));
  const shared = [...left].filter((w) => right.has(w)).length;
  return shared / Math.max(left.size, right.size);
}

async function openAlex(title) {
  const url = new URL("https://api.openalex.org/works");
  // Commas separate filters in OpenAlex's syntax, so a title containing one
  // would be read as two filters and rejected. Colons confuse it likewise.
  url.searchParams.set("filter", `title.search:${title.replace(/[,:]/g, " ")}`);
  url.searchParams.set("per-page", "3");
  url.searchParams.set("mailto", MAILTO);

  const response = await get(url);
  if (!response.ok) throw new Error(`OpenAlex ${response.status}`);

  const { results = [] } = await response.json();
  const match = results.find((work) => work.title && similar(work.title, title) >= 0.8);
  if (!match) return null;

  return {
    doi: match.doi ?? null,
    pdf: match.best_oa_location?.pdf_url ?? null,
  };
}

async function arxiv(title) {
  const url = new URL("https://export.arxiv.org/api/query");
  url.searchParams.set("search_query", `ti:"${title}"`);
  url.searchParams.set("max_results", "1");

  const response = await get(url);
  if (!response.ok) return null;

  const feed = await response.text();
  // The first <entry> is the paper; the feed's own <title> comes before it.
  const entry = feed.slice(feed.indexOf("<entry>"));
  const found = /<title>([\s\S]*?)<\/title>/.exec(entry)?.[1]?.trim();
  const id = /<id>(https?:\/\/arxiv\.org\/abs\/[^<]+)<\/id>/.exec(entry)?.[1];
  if (!found || !id || similar(found, title) < 0.8) return null;

  return id.replace("/abs/", "/pdf/");
}

/** Crossref is the registry of record for DOIs and is exact about them. */
async function crossref(title) {
  const url = new URL("https://api.crossref.org/works");
  url.searchParams.set("query.bibliographic", title);
  url.searchParams.set("rows", "1");
  url.searchParams.set("mailto", MAILTO);

  const response = await get(url);
  if (!response.ok) return null;

  const item = (await response.json()).message?.items?.[0];
  if (!item?.DOI || !item.title?.[0]) return null;

  return { doi: item.DOI, title: item.title[0], venue: item["container-title"]?.[0] ?? "" };
}

const doc = parseDocument(readFileSync(FILE, "utf8"));

/**
 * --verify: ask Crossref what each paper's DOI should be and report anything
 * that disagrees with the file. A fuzzy title match can attach one paper's DOI
 * to another - it happened once, to two papers about sea demining - and this
 * is how such a mistake is found rather than trusted.
 */
if (verify) {
  const problems = [];
  const missing = [];
  const upgradable = [];
  const seen = new Map();

  for (const section of ["journal", "conference", "preprint", "technote"]) {
    for (const entry of doc.get(section)?.items ?? []) {
      const ref = String(entry.get("ref"));
      const title = String(entry.get("title"));
      const doi = entry.get("doi") ? String(entry.get("doi")) : null;

      if (doi) {
        const twin = seen.get(doi);
        if (twin) problems.push(`[${ref}] shares its DOI with [${twin}]: ${doi}`);
        seen.set(doi, ref);
      }

      const found = await crossref(title);
      if (found && similar(found.title, title) >= 0.8) {
        const held = (doi ?? "").toLowerCase();

        if (!held) {
          missing.push(`[${ref}] ${found.doi}`);
        } else if (held.startsWith("10.")) {
          // A real DOI that is not the one registered for this title means one
          // of the two describes a different paper.
          if (held !== found.doi.toLowerCase()) {
            problems.push(
              `[${ref}] holds ${doi}\n        Crossref says ${found.doi} (${found.venue})`,
            );
          }
        } else {
          // A publisher address. It works, but it rots when they reorganise.
          upgradable.push(`[${ref}] ${found.doi}`);
        }
      }
      await sleep(PAUSE_MS);
    }
  }

  if (problems.length) {
    console.log("DISAGREEMENTS - one of the two describes a different paper:");
    for (const line of problems) console.log(`  ${line}`);
  }
  if (missing.length) {
    console.log("\nNO DOI held, but Crossref knows one:");
    for (const line of missing) console.log(`  ${line}`);
  }
  if (upgradable.length) {
    console.log(`\n${upgradable.length} hold a publisher address rather than a DOI.`);
    console.log("They work; a DOI simply outlives a publisher's URL scheme.");
  }
  if (!problems.length && !missing.length) console.log("\nNothing looks wrong.");

  process.exit(0);
}

const pending = [];

for (const section of ["journal", "conference", "preprint", "technote"]) {
  for (const entry of doc.get(section)?.items ?? []) {
    if (!entry.has("doi") || !entry.has("pdf")) pending.push(entry);
  }
}

console.log(`${pending.length} publications are missing a DOI or a PDF\n`);

let filled = 0;
const unresolved = [];
const closed = [];

for (const entry of pending) {
  const ref = String(entry.get("ref"));
  const title = String(entry.get("title"));
  const found = [];

  try {
    const result = await openAlex(title);

    if (result?.doi && !entry.has("doi")) {
      entry.set("doi", result.doi);
      found.push(`doi ${result.doi}`);
    }
    if (result?.pdf && !entry.has("pdf")) {
      entry.set("pdf", result.pdf);
      found.push(`pdf ${result.pdf}`);
    }
    if (!entry.has("pdf")) {
      const preprint = await arxiv(title);
      if (preprint) {
        entry.set("pdf", preprint);
        found.push(`pdf ${preprint}`);
      }
    }
  } catch (error) {
    console.warn(`  [${ref}] lookup failed: ${error.message}`);
  }

  if (found.length) {
    filled++;
    console.log(`  [${ref}] ${found.join("\n         ")}`);
  } else if (!entry.has("doi")) {
    // No DOI at all: the paper was not recognised, so it needs a human.
    unresolved.push(`[${ref}] ${title}`);
  } else {
    // A DOI but no open copy is the normal state of a paywalled paper.
    closed.push(`[${ref}] ${title}`);
  }

  await sleep(PAUSE_MS);
}

console.log(`\nfilled ${filled} of ${pending.length}`);

if (unresolved.length) {
  console.log("\nnot recognised at all, so these need a DOI by hand:");
  for (const line of unresolved) console.log(`  ${line}`);
}

if (closed.length) {
  console.log(`\n${closed.length} have a DOI but no open copy anywhere.`);
  console.log("That is normal for a paywalled paper; add a `pdf:` if you have one to host.");
}

if (dryRun) {
  console.log("\n--dry-run: nothing written");
} else if (filled) {
  writeFileSync(FILE, doc.toString({ lineWidth: 0 }));
  console.log(`\nwrote ${FILE}`);
}
