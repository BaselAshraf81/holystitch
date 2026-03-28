import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { convertStitchToReact } from "./pipeline/stitch-converter.js";
import { fetchScreens } from "./pipeline/fetcher.js";

// ─── Input schema ──────────────────────────────────────────────────────────────

const ConvertSchema = z.object({
  projectId: z.string().optional(),
  screenIds: z.array(z.string()).optional(),
  htmlScreens: z
    .array(z.object({ id: z.string(), name: z.string(), html: z.string() }))
    .optional(),
  outputDir: z.string().optional(),
  framework: z.enum(["nextjs", "vite"]).default("nextjs"),
  language: z.enum(["typescript", "javascript"]).default("typescript"),
  styling: z.enum(["tailwind"]).default("tailwind"),
});

// ─── Server ────────────────────────────────────────────────────────────────────

export function startMCPServer(): void {
  const server = new Server(
    { name: "stitch-to-react", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "convert_stitch_to_react",
        description: [
          "Converts one or more Google Stitch HTML screens into a complete, multi-page React project and writes all files to disk.",
          "",
          "WHAT THE TOOL DOES (fully deterministic — no AI, no API keys needed):",
          "  1. Saves each original HTML screen to stitch-source/<name>.html for reference",
          "  2. Parses HTML comment markers at every depth to split into named components",
          "     e.g. <!-- TopNavBar --> <!-- HeroSection --> <!-- Entry 1 --> <!-- Footer -->",
          "  3. Builds a component tree — nested comments produce parent→child relationships",
          "     e.g. TimelineContainer → children: [Entry1, Entry2, Entry3]",
          "  4. Detects shared components (TopNavBar, Footer) used across multiple screens",
          "     and writes them ONCE, imported by every page that uses them",
          "  5. Compiles each component's HTML → JSX (class→className, void elements,",
          "     inline style strings → style objects, data-* passthrough)",
          "  6. Generates page files using the original structural wrappers (<main>, <nav>)",
          "     with <ComponentName /> placeholders — NOT a flat list of components",
          "  7. Writes all config: package.json, tailwind.config.js (with extracted Stitch",
          "     theme + darkMode), tsconfig.json, postcss.config.js, next.config.js,",
          "     globals.css (fonts via next/font/google), layout.tsx",
          "  8. Writes project-context.md with the routing table, fix checklist,",
          "     shared component list, and ordered instructions for the AI agent",
          "",
          "WHAT YOU MUST DO AFTER THIS TOOL RETURNS:",
          "  ⚠️  READ project-context.md IMMEDIATELY and follow every step inside it.",
          "  The file contains the routing table, a step-by-step fix checklist, and a",
          "  component-to-source-HTML map. Your goal is pixel-accurate conversion:",
          "  every page must match its source HTML in stitch-source/ exactly.",
          "",
          "  Concretely:",
          "  1. Read project-context.md from top to bottom before touching any file",
          "  2. Open every stitch-source/*.html file — these are the ground truth",
          "  3. For each component, find the matching <!-- ComponentName --> section",
          "     in the source HTML and verify the JSX reproduces it faithfully",
          "  4. Fix all JSX errors (unclosed tags, style strings, fragments)",
          "  5. Run: npm install && npm run build — fix every error until clean",
          "  6. Start the dev server and compare each route against its source HTML",
          "     in a browser — fix any layout, copy, or visual discrepancy",
        ].join("\n"),
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description: "Stitch project ID. Requires STITCH_API_KEY env var. Use this OR htmlScreens.",
            },
            screenIds: {
              type: "array",
              items: { type: "string" },
              description: "Screen IDs to convert. Omit to convert all screens in the project.",
            },
            htmlScreens: {
              type: "array",
              description: "Pass HTML screens directly. Each screen becomes one page in the output.",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: {
                    type: "string",
                    description: "Screen name used for the route and file name (e.g. 'Home', 'Pricing', 'Changelog')",
                  },
                  html: { type: "string", description: "Full HTML string or a Stitch download URL" },
                },
                required: ["id", "name", "html"],
              },
            },
            outputDir: {
              type: "string",
              description: "Directory to write the project. Defaults to cwd. Pass a name like 'my-app' for a sub-folder, or an absolute path.",
            },
            framework: { type: "string", enum: ["nextjs", "vite"], default: "nextjs" },
            language: { type: "string", enum: ["typescript", "javascript"], default: "typescript" },
            styling: { type: "string", enum: ["tailwind"], default: "tailwind" },
          },
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== "convert_stitch_to_react") {
      return { content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }], isError: true };
    }

    const parsed = ConvertSchema.safeParse(request.params.arguments);
    if (!parsed.success) {
      return { content: [{ type: "text", text: `Invalid input: ${parsed.error.message}` }], isError: true };
    }

    const input = parsed.data;

    if (!input.projectId && (!input.htmlScreens || input.htmlScreens.length === 0)) {
      return {
        content: [{ type: "text", text: "Provide either projectId (requires STITCH_API_KEY env var) or htmlScreens." }],
        isError: true,
      };
    }

    const stitchApiKey = process.env.STITCH_API_KEY ?? "";
    const outputDir = input.outputDir ?? process.cwd();

    try {
      let screens = input.htmlScreens ?? [];

      if (screens.length === 0 && input.projectId) {
        if (!stitchApiKey) {
          return {
            content: [{ type: "text", text: 'STITCH_API_KEY env var not set. Add it to MCP config: "env": { "STITCH_API_KEY": "your-key" }' }],
            isError: true,
          };
        }
        screens = await fetchScreens(input.projectId, stitchApiKey, input.screenIds);
      }

      const result = await convertStitchToReact({
        screens,
        framework: input.framework,
        language: input.language,
        styling: input.styling,
        outputDir,
      });

      // Build a concise but complete response the AI agent can act on immediately
      const sharedNote = result.sharedComponents.length > 0
        ? `🔗 Shared components (used on 2+ pages): ${result.sharedComponents.join(", ")}`
        : "ℹ️  No shared components detected";

      const routeList = result.pages
        .map((p) => `   ${p.route.padEnd(30)} → ${p.path}`)
        .join("\n");

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            summary: result.summary,
            outputDir: result.outputDir,
            filesWritten: result.filesWritten,
            pages: result.pages.map((p) => ({ route: p.route, path: p.path, screenName: p.screenName })),
            components: result.components.map((c) => ({ name: c.name, path: c.path })),
            sharedComponents: result.sharedComponents,
            notes: [
              result.hasTailwindTheme
                ? "✅ Tailwind theme extracted → tailwind.config.js"
                : "⚠️  No Tailwind config found — default theme used",
              result.hasCustomCss ? "✅ Custom CSS → globals.css" : "ℹ️  No custom CSS",
              `📁 Source HTML → stitch-source/ (${result.sourceHtmlPaths.length} file${result.sourceHtmlPaths.length !== 1 ? "s" : ""})`,
              sharedNote,
              `\n📄 READ project-context.md NOW — then follow every step inside it to ensure each page in stitch-source/ is converted correctly into working React. Open each stitch-source/*.html file and use it as the pixel-accurate reference for the components on that page. Do not move on until the build passes and every route matches its source HTML.`,
              `\n📐 Routes generated:\n${routeList}`,
              ...(result.warnings.length > 0
                ? [`\n⚠️  ${result.warnings.length} structural warning${result.warnings.length !== 1 ? "s" : ""}:`,
                   ...result.warnings.map((w) => `   • ${w}`)]
                : ["✅ No structural warnings"]),
            ],
          }, null, 2),
        }],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { content: [{ type: "text", text: `Conversion failed: ${message}` }], isError: true };
    }
  });

  const transport = new StdioServerTransport();
  server.connect(transport).then(() => {
    process.stderr.write("[stitch-to-react] MCP server v1.0.0 started\n");
  });
}
