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


---

## Hits!

The easy way to know how many people are viewing your GitHub projects!

### How?

Type your GitHub Username (or org name): **BaselAshraf81**

Input the GitHub Project/Repository name: **holystitch**

Choose a style for your badge: Flat Square / Flat

### Your Badge Markdown:

[![HitCount](https://hits.dwyl.com/BaselAshraf81/holystitch.svg?style=flat)](http://hits.dwyl.com/BaselAshraf81/holystitch)

Copy the markdown snippet and paste it into your README.md file to start tracking the view count on your GitHub project!

If you want to display the unique count, use the following markdown:

[![HitCount](https://hits.dwyl.com/BaselAshraf81/holystitch.svg?style=flat&show=unique)](http://hits.dwyl.com/BaselAshraf81/holystitch)

### JSON Endpoints

shields.io provides a way for you to have other badge designs via shields.io/endpoint.

You can fully customise your badge by copying the following JSON URL:

```
https://hits.dwyl.com/BaselAshraf81/holystitch.json
```

And pasting it into the url field at: shields.io/endpoint to get your custom badge.

For example:

```
https://img.shields.io/endpoint?url=https%3A%2F%2Fhits.dwyl.com%2FBaselAshraf81%2Fholystitch.json%3Fcolor%3Dpink
```

---

## GitHub Star History

### How to use this site

When choosing a tool (especially an open-source one) to use, what's your thought process? What are the factors that matter to you?

- Any other users out there?
- Is it the most popular in this category?
- Is this technology in decline?

Here's one obvious metric I'm sure you will also investigate: its GitHub stars.

We know, you can't fully trust a project's GitHub stars alone. It is, however, a good way to determine if a tool is an adequate one and if it's likely to grow, if you use it correctly.

Even if a project has hundreds of millions of stars now, doesn't mean that it's still gaining popularity or maintained. Or if the project had an explosive breakout in the past? There's no way of knowing these simply from gazing at the stars count. Here's when Star History comes in handy: it shows how the number of GitHub stars of a project is increasing over the years. And - it's free and open-source.

### User Manual

It's just a simple search box, how hard could it be? Simplicity is indeed Star History's No 1 design principal. On the other hand, it also provides some handy features for power users. Below we will show you:

- How to add a repo using 3 different formats.
- How to add multiple repos.
- How to align the timeline to compare multiple repos.
- How to temporality show/hide a repo in the chart.
- How to add your GitHub personal access token to remove GitHub API limits.
- How to embed a live star history chart inside your GitHub project README.md.

And don't forget we also have a chrome extension.

#### How to add a repo using 3 different formats

To add a repo, you can:

1. Paste its whole URL in the search bar. e.g. `https://github.com/star-history/star-history`
2. If you are feeling lazy, skip the `https://github.com/` part. e.g `star-history/star-history`
3. When the repo name matches the organization's, writing once is enough, e.g. `star-history`. However, for something like `hashicorp/terraform`, you can't do `hashicorp` nor `terraform`, cuz they don't match and you need to specify `hashicorp/terraform`.

#### How to add multiple repos

After adding one repo, you can continue adding more by just typing the next repo in the input box. They will be rendered in the same chart.

For example, if you were wondering about which database change management tool to use, here we have the history of their growth. Both Flyway and Liquibase started way back and are gaining popularity over the years, but in recent years, Bytebase is picking up rapidly and has already bypassed Liquibase. You can not naively choose the project based on mere stars, while stars and its trajectory give you a hint about those projects worth looking at.

#### How to align the timeline to compare multiple repos

By checking Align timeline, the chart will be rerendered.

#### How to temporality show/hide a repo in the chart

Instead of removing a repo from the chart, you can switch visibility of it by clicking the name in its label box.

#### How to add your GitHub personal access token to remove GitHub API limits

Star History is free to use, but it uses GitHub API to retrieve repository metadata, which means you need to add your personal access token from GitHub to start using Star History. Rest assured, no personal data is needed in this process.

1. Login to your GitHub account, go to Personal Access Tokens: https://github.com/settings/tokens.
2. Click Generate new token.
3. Click Generate new token (classic).
4. Fill in the form on the token details page:
   - Note: give it a name for identification.
   - Expiration: how long should it be valid for?
   - Select scopes: access boundary for this token, for Star History, repo access will do.
5. When you are done, click Generate token at the bottom of the page.
6. MAKE SURE to copy your personal access token NOW. You WON'T be able to see it again!
7. Go back to star-history.com, and click Edit Access Token. Paste the token. (It's also where you edit in the future, when it expires and you'll need to generate a new one.) Hit Save, et voilà, the star history of all GitHub repos are at your fingertips. Simple as that.

#### How to embed a live star history chart inside your GitHub project README.md

1. Click Embed below the chart.
2. You need to add your personal access token first. Copy the iframe snippet and paste it into your README.md

#### Chrome extension

Visit extension page at star-history.com

Go to any GitHub repo and click the extension. There will be a hovering chart showing the star history.

Play around and let us know @StarHistoryHQ what you think!

Special thanks to https://kajiblo.com/git-hub-star-history/ for inspiring this post.
