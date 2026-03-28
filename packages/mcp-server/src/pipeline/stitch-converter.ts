/**
 * Deterministic Stitch → React converter.
 * No AI. No external API keys.
 *
 * Steps:
 *   1. Resolve screens — fetch HTML from URL if Stitch gave us a download link
 *   2. Parse HTML comment boundaries → component slices
 *   3. Extract fonts + custom CSS from <head>
 *   4. Extract Tailwind theme.extend config
 *   5. Compile each slice HTML → JSX
 *   6. Wrap each slice in a React component file
 *   7. Generate page files + all framework config files
 *   8. Write everything to outputDir
 *   9. Write project-context.md so the agent can resume in a new session
 */

import path from "path";
import { resolveScreens } from "./resolver.js";
import { parseStitchHtml, extractGoogleFonts, type ParsedComponent, type GoogleFontSpec } from "./parser.js";
import { compileHTMLToJSX, formatJSX, requiresClientDirective } from "./compiler.js";
import { writeProjectFiles } from "./writer.js";
import type { Framework, Language, Styling, ProjectFile, RawScreen } from "../types.js";

export interface ConvertStitchInput {
  screens: RawScreen[];
  framework: Framework;
  language: Language;
  styling: Styling;
  outputDir: string;
}

export interface ConvertedComponent {
  name: string;
  path: string;
}

export interface ConvertedPage {
  screenName: string;
  route: string;
  path: string;
  components: string[];
}

