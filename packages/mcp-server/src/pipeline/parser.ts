/**
 * Stitch HTML Parser
 *
 * 1. Head assets  — fonts, CSS links, <style> blocks
 * 2. Tailwind config  — theme.extend, darkMode, plugins
 * 3. Google Font specs  — for next/font/google
 * 4. Hierarchical component extraction  — AST-based, comment-driven, ANY depth
 *
 * Component extraction algorithm:
 *   - Uses htmlparser2 with character position tracking
 *   - Scans for uppercase HTML comments (<!-- ComponentName -->) at every level
 *   - Each comment claims the next sibling block element as its component
 *   - After claiming an element, recursion CONTINUES inside it to find nested components
 *   - This produces a component TREE, not just a flat list
 *
 * Page body reconstruction:
 *   - Only ROOT components (those not nested inside another component) appear in pageBodyHtml
 *   - Each component's `html` field has its DIRECT children replaced by <ChildName />
 *   - This preserves structural wrappers like <main>, <section> in the page file
 *   - And gives each component a clean JSX composition body
 *
 * Label normalization:
 *   - "TopNavBar from JSON mapping"  → TopNavBar
 *   - "Entry 1: Latest"              → Entry1
 *   - "Bold Footer CTA"              → BoldFooterCta
 *   - Decorative elements (no children, <300 chars) are skipped
 */

import { parseDocument, DomUtils } from "htmlparser2";
import type { ChildNode, Document, Element, Comment, Text } from "domhandler";

// ─── Public types ─────────────────────────────────────────────────────────────

export interface HeadAssets {
  fontLinks: string[];
  globalCss: string;
}

export interface ExtractedTailwindConfig {
  themeExtend: string;
  plugins: string;
  darkMode: string | null;
  raw: string;
}

export interface GoogleFontSpec {
  family: string;
  weights: string[];
  subsets: string[];
  /** camelCase variable name, e.g. "inter", "jetBrainsMono" */
  variable: string;
}

export interface ParsedComponent {
  name: string;
  /** Outer HTML of this component with direct child components replaced by <ChildName /> */
  html: string;
  /** Outer HTML of this component, unmodified (for stitch-source reference) */
  rawHtml: string;
  /** Depth within the component tree (0 = direct child of page body) */
  depth: number;
  /** Direct child component names — must be imported by this component file */
  children: string[];
}

export interface StitchParseResult {
  head: HeadAssets;
  tailwindConfig: ExtractedTailwindConfig | null;
  /** All components extracted, in tree order */
  components: ParsedComponent[];
  /**
   * Page body HTML where ROOT components are replaced by <ComponentName />.
   * Structural wrappers like <main>, <nav> that wrap components are preserved.
   * This becomes the JSX inside the page's return statement.
   */
  pageBodyHtml: string;
  /** Names of root-level components only — these are what the page file imports */
  pageBodyComponentNames: string[];
  /** Raw body HTML, unmodified */
  bodyHtml: string;
}

// ─── Head assets ──────────────────────────────────────────────────────────────

function extractHeadAssets(html: string): HeadAssets {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1]! : "";

  const fontLinks: string[] = [];
  const linkPattern = /<link([^>]*?)(\/?)?>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkPattern.exec(headContent)) !== null) {
    const attrs = m[1] ?? "";
    if (/fonts\.googleapis|fonts\.gstatic|material.+icon|icon.+font/i.test(attrs)) {
      fontLinks.push(m[0]!.endsWith("/>") ? m[0]! : m[0]!.replace(/>$/, " />"));
    }
  }

  let globalCss = "";
  const stylePattern = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  while ((m = stylePattern.exec(headContent)) !== null) {
    const content = m[1]!.trim();
    if (content.length > 0 && content.length < 50_000) globalCss += content + "\n";
  }

  return { fontLinks, globalCss: globalCss.trim() };
}

// ─── Google Fonts ─────────────────────────────────────────────────────────────

