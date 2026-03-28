/**
 * Step 1 of the agentic IDE pipeline (no external AI key).
 * Parses HTML, splits into components, compiles JSX, and returns
 * a structured prompt so the IDE agent can wrap + fix each component.
 */
import { fetchScreens } from "../pipeline/fetcher.js";
import { parseStitchHtml } from "../pipeline/parser.js";
import { compileHTMLToJSX } from "../pipeline/compiler.js";
import type { RawScreen, Framework, Language, Styling, PrepareScreensOutput, CompiledScreen } from "../types.js";

export interface PrepareScreensInput {
  projectId?: string;
  screenIds?: string[];
  htmlScreens?: RawScreen[];
  framework: Framework;
  language: Language;
  styling: Styling;
  stitchApiKey?: string;
}

export async function prepareScreens(input: PrepareScreensInput): Promise<PrepareScreensOutput> {
  let rawScreens: RawScreen[];

  if (input.htmlScreens && input.htmlScreens.length > 0) {
    rawScreens = input.htmlScreens;
  } else if (input.projectId) {
    if (!input.stitchApiKey) throw new Error("stitchApiKey required for projectId.");
    rawScreens = await fetchScreens(input.projectId, input.stitchApiKey, input.screenIds);
  } else {
    throw new Error("Either projectId or htmlScreens must be provided.");
  }

  if (rawScreens.length === 0) throw new Error("No screens found.");

  const ext = input.language === "typescript" ? "tsx" : "jsx";
  const lang = input.language === "typescript" ? "TypeScript" : "JavaScript";
  const isNextjs = input.framework === "nextjs";

  // Use the same parse-and-split logic as the main pipeline
  function toPascalCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+/g, " ").trim()
      .split(/\s+/).filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  }
  function screenToRoute(name: string, index: number): string {
    if (index === 0) return "/";
    return "/" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // Build screen objects for the PrepareScreensOutput (still uses CompiledScreen for compat)
  const compiledScreens: CompiledScreen[] = rawScreens.map((s) => ({
    ...s,
    jsx: compileHTMLToJSX(s.html),
  }));

  // Build the IDE agent prompt
  const clientNote = isNextjs
    ? `Add 'use client'; as the FIRST line if the JSX has onClick, onChange, useState, useEffect, useRef, or useCallback. Otherwise omit it.`
    : `No 'use client' directive needed.`;

  const pagePath = (name: string, idx: number) => {
    const route = screenToRoute(name, idx);
    return isNextjs
      ? (route === "/" ? `app/page.${ext}` : `app${route}/page.${ext}`)
      : `src/pages/${toPascalCase(name)}.${ext}`;
  };

  const sections = rawScreens.map((screen, screenIdx) => {
    const parsed = parseStitchHtml(screen.html);
    const components = parsed.components.length > 0
      ? parsed.components
      : [{ name: toPascalCase(screen.name) || `Screen${screenIdx + 1}`, html: parsed.bodyHtml, depth: 0 }];

    const compBlocks = components.map((comp, i) => {
      const path = isNextjs ? `components/${comp.name}.${ext}` : `src/components/${comp.name}.${ext}`;
      const jsx = compileHTMLToJSX(comp.html);
      return [
        `### Component ${i + 1}/${components.length}: ${comp.name}`,
        `File: \`${path}\``,
        `\`\`\`jsx`,
        jsx,
        `\`\`\``,
      ].join("\n");
    }).join("\n\n");

    return [
      `## Screen: "${screen.name}" → ${pagePath(screen.name, screenIdx)}`,
      `Components to wrap: ${components.map((c) => c.name).join(", ")}`,
      ``,
      compBlocks,
    ].join("\n");
  }).join("\n\n---\n\n");

  const refactorPrompt = [
    `You are a ${lang} syntax corrector for React. For each component JSX snippet below, produce a complete valid \`.${ext}\` component file.`,
    ``,
    `## Output JSON for write_react_files`,
    `{`,
    `  "components": [`,
    `    { "name": "ComponentName", "path": "components/ComponentName.${ext}", "content": "...full tsx..." }`,
    `  ],`,
    `  "pages": [`,
    ...rawScreens.map((s, i) => {
      const route = screenToRoute(s.name, i);
      return `    { "route": "${route}", "path": "${pagePath(s.name, i)}", "content": "...page content...", "screenName": "${s.name}" }`;
    }),
    `  ],`,
    `  "sharedTypes": ""`,
    `}`,
    ``,
    `## For each component`,
    `Wrap in a proper component file. Fix ONLY these syntax errors:`,
    ``,
    `1. UNCLOSED TAGS — every open tag must have a matching close.`,
    `2. STYLE STRINGS — style="..." must become style={{camelCaseProp: "value"}}.`,
    `3. MULTIPLE ROOT ELEMENTS — wrap in <>..</>.`,
    ``,
    clientNote,
    ``,
    `Do NOT split into sub-components. Do NOT change any Tailwind classes or text content.`,
    ``,
    `## For each page file`,
    `Import the screen's components and compose them. Use the pageBodyHtml structure as guide.`,
    isNextjs ? `Add: import type { Metadata } from 'next'; export const metadata: Metadata = { title: '...' };` : "",
    ``,
    `---`,
    ``,
    sections,
  ].filter(Boolean).join("\n");

  return {
    screens: compiledScreens,
    framework: input.framework,
    language: input.language,
    styling: input.styling,
    refactorPrompt,
  };
}
