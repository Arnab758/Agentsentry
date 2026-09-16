import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.resolve(rootDir, "frontend/dist");
const destDir = path.resolve(rootDir, "dist");

try {
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`[AgentSentry Build] Successfully mirrored ${srcDir} -> ${destDir}`);
  } else {
    console.warn(`[AgentSentry Build] Warning: ${srcDir} not found to copy.`);
  }
} catch (err) {
  console.error(`[AgentSentry Build] Failed to copy dist:`, err);
}
