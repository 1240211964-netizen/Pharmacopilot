const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const jsPath = path.join(root, "前端核心", "teaching-navigation-productized.js");
const htmlPath = path.join(root, "前端核心", "teaching-navigation.html");

const js = fs.readFileSync(jsPath, "utf8");
const html = fs.readFileSync(htmlPath, "utf8");
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const frontendSupportToolLabels = [
  "导学问题",
  "判断流程卡",
  "案例阅读提示",
  "证据提取模板",
  "概念边界卡",
  "分层帮助卡",
  "课堂任务单",
  "示例与反例",
  "追问提示",
];

for (const label of frontendSupportToolLabels) {
  expect(js.includes(label), `teaching navigation should expose ${label}`);
}

expect(!js.includes("支架"), "teaching navigation visible copy should use concrete support-tool names instead of 支架");
expect(!html.includes("支架"), "teaching navigation HTML should not contain 支架 in visible copy");
expect(js.includes("导学支持线"), "diagnostic reference label should use 导学支持线 instead of 支架线");
expect(js.includes("需帮助卡"), "chart zone label should use 需帮助卡 instead of 需支架");

if (failures.length) {
  console.error("Teaching terminology verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Teaching terminology verification passed.");