export function extractGoogleFonts(html: string): GoogleFontSpec[] {
  const specs: GoogleFontSpec[] = [];
  const seen = new Set<string>();
  const urls: string[] = [];

  const linkRe = /href=["'](https:\/\/fonts\.googleapis\.com[^"']+)["']/gi;
  const importRe = /@import\s+url\(['"]?(https:\/\/fonts\.googleapis\.com[^'")]+)['"]?\)/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html)) !== null) urls.push(m[1]!);
  while ((m = importRe.exec(html)) !== null) urls.push(m[1]!);

  for (const url of urls) {
    for (const fp of url.matchAll(/family=([^&?]+)/gi)) {
      const raw = decodeURIComponent(fp[1]!);
      const [familyPart, ...rest] = raw.split(":");
      if (!familyPart) continue;
      const family = familyPart.replace(/\+/g, " ").trim();
      if (seen.has(family)) continue;
      seen.add(family);

      const weights: string[] = [];
      const wRest = rest.join(":").replace(/^wght@/, "");
      if (wRest.includes("..")) weights.push("400", "500", "600", "700", "800");
      else if (wRest) weights.push(...wRest.split(";").filter(Boolean));
      else weights.push("400");

      // camelCase variable: "JetBrains Mono" → "jetBrainsMono"
      const variable = family
        .replace(/\s+(\w)/g, (_, c: string) => c.toUpperCase())
        .replace(/^(.)/, (c) => c.toLowerCase())
        .replace(/[^a-zA-Z0-9]/g, "");

      specs.push({ family, weights, subsets: ["latin"], variable });
    }
  }

  return specs;
}

// ─── Tailwind config ──────────────────────────────────────────────────────────

