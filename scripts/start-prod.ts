/* scripts/start-prod.ts */
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

const hasStandalone = existsSync(".next/standalone/server.js");

const [cmd, args] = hasStandalone
  ? (["node", [".next/standalone/server.js"]] as const)
  : (["npx", ["next", "start", "-p", process.env.PORT || "3000"]] as const);

const child = spawn(cmd, args, { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
