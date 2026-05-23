const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const frontend = path.join(root, "前端核心");
const htmlPath = path.join(frontend, "teaching-navigation.html");
const jsPath = path.join(frontend, "teaching-navigation-productized.js");
const cssPath = path.join(frontend, "teaching-navigation-productized.css");
const contractPath = path.join(frontend, "teaching-navigation-contract.js");
const httpUtilsPath = path.join(root, "后端核心", "src", "http-utils.ts");

const html = fs.readFileSync(htmlPath, "utf8");
const js = fs.readFileSync(jsPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const contractSource = fs.readFileSync(contractPath, "utf8");
const httpUtils = fs.readFileSync(httpUtilsPath, "utf8");
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

let contract = null;
try {
  const sandbox = { window: {} };
  vm.runInNewContext(contractSource, sandbox, { filename: contractPath });
  contract = sandbox.window.PharmacoPilotNavigationContract;
} catch (error) {
  failures.push(`contract should evaluate without errors: ${error.message}`);
}

const forbiddenHtmlTokens = [
  "qualityRadar",
  "quality-radar",
  "assetShelf",
  "asset-shelf",
  "agentStatusPanel",
  "agent-status-panel",
  "artifactPreview",
  "generated-artifact-preview",
  "evidenceChain",
  "evidence-chain-card",
  "workbench-side",
  "radar-asset-grid",
  "scenarioSwitcher",
  "scenario-card",
  "导出摘要",
  "质量雷达",
  "运行状态",
  "证据链",
  "资产货架",
];

const forbiddenJsTokens = [
  "renderQualityRadar",
  "renderAgentStatusPanel",
  "renderGeneratedArtifactPreview",
  "renderEvidenceChainCard",
  "renderAssetShelf",
  "exportNavigationSummary",
  "qualityRadar",
  "assetShelf",
  "agentStatusPanel",
  "artifactPreview",
  "evidenceChain",
  "Evidence figure",
  "One decision",
  "System feedback",
  "<span class=\"eyebrow\">Artifact</span>",
  "<small>${esc(option.rationale)}</small>",
];

expect(contract?.NAV_STATIONS?.length === 10, "contract should keep the complete 10-station structure");
expect(contract?.QUALITY_DIMENSIONS?.length === 6, "contract should keep the complete quality dimension structure");
expect(contract?.PHARMACY_SCENARIOS?.length === 4, "contract should keep the complete pharmacy scenario structure");

for (const token of ["nav-shell", "scenarioSelect", "phaseTabs", "stationChips", "evidenceFigure", "decisionPanel", "feedbackPanel", "artifactDrawer", "saveAssetBtn"]) {
  expect(html.includes(token), `HTML should include focused v3 element: ${token}`);
}

for (const token of forbiddenHtmlTokens) {
  expect(!html.includes(token), `HTML should not restore constant backend/frontstage module: ${token}`);
}

expect(html.includes("证据图 → 判断题 → 反馈 → 产物 → 保存资产"), "HTML should state the required primary interaction order");
expect(html.includes("<select id=\"scenarioSelect\""), "pharmacy scenario should be a lightweight select");
expect(!html.includes("四张大卡"), "HTML should not frame pharmacy scenarios as card grids");

expect(js.includes('const STORAGE_KEY = "pharmacopilot.navigation.focus.v3"'), "JS should use the focus v3 state key");
for (const token of ["scenarioSelect", "decisionPanel", "feedbackPanel", "artifactDrawer", "generateArtifactBtn", "saveAssetBtn", "nextStationBtn"]) {
  expect(js.includes(token), `JS should bind focused v3 control: ${token}`);
}
for (const token of ["canGenerateArtifact", "canSaveAsset", "hasSavedAsset", "requireDecisionFirst"]) {
  expect(js.includes(token), `JS should enforce ordered interaction with ${token}()`);
}
for (const token of forbiddenJsTokens) {
  expect(!js.includes(token), `JS should not expose backend panel or premature feedback token: ${token}`);
}

expect(js.includes("证据图"), "JS should use Chinese evidence figure label");
expect(js.includes("教学判断题"), "JS should use Chinese decision question label");
expect(js.includes("系统反馈"), "JS should use Chinese feedback label");
expect(js.includes("保存资产"), "JS should keep the save-asset action");

for (const className of [
  ".nav-shell",
  ".flow-strip",
  ".context-strip",
  ".route-panel",
  ".phase-tabs",
  ".station-chips",
  ".station-cover",
  ".context-drawer",
  ".decision-workspace",
  ".evidence-figure",
  ".decision-panel",
  ".feedback-panel",
  ".artifact-panel",
  ".artifact-drawer",
]) {
  expect(css.includes(className), `CSS should include focused layout class ${className}`);
}

for (const className of [".workbench-side", ".radar-asset-grid", ".quality-radar", ".asset-shelf", ".evidence-chain-card", ".agent-status-panel"]) {
  expect(!css.includes(className), `CSS should not include removed constant module class ${className}`);
}

expect(css.includes("@media"), "CSS should include responsive rules");

for (const route of ["/teaching-navigation-contract.js", "/teaching-navigation/teaching-navigation-contract.js", "/launch/teaching-navigation-contract.js"]) {
  expect(httpUtils.includes(`["${route}", "teaching-navigation-contract.js"]`), `static server should expose ${route}`);
}

if (failures.length) {
  console.error("Navigation focus v3 verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Navigation focus v3 verification passed.");
