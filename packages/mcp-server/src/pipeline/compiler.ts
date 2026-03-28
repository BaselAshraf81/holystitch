/**
 * Deterministic HTML → JSX compiler.
 *
 * Handles:
 * - Attribute renaming (class→className, for→htmlFor, etc.)
 * - Self-closing void elements
 * - Inline style strings → JS objects (including complex url() values)
 * - HTML comment → JSX comment
 * - Boolean attribute handling
 * - Event handler camelCasing (onclick→onClick, etc.)
 * - SVG attributes
 * - data-* attribute passthrough (no remapping)
 * - Removing <!DOCTYPE> / <html> / <head> / <body> wrappers
 */

// Void elements that must be self-closed in JSX
const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

// HTML attr → JSX attr renames (NO data-* entries — those pass through unchanged)
const ATTR_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  rowspan: "rowSpan",
  colspan: "colSpan",
  usemap: "useMap",
  frameborder: "frameBorder",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  enctype: "encType",
  formnovalidate: "formNoValidate",
  novalidate: "noValidate",
  "http-equiv": "httpEquiv",
  accesskey: "accessKey",
};

const EVENT_MAP: Record<string, string> = {
  onclick: "onClick",
  ondblclick: "onDoubleClick",
  onchange: "onChange",
  oninput: "onInput",
  onsubmit: "onSubmit",
  onreset: "onReset",
  onfocus: "onFocus",
  onblur: "onBlur",
  onkeydown: "onKeyDown",
  onkeyup: "onKeyUp",
  onkeypress: "onKeyPress",
  onmousedown: "onMouseDown",
  onmouseup: "onMouseUp",
  onmouseover: "onMouseOver",
  onmouseout: "onMouseOut",
  onmousemove: "onMouseMove",
  onmouseenter: "onMouseEnter",
  onmouseleave: "onMouseLeave",
  onload: "onLoad",
  onerror: "onError",
  onscroll: "onScroll",
  onwheel: "onWheel",
  ondragstart: "onDragStart",
  ondragend: "onDragEnd",
  ondragover: "onDragOver",
  ondrop: "onDrop",
  ontouchstart: "onTouchStart",
  ontouchend: "onTouchEnd",
  ontouchmove: "onTouchMove",
};

const BOOLEAN_ATTRS = new Set([
  "disabled", "checked", "selected", "multiple", "required",
  "readonly", "hidden", "open", "reversed", "loop", "muted",
  "controls", "autoplay", "defer", "async", "allowfullscreen",
]);

/**
 * Split a CSS declaration string into [property, value] pairs,
 * correctly handling url("...") and other values that contain semicolons
 * or colons inside parentheses.
 */
function splitCssDeclarations(styleStr: string): Array<[string, string]> {
  const results: Array<[string, string]> = [];
  let current = "";
  let parenDepth = 0;
  let inStr = false;
  let strChar = "";

  for (let i = 0; i < styleStr.length; i++) {
    const ch = styleStr[i]!;
    if (inStr) {
      current += ch;
      if (ch === strChar && styleStr[i - 1] !== "\\") inStr = false;
    } else if (ch === "(" ) {
      parenDepth++;
      current += ch;
    } else if (ch === ")") {
      parenDepth--;
      current += ch;
    } else if ((ch === '"' || ch === "'") && parenDepth > 0) {
      inStr = true;
      strChar = ch;
      current += ch;
    } else if (ch === ";" && parenDepth === 0) {
      const decl = current.trim();
      if (decl) {
        const colon = decl.indexOf(":");
        if (colon !== -1) {
          results.push([decl.slice(0, colon).trim(), decl.slice(colon + 1).trim()]);
        }
      }
      current = "";
    } else {
      current += ch;
    }
  }
  // trailing declaration without semicolon
  const decl = current.trim();
  if (decl) {
    const colon = decl.indexOf(":");
    if (colon !== -1) {
      results.push([decl.slice(0, colon).trim(), decl.slice(colon + 1).trim()]);
    }
  }
  return results;
}

/**
 * Convert an HTML style string to a JSX style object string.
 * Handles url("..."), calc(), var(), and other complex CSS values.
 *
 * e.g. 'background-image: url("x"); color: red'
 *   → '{{backgroundImage: "url(\\"x\\")", color: "red"}}'
 */
function styleStringToObject(styleStr: string): string {
  const pairs = splitCssDeclarations(styleStr);
  const entries = pairs
    .map(([prop, value]) => {
      // camelCase property name
      const camelProp = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

      // Pure integer → number literal; everything else → string
      if (/^\d+$/.test(value)) {
        return `${camelProp}: ${value}`;
      }

      // Escape any double quotes inside the value so we can wrap in double quotes
      const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return `${camelProp}: "${escaped}"`;
    });

  return `{{${entries.join(", ")}}}`;
}

