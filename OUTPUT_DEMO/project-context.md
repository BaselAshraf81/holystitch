# Stitch → React Conversion — Agent Handoff

---

## 🤖 Instructions for the AI agent reading this file

The deterministic converter has scaffolded this project from the original Stitch HTML screens.
Your job is to complete the conversion so every page renders **pixel-accurately** against its
source HTML. Work through the checklist below in order.

**Before you touch a single file:**
1. Open every source file listed in the *Source HTML Reference* section below.
2. For each page route, read the matching `stitch-source/*.html` file from top to bottom.
   This is the single source of truth — if anything in the React output conflicts with
   the source HTML, the source HTML wins.
3. Cross-check every component against its section in the source HTML before editing.
   Do not rely on the generated JSX alone — the converter is regex-based and has known
   blind spots documented in the checklist below.

**How to match a component back to its source HTML:**
Look for the `<!-- ComponentName -->` comment marker in the source HTML — the block element
immediately following that comment is the exact HTML this component should reproduce.

- **Linear Kinetic Landing Page** → `stitch-source/Linear_Kinetic_Landing_Page.html`  (route: `/`)
- **Pricing Plan** → `stitch-source/Pricing_Plan.html`  (route: `/pricing-plan`)
- **Changelog** → `stitch-source/Changelog.html`  (route: `/changelog`)

---

Generated: 2026-03-28T21:09:22.601Z
Output: `c:\My data\teststitchmcp`
Framework: **nextjs** | Language: **typescript** | Screens: **3**

---

## Site Structure

| Route | File | Root Components | Source HTML |
|-------|------|-----------------|-------------|
| / | `app/page.tsx` | TopNavBar, HeroSection, ProductPreviewImage, CustomerLogos, BentoGridFeatures, HighFidelityUIShowcase, FinalCTA, Footer | `stitch-source/Linear_Kinetic_Landing_Page.html` |
| /pricing-plan | `app/pricing-plan/page.tsx` | TopNavBar, HeroSectionPricingPlan, PricingGrid, CompareTable, FAQSection, BoldFooterCTA, FooterPricingPlan | `stitch-source/Pricing_Plan.html` |
| /changelog | `app/changelog/page.tsx` | TopNavBar, HeaderSection, TimelineContainer, FinalCTAChangelog, FooterChangelog | `stitch-source/Changelog.html` |

## Shared Components (appear on multiple pages)

These are written **once** and imported by every page that uses them.
Changes here affect all pages:

- `components/TopNavBar.tsx`
- `components/HeroSection.tsx`
- `components/FinalCTA.tsx`
- `components/Footer.tsx`


## ⚠️ Structural Warnings

Address these first:

- "HeroSection" on "Pricing Plan" differs from the shared version (similarity 27%) — created as "HeroSectionPricingPlan". Verify both against stitch-source/.
- "Footer" on "Pricing Plan" differs from the shared version (similarity 64%) — created as "FooterPricingPlan". Verify both against stitch-source/.
- "FinalCTA" on "Changelog" differs from the shared version (similarity 28%) — created as "FinalCTAChangelog". Verify both against stitch-source/.
- "Footer" on "Changelog" differs from the shared version (similarity 52%) — created as "FooterChangelog". Verify both against stitch-source/.

---

## Fix Checklist (work through in order)

### Step 1 — Verify every component matches its source HTML

Open each file in `components/` side-by-side with the corresponding section of its source
HTML (use the source map above to find it). The converter is deterministic and handles the
mechanical transforms, but the following issues require human/AI judgement:

**Unclosed tags** — the most common issue. If an HTML comment marker sat inside a nested
element, the component HTML was cut mid-element leaving unclosed tags. Every opened tag must
have a matching close. Reconstruct missing structure by reading the source HTML directly.

**Style strings** — `style="color:red"` is invalid JSX. Every `style=` attribute must be an object:
```
style="background-image: url('x'); color: red"
→  style={{backgroundImage: "url('x')", color: "red"}}
```
CSS property names must be camelCase. Values must be quoted strings.

**Multiple root elements** — if a component returns two siblings with no wrapper, add a
fragment: `return ( <> ... </> )`

**`data-alt` on `<img>`** — the converter promotes `data-alt` to a proper `alt` attribute.
If any `data-alt` remains on non-`<img>` elements (e.g. `<div>` background images), convert
to `aria-label` if meaningful, or remove if purely decorative.

**Content fidelity** — re-read each component's source HTML and confirm: headings match,
copy is verbatim, link targets are preserved, class names are complete. Pay special
attention to components flagged in ⚠️ Structural Warnings above.

### Step 2 — Run the build and fix all errors

```bash
cd c:\My data\teststitchmcp
npm install
npm run build
```

Fix every TypeScript/JSX error before proceeding. Use `stitch-source/` as ground truth
for any structural questions.

### Step 3 — Wire up navigation routing

Stitch outputs every link as `href="#"` because it has no knowledge of the multi-page
routing. You must replace those placeholders with real routes. Here is the full route map:

