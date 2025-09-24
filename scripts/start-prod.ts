/* scripts/start-prod.ts */
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const standaloneDir = path.join(".next", "standalone");
const hasStandalone = existsSync(path.join(standaloneDir, "server.js"));
const hasBuild = existsSync(path.join(".next", "BUILD_ID"));

if (!hasBuild) {
  console.error("[start-prod] ERROR: No .next build found. Did the build run?");
  process.exit(1);
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