export interface ConvertStitchOutput {
  components: ConvertedComponent[];
  pages: ConvertedPage[];
  hasTailwindTheme: boolean;
  hasCustomCss: boolean;
  /** Paths to original HTML source files written for AI reference */
  sourceHtmlPaths: string[];
  /** Component names that appear on 2+ screens (TopNavBar, Footer, etc.) */
  sharedComponents: string[];
  outputDir: string;
  filesWritten: number;
  summary: string;
  /** Warnings about potential issues in the deterministic conversion */
  warnings: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toPascalCase(str: string): string {
  return str.replace(/[^a-zA-Z0-9]+/g, " ").trim()
    .split(/\s+/).filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function indent(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text.split("\n").map((l, i) => (i === 0 ? l : pad + l)).join("\n");
}

function screenToRoute(name: string, index: number): string {
  if (index === 0) return "/";
  return "/" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ─── Component file ───────────────────────────────────────────────────────────

function makeComponentFile(
  name: string,
  jsxContent: string,
  language: Language,
  framework: Framework,
  childComponents: string[] = []
): string {
  const ts = language === "typescript";
  const isNextjs = framework === "nextjs";
  const needsClient = isNextjs && requiresClientDirective(jsxContent);
  const clientDirective = needsClient ? "'use client';\n\n" : "";

  // Format the JSX with proper indentation
  const formatted = formatJSX(jsxContent, 2);

  // Import child components (sub-components used inside this component)
  const childImports = childComponents
    .map((c) => `import ${c} from './${c}';`)
    .join("\n");

  // Surface prop hints for heading text and image URLs
  const hints: string[] = [];
  const headingMatch = jsxContent.match(/<h[1-3][^>]*>([^<]{3,80})<\/h[1-3]>/);
  if (headingMatch) hints.push(`  // Potential prop: title (currently "${headingMatch[1]!.trim().slice(0, 50)}")`);
  if (/\bsrc=["']/.test(jsxContent)) hints.push("  // Potential prop: imageSrc — replace hardcoded Stitch image URLs");
  if (/\bhref=["']#/.test(jsxContent)) hints.push("  // Potential prop: links — replace placeholder href values");

  const hintsBlock = hints.length > 0 ? "\n" + hints.join("\n") + "\n" : "";
  const propsType = ts ? `\ninterface ${name}Props {${hintsBlock}}\n` : "";
  const paramType = ts ? `_props: ${name}Props` : "_props";
  const imports = ["import React from 'react';", childImports].filter(Boolean).join("\n");

  return `${clientDirective}${imports}${propsType}
export default function ${name}(${paramType}) {
  return (
${formatted}
  );
}
`;
}

// ─── Page file ────────────────────────────────────────────────────────────────

function makePageFile(
  screenName: string,
  pageBodyHtml: string,
  pageComponentNames: string[],
  language: Language,
  framework: Framework,
  ext: string,
  pagePath: string
): string {
  const isNextjs = framework === "nextjs";
  // Calculate how many directory levels deep the page file sits so imports are correct.
  // e.g. app/page.tsx (depth 1) → "../components"
  //      app/pricing-plan/page.tsx (depth 2) → "../../components"
  const dirDepth = pagePath.split("/").length - 1;
  const importBase = isNextjs
    ? "../".repeat(dirDepth) + "components"
    : "../components";
  const imports = pageComponentNames.map((n) => `import ${n} from '${importBase}/${n}';`).join("\n");

  // Compile the page body HTML (which has <ComponentName /> placeholders) to JSX
  const bodyJsx = compileHTMLToJSX(pageBodyHtml);

  if (isNextjs && language === "typescript") {
    return `import React from 'react';
import type { Metadata } from 'next';
${imports}

export const metadata: Metadata = {
  title: '${screenName}',
};

export default function Page() {
  return (
    ${bodyJsx.trim()}
  );
}
`;
  }

  return `import React from 'react';
${imports}

export default function ${toPascalCase(screenName)}Page() {
  return (
    ${bodyJsx.trim()}
  );
}
`;
}

// ─── Config files ─────────────────────────────────────────────────────────────

function makePackageJson(framework: Framework): string {
  if (framework === "nextjs") {
    return JSON.stringify({
      name: "stitch-react-app", version: "0.1.0", private: true,
      scripts: { dev: "next dev", build: "next build", start: "next start", lint: "next lint" },
      dependencies: { next: "14.2.5", react: "^18", "react-dom": "^18" },
      devDependencies: {
        "@types/node": "^20", "@types/react": "^18", "@types/react-dom": "^18",
        typescript: "^5", tailwindcss: "^3", autoprefixer: "^10", postcss: "^8",
        eslint: "^8", "eslint-config-next": "14.2.5",
      },
    }, null, 2);
  }
  return JSON.stringify({
    name: "stitch-react-app", version: "0.1.0", private: true,
    scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
    dependencies: { react: "^18", "react-dom": "^18" },
    devDependencies: {
      "@types/react": "^18", "@types/react-dom": "^18",
      "@vitejs/plugin-react": "^4", typescript: "^5", vite: "^5",
      tailwindcss: "^3", autoprefixer: "^10", postcss: "^8",
    },
  }, null, 2);
}

function makeTailwindConfig(themeExtend: string, plugins: string, darkMode?: string | null): string {
  const darkModeLine = darkMode ? `  darkMode: "${darkMode}",\n` : "";
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
${darkModeLine}  theme: {
    extend: ${themeExtend || "{}"},
  },
  plugins: ${plugins || "[]"},
};
`;
}

function makeGlobalCss(
  customCss: string,
  fontLinks: string[],
  stripGoogleFonts = false,
  iconFontLinks: string[] = []
): string {
  // When Next.js font optimization is used (stripGoogleFonts=true), drop regular @import
  // Google Fonts — they are handled via next/font/google in layout.tsx instead.
  // However icon fonts (Material Symbols, Material Icons) cannot be loaded via next/font/google
  // and must always stay as CDN imports.
  const textFontImports = stripGoogleFonts ? "" : fontLinks
    .map((link) => {
      const href = link.match(/href=["']([^"']+)["']/)?.[1];
      return href ? `@import url('${href}');` : "";
    })
    .filter(Boolean).join("\n");

  // Icon fonts always go through CSS @import regardless of stripGoogleFonts
  const iconImports = iconFontLinks
    .map((link) => {
      const href = link.match(/href=["']([^"']+)["']/)?.[1];
      return href ? `@import url('${href}');` : "";
    })
    .filter(Boolean).join("\n");

  // Also strip inline @import Google Fonts from the extracted customCss
  const cleanCss = stripGoogleFonts
    ? customCss.replace(/@import\s+url\(['"]?https:\/\/fonts\.googleapis[^;]+;?/gi, "").trim()
    : customCss;

  return [
    "@tailwind base;",
    "@tailwind components;",
    "@tailwind utilities;",
    textFontImports,
    iconImports,
    cleanCss,
  ].filter(Boolean).join("\n\n") + "\n";
}

function makeNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
`;
}

function makeNextLayout(
  ext: string,
  fontSpecs: GoogleFontSpec[],
  darkMode?: string | null
): string {
  const htmlAttrs = darkMode === "class" ? ' lang="en" className="dark"' : ' lang="en"';

  // Generate next/font/google imports — eliminates CSS @import and stops Next.js warnings.
  // Icon fonts (Material Symbols, etc.) are filtered out by the caller since they can't
  // be loaded via next/font/google — they stay in globals.css as @import instead.
  const fontImports = fontSpecs.map((f) => {
    const importName = f.family.replace(/\s+/g, "_");
    const weightsStr = f.weights.length > 0
      ? `[${f.weights.map((w) => `"${w}"`).join(", ")}]`
      : `["400"]`;
    return `import { ${importName} } from 'next/font/google';\nconst ${f.variable}Font = ${importName}({ subsets: ["latin"], weight: ${weightsStr}, display: "swap" });`;
  }).join("\n");

  // Build className string that combines all font variables.
  // Each font contributes one interpolation: ${interFont.className}
  // Joined with spaces inside a single template literal → valid JSX.
  const fontClassNames = fontSpecs.length > 0
    ? fontSpecs.map((f) => "${" + f.variable + "Font.className}").join(" ")
    : "";
  const bodyClass = fontClassNames ? ` className={\`${fontClassNames}\`}` : "";

  const hasFonts = fontSpecs.length > 0;

  return `import type { Metadata } from 'next';
import './globals.css';
${hasFonts ? "\n" + fontImports : ""}

export const metadata: Metadata = {
  title: 'Stitch App',
  description: 'Generated from Google Stitch',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html${htmlAttrs}>
      <body${bodyClass}>{children}</body>
    </html>
  );
}
`;
}

function makeTsConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: "ES2017", lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true, skipLibCheck: true, strict: true, noEmit: true,
      esModuleInterop: true, module: "esnext", moduleResolution: "bundler",
      resolveJsonModule: true, isolatedModules: true, jsx: "preserve",
      incremental: true, plugins: [{ name: "next" }], paths: { "@/*": ["./*"] },
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"],
  }, null, 2);
}

function makePostcssConfig(): string {
  return `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };\n`;
}

function makeGitignore(): string {
  return `node_modules/\n.next/\ndist/\n.env.local\n.DS_Store\n`;
}


// ─── project-context.md ───────────────────────────────────────────────────────

function makeProjectContext(
  output: ConvertStitchOutput,
  input: ConvertStitchInput & { screens: RawScreen[] },
  generatedAt: string
): string {
  const ext = input.language === "typescript" ? "tsx" : "jsx";
  const isNextjs = input.framework === "nextjs";

  const routingRows = output.pages.map((p) => {
    const srcName = (input.screens.find((s) => s.name === p.screenName)?.name ?? p.screenName)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    return `| ${p.route} | \`${p.path}\` | ${p.components.join(", ")} | \`stitch-source/${srcName}.html\` |`;
  }).join("\n");

  const componentList = output.components.map((c) => `- \`${c.path}\``).join("\n");

  const sharedSection = output.sharedComponents.length > 0
    ? [
        "",
        "## Shared Components (appear on multiple pages)",
        "",
        "These are written **once** and imported by every page that uses them.",
        "Changes here affect all pages:",
        "",
        output.sharedComponents.map((n) => `- \`components/${n}.${ext}\``).join("\n"),
        "",
      ].join("\n")
    : "";

  const warningSection = output.warnings.length > 0
    ? [
        "",
        "## ⚠️ Structural Warnings",
        "",
        "Address these first:",
        "",
        output.warnings.map((w) => `- ${w}`).join("\n"),
        "",
      ].join("\n")
    : "";

  const verifyPages = output.pages.map((p) => `- [ ] Route \`${p.route}\` — \`${p.path}\``).join("\n");

  const themeNote = output.hasTailwindTheme
    ? "Stitch theme extracted to `tailwind.config.js`. Verify colors render correctly."
    : "⚠️ No Tailwind config found in HTML — default theme used. Add custom colors if needed.";

  const conflictNote = output.warnings.some((w) => w.includes("color conflict"))
    ? "\n⚠️ Color token conflicts detected (see warnings above). Reconcile in `tailwind.config.js` using `stitch-source/` as reference."
    : "";

  const clientNote = isNextjs
    ? "Any component using `useState`, `useEffect`, event handlers (`onClick`, `onChange`, etc.) or browser APIs needs `'use client';` as its **first line**. The converter added it where events were detected — verify manually."
    : "All components can use hooks freely — no `'use client'` needed for Vite.";

  const buildCmds = isNextjs
    ? `cd ${output.outputDir}\nnpm install\nnpm run build`
    : `cd ${output.outputDir}\nnpm install\nnpm run dev`;

  const sourceList = output.sourceHtmlPaths.map((p) => `- \`${p}\``).join("\n");

  // Source file lookup table so the AI can instantly find the right reference
  const sourceMap = output.pages.map((p) => {
    const srcName = (input.screens.find((s) => s.name === p.screenName)?.name ?? p.screenName)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    return `- **${p.screenName}** → \`stitch-source/${srcName}.html\`  (route: \`${p.route}\`)`;
  }).join("\n");

  const lines: string[] = [
    "# Stitch → React Conversion — Agent Handoff",
    "",
    "---",
    "",
    "## 🤖 Instructions for the AI agent reading this file",
    "",
    "The deterministic converter has scaffolded this project from the original Stitch HTML screens.",
    "Your job is to complete the conversion so every page renders **pixel-accurately** against its",
    "source HTML. Work through the checklist below in order.",
    "",
    "**Before you touch a single file:**",
    "1. Open every source file listed in the *Source HTML Reference* section below.",
    "2. For each page route, read the matching `stitch-source/*.html` file from top to bottom.",
    "   This is the single source of truth — if anything in the React output conflicts with",
    "   the source HTML, the source HTML wins.",
    "3. Cross-check every component against its section in the source HTML before editing.",
    "   Do not rely on the generated JSX alone — the converter is regex-based and has known",
    "   blind spots documented in the checklist below.",
    "",
    "**How to match a component back to its source HTML:**",
    "Look for the `<!-- ComponentName -->` comment marker in the source HTML — the block element",
    "immediately following that comment is the exact HTML this component should reproduce.",
    "",
    sourceMap,
    "",
    "---",
    "",
    `Generated: ${generatedAt}`,
    `Output: \`${output.outputDir}\``,
    `Framework: **${input.framework}** | Language: **${input.language}** | Screens: **${input.screens.length}**`,
    "",
    "---",
    "",
    "## Site Structure",
    "",
    "| Route | File | Root Components | Source HTML |",
    "|-------|------|-----------------|-------------|",
    routingRows,
    sharedSection,
    warningSection,
    "---",
    "",
    "## Fix Checklist (work through in order)",
    "",
    "### Step 1 — Verify every component matches its source HTML",
    "",
    "Open each file in `components/` side-by-side with the corresponding section of its source",
    "HTML (use the source map above to find it). The converter is deterministic and handles the",
    "mechanical transforms, but the following issues require human/AI judgement:",
    "",
    "**Unclosed tags** — the most common issue. If an HTML comment marker sat inside a nested",
    "element, the component HTML was cut mid-element leaving unclosed tags. Every opened tag must",
    "have a matching close. Reconstruct missing structure by reading the source HTML directly.",
    "",
    "**Style strings** — `style=\"color:red\"` is invalid JSX. Every `style=` attribute must be an object:",
    "```",
    "style=\"background-image: url('x'); color: red\"",
    "→  style={{backgroundImage: \"url('x')\", color: \"red\"}}",
    "```",
    "CSS property names must be camelCase. Values must be quoted strings.",
    "",
    "**Multiple root elements** — if a component returns two siblings with no wrapper, add a",
    "fragment: `return ( <> ... </> )`",
    "",
    "**`data-alt` on `<img>`** — the converter promotes `data-alt` to a proper `alt` attribute.",
    "If any `data-alt` remains on non-`<img>` elements (e.g. `<div>` background images), convert",
    "to `aria-label` if meaningful, or remove if purely decorative.",
    "",
    "**Content fidelity** — re-read each component's source HTML and confirm: headings match,",
    "copy is verbatim, link targets are preserved, class names are complete. Pay special",
    "attention to components flagged in ⚠️ Structural Warnings above.",
    "",
    "### Step 2 — Run the build and fix all errors",
    "",
    "```bash",
    buildCmds,
    "```",
    "",
    "Fix every TypeScript/JSX error before proceeding. Use `stitch-source/` as ground truth",
    "for any structural questions.",
    "",
    "### Step 3 — Wire up navigation routing",
    "",
    "Stitch outputs every link as `href=\"#\"` because it has no knowledge of the multi-page",
    "routing. You must replace those placeholders with real routes. Here is the full route map:",
    "",
    routingRows.split("\n").map((r) => r).join("\n"),
    "",
    "**How to do this:**",
    "",
    isNextjs
      ? "1. Open every navigation component (TopNavBar, Footer, sidebar menus, breadcrumbs, etc.).\n" +
        "2. For each `<a href=\"#\">LinkText</a>` link, look at the link text and match it to a route\n" +
        "   in the table above (e.g. the link labelled \"Changelog\" → route `/changelog`).\n" +
        "3. Replace the `<a>` tag with Next.js `<Link>` and add the correct href:\n" +
        "   ```tsx\n" +
        "   // Before\n" +
        "   <a className=\"...\" href=\"#\">Changelog</a>\n" +
        "   // After\n" +
        "   import Link from 'next/link';\n" +
        "   <Link className=\"...\" href=\"/changelog\">Changelog</Link>\n" +
        "   ```\n" +
        "4. For each page that uses a shared NavBar, the Stitch source HTML already highlights\n" +
        "   the *active* nav link with a different color/weight. Add an `activeRoute` prop to\n" +
        "   the shared component and use Next.js `usePathname()` (or accept it as a prop from\n" +
        "   the page) to apply the active-state classes from the source HTML:\n" +
        "   ```tsx\n" +
        "   'use client';\n" +
        "   import { usePathname } from 'next/navigation';\n" +
        "   // …\n" +
        "   const pathname = usePathname();\n" +
        "   // then conditionally apply active className based on pathname\n" +
        "   ```\n" +
        "5. Links that have no matching route (e.g. social links, external URLs) should keep\n" +
        "   a meaningful `href` (Twitter → `https://twitter.com`, etc.) or stay as `href=\"#\"`\n" +
        "   with a `// TODO` comment."
      : "1. Open every navigation component (TopNavBar, Footer, sidebar menus, etc.).\n" +
        "2. Match each `href=\"#\"` link text to a route in the table above.\n" +
        "3. Replace `href=\"#\"` with the correct hash route, e.g. `href=\"/#/changelog\"`\n" +
        "   (this project uses hash-based routing via `src/App.tsx`).\n" +
        "4. For active-state styling: add an `activeRoute` prop and compare it with each\n" +
        "   link's route to conditionally apply the active classes from the source HTML.",
    "",
    "### Step 4 — Normalize inline font declarations",
    "",
    "Stitch emits font-family as Tailwind arbitrary values like `font-['Inter']` or",
    "`font-['JetBrains_Mono']`. These work but bypass your Tailwind theme config and make",
    "future re-theming harder. Replace them with the semantic aliases already in `tailwind.config.js`.",
    "",
    "**How to do this:**",
    "1. Open `tailwind.config.js` and read the `fontFamily` keys in `theme.extend`.",
    "2. Search every `.tsx` / `.jsx` file in `components/` for `font-['...']\"`.",
    "3. Replace each inline font class with the matching semantic alias. Examples:",
    "   - `font-['Inter']` → the alias whose value array starts with `\"Inter\"` (e.g. `font-body`)",
    "   - `font-['JetBrains_Mono']` or `font-['JetBrains Mono']` → the `mono` alias (e.g. `font-mono`)",
    "4. If multiple aliases map to the same font family (e.g. `headline`, `body`, `label` all use",
    "   Inter), pick the alias that best describes the element's role (headings → `font-headline`,",
    "   body copy → `font-body`, labels/captions → `font-label`).",
    "5. After replacing, run the build to confirm no class names were broken.",
    "",
    "### Step 5 — Verify each page renders correctly",
    "",
    verifyPages,
    "",
    "For each route: run the dev server, open the page in a browser, and compare it visually",
    "against the source HTML rendered directly in a browser. Fix any layout, spacing, color,",
    "or content discrepancies by consulting the source HTML — not by guessing.",
    "",
    "### Step 6 — Tailwind theme",
    "",
    themeNote,
    conflictNote,
    "",
    "### Step 7 — Replace placeholder images",
    "",
    "All `src` and `backgroundImage` URLs pointing to `lh3.googleusercontent.com` are",
    "temporary Stitch preview links. Replace with real assets in `/public` or a CDN.",
    "",
    "### Step 8 — Add `'use client'` where needed",
    "",
    clientNote,
    "",
    "### Step 9 — Component props (optional polish)",
    "",
    "All components have empty `interface ComponentNameProps {}`. After the build passes,",
    "add typed props for configurable values: heading text, image URLs, link targets, etc.",
    "",
    "---",
    "",
    `## All Components (${output.components.length} total)`,
    "",
    componentList,
    "",
    "---",
    "",
    "## Source HTML Reference Files",
    "",
    "**Always open these when reconstructing broken JSX. They are the ground truth.**",
    "",
    sourceList,
    "",
  ];

  return lines.join("\n");
}

// ─── Component similarity ─────────────────────────────────────────────────────

/**
 * Jaccard similarity over word tokens extracted from two HTML strings.
 * Returns 0..1 — 1 means identical token sets, 0 means nothing in common.
 * Used to decide whether two same-named components are truly the same widget
 * or just coincidentally share a label.
 */
function tokenSimilarity(a: string, b: string): number {
  const tokenize = (s: string): Set<string> =>
    new Set(s.match(/[a-zA-Z][a-zA-Z0-9-]{2,}/g) ?? []);
  const ta = tokenize(a);
  const tb = tokenize(b);
  if (ta.size === 0 && tb.size === 0) return 1;
  if (ta.size === 0 || tb.size === 0) return 0;
  let intersection = 0;
  for (const t of ta) { if (tb.has(t)) intersection++; }
  return intersection / (ta.size + tb.size - intersection);
}

/**
 * Threshold below which two same-named components are treated as distinct.
 * 0.7 = 70% token overlap required to be considered the same shared component.
 */
const SHARED_COMPONENT_SIMILARITY_THRESHOLD = 0.7;

/**
 * Font families that cannot be loaded via next/font/google.
 * These must remain as CDN <link> / @import in globals.css.
 */
const ICON_FONT_FAMILIES = new Set([
  "Material Symbols Outlined",
  "Material Symbols Rounded",
  "Material Symbols Sharp",
  "Material Icons",
  "Material Icons Outlined",
  "Material Icons Round",
  "Material Icons Sharp",
  "Material Icons Two Tone",
]);

// ─── Main export ──────────────────────────────────────────────────────────────

export async function convertStitchToReact(
  input: ConvertStitchInput
): Promise<ConvertStitchOutput> {
  const { framework, language, styling, outputDir } = input;
  const ext = language === "typescript" ? "tsx" : "jsx";
  const isNextjs = framework === "nextjs";

  // Step 1: Resolve screens — fetch HTML from URL if needed
  const screens = await resolveScreens(input.screens);

  const allFiles: ProjectFile[] = [];
  const allComponents: ConvertedComponent[] = [];
  const allPages: ConvertedPage[] = [];
  const seenComponents = new Set<string>();
  /** HTML of the first occurrence of each component name — used for similarity gating */
  const seenComponentHtml = new Map<string, string>();

  let hasTailwindTheme = false;
  let hasCustomCss = false;
  /** CDN links for standard text fonts (may be replaced by next/font/google) */
  const allTextFontLinks: string[] = [];
  /** CDN links for icon fonts — always stay in globals.css regardless of next/font usage */
  const allIconFontLinks: string[] = [];
  /** Text font specs eligible for next/font/google optimization */
  const allGoogleFontSpecs: GoogleFontSpec[] = [];
  const seenFontFamilies = new Set<string>();
  let allCustomCss = "";
  let tailwindThemeExtend = "{}";
  let tailwindPlugins = "[]";
  let tailwindDarkMode: string | null = null;

  const warnings: string[] = [];
  const sourceHtmlPaths: string[] = [];
  /** Maps component name → list of screen names it appears in (for shared component detection) */
  const componentScreenMap = new Map<string, string[]>();

  // ── Per-screen processing ──────────────────────────────────────────────────
  // Track Tailwind color tokens across screens to detect conflicts
  const seenColorTokens = new Map<string, string>();

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i]!;

    // Save original HTML for AI reference
    const safeName = screen.name.replace(/[^a-zA-Z0-9_-]/g, "_") || `screen_${i + 1}`;
    const htmlPath = `stitch-source/${safeName}.html`;
    allFiles.push({ path: htmlPath, content: screen.html });
    sourceHtmlPaths.push(htmlPath);

    // Steps 2–4: Parse
    const parsed = parseStitchHtml(screen.html);

    // Collect head assets — split icon fonts from text fonts
    for (const link of parsed.head.fontLinks) {
      const isIconFont = /material.symbols|material.icons/i.test(link);
      if (isIconFont) {
        if (!allIconFontLinks.includes(link)) allIconFontLinks.push(link);
      } else {
        if (!allTextFontLinks.includes(link)) allTextFontLinks.push(link);
      }
    }

    // Extract Google Font specs for Next.js font optimization — skip icon fonts
    for (const spec of extractGoogleFonts(screen.html)) {
      if (ICON_FONT_FAMILIES.has(spec.family)) continue; // handled via CSS @import
      if (!seenFontFamilies.has(spec.family)) {
        seenFontFamilies.add(spec.family);
        allGoogleFontSpecs.push(spec);
      }
    }
    if (parsed.head.globalCss) allCustomCss += "\n" + parsed.head.globalCss;

    if (parsed.tailwindConfig) {
      if (parsed.tailwindConfig.themeExtend && !hasTailwindTheme) {
        tailwindThemeExtend = parsed.tailwindConfig.themeExtend;
        hasTailwindTheme = true;

        // Extract color tokens and detect conflicts across screens
        const colorMatches = parsed.tailwindConfig.themeExtend.matchAll(/"([^"]+)":\s*"(#[0-9a-fA-F]{3,8}|[a-z]+\([^)]+\))"/g);
        for (const m of colorMatches) {
          const [, token, value] = m;
          if (token && value) {
            if (seenColorTokens.has(token) && seenColorTokens.get(token) !== value) {
              warnings.push(
                `Tailwind color conflict: "${token}" is "${seenColorTokens.get(token)}" on screen 1 but "${value}" on "${screen.name}" — check tailwind.config.js`
              );
            } else {
              seenColorTokens.set(token, value);
            }
          }
        }
      } else if (parsed.tailwindConfig.themeExtend && hasTailwindTheme) {
        // Check later screens for color token conflicts
        const colorMatches = parsed.tailwindConfig.themeExtend.matchAll(/"([^"]+)":\s*"(#[0-9a-fA-F]{3,8}|[a-z]+\([^)]+\))"/g);
        for (const m of colorMatches) {
          const [, token, value] = m;
          if (token && value) {
            if (seenColorTokens.has(token) && seenColorTokens.get(token) !== value) {
              warnings.push(
                `Tailwind color conflict: "${token}" is "${seenColorTokens.get(token)}" on an earlier screen but "${value}" on "${screen.name}" — check tailwind.config.js`
              );
            }
          }
        }
      }
      if (parsed.tailwindConfig.plugins && parsed.tailwindConfig.plugins !== "[]") {
        tailwindPlugins = parsed.tailwindConfig.plugins;
      }
      if (parsed.tailwindConfig.darkMode && !tailwindDarkMode) {
        tailwindDarkMode = parsed.tailwindConfig.darkMode;
      }
    }

    // Determine component list for this screen
    const screenName = toPascalCase(screen.name) || `Screen${i + 1}`;
    const components: ParsedComponent[] =
      parsed.components.length > 0
        ? parsed.components
        : [{ name: screenName, html: parsed.bodyHtml, rawHtml: parsed.bodyHtml, depth: 0, children: [] }];

    // Page-level component names: only root components (no parent) for page imports.
    // We build a mutable array so we can update names when components get renamed.
    const pageComponentNames: string[] =
      parsed.pageBodyComponentNames.length > 0
        ? [...parsed.pageBodyComponentNames]
        : components.map((c) => c.name);

    // Track which components appear on multiple screens (for shared component report)
    for (const comp of components) {
      const existing = componentScreenMap.get(comp.name);
      if (existing) {
        componentScreenMap.set(comp.name, [...existing, screen.name]);
      } else {
        componentScreenMap.set(comp.name, [screen.name]);
      }
    }

    // ── Similarity-gated component sharing ──────────────────────────────────
    // Maps original component name → the name actually used in files for THIS screen.
    // Populated only when a component is renamed due to low similarity.
    const screenRenames = new Map<string, string>();

    // Steps 5–6: Compile + wrap each component
    for (const comp of components) {
      let effectiveName = comp.name;

      if (seenComponents.has(comp.name)) {
        // We've written a component with this name before.
        // Check whether it's the same widget or just coincidentally named the same.
        const existingHtml = seenComponentHtml.get(comp.name) ?? "";
        const similarity = tokenSimilarity(existingHtml, comp.html);

        if (similarity < SHARED_COMPONENT_SIMILARITY_THRESHOLD) {
          // Different content — create a screen-scoped copy so the shared version
          // isn't clobbered. Name: ComponentName + PascalCasedScreenName
          effectiveName = comp.name + toPascalCase(screen.name);
          screenRenames.set(comp.name, effectiveName);
          warnings.push(
            `"${comp.name}" on "${screen.name}" differs from the shared version ` +
            `(similarity ${(similarity * 100).toFixed(0)}%) — ` +
            `created as "${effectiveName}". Verify both against stitch-source/.`
          );
        } else {
          // Similar enough — reuse the shared component, nothing to write
          continue;
        }
      }

      // Register this component as seen (whether new or a renamed copy)
      seenComponents.add(effectiveName);
      seenComponentHtml.set(effectiveName, comp.html);

      const jsxContent = compileHTMLToJSX(comp.html);

      // Warn if the compiled JSX looks structurally broken (heuristic: unbalanced < >)
      const openTags = (jsxContent.match(/<[a-zA-Z]/g) ?? []).length;
      const closeTags = (jsxContent.match(/<\/[a-zA-Z]/g) ?? []).length;
      const selfClose = (jsxContent.match(/\/>/g) ?? []).length;
      if (Math.abs(openTags - closeTags - selfClose) > 2) {
        warnings.push(
          `Possible unclosed tags in ${effectiveName} (${openTags} opens, ${closeTags} closes, ${selfClose} self-closing) — verify against stitch-source/${safeName}.html`
        );
      }

      // Remap child component names if any of them were also renamed this screen
      const effectiveChildren = comp.children.map((c) => screenRenames.get(c) ?? c);

      const fileContent = makeComponentFile(effectiveName, jsxContent, language, framework, effectiveChildren);
      const filePath = isNextjs
        ? `components/${effectiveName}.${ext}`
        : `src/components/${effectiveName}.${ext}`;

      allFiles.push({ path: filePath, content: fileContent });
      allComponents.push({ name: effectiveName, path: filePath });
    }

    // Apply any renames to the page component name list so import statements are correct
    for (let k = 0; k < pageComponentNames.length; k++) {
      const renamed = screenRenames.get(pageComponentNames[k]!);
      if (renamed) pageComponentNames[k] = renamed;
    }

    // Apply renames to the page body HTML so <OldName /> placeholders become <NewName />
    let pageBodyForFile = parsed.components.length > 0 ? parsed.pageBodyHtml : parsed.bodyHtml;
    for (const [orig, renamed] of screenRenames) {
      pageBodyForFile = pageBodyForFile.replace(
        new RegExp(`<${orig}(\\s*\\/?>)`, "g"),
        `<${renamed}$1`
      );
    }

    // Step 7: Page file — uses compiled pageBodyHtml, imports only root components
    const route = screenToRoute(screen.name, i);
    const pagePath = isNextjs
      ? (route === "/" ? `app/page.${ext}` : `app${route}/page.${ext}`)
      : `src/pages/${screenName}.${ext}`;

    allFiles.push({
      path: pagePath,
      content: makePageFile(screen.name, pageBodyForFile, pageComponentNames, language, framework, ext, pagePath),
    });
    allPages.push({ screenName: screen.name, route, path: pagePath, components: pageComponentNames });
  }

  // ── Config files ─────────────────────────────────────────────────────────
  hasCustomCss = allCustomCss.trim().length > 0;

  allFiles.push({ path: "package.json", content: makePackageJson(framework) });
  allFiles.push({ path: "tailwind.config.js", content: makeTailwindConfig(tailwindThemeExtend, tailwindPlugins, tailwindDarkMode) });
  allFiles.push({ path: "postcss.config.js", content: makePostcssConfig() });
  allFiles.push({ path: ".gitignore", content: makeGitignore() });

  if (language === "typescript") {
    allFiles.push({ path: "tsconfig.json", content: makeTsConfig() });
  }

  const useNextFontOptimization = isNextjs && allGoogleFontSpecs.length > 0;
  const globalCss = makeGlobalCss(
    allCustomCss.trim(),
    allTextFontLinks,
    useNextFontOptimization,
    allIconFontLinks
  );

  if (isNextjs) {
    allFiles.push({ path: "next.config.js", content: makeNextConfig() });
    allFiles.push({ path: "app/globals.css", content: globalCss });
    allFiles.push({ path: `app/layout.${ext}`, content: makeNextLayout(ext, allGoogleFontSpecs, tailwindDarkMode) });
  } else {
    allFiles.push({ path: "src/index.css", content: globalCss });
    const firstPage = allPages[0];
    allFiles.push({
      path: `src/main.${ext}`,
      content: [
        "import React from 'react';",
        "import ReactDOM from 'react-dom/client';",
        "import './index.css';",
        "import App from './App';",
        "",
        "ReactDOM.createRoot(document.getElementById('root')!).render(",
        "  <React.StrictMode><App /></React.StrictMode>",
        ");",
      ].join("\n") + "\n",
    });

    // Multi-page App with hash-based routing for Vite
    const pageImports = allPages.map((p) =>
      `import ${toPascalCase(p.screenName)}Page from './pages/${toPascalCase(p.screenName)}';`
    ).join("\n");
    const routeEntries = allPages.map((p) =>
      `  "${p.route}": <${toPascalCase(p.screenName)}Page />,`
    ).join("\n");
    const defaultRoute = allPages[0]?.route ?? "/";
    allFiles.push({
      path: `src/App.${ext}`,
      content: [
        "import React, { useState, useEffect } from 'react';",
        pageImports,
        "",
        `const ROUTES${input.language === "typescript" ? ": Record<string, React.ReactNode>" : ""} = {`,
        routeEntries,
        "};",
        "",
        "export default function App() {",
        `  const [route, setRoute] = useState(window.location.hash.replace('#', '') || '${defaultRoute}');`,
        "  useEffect(() => {",
        `    const handler = () => setRoute(window.location.hash.replace('#', '') || '${defaultRoute}');`,
        "    window.addEventListener('hashchange', handler);",
        "    return () => window.removeEventListener('hashchange', handler);",
        "  }, []);",
        `  return ROUTES[route] ?? ROUTES['${defaultRoute}'] ?? <div>Page not found</div>;`,
        "}",
      ].join("\n") + "\n",
    });
  }

  // ── Write to disk ─────────────────────────────────────────────────────────
  const { outputDir: resolvedDir, filesWritten } = await writeProjectFiles(allFiles, outputDir);

  // Components that appear on multiple screens (detected from componentScreenMap)
  const sharedComponents = [...componentScreenMap.entries()]
    .filter(([, screenNames]) => screenNames.length > 1)
    .map(([name]) => name);

  const result: ConvertStitchOutput = {
    components: allComponents,
    pages: allPages,
    hasTailwindTheme,
    hasCustomCss,
    sourceHtmlPaths,
    sharedComponents,
    outputDir: resolvedDir,
    filesWritten,
    summary: `Converted ${screens.length} screen${screens.length !== 1 ? "s" : ""} into ${allComponents.length} component${allComponents.length !== 1 ? "s" : ""} and ${allPages.length} page${allPages.length !== 1 ? "s" : ""}`,
    warnings,
  };

  // Step 9: Write project-context.md
  const contextMd = makeProjectContext(result, { ...input, screens }, new Date().toISOString());
  await writeProjectFiles([{ path: "project-context.md", content: contextMd }], resolvedDir);

  return result;
}
