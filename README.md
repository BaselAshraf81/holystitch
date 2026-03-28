# HolyStitch

**Instant Google Stitch → React conversion. Zero AI tokens.**

[holystitch.dev](https://holystitch.dev) · [Report a bug](https://github.com/BaselAshraf81/holystitch/issues)

---

## The problem

Converting a Stitch design to React by asking an AI means thousands of tokens, hallucinated class names, broken JSX, and a back-and-forth that takes longer than just writing the components yourself.

HolyStitch is a compiler, not a prompt. It reads your Stitch project directly from the API and writes a complete, working Next.js project to disk — deterministically, instantly, and for free.

| | Asking an AI | HolyStitch |
|---|---|---|
| Token usage | Thousands | ~0 |
| Errors | Common | Build-verified |
| Tailwind theme | Lost or guessed | Extracted exactly |
| Shared components | Duplicated | Detected and deduplicated |
| Time | Minutes of back-and-forth | Seconds |

---

## How it works

HolyStitch is an MCP tool. You give it your Stitch API key and a project ID — it handles the rest.

1. Fetches every screen from your Stitch project via the API
2. Reads the `<!-- ComponentName -->` markers Stitch embeds in the HTML
3. Splits each screen into named React components with correct parent → child relationships
4. Compiles HTML to JSX (attributes, styles, void elements, icon fonts, everything)
5. Detects components shared across screens and writes them once
6. Extracts your Tailwind theme, colors, fonts, and dark mode config
7. Writes a complete Next.js project to whatever folder you choose — ready to `npm install && npm run dev`

The AI in your IDE then handles the finishing touches (routing, font tokens, any broken JSX) and asks you to review the result in your browser.

---

## Quickstart

### 1. Get your Stitch API key

Go to your Stitch project settings and copy your API key.

### 2. Get your project ID

Open your Stitch project. The ID is in the URL:

```
https://stitch.withgoogle.com/project/12828868370598194178
                                       ^^^^^^^^^^^^^^^^^^^
                                       this is your project ID
```

### 3. Add HolyStitch to your IDE

**Claude Desktop** — edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "holystitch": {
      "command": "npx",
      "args": ["holystitch-mcp"],
      "env": {
        "STITCH_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Cursor / Windsurf / other MCP hosts** → see [holystitch.dev](https://holystitch.dev) for IDE-specific config snippets.

### 4. Run the conversion

Tell your AI assistant:

> Convert my Stitch project `12828868370598194178` into a Next.js app and put it at `/Users/alice/projects/my-app`

That's it. The tool runs, writes every file, and your AI works through the checklist automatically.

---

## What gets generated

```
my-app/
├── components/
│   ├── TopNavBar.tsx       ← shared across all pages
│   ├── Footer.tsx          ← shared across all pages
│   ├── HeroSection.tsx
│   ├── PricingCard.tsx
│   └── ...
├── app/
│   ├── page.tsx            ← route: /
│   ├── changelog/
│   │   └── page.tsx        ← route: /changelog
│   └── pricing-plan/
│       └── page.tsx        ← route: /pricing-plan
├── stitch-source/          ← original HTML kept for reference
├── tailwind.config.js      ← your exact Stitch theme
├── package.json
├── tsconfig.json
└── project-context.md      ← routing table + checklist for the AI
```

---

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `framework` | `nextjs` | `nextjs` or `vite` |
| `language` | `typescript` | `typescript` or `javascript` |
| `screenIds` | all screens | Convert only specific screens by ID |

---

## What the compiler handles

- All HTML → JSX attribute renames (`class` → `className`, `for` → `htmlFor`, etc.)
- Inline style strings → style objects, including complex values like `url()`, `calc()`, `var()`, `font-variation-settings`
- Material Symbols and Material Icons rendered correctly (the icon name text is stripped so the font displays the glyph instead of the word)
- Curly braces in `<pre><code>` blocks escaped so code examples don't break JSX
- Duplicate attributes deduplicated — `data-alt` is promoted to `alt` and the original removed
- `'use client'` added to any Next.js component with event handlers, hooks, or buttons
- Google Fonts loaded via `next/font/google`; icon fonts stay as CSS imports
- Shared components detected by content similarity and written once

---

## Contributing

Contributions are very welcome. This project is a compiler — if you find a Stitch HTML pattern it doesn't handle correctly, the best contribution is a failing test case with the input HTML and the expected JSX output.

```bash
git clone https://github.com/BaselAshraf81/holystitch
cd holystitch
npm install
npm run build
```

Open issues for patterns the compiler gets wrong, and PRs for fixes.

---

## License

MIT
