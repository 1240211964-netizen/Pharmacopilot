const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "前端核心");
const moduleFiles = {
  "src/lib/wenda": path.join(projectRoot, "src/lib/wenda.ts"),
  "src/components/integrations/WendaEmbedWorkspace": path.join(projectRoot, "src/components/integrations/WendaEmbedWorkspace.tsx"),
  "src/wenda-embed-entry": path.join(projectRoot, "src/wenda-embed-entry.tsx"),
};
const vendorFiles = {
  react: path.join(projectRoot, "node_modules/react/cjs/react.production.js"),
  "react-dom": path.join(projectRoot, "node_modules/react-dom/cjs/react-dom.production.js"),
  "react-dom/client": path.join(projectRoot, "node_modules/react-dom/cjs/react-dom-client.production.js"),
  scheduler: path.join(projectRoot, "node_modules/scheduler/cjs/scheduler.production.js"),
};

loadDotEnv(path.join(projectRoot, ".env"));
fs.mkdirSync(outputDir, { recursive: true });
writeRuntimeEnv();
writeBundle();

function writeRuntimeEnv() {
  const domain = process.env.VITE_WENDAO_DOMAIN || process.env.WENDAO_DOMAIN || "";
  const content = [
    "window.__PHARMACOPILOT_ENV__ = Object.assign({}, window.__PHARMACOPILOT_ENV__, {",
    `  VITE_WENDAO_DOMAIN: ${JSON.stringify(domain)},`,
    `  WENDAO_DOMAIN: ${JSON.stringify(domain)}`,
    "});",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(outputDir, "wenda-env.js"), content);
}

function writeBundle() {
  const modules = { ...readVendorModules(), ...transpileAppModules() };
  const moduleEntries = Object.entries(modules)
    .map(([id, source]) => `${JSON.stringify(id)}: function(require, module, exports) {\n${source}\n}`)
    .join(",\n");
  const bundle = `(function() {
var __modules = {
${moduleEntries}
};
var __cache = {};
function __resolve(request, parentId) {
  if (request.charAt(0) !== ".") return request;
  var base = parentId ? parentId.split("/").slice(0, -1).join("/") : "";
  var segments = (base ? base + "/" + request : request).split("/");
  var resolved = [];
  for (var i = 0; i < segments.length; i += 1) {
    var segment = segments[i];
    if (!segment || segment === ".") continue;
    if (segment === "..") resolved.pop();
    else resolved.push(segment);
  }
  return resolved.join("/");
}
function __require(request, parentId) {
  var id = __resolve(request, parentId);
  if (__cache[id]) return __cache[id].exports;
  if (!__modules[id]) throw new Error("Module not found: " + id);
  var module = { exports: {} };
  __cache[id] = module;
  __modules[id](function(nextRequest) { return __require(nextRequest, id); }, module, module.exports);
  return module.exports;
}
__require("src/wenda-embed-entry", "");
})();`;
  fs.writeFileSync(path.join(outputDir, "wenda-embed-workspace.js"), bundle);
}

function readVendorModules() {
  return Object.fromEntries(Object.entries(vendorFiles).map(([id, filePath]) => [id, fs.readFileSync(filePath, "utf8")]));
}

function transpileAppModules() {
  return Object.fromEntries(
    Object.entries(moduleFiles).map(([id, filePath]) => {
      const source = fs.readFileSync(filePath, "utf8");
      const result = ts.transpileModule(source, {
        fileName: filePath,
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.React,
          jsxFactory: "React.createElement",
          jsxFragmentFactory: "React.Fragment",
          esModuleInterop: true,
        },
      });
      return [id, result.outputText];
    }),
  );
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
}
