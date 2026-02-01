"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* scripts/start-prod.ts */
const node_fs_1 = require("node:fs");
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
const standaloneDir = node_path_1.default.join(".next", "standalone");
const hasStandalone = (0, node_fs_1.existsSync)(node_path_1.default.join(standaloneDir, "server.js"));
const hasBuild = (0, node_fs_1.existsSync)(node_path_1.default.join(".next", "BUILD_ID"));
const rootStatic = node_path_1.default.join(".next", "static");
const standaloneStatic = node_path_1.default.join(standaloneDir, ".next", "static");
const rootPublic = "public";
const standalonePublic = node_path_1.default.join(standaloneDir, "public");
if (!hasBuild) {
    console.error("[start-prod] ERROR: No .next build found. Did the build run?");
    process.exit(1);
}
// Ensure static assets are available when running from the standalone folder.
if (hasStandalone) {
    if (!(0, node_fs_1.existsSync)(standaloneStatic) && (0, node_fs_1.existsSync)(rootStatic)) {
        (0, node_fs_1.mkdirSync)(node_path_1.default.join(standaloneDir, ".next"), { recursive: true });
        console.log("[start-prod] copying .next/static into standalone");
        (0, node_fs_1.cpSync)(rootStatic, standaloneStatic, { recursive: true });
    }
    if (!(0, node_fs_1.existsSync)(standalonePublic) && (0, node_fs_1.existsSync)(rootPublic)) {
        console.log("[start-prod] copying public/ into standalone");
        (0, node_fs_1.cpSync)(rootPublic, standalonePublic, { recursive: true });
    }
}
if (hasStandalone) {
    // Run standalone server with .next/static & public copied under this cwd
    console.log("[start-prod] launching standalone server");
    process.chdir(standaloneDir);
    (0, node_child_process_1.spawn)("node", ["server.js"], { stdio: "inherit" }).on("exit", (code) => process.exit(code ?? 0));
}
else {
    // Fallback: next start (serves from project root .next)
    console.log("[start-prod] standalone missing, falling back to next start");
    (0, node_child_process_1.spawn)("npx", ["next", "start", "-p", process.env.PORT || "3000"], {
        stdio: "inherit",
    }).on("exit", (code) => process.exit(code ?? 0));
}
