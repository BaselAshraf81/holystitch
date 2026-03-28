/**
 * Resolves the actual HTML content for a screen.
 *
 * Stitch's SDK sometimes returns a signed download URL in the html field
 * instead of the raw HTML string. This module detects that and fetches
 * the real content before the parser/compiler touch it.
 */

import type { RawScreen } from "../types.js";

function looksLikeUrl(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      // Stitch download URLs don't require auth headers, but a browser UA
      // avoids some CDN bot-detection redirects
      "User-Agent": "Mozilla/5.0 (compatible; stitch-to-react/1.0)",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Stitch HTML from URL (${res.status} ${res.statusText}): ${url}`
    );
  }

  const text = await res.text();

  if (!text.trim()) {
    throw new Error(`Stitch HTML URL returned empty content: ${url}`);
  }

  return text;
}

/**
 * Resolve all screens — fetch HTML from URL if needed.
 * Returns a new array with guaranteed HTML string content.
 */
export async function resolveScreens(screens: RawScreen[]): Promise<RawScreen[]> {
  return Promise.all(
    screens.map(async (screen) => {
      if (looksLikeUrl(screen.html)) {
        const html = await fetchHtml(screen.html.trim());
        return { ...screen, html };
      }
      return screen;
    })
  );
}
