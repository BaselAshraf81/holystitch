import fs from "fs/promises";
import path from "path";
import type { ProjectFile } from "../types.js";

export interface WriteResult {
  outputDir: string;
  filesWritten: number;
  paths: string[];
}

/**
 * Writes an array of ProjectFile objects to disk under `outputDir`.
 *
 * - Creates intermediate directories automatically.
 * - Binary files (base64) are decoded before writing.
 * - Returns a manifest of what was written.
 */
export async function writeProjectFiles(
  files: ProjectFile[],
  outputDir: string
): Promise<WriteResult> {
  const resolvedDir = path.resolve(outputDir);

  // Ensure the root output directory exists
  await fs.mkdir(resolvedDir, { recursive: true });

  const writtenPaths: string[] = [];

  for (const file of files) {
    const fullPath = path.join(resolvedDir, file.path);

    // Create parent directory tree
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    if (file.binary) {
      await fs.writeFile(fullPath, Buffer.from(file.content, "base64"));
    } else {
      await fs.writeFile(fullPath, file.content, "utf8");
    }

    writtenPaths.push(file.path);
  }

  return {
    outputDir: resolvedDir,
    filesWritten: writtenPaths.length,
    paths: writtenPaths,
  };
}
