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

for (const token of ["site-header", "nav-shell", "pp-nav-brief", "pp-nav-brief-main", "pp-nav-example", "pp-map-nav", "pp-map-stage-row", "pp-map-step-row", "evidenceFigure", "decisionPanel", "feedbackPanel", "artifactDrawer", "saveAssetBtn"]) {
  expect(html.includes(token), `HTML should include focused v3 element: ${token}`);
}
expect(!html.includes("app-header"), "teaching navigation header should match index.html site-header markup");
expect(html.includes('<div class="station-cover-main">'), "station cover should use the compact main container");
expect(html.includes('id="stationInputChips" class="station-input-chips"'), "station cover should expose input source chips");
expect(!html.includes("context-drawer"), "station cover should not restore the rationale drawer");
expect(!html.includes("stationRationale"), "station cover should not render station rationale in the top panel");
expect(!html.includes("本站依据"), "station cover should not explain rationale copy in the top panel");

for (const token of forbiddenHtmlTokens) {
  expect(!html.includes(token), `HTML should not restore constant backend/frontstage module: ${token}`);
}

for (const phrase of ["本页怎么用", "每个环节只完成一个关键判断", "读依据", "做判断", "生成产物", "当前示例", "管理学原理", "SWOT 分析", "药事管理本科班"]) {
  expect(html.includes(phrase), `HTML should include the new brief/example copy: ${phrase}`);
}
for (const token of [
  '<div class="pp-nav-example-head">',
  '<button class="pp-syllabus-chip" id="syllabusImportBtn" type="button" aria-label="导入或查看课程大纲状态">示例大纲</button>',
  '<input id="syllabusFileInput" class="visually-hidden-file" type="file" accept=".pdf,.doc,.docx,.txt,.md" />',
]) {
  expect(html.includes(token), `HTML should include syllabus example control: ${token}`);
}
const exampleListMatch = html.match(/<dl class="pp-nav-example-list">([\s\S]*?)<\/dl>/);
expect(Boolean(exampleListMatch), "HTML should keep the example course list");
if (exampleListMatch) {
  const exampleTerms = Array.from(exampleListMatch[1].matchAll(/<dt>([^<]+)<\/dt>/g)).map((match) => match[1]);
  expect(exampleTerms.length === 3, "example list should keep exactly three right-side items");
  expect(exampleTerms.join("|") === "示例课程|示例知识点|示例班级", "example list should only include course, topic, and class");
}
expect(!html.includes("大纲正文"), "HTML should not add a syllabus body field");
for (const token of ['data-stage="pre"', 'data-stage="in"', 'data-stage="post"', 'data-step="01"', 'data-step="10"', 'data-target="positioningLab"']) {
  expect(html.includes(token), `HTML should include new map attribute: ${token}`);
}
expect(!html.includes("<select id=\"scenarioSelect\""), "pharmacy scenario select should be removed from the new example card");
expect(!html.includes("四张大卡"), "HTML should not frame pharmacy scenarios as card grids");

expect(js.includes('const STORAGE_KEY = "pharmacopilot.navigation.focus.v3"'), "JS should use the focus v3 state key");
for (const token of ["renderSharedPrimaryNav", "sharedNavItems", "data-example-course", "stationInputChips", "[data-pp-map-nav] .pp-map-stage", "[data-pp-map-nav] .pp-map-step", "scrollToWorkbench", "option-rationale", "decisionPanel", "feedbackPanel", "artifactDrawer", "generateArtifactBtn", "saveAssetBtn", "nextStationBtn"]) {
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
expect(js.includes("const syllabusMock = {"), "station 1 should define a mock syllabus upstream input");
for (const token of ['loaded: false', 'courseGoal: "管理工具分析能力"', 'syllabusPoint: "环境分析与战略判断工具"', 'assessmentFocus: "案例分析与策略表达"']) {
  expect(js.includes(token), `mock syllabus should include ${token}`);
}
expect(js.includes("const learnerProfiles = {"), "station 1 should define named learner profiles");
for (const token of ['balanced: {', 'postgraduate: {', 'internship: {', 'civil: {', 'recommended: "comprehensive"', 'recommended: "research"', 'recommended: "service"', 'recommended: "policy"']) {
  expect(js.includes(token), `learner profiles should include ${token}`);
}
expect(js.includes("const positioningModes = {"), "station 1 should define four positioning modes as named options");
for (const token of ['comprehensive: {', 'research: {', 'service: {', 'policy: {', 'label: "综合决策型定位"', 'label: "证据研究型定位"', 'label: "服务运营型定位"', 'label: "政策治理型定位"']) {
  expect(js.includes(token), `positioning modes should include ${token}`);
}
expect(js.includes('state.syllabus = {'), "syllabus file input should update navigation state");
expect(js.includes("...currentSyllabus()"), "syllabus file input should preserve mock syllabus fields");
expect(js.includes("loaded: true"), "syllabus file input should mark syllabus as loaded");
expect(js.includes("fileName: file.name"), "syllabus file input should store file name only");
expect(js.includes("课程大纲已载入，已用于第 1 站定位输入。"), "syllabus import should confirm upstream use");
expect(!js.includes("大纲正文"), "station 1 should not show syllabus full text");
expect(!js.includes("syllabusBody"), "station 1 should not add a syllabus body field");
expect(!js.includes("课程定位三角图"), "station 1 should not keep the old abstract triangle chart title");
expect(!js.includes("function triangleSvg"), "station 1 should not keep the old abstract triangle renderer");

for (const className of [
  ".nav-shell",
  ".pp-nav-brief",
  ".pp-nav-brief-main",
  ".pp-nav-reminders",
  ".pp-nav-reminder",
  ".pp-nav-example",
  ".pp-nav-example-head",
  ".pp-map-nav",
  ".pp-map-stage-row",
  ".pp-map-stage",
  ".pp-map-step-row",
  ".pp-map-step",
  ".station-cover",
  ".station-cover-main",
  ".station-input-chips",
  ".station-input-chip",
  ".decision-workspace",
  ".evidence-figure",
  ".decision-panel",
  ".option-rationale",
  ".positioning-evidence-grid",
  ".positioning-feedback-list",
  ".positioning-artifact-guide",
  ".feedback-panel",
  ".artifact-panel",
  ".artifact-drawer",
  ".pp-syllabus-chip",
  ".visually-hidden-file",
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