| / | `app/page.tsx` | TopNavBar, HeroSection, ProductPreviewImage, CustomerLogos, BentoGridFeatures, HighFidelityUIShowcase, FinalCTA, Footer | `stitch-source/Linear_Kinetic_Landing_Page.html` |
| /pricing-plan | `app/pricing-plan/page.tsx` | TopNavBar, HeroSectionPricingPlan, PricingGrid, CompareTable, FAQSection, BoldFooterCTA, FooterPricingPlan | `stitch-source/Pricing_Plan.html` |
| /changelog | `app/changelog/page.tsx` | TopNavBar, HeaderSection, TimelineContainer, FinalCTAChangelog, FooterChangelog | `stitch-source/Changelog.html` |

**How to do this:**

1. Open every navigation component (TopNavBar, Footer, sidebar menus, breadcrumbs, etc.).
2. For each `<a href="#">LinkText</a>` link, look at the link text and match it to a route
   in the table above (e.g. the link labelled "Changelog" → route `/changelog`).
3. Replace the `<a>` tag with Next.js `<Link>` and add the correct href:
   ```tsx
   // Before
   <a className="..." href="#">Changelog</a>
   // After
   import Link from 'next/link';
   <Link className="..." href="/changelog">Changelog</Link>
   ```
4. For each page that uses a shared NavBar, the Stitch source HTML already highlights
   the *active* nav link with a different color/weight. Add an `activeRoute` prop to
   the shared component and use Next.js `usePathname()` (or accept it as a prop from
   the page) to apply the active-state classes from the source HTML:
   ```tsx
   'use client';
   import { usePathname } from 'next/navigation';
   // …
   const pathname = usePathname();
   // then conditionally apply active className based on pathname
   ```
5. Links that have no matching route (e.g. social links, external URLs) should keep
   a meaningful `href` (Twitter → `https://twitter.com`, etc.) or stay as `href="#"`
   with a `// TODO` comment.

### Step 4 — Normalize inline font declarations

Stitch emits font-family as Tailwind arbitrary values like `font-['Inter']` or
`font-['JetBrains_Mono']`. These work but bypass your Tailwind theme config and make
future re-theming harder. Replace them with the semantic aliases already in `tailwind.config.js`.

**How to do this:**
1. Open `tailwind.config.js` and read the `fontFamily` keys in `theme.extend`.
2. Search every `.tsx` / `.jsx` file in `components/` for `font-['...']"`.
3. Replace each inline font class with the matching semantic alias. Examples:
   - `font-['Inter']` → the alias whose value array starts with `"Inter"` (e.g. `font-body`)
   - `font-['JetBrains_Mono']` or `font-['JetBrains Mono']` → the `mono` alias (e.g. `font-mono`)
4. If multiple aliases map to the same font family (e.g. `headline`, `body`, `label` all use
   Inter), pick the alias that best describes the element's role (headings → `font-headline`,
   body copy → `font-body`, labels/captions → `font-label`).
5. After replacing, run the build to confirm no class names were broken.

### Step 5 — Verify each page renders correctly

- [ ] Route `/` — `app/page.tsx`
- [ ] Route `/pricing-plan` — `app/pricing-plan/page.tsx`
- [ ] Route `/changelog` — `app/changelog/page.tsx`

For each route: run the dev server, open the page in a browser, and compare it visually
against the source HTML rendered directly in a browser. Fix any layout, spacing, color,
or content discrepancies by consulting the source HTML — not by guessing.

### Step 6 — Tailwind theme

Stitch theme extracted to `tailwind.config.js`. Verify colors render correctly.


### Step 7 — Replace placeholder images

All `src` and `backgroundImage` URLs pointing to `lh3.googleusercontent.com` are
temporary Stitch preview links. Replace with real assets in `/public` or a CDN.

### Step 8 — Add `'use client'` where needed

Any component using `useState`, `useEffect`, event handlers (`onClick`, `onChange`, etc.) or browser APIs needs `'use client';` as its **first line**. The converter added it where events were detected — verify manually.

### Step 9 — Component props (optional polish)

All components have empty `interface ComponentNameProps {}`. After the build passes,
add typed props for configurable values: heading text, image URLs, link targets, etc.

---

## All Components (29 total)

- `components/TopNavBar.tsx`
- `components/HeroSection.tsx`
- `components/ProductPreviewImage.tsx`
- `components/CustomerLogos.tsx`
- `components/BentoGridFeatures.tsx`
- `components/LargeCard.tsx`
- `components/SmallCard.tsx`
- `components/MidCard.tsx`
- `components/LargeCard2.tsx`
- `components/HighFidelityUIShowcase.tsx`
- `components/FinalCTA.tsx`
- `components/Footer.tsx`
- `components/HeroSectionPricingPlan.tsx`
- `components/PricingGrid.tsx`
- `components/FreePlan.tsx`
- `components/ProPlan.tsx`
- `components/EnterprisePlan.tsx`
- `components/CompareTable.tsx`
- `components/FAQSection.tsx`
- `components/BoldFooterCTA.tsx`
- `components/BackgroundImageDecoration.tsx`
- `components/FooterPricingPlan.tsx`
- `components/HeaderSection.tsx`
- `components/TimelineContainer.tsx`
- `components/Entry1.tsx`
- `components/Entry2.tsx`
- `components/Entry3.tsx`
- `components/FinalCTAChangelog.tsx`
- `components/FooterChangelog.tsx`

---

## Source HTML Reference Files

**Always open these when reconstructing broken JSX. They are the ground truth.**

- `stitch-source/Linear_Kinetic_Landing_Page.html`
- `stitch-source/Pricing_Plan.html`
- `stitch-source/Changelog.html`
