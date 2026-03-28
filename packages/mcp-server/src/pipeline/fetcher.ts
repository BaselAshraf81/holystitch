import type { RawScreen } from "../types.js";

/**
 * Fetches screens from a Stitch project via the official Google Stitch SDK.
 * Requires a valid Stitch API key.
 *
 * @see https://github.com/google-labs-code/stitch-sdk
 */
export async function fetchScreens(
  projectId: string,
  apiKey: string,
  screenIds?: string[]
): Promise<RawScreen[]> {
  // Dynamically import stitch-sdk so the package is optional at startup
  let stitchModule: typeof import("@google/stitch-sdk");

  try {
    stitchModule = await import("@google/stitch-sdk");
  } catch {
    throw new Error(
      '@google/stitch-sdk is not installed. Run: npm install @google/stitch-sdk\n' +
        'Alternatively, pass htmlScreens directly to skip Stitch API fetching.'
    );
  }

  // @google/stitch-sdk v0.0.x exports StitchToolClient (low-level transport)
  // and Stitch (high-level domain API). There is no StitchClient export.
  const { StitchToolClient, Stitch } = stitchModule;

  const toolClient = new StitchToolClient({ apiKey });
  await toolClient.connect();

  const stitchApi = new Stitch(toolClient);
  const project = stitchApi.project(projectId);
  const allScreens = await project.screens();

  // Filter by requested screenIds if provided
  const screensToFetch =
    screenIds && screenIds.length > 0
      ? allScreens.filter((s) => screenIds.includes(s.id))
      : allScreens;

  if (screensToFetch.length === 0) {
    throw new Error(
      `No screens found in project ${projectId}` +
        (screenIds?.length ? ` matching screen IDs: ${screenIds.join(", ")}` : "")
    );
  }

  // Fetch HTML for each screen in parallel.
  // Screen.data holds the raw API payload; displayName is the human-readable
  // title. Fall back to the screen ID if the field is absent.
  const results = await Promise.all(
    screensToFetch.map(async (screen) => {
      const html = await screen.getHtml();
      const name: string =
        (screen.data as { displayName?: string; title?: string } | undefined)
          ?.displayName ??
        (screen.data as { displayName?: string; title?: string } | undefined)
          ?.title ??
        screen.id;
      return {
        id: screen.id,
        name,
        html,
      } satisfies RawScreen;
    })
  );

  return results;
}