function extractTailwindConfig(html: string): ExtractedTailwindConfig | null {
  const byId = html.match(/<script[^>]*id=["']tailwind-config["'][^>]*>([\s\S]*?)<\/script>/i);
  const byContent = html.match(/<script[^>]*>([\s\S]*?tailwind\.config[\s\S]*?)<\/script>/i);
  const rawScript = byId ? byId[1]! : byContent ? byContent[1]! : "";
  if (!rawScript.trim()) return null;

  const raw = rawScript.trim();
  let configObj = "";
  const assignMatch = raw.match(/tailwind\.config\s*=\s*\{/);
  if (assignMatch?.index !== undefined) {
    configObj = extractBalanced(raw.slice(raw.indexOf("{", assignMatch.index)), "{", "}");
  }
  if (!configObj) configObj = extractBalanced(raw, "{", "}");
  if (!configObj) return null;

  const themeExtend =
    extractNestedObject(configObj, ["theme", "extend"]) ||
    extractNestedObject(configObj, ["extend"]) || "";
  const plugins = extractArrayValue(configObj, "plugins") || "[]";
  const darkModeMatch = configObj.match(/["']?darkMode["']?\s*:\s*["']([^"']+)["']/);
  const darkMode = darkModeMatch ? darkModeMatch[1]! : null;

  return { themeExtend, plugins, darkMode, raw };
}

function extractNestedObject(src: string, keys: string[]): string {
  let cursor = src;
  for (const key of keys) {
    const match = cursor.match(new RegExp(`["']?${key}["']?\\s*:\\s*\\{`));
    if (!match?.index) return "";
    cursor = extractBalanced(cursor.slice(cursor.indexOf("{", match.index)), "{", "}");
    if (!cursor) return "";
  }
  return cursor;
}

function extractArrayValue(src: string, key: string): string {
  const match = src.match(new RegExp(`["']?${key}["']?\\s*:\\s*\\[`));
  if (!match?.index) return "";
  return extractBalanced(src.slice(src.indexOf("[", match.index)), "[", "]");
}

function extractBalanced(src: string, open: string, close: string): string {
  let depth = 0, start = -1;
  for (let i = 0; i < src.length; i++) {
    if (src[i] === open) { if (depth === 0) start = i; depth++; }
    else if (src[i] === close) { depth--; if (depth === 0 && start !== -1) return src.slice(start, i + 1); }
  }
  return "";
}

// ─── Body extraction ──────────────────────────────────────────────────────────

function extractBody(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1]!.trim();
  return html
    .replace(/<head[\s\S]*?<\/head>/i, "")
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .trim();
}

// ─── Comment label normalization ─────────────────────────────────────────────

function toPascalCase(str: string): string {
  return str.replace(/[^a-zA-Z0-9]+/g, " ").trim()
    .split(/\s+/).filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

/**
 * Normalize a raw HTML comment string to a valid PascalCase component name.
 *
 * Rules applied in order:
 *   - Strip "from ...", "for ...", "by ...", "- ...", "– ..."  suffixes
 *   - Strip everything from ":" onwards (e.g. "Entry 1: Latest" → "Entry 1")
 *   - PascalCase the result
 *   - Return "" if the result is too short or doesn't start with uppercase
 */
function normalizeLabel(raw: string): string {
  // Strip closing slash (for <!-- /ComponentName --> patterns)
  let label = raw.replace(/^\//, "").trim();

  // Strip common English connector suffixes
  label = label
    .replace(/\s+from\s+.*/i, "")
    .replace(/\s+for\s+.*/i, "")
    .replace(/\s+by\s+.*/i, "")
    .replace(/\s*[-–—]\s+.*/i, "")
    .replace(/\s*:.*/, "")         // "Entry 1: Latest" → "Entry 1"
    .trim();

  if (!label || !/^[A-Z]/i.test(label)) return "";

  const pascal = toPascalCase(label);
  // Minimum 3 chars, must start uppercase
  return pascal.length >= 3 && /^[A-Z]/.test(pascal) ? pascal : "";
}

function isUppercaseComment(node: ChildNode): node is Comment {
  if (node.type !== "comment") return false;
  const text = ((node as Comment).data ?? "").trim();
  // Starts with uppercase letter (ignoring leading slash for closing comments)
  return /^[A-Z\/]/.test(text) && text.length >= 3;
}

const BLOCK_ELEMENTS = new Set([
  "div", "section", "article", "main", "header", "footer", "nav", "aside",
  "ul", "ol", "table", "form", "figure", "fieldset", "details", "dialog",
  "canvas", "p", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "li",
]);

function isBlockElement(node: ChildNode): node is Element {
  return node.type === "tag" && BLOCK_ELEMENTS.has((node as Element).name.toLowerCase());
}

/** Skip tiny decorative elements — must have at least one element child OR be substantial */
function meetsContentThreshold(el: Element, bodyHtml: string): boolean {
  const outerHtmlLength = (el.endIndex ?? 0) - (el.startIndex ?? 0) + 1;
  const hasElementChild = (el.children ?? []).some((c) => c.type === "tag");
  return hasElementChild || outerHtmlLength >= 300;
}

// ─── Hierarchical extraction ──────────────────────────────────────────────────

interface RawExtraction {
  name: string;
  commentStart: number;
  commentEnd: number;
  elementStart: number;
  elementEnd: number;
  depth: number;       // nesting depth within component tree (0 = page-level)
  parentName: string | null;
}

/**
 * Recursively collect ALL comment-marked component extractions at any depth.
 * After claiming an element as a component, we recurse INTO it to find
 * nested components (giving us a full component tree, not just a flat list).
 */
function collectAll(
  nodes: ChildNode[],
  bodyHtml: string,
  componentDepth: number,
  parentName: string | null
): RawExtraction[] {
  const results: RawExtraction[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!;

    if (isUppercaseComment(node)) {
      const label = normalizeLabel((node as Comment).data ?? "");
      if (!label) continue;

      // Find next sibling element (skip whitespace text nodes)
      let j = i + 1;
      while (j < nodes.length && (nodes[j]!.type === "text" || nodes[j]!.type === "comment")) j++;
      const nextEl = j < nodes.length ? nodes[j] : undefined;

      if (nextEl && isBlockElement(nextEl) && meetsContentThreshold(nextEl, bodyHtml)) {
        // Claim this element as a component
        results.push({
          name: label,
          commentStart: node.startIndex ?? 0,
          commentEnd: node.endIndex ?? 0,
          elementStart: nextEl.startIndex ?? 0,
          elementEnd: nextEl.endIndex ?? 0,
          depth: componentDepth,
          parentName,
        });

        // Recurse INTO the claimed element to find nested sub-components
        const children = (nextEl as Element).children ?? [];
        const nested = collectAll(children as ChildNode[], bodyHtml, componentDepth + 1, label);
        results.push(...nested);

        i = j; // skip past the claimed element
        continue;
      }
    }

    // Recurse into non-claimed elements (structural wrappers like <main>)
    if (node.type === "tag") {
      const children = (node as Element).children ?? [];
      if (children.length > 0) {
        const nested = collectAll(children as ChildNode[], bodyHtml, componentDepth, parentName);
        results.push(...nested);
      }
    }
  }

  return results;
}

/**
 * Build the `html` for each component: the raw element HTML with its direct
 * child components replaced by <ChildName />.
 *
 * Replacement is done end-to-start to keep positions valid.
 * Positions are adjusted to be relative to the element's own start.
 */
function buildComposedHtml(
  extraction: RawExtraction,
  directChildren: RawExtraction[],
  bodyHtml: string
): string {
  const rawHtml = bodyHtml.slice(extraction.elementStart, extraction.elementEnd + 1);
  if (directChildren.length === 0) return rawHtml;

  // Sort end-to-start to keep positions valid during replacement
  const sorted = [...directChildren].sort((a, b) => b.commentStart - a.commentStart);
  const offset = extraction.elementStart;
  let html = rawHtml;

  for (const child of sorted) {
    const localCommentStart = child.commentStart - offset;
    const localElementEnd = child.elementEnd - offset;
    if (localCommentStart < 0 || localElementEnd >= html.length) continue;
    html = html.slice(0, localCommentStart) + `<${child.name} />` + html.slice(localElementEnd + 1);
  }
  return html;
}

// ─── Page body reconstruction ─────────────────────────────────────────────────

/**
 * Build the page body HTML: only ROOT components (depth 0, parentName null)
 * are replaced with <ComponentName />.
 * Structural wrappers like <main>, <section> that don't have a comment marker
 * are preserved intact, so the page file keeps the original layout intent.
 */
function buildPageBody(bodyHtml: string, roots: RawExtraction[]): string {
  const sorted = [...roots].sort((a, b) => b.commentStart - a.commentStart);
  let result = bodyHtml;
  for (const ex of sorted) {
    result = result.slice(0, ex.commentStart) + `<${ex.name} />` + result.slice(ex.elementEnd + 1);
  }
  return result;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function parseStitchHtml(html: string): StitchParseResult {
  const bodyHtml = extractBody(html);

  // Parse with position tracking
  const doc = parseDocument(bodyHtml, {
    withStartIndices: true,
    withEndIndices: true,
    recognizeSelfClosing: true,
  }) as Document;

  // Collect all component extractions at all depths
  const allExtractions = collectAll(doc.children as ChildNode[], bodyHtml, 0, null);

  // Deduplicate by name — first occurrence wins (for cross-screen shared components)
  const seenNames = new Set<string>();
  const unique = allExtractions.filter((e) => {
    if (seenNames.has(e.name)) return false;
    seenNames.add(e.name);
    return true;
  });

  // Build the ParsedComponent list with composed HTML (children replaced)
  const roots = unique.filter((e) => e.parentName === null);
  const components: ParsedComponent[] = unique.map((e) => {
    const directChildren = unique.filter((c) => c.parentName === e.name);
    const rawHtml = bodyHtml.slice(e.elementStart, e.elementEnd + 1);
    const composedHtml = buildComposedHtml(e, directChildren, bodyHtml);
    return {
      name: e.name,
      html: composedHtml,
      rawHtml,
      depth: e.depth,
      children: directChildren.map((c) => c.name),
    };
  });

  const pageBodyHtml = roots.length > 0 ? buildPageBody(bodyHtml, roots) : bodyHtml;
  const pageBodyComponentNames = roots.map((r) => r.name);

  return {
    head: extractHeadAssets(html),
    tailwindConfig: extractTailwindConfig(html),
    components,
    pageBodyHtml,
    pageBodyComponentNames,
    bodyHtml,
  };
}
