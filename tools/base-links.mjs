/**
 * Makes site-relative links written in Markdown survive a base path.
 *
 * Content authors write what they see in the address bar:
 *
 *   [our ERC Proof of Concept](/research/aerosense)
 *
 * Components go through `url()` for this, but Markdown has no such seam, so
 * the links are rewritten here instead. With the site at the root of a domain
 * this changes nothing; served from a sub-path - a GitHub project page - every
 * one of them would otherwise 404.
 *
 * Only links starting with a single "/" are touched: "//host", "https://",
 * "mailto:" and "#anchor" are all left exactly as written.
 */
export default function baseLinks(base = "/") {
  const prefix = base.endsWith("/") ? base.slice(0, -1) : base;

  return () => (tree) => {
    if (!prefix) return;

    const walk = (node) => {
      if (node.type === "element") {
        const attribute = node.tagName === "a" ? "href" : node.tagName === "img" ? "src" : null;
        const value = attribute && node.properties?.[attribute];
        if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
          node.properties[attribute] = prefix + value;
        }
      }
      for (const child of node.children ?? []) walk(child);
    };

    walk(tree);
  };
}
