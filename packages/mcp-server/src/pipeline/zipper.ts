import archiver from "archiver";
import { Writable } from "stream";
import type { ProjectFile } from "../types.js";

/**
 * Packages an array of ProjectFile objects into a ZIP archive.
 * Returns the ZIP as a base64-encoded string.
 *
 * The ZIP has the structure:
 *   stitch-export/
 *     package.json
 *     app/
 *       layout.tsx
 *       page.tsx
 *     components/
 *       Navbar.tsx
 *       ...
 */
export function packageToZip(files: ProjectFile[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    // Writable stream that collects chunks into a buffer
    const collector = new Writable({
      write(chunk: Buffer, _encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", reject);
    collector.on("error", reject);

    collector.on("finish", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString("base64"));
    });

    archive.pipe(collector);

    const ROOT_FOLDER = "stitch-export";

    for (const file of files) {
      if (file.binary) {
        // Binary files are stored as base64 strings
        const buffer = Buffer.from(file.content, "base64");
        archive.append(buffer, { name: `${ROOT_FOLDER}/${file.path}` });
      } else {
        archive.append(file.content, { name: `${ROOT_FOLDER}/${file.path}` });
      }
    }

    archive.finalize();
  });
}
