const path = require("node:path");
const { spawnSync } = require("node:child_process");

const backendRoot = path.resolve(__dirname, "..");
const projectRoot = path.basename(backendRoot) === "后端核心" ? path.resolve(backendRoot, "..") : backendRoot;
const compiledServer = path.join(projectRoot, "dist", "server", "server.js");

function buildServer() {
  const result = spawnSync("npm", ["run", "build:server"], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

buildServer();
require(compiledServer);
