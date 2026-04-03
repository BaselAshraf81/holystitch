<div align="center">

<h1>⚡ stitch-to-react</h1>

<p><strong>Google Stitch → Next.js. Compiled, not prompted. Zero tokens.</strong></p>

<p>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  <a href="http://hits.dwyl.com/BaselAshraf81/holystitch">
    <img src="https://hits.dwyl.com/BaselAshraf81/holystitch.svg?style=flat" alt="Hit Count">
  </a>
  <a href="https://ko-fi.com/V7V01X2WY5">
    <img src="https://img.shields.io/badge/Ko--fi-F16061?style=flat&logo=ko-fi&logoColor=white" alt="Support on Ko-fi">
  </a>
</p>

<img src=".github/assets/hero.gif" alt="HolyStitch Demo" width="100%">

▶️ **[Watch it in action](https://www.youtube.com/watch?v=KfkVDPthE64)**
<p>
  <a href="#-getting-started">Get Started</a> ·
  <a href="#-how-it-works">How It Works</a> ·
  <a href="#-output-structure">Output</a> ·
  <a href="https://github.com/BaselAshraf81/holystitch/issues">Report a Bug</a>
</p>

</div>

---

## The problem with asking AI to convert designs

Every token is wasted guessing at class names it can't see, reconstructing structure it doesn't have, and hallucinating props that don't exist. Then you spend the next twenty minutes fixing it.

HolyStitch is a **compiler**, not a prompt. It reads your Stitch project directly from the API and writes a complete, working Next.js project to disk — deterministically, instantly, and without spending a single AI token on the conversion itself.

|  | Asking an AI | **HolyStitch** |
|---|---|---|
| Token usage | Thousands | **~0** |
| Correctness | Hit or miss | **Build-verified** |
| Tailwind theme | Lost or guessed | **Extracted exactly** |
| Shared components | Duplicated across files | **Detected and deduplicated** |
| Speed | Minutes of back-and-forth | **Seconds** |

---

## ✨ How it works

HolyStitch runs as an MCP tool inside your IDE. You give it a Stitch project ID — it handles everything else.

```
Stitch API  →  Fetch screens  →  Parse components  →  Compile JSX  →  Write project
```

Specifically, it:

1. **Fetches** every screen from your Stitch project via the API
2. **Reads** the `<!-- ComponentName -->` markers Stitch embeds in the HTML
3. **Splits** each screen into named React components with correct parent → child relationships
4. **Compiles** HTML to valid JSX — attributes, inline styles, void elements, icon fonts, all of it
5. **Deduplicates** components shared across screens and writes them once
6. **Extracts** your exact Tailwind theme: colors, fonts, dark mode config
7. **Writes** a complete Next.js project, ready to `npm install && npm run dev`

Your AI then handles the finishing touches — routing, font tokens, any edge-case JSX — and asks you to review the result in the browser.

---

## 🚀 Getting started

### 1. Clone and build

```bash
git clone https://github.com/BaselAshraf81/holystitch
cd holystitch
npm install
npm run build
```

Note the full path to the folder — you'll need it in the next step.
For example: `/Users/alice/holystitch`

---

### 2. Get your Stitch API key

Go to your Stitch project settings and copy your API key.

---

### 3. Configure your IDE

Point your MCP host at the built package using the full path from step 1.

**Claude Desktop** — add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "holystitch": {
      "command": "node",
      "args": ["/Users/alice/holystitch/packages/mcp-server/dist/index.js"],
      "env": {
        "STITCH_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Cursor / Windsurf / other MCP hosts** — add the same block to your IDE's MCP settings file, updating the path to match your machine.

> Replace `/Users/alice/holystitch` with the actual path where you cloned the repo.
> 
> On Windows, use the full path with forward slashes or escaped backslashes, e.g.:
> `"C:/Users/alice/holystitch/packages/mcp-server/dist/index.js"` or
> `"C:\\Users\\alice\\holystitch\\packages\\mcp-server\\dist\\index.js"`

---

### 4. Find your project ID

Open your Stitch project. The ID is in the URL:

```
https://stitch.withgoogle.com/project/12828868370598194178
                                       ^^^^^^^^^^^^^^^^^^^
```

---

### 5. Run the conversion

Tell your AI assistant:

> Convert my Stitch project `12828868370598194178` into a Next.js app at `/Users/alice/projects/my-app`

That's it. HolyStitch runs, writes every file, and your AI works through the post-conversion checklist automatically.

---

## 📁 Output structure

```
my-app/
├── components/
│   ├── TopNavBar.tsx          ← shared across all pages
│   ├── Footer.tsx             ← shared across all pages
│   ├── HeroSection.tsx
│   ├── PricingCard.tsx
│   └── ...
├── app/
│   ├── page.tsx               ← route: /
│   ├── changelog/
│   │   └── page.tsx           ← route: /changelog
│   └── pricing-plan/
│       └── page.tsx           ← route: /pricing-plan
├── stitch-source/             ← original HTML kept for reference
├── tailwind.config.js         ← your exact Stitch theme
├── package.json
├── tsconfig.json
└── project-context.md         ← routing table + AI checklist
```

---

## ⚙️ Options

| Option | Default | Description |
|--------|---------|-------------|
| `framework` | `nextjs` | `nextjs` or `vite` |
| `language` | `typescript` | `typescript` or `javascript` |
| `screenIds` | *(all screens)* | Pass specific screen IDs to convert a subset |

---

## 🔧 What the compiler handles

HolyStitch goes beyond naive HTML-to-JSX conversion. It covers the edge cases that trip up LLMs:

- **Attribute renames** — `class` → `className`, `for` → `htmlFor`, all standard HTML → JSX rewrites
- **Inline styles** — style strings → style objects, including `url()`, `calc()`, `var()`, and `font-variation-settings`
- **Icon fonts** — Material Symbols and Material Icons rendered correctly (icon name text is stripped so the font renders the glyph, not the word)
- **JSX-safe code blocks** — curly braces in `<pre><code>` blocks are escaped so code examples don't break the JSX parser
- **Duplicate attributes** — deduplicated automatically; `data-alt` is promoted to `alt` and the original removed
- **Client components** — `'use client'` is added to any Next.js component with event handlers, hooks, or buttons
- **Fonts** — Google Fonts loaded via `next/font/google`; icon fonts remain as CSS imports
- **Shared components** — detected by content similarity and written once, no matter how many screens use them

---

## 🤝 Contributing

Contributions are welcome. HolyStitch is a compiler, and the best contributions are **failing test cases**: a snippet of Stitch HTML that produces wrong JSX, plus the expected output.

```bash
git clone https://github.com/BaselAshraf81/holystitch
cd holystitch
npm install
npm run build
```

Open an issue for patterns the compiler gets wrong. Open a PR for fixes.

---

## ⭐ Star History

<a href="https://www.star-history.com/?repos=BaselAshraf81%2Fholystitch&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/image?repos=BaselAshraf81/holystitch&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/image?repos=BaselAshraf81/holystitch&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/image?repos=BaselAshraf81/holystitch&type=date&legend=top-left" />
 </picture>
</a>

---

## ☕ Support

If HolyStitch saved you time, consider buying me a coffee — it helps keep the project moving.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V01X2WY5)

---

## License

MIT © [Basel Ashraf](https://github.com/BaselAshraf81)