/**
 * Map an HTML attribute name+value to a JSX attribute string.
 * Returns empty string "" to signal the attribute should be dropped.
 */
function transformAttribute(name: string, value: string | null): string {
  const lname = name.toLowerCase();

  // data-alt → alt: Stitch uses data-alt on <img> instead of the real alt attribute.
  // Promote it to a proper accessibility attribute.
  if (lname === "data-alt") {
    return value !== null ? `alt="${value}"` : "";
  }

  // data-icon: Stitch artifact used for Material Symbols icon names.
  // The icon name is already the text content of the element — drop the attribute.
  if (lname === "data-icon") {
    return "";
  }

  // All other data-* attributes pass through exactly as-is (React supports all data-* props)
  if (lname.startsWith("data-")) {
    return value !== null ? `${name}="${value}"` : name;
  }

  // Event handlers
  if (lname in EVENT_MAP) {
    const jsxName = EVENT_MAP[lname]!;
    if (value) return `${jsxName}={() => { ${value} }}`;
    return jsxName;
  }

  // style
  if (lname === "style" && value) {
    return `style=${styleStringToObject(value)}`;
  }

  // Boolean attributes
  if (BOOLEAN_ATTRS.has(lname)) {
    if (value === null || value === "" || value === lname) {
      return `${ATTR_MAP[lname] ?? lname}`;
    }
  }

  // Mapped attrs
  const jsxName = ATTR_MAP[lname] ?? name;
  if (value === null) return jsxName;
  return `${jsxName}="${value}"`;
}

/**
 * Pre-process raw HTML before JSX compilation.
 *
 * Handles patterns the regex-based compiler cannot safely handle inline:
 *
 * 1. **Material Symbols / Icons spans** — Stitch emits the icon name as both
 *    a `data-icon` attribute AND as text content, e.g.:
 *      `<span class="material-symbols-outlined">check_circle</span>`
 *    The Material Symbols font renders the icon purely via the class; the text
 *    content must be EMPTY or the icon name appears as literal text.
 *    Fix: strip the icon-name text child from any span whose class contains
 *    `material-symbols-*` or `material-icons*`.
 *
 * 2. **`<pre><code>` blocks** — Stitch code examples contain raw `{` and `}`
 *    which JSX treats as expression delimiters, causing parse errors.
 *    Fix: replace `{` → `&#123;` and `}` → `&#125;` inside every `<pre>` block.
 *    HTML entities render correctly in the browser; no JSX escaping needed.
 *
 * Both transforms are applied to the body fragment BEFORE attribute rewriting.
 */
function preProcessHTML(html: string): string {
  // ── 1. Material Icons / Symbols ──────────────────────────────────────────
  // Match: <span …class="…material-symbols-outlined…">icon_name</span>
  // The icon name is always lowercase snake_case, e.g. check_circle, bolt, shield.
  html = html.replace(
    /<span([^>]*\bmaterial-(?:symbols|icons)\b[^>]*)>\s*[a-z][a-z0-9_]*\s*<\/span>/g,
    "<span$1></span>"
  );

  // ── 2. Escape { } inside <pre> blocks ───────────────────────────────────
  html = html.replace(
    /(<pre[^>]*>)([\s\S]*?)(<\/pre>)/gi,
    (_match, preOpen: string, preBody: string, preClose: string) =>
      preOpen +
      preBody.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;") +
      preClose
  );

  return html;
}

/**
 * Extract inner body HTML from a full HTML document.
 */
function extractBodyContent(html: string): string {
  let content = html.replace(/<!DOCTYPE[^>]*>/gi, "").trim();
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1]!.trim();
  content = content
    .replace(/<html[^>]*>/gi, "")
    .replace(/<\/html>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
    .trim();
  return content;
}

/**
 * Main HTML → JSX transformer.
 */
export function compileHTMLToJSX(html: string): string {
  let jsx = extractBodyContent(html);

  // Pre-process: fix patterns the regex compiler cannot handle inline
  jsx = preProcessHTML(jsx);

  // 1. Transform opening tags
  jsx = jsx.replace(
    /<([a-zA-Z][a-zA-Z0-9-]*)((?:\s[^>]*?)?)(\/?)?>/g,
    (match, tagName: string, attrsStr: string, selfClose: string) => {
      const lowerTag = tagName.toLowerCase();
      const isVoid = VOID_ELEMENTS.has(lowerTag);
      const attrStr = transformAttributes(attrsStr);
      if (isVoid || selfClose === "/") return `<${tagName}${attrStr} />`;
      return `<${tagName}${attrStr}>`;
    }
  );

  // 2. HTML comments → JSX comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, (_match, content: string) => `{/*${content}*/}`);

  // 3. Wrap in fragment if multiple root elements
  const trimmed = jsx.trim();
  if (countRootElements(trimmed) > 1) {
    jsx = `<>\n${trimmed}\n</>`;
  }

  return jsx;
}

