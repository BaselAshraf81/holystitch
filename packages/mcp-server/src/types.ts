// ─── Core types ───────────────────────────────────────────────────────────────

export type Framework = "nextjs" | "vite";
export type Language = "typescript" | "javascript";
export type Styling = "tailwind";

export interface RawScreen {
  id: string;
  name: string;
  html: string;
}

// ─── Project file ─────────────────────────────────────────────────────────────

export interface ProjectFile {
  path: string;
  content: string;
  binary?: boolean;
}

// ─── Agentic IDE tool types (prepare_stitch_screens) ─────────────────────────

export interface CompiledScreen {
  id: string;
  name: string;
  html: string;
  jsx: string;
}

/** Output of prepare_stitch_screens — handed back to the IDE agent */
export interface PrepareScreensOutput {
  screens: CompiledScreen[];
  framework: Framework;
  language: Language;
  styling: Styling;
  /** Prompt the IDE agent should act on */
  refactorPrompt: string;
}
