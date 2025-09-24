"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* scripts/start-prod.ts */
const node_fs_1 = require("node:fs");
const node_child_process_1 = require("node:child_process");
const hasStandalone = (0, node_fs_1.existsSync)(".next/standalone/server.js");
const [cmd, args] = hasStandalone
    ? ["node", [".next/standalone/server.js"]]
    : ["npx", ["next", "start", "-p", process.env.PORT || "3000"]];
const child = (0, node_child_process_1.spawn)(cmd, args, { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