function transformAttributes(attrsStr: string): string {
  if (!attrsStr.trim()) return "";
  // Use an ordered Map keyed by JSX attribute name so later attrs overwrite earlier
  // ones that resolve to the same output name.
  //
  // Example: <img alt="short" data-alt="long descriptive" …>
  //   • "alt"      → alt="short"     (key: "alt")
  //   • "data-alt" → alt="long…"     (key: "alt" — overwrites the earlier entry)
  // Result: only the data-alt value survives, preventing duplicate JSX attributes.
  const transformed = new Map<string, string>();
  const attrPattern = /\s+([^\s=/>]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = attrPattern.exec(attrsStr)) !== null) {
    const name = match[1]!;
    const value = match[2] ?? match[3] ?? match[4] ?? null;
    const result = transformAttribute(name, value);
    if (result !== "") {
      // Derive the JSX attribute name (the part before the first "=")
      const jsxAttrName = result.split("=")[0]!.trim();
      transformed.set(jsxAttrName, " " + result);
    }
  }
  return [...transformed.values()].join("");
}

function countRootElements(jsx: string): number {
  let depth = 0, count = 0, i = 0;
  while (i < jsx.length) {
    if (jsx[i] === "<" && jsx[i + 1] !== "/") {
      if (depth === 0) count++;
      depth++;
      while (i < jsx.length && jsx[i] !== ">") i++;
      if (jsx[i - 1] === "/") depth--;
    } else if (jsx[i] === "<" && jsx[i + 1] === "/") {
      depth--;
      while (i < jsx.length && jsx[i] !== ">") i++;
    }
    i++;
  }
  return count;
}

/**
 * Format JSX with proper indentation.
 */
export function formatJSX(jsx: string, baseIndent = 0): string {
  const INDENT = "  ";
  const lines: string[] = [];
  let depth = baseIndent;
  let i = 0;
  jsx = jsx.trim();

  while (i < jsx.length) {
    while (i < jsx.length && jsx[i] !== "<" && jsx[i] !== "{" && /\s/.test(jsx[i]!)) i++;
    if (i >= jsx.length) break;

    if (jsx[i] === "{") {
      let j = i + 1, brace = 1, inStr = false, strChar = "";
      while (j < jsx.length && brace > 0) {
        const ch = jsx[j]!;
        if (inStr) { if (ch === strChar && jsx[j - 1] !== "\\") inStr = false; }
        else { if (ch === '"' || ch === "'" || ch === "`") { inStr = true; strChar = ch; } else if (ch === "{") brace++; else if (ch === "}") brace--; }
        j++;
      }
      const expr = jsx.slice(i, j).trim();
      if (expr) lines.push(INDENT.repeat(depth) + expr);
      i = j;
      continue;
    }

    if (jsx[i] !== "<") {
      let j = i;
      while (j < jsx.length && jsx[j] !== "<" && jsx[j] !== "{") j++;
      const text = jsx.slice(i, j).trim();
      if (text) lines.push(INDENT.repeat(depth) + text);
      i = j;
      continue;
    }

    let j = i + 1, inStr2 = false, strChar2 = "";
    while (j < jsx.length) {
      const ch = jsx[j]!;
      if (inStr2) { if (ch === strChar2 && jsx[j - 1] !== "\\") inStr2 = false; }
      else { if (ch === '"' || ch === "'") { inStr2 = true; strChar2 = ch; } else if (ch === ">") break; }
      j++;
    }
    const tag = jsx.slice(i, j + 1);

    if (jsx[i + 1] === "/") {
      depth = Math.max(baseIndent, depth - 1);
      lines.push(INDENT.repeat(depth) + tag);
    } else if (tag.endsWith("/>")) {
      lines.push(INDENT.repeat(depth) + tag);
    } else {
      const tagName = tag.match(/<([a-zA-Z][a-zA-Z0-9-]*)/)?.[1]?.toLowerCase() ?? "";
      lines.push(INDENT.repeat(depth) + tag);
      if (!VOID_ELEMENTS.has(tagName)) depth++;
    }
    i = j + 1;
  }
  return lines.join("\n");
}

/**
 * Detect if JSX content requires the 'use client' directive (Next.js).
 *
 * Triggers:
 *   - Event handler props (onClick, onChange, etc.)
 *   - React hooks (useState, useEffect, etc.)
 *   - <button> elements — always interactive, always need the client boundary
 */
export function requiresClientDirective(jsx: string): boolean {
  return (
    /\bonClick\b|\bonChange\b|\bonSubmit\b|\bonInput\b|\bonFocus\b|\bonBlur\b/.test(jsx) ||
    /\buseState\b|\buseEffect\b|\buseRef\b|\buseContext\b|\buseReducer\b/.test(jsx) ||
    /<button[\s/>]/.test(jsx)
  );
}
