/* scripts/start-prod.ts */
import { existsSync, cpSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const standaloneDir = path.join(".next", "standalone");
const hasStandalone = existsSync(path.join(standaloneDir, "server.js"));
const hasBuild = existsSync(path.join(".next", "BUILD_ID"));
const rootStatic = path.join(".next", "static");
const standaloneStatic = path.join(standaloneDir, ".next", "static");
const rootPublic = "public";
const standalonePublic = path.join(standaloneDir, "public");

if (!hasBuild) {
  console.error("[start-prod] ERROR: No .next build found. Did the build run?");
  process.exit(1);
}

// Ensure static assets are available when running from the standalone folder.
if (hasStandalone) {
  if (!existsSync(standaloneStatic) && existsSync(rootStatic)) {
    mkdirSync(path.join(standaloneDir, ".next"), { recursive: true });
    console.log("[start-prod] copying .next/static into standalone");
    cpSync(rootStatic, standaloneStatic, { recursive: true });
  }
  if (!existsSync(standalonePublic) && existsSync(rootPublic)) {
    console.log("[start-prod] copying public/ into standalone");
    cpSync(rootPublic, standalonePublic, { recursive: true });
  }
}

if (hasStandalone) {
  // Run standalone server with .next/static & public copied under this cwd
  console.log("[start-prod] launching standalone server");
  process.chdir(standaloneDir);
  spawn("node", ["server.js"], { stdio: "inherit" }).on("exit", (code) =>
    process.exit(code ?? 0)
  );
} else {
  // Fallback: next start (serves from project root .next)
  console.log("[start-prod] standalone missing, falling back to next start");
  spawn("npx", ["next", "start", "-p", process.env.PORT || "3000"], {
    stdio: "inherit",
  }).on("exit", (code) => process.exit(code ?? 0));
}
