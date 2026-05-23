(() => {
  "use strict";

  const contract = window.PharmacoPilotNavigationContract;
  const STORAGE_KEY = "pharmacopilot.navigation.phase10.v2";
  const DEFAULT_SECTIONS = ["图表观察", "教学判断", "药事管理情境", "课堂动作或评价动作", "证据与资产沉淀"];
  const palette = {
    ink: "#1f1e1d",
    muted: "#73726c",
    line: "rgba(31,30,29,.16)",
    grid: "rgba(31,30,29,.08)",
    paper: "#fffdf7",
    blue: "#48687b",
    sage: "#4d6257",
    amber: "#b38442",
    clay: "#d97757",
    rose: "#a45149",
    purple: "#6b6287",
  };

  if (!contract) {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.innerHTML = `<main class="page-shell"><article class="system-feedback is-warning"><strong>教学导航契约未加载</strong><p>请确认 teaching-navigation-contract.js 已在 productized 脚本之前加载。</p></article></main>`;
    });
    return;
  }

  const phases = normalizePhases(contract.NAVIGATION_PHASES || contract.NAV_STAGES || []);
  const phaseById = Object.fromEntries(phases.map((phase) => [phase.id, phase]));
  const stations = normalizeStations(contract.NAV_STATIONS || []);
  const scenarios = normalizeScenarios(contract.PHARMACY_SCENARIOS || []);
  const dimensions = normalizeDimensions(contract.QUALITY_DIMENSIONS || []);
  const dimensionById = Object.fromEntries(dimensions.map((dimension) => [dimension.id, dimension]));
  const interaction = contract.INTERACTION_CONTRACT || {};
  const artifactRequiredSections = interaction.artifactRequiredSections || DEFAULT_SECTIONS;

  const state = loadState();
  const $ = (id) => document.getElementById(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const esc = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function normalizePhases(rawPhases) {
    if (!Array.isArray(rawPhases)) return [];
    return rawPhases.map((phase, index) => ({
      id: String(phase.id || phase.key || `phase-${index + 1}`),
      title: phase.title || `阶段 ${index + 1}`,
      subtitle: phase.subtitle || phase.description || "",
      stationIds: Array.isArray(phase.stationIds)
        ? phase.stationIds.map(String)
        : (phase.nodes || []).map((node) => String(node.id)),
      outputPackage: phase.outputPackage || "",
      colorToken: phase.colorToken || ["accent", "sage", "blue"][index] || "accent",
    }));
  }

  function normalizeStations(rawStations) {
    if (!Array.isArray(rawStations)) return [];
    return rawStations.map((station, index) => {
      const id = String(station.id || `station-${index + 1}`);
      const phaseId = String(station.phase || phaseForLegacyStation(index));
      return {
        ...station,
        id,
        numericOrder: Number.parseInt(id, 10) || index + 1,
        phase: phaseId,
        phaseTitle: phaseById[phaseId]?.title || station.phase || "",
        title: station.title || station.displayName || `任务站 ${index + 1}`,
        displayName: station.displayName || station.title || `任务站 ${index + 1}`,
        short: station.short || station.title || station.displayName || `任务站 ${index + 1}`,
        what: station.what || station.purpose || "",
        why: station.why || "",
        how: station.how || station.teacherJob || "",
        artifactType: station.artifactType || station.outputType || "教学产物草稿",
        evidenceFigure: station.evidenceFigure || station.figureType || "证据图",
        userMindset: station.userMindset || station.purpose || "",
        qualityDimensions: station.qualityDimensions || station.dimensions || [],
        backendCheckpoints: station.backendCheckpoints || station.requiredElements || [],
      };
    });
  }

  function normalizeScenarios(rawScenarios) {
    const source = Array.isArray(rawScenarios)
      ? rawScenarios
      : Object.entries(rawScenarios).map(([id, scenario]) => ({ id, ...scenario }));
    return source.map((scenario, index) => ({
      id: String(scenario.id || `scenario-${index + 1}`),
      title: scenario.title || scenario.name || `药事情境 ${index + 1}`,
      subtitle: scenario.subtitle || scenario.desc || "",
      evidenceBoundary: scenario.evidenceBoundary || scenario.evidence || "",
    }));
  }

  function normalizeDimensions(rawDimensions) {
    return rawDimensions.map((dimension, index) => ({
      id: dimension.id || `dimension-${index + 1}`,
      label: dimension.label || dimension.description || `质量维度 ${index + 1}`,
      shortLabel: dimension.shortLabel || dimension.short || dimension.label || `维度 ${index + 1}`,
      theory: dimension.theory || dimension.source || "",
      diagnosticQuestion: dimension.diagnosticQuestion || dimension.description || "",
      color: dimension.color || [palette.blue, palette.sage, palette.clay, palette.amber, palette.purple, palette.rose][index % 6],
    }));
  }

  function phaseForLegacyStation(index) {
    if (index < 5) return "pre";
    if (index < 8) return "in";
    return "post";
  }

  function loadState() {
    const fallback = {
      activeStationIndex: 0,
      scenarioId: scenarios[0]?.id || "",
      decisions: {},
      drafts: {},
      assets: [],
    };
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!parsed || typeof parsed !== "object") return fallback;
      return {
        ...fallback,
        ...parsed,
        activeStationIndex: clamp(Number(parsed.activeStationIndex) || 0, 0, Math.max(0, stations.length - 1)),
        scenarioId: scenarios.some((scenario) => scenario.id === parsed.scenarioId) ? parsed.scenarioId : fallback.scenarioId,
        decisions: parsed.decisions && typeof parsed.decisions === "object" ? parsed.decisions : {},
        drafts: parsed.drafts && typeof parsed.drafts === "object" ? parsed.drafts : {},
        assets: Array.isArray(parsed.assets) ? parsed.assets : [],
      };
    } catch {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast("本地存储不可用，当前进度仅保留在页面会话中。");
    }
  }

  function stationKey(station = currentStation()) {
    return String(station?.id || "");
  }

  function currentStation() {
    return stations[state.activeStationIndex] || stations[0];
  }

  function currentPhase(station = currentStation()) {
    return phaseById[station?.phase] || phases.find((phase) => phase.stationIds.includes(stationKey(station))) || phases[0] || {};
  }

  function currentScenario() {
    return scenarios.find((scenario) => scenario.id === state.scenarioId) || scenarios[0] || {};
  }

  function phaseStations(phaseId) {
    const phase = phaseById[phaseId];
    if (phase?.stationIds?.length) {
      const ordered = phase.stationIds
        .map((id) => stations.find((station) => station.id === String(id)))
        .filter(Boolean);
      if (ordered.length) return ordered;
    }
    return stations.filter((station) => station.phase === phaseId);
  }

  function decisionQuestionFor(station) {
    return station.decisionQuestion || station.decision?.question || "当前教学设计最需要做出的判断是什么？";
  }

  function decisionOptionsFor(station = currentStation()) {
    if (station.decision?.options?.length) {
      return station.decision.options.map((option) => ({
        ...option,
        id: String(option.id),
        score: Number(option.score) || 2.4,
        rationale: option.rationale || "",
      }));
    }
    const checkpoints = station.backendCheckpoints.length ? station.backendCheckpoints : ["教学目标", "学生证据", "课堂动作"];
    return [
      {
        id: `${station.id}-evidence-first`,
        label: `先依据“${station.evidenceFigure}”判断${checkpoints[0]}，再生成${station.artifactType}`,
        score: 3.8,
        rationale: "先看证据再写产物，能把教学判断、药事情境和评价证据连起来。",
      },
      {
        id: `${station.id}-material-first`,
        label: `先补充${checkpoints.slice(0, 2).join("、")}材料，再决定是否进入产物生成`,
        score: 2.7,
        rationale: "可以推进，但需要明确哪些证据真正支持课堂动作或评价动作。",
      },
      {
        id: `${station.id}-lecture-first`,
        label: "直接按知识点顺序讲解，再让学生课后自行完成表格",
        score: 1.7,
        rationale: "容易退回讲授和填表，无法证明学生完成了药事管理判断。",
      },
    ];
  }

  function selectedOption(station = currentStation()) {
    const optionId = state.decisions[stationKey(station)];
    return decisionOptionsFor(station).find((option) => option.id === optionId) || null;
  }

  function stationAssets(stationId) {
    return state.assets.filter((asset) => String(asset.stationId) === String(stationId));
  }

  function stationMaturity(station = currentStation()) {
    const option = selectedOption(station);
    const hasDraft = Boolean(state.drafts[stationKey(station)]);
    const hasAsset = stationAssets(station.id).length > 0;
    const base = option ? option.score : 2.55;
    return clamp(base + (hasDraft ? 0.16 : 0) + (hasAsset ? 0.24 : 0), 1.2, 4);
  }

  function render() {
    renderRoute();
    renderScenarioSwitcher();
    renderActiveStation();
    renderEvidenceFigure();
    renderDecisionQuestion();
    renderSystemFeedback();
    renderArtifactPanel();
    renderAgentStatusPanel();
    renderGeneratedArtifactPreview();
    renderEvidenceChainCard();
    renderQualityRadar();
    renderAssetShelf();
  }

  function renderRoute() {
    renderPhaseRoute();
    renderStationRoute();
    renderProgress();
  }

  function renderPhaseRoute() {
    const target = $("phaseRoute");
    if (!target) return;
    const activePhase = currentPhase().id;
    target.innerHTML = phases.map((phase) => {
      const list = phaseStations(phase.id);
      const saved = list.filter((station) => stationAssets(station.id).length).length;
      const status = phase.id === activePhase ? "active" : saved === list.length && list.length ? "done" : "ready";
      return `<button class="phase-card ${esc(status)}" type="button" data-phase-id="${esc(phase.id)}">
        <span>${esc(phase.title)}</span>
        <strong>${esc(phase.outputPackage || `${list.length} 个任务站`)}</strong>
        <small>${esc(phase.subtitle)}</small>
        <em>${saved}/${list.length} 已保存</em>
      </button>`;
    }).join("");
    target.querySelectorAll("[data-phase-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const firstStation = phaseStations(button.dataset.phaseId)[0];
        const index = stations.findIndex((station) => station.id === firstStation?.id);
        if (index >= 0) {
          state.activeStationIndex = index;
          saveState();
          render();
        }
      });
    });
  }

  function renderStationRoute() {
    const route = $("stationRoute");
    if (!route) return;
    route.innerHTML = phases.map((phase) => {
      const list = phaseStations(phase.id);
      const nodes = list.map((station) => {
        const index = stations.findIndex((item) => item.id === station.id);
        const status = index === state.activeStationIndex ? "active" : stationAssets(station.id).length ? "done" : "ready";
        return `<button class="station-node ${esc(status)}" type="button" data-station-index="${index}" aria-current="${status === "active" ? "step" : "false"}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${esc(station.title)}</strong>
          <small>${esc(station.displayName)}</small>
        </button>`;
      }).join("");
      return `<section class="station-stage" aria-label="${esc(phase.title)}">
        <div class="station-stage-head">
          <strong>${esc(phase.title)}</strong>
          <span>${list.length} 站</span>
        </div>
        <div class="station-stage-nodes">${nodes}</div>
      </section>`;
    }).join("");
    route.querySelectorAll("[data-station-index]").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeStationIndex = Number(button.dataset.stationIndex) || 0;
        saveState();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function renderProgress() {
    const completed = new Set(state.assets.map((asset) => String(asset.stationId)));
    const progress = stations.length ? Math.max(8, (completed.size / stations.length) * 100) : 0;
    const fill = $("progressFill");
    if (fill) fill.style.width = `${progress}%`;
  }

  function renderScenarioSwitcher() {
    const switcher = $("scenarioSwitcher");
    if (!switcher) return;
    switcher.innerHTML = scenarios.map((scenario) => `<button class="scenario-option ${scenario.id === state.scenarioId ? "active" : ""}" type="button" data-scenario-id="${esc(scenario.id)}">
      <strong>${esc(scenario.title)}</strong>
      <span>${esc(scenario.subtitle)}</span>
    </button>`).join("");
    switcher.querySelectorAll("[data-scenario-id]").forEach((button) => {
      button.addEventListener("click", () => {
        state.scenarioId = button.dataset.scenarioId;
        saveState();
        render();
      });
    });
    const evidence = $("scenarioEvidence");
    if (evidence) evidence.textContent = currentScenario().evidenceBoundary || "";
  }

  function renderActiveStation() {
    const station = currentStation();
    const phase = currentPhase(station);
    const score = stationMaturity(station);
    $("phasePill").textContent = `${phase.title || "教学导航"} · ${String(state.activeStationIndex + 1).padStart(2, "0")}/${String(stations.length).padStart(2, "0")}`;
    $("activeTitle").textContent = station.displayName;
    $("activePurpose").textContent = `${station.userMindset || station.what} 当前情境：${currentScenario().title || "药事管理情境"}。`;
    $("maturityScore").textContent = score.toFixed(1);
    const scoreCard = document.querySelector(".step-score-card");
    if (scoreCard) {
      scoreCard.style.setProperty("--score-progress", `${clamp(score / 4, 0, 1) * 100}%`);
      scoreCard.dataset.level = score >= 3.45 ? "可沉淀" : score >= 3 ? "可推进" : "待判断";
    }
    const meta = $("activeStationMeta");
    if (!meta) return;
    const activeDimensions = station.qualityDimensions.map((id) => dimensionById[id]).filter(Boolean);
    meta.innerHTML = `
      <article>
        <span class="label">是什么</span>
        <strong>${esc(station.what)}</strong>
      </article>
      <article>
        <span class="label">为什么</span>
        <strong>${esc(station.why)}</strong>
      </article>
      <article>
        <span class="label">用户如何做</span>
        <strong>${esc(station.how)}</strong>
      </article>
      <article>
        <span class="label">本站产物</span>
        <strong>${esc(station.artifactType)}</strong>
        <div class="chip-row">${activeDimensions.map((dimension) => `<span style="--chip-color:${esc(dimension.color)}">${esc(dimension.shortLabel)}</span>`).join("")}</div>
      </article>`;
  }

  function renderEvidenceFigure() {
    const station = currentStation();
    const scenario = currentScenario();
    const figure = buildFigureModel(station, scenario);
    const target = $("evidenceFigure");
    if (!target) return;
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">证据图</span>
          <h2>${esc(figure.title)}</h2>
        </div>
        <span class="figure-type">${esc(figure.axis)}</span>
      </div>
      <div class="figure-canvas">${renderFigureSvg(figure)}</div>
      <p class="figure-caption">${esc(figure.caption)}</p>`;
  }

  function renderDecisionQuestion() {
    const station = currentStation();
    const selected = selectedOption(station);
    const target = $("decisionQuestion");
    if (!target) return;
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">教学判断题</span>
          <h2>${esc(decisionQuestionFor(station))}</h2>
        </div>
        <span class="question-count">${esc(station.artifactType)}</span>
      </div>
      <div class="decision-options">
        ${decisionOptionsFor(station).map((option, index) => `<button class="decision-option ${selected?.id === option.id ? "active" : ""}" type="button" data-option-id="${esc(option.id)}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${esc(option.label)}</strong>
          <small>${esc(option.rationale || (option.score >= 3 ? "更接近证据化教学设计" : "需要补充证据或作为反例比较"))}</small>
        </button>`).join("")}
      </div>`;
    target.querySelectorAll("[data-option-id]").forEach((button) => {
      button.addEventListener("click", () => {
        state.decisions[stationKey(station)] = button.dataset.optionId;
        saveState();
        render();
      });
    });
  }

  function renderSystemFeedback() {
    const station = currentStation();
    const option = selectedOption(station);
    const target = $("systemFeedback");
    if (!target) return;
    if (!option) {
      target.innerHTML = `
        <span class="eyebrow">系统反馈</span>
        <h2>先完成本站教学判断</h2>
        <p>选择一个判断后，系统会把证据图、药事情境、质量维度和本站产物连起来，避免新教师只停留在流程填空。</p>`;
      return;
    }
    const level = option.score >= 3.4 ? "可作为本站主判断" : option.score >= 2.5 ? "需要补证据后推进" : "不建议作为主方案";
    const dims = station.qualityDimensions.map((id) => dimensionById[id]?.shortLabel).filter(Boolean).join("、");
    target.innerHTML = `
      <span class="eyebrow">系统反馈</span>
      <h2>${esc(level)}</h2>
      <p>你选择了“${esc(option.label)}”。该判断成熟度为 ${option.score.toFixed(1)} / 4.0，主要影响 ${esc(dims)}。下一步应生成“${esc(station.artifactType)}”，并把证据写入教学资产。</p>
      <div class="feedback-metrics">
        <span><strong>${option.score.toFixed(1)}</strong>判断成熟度</span>
        <span><strong>${esc(currentScenario().title)}</strong>药事情境</span>
        <span><strong>${esc(station.backendCheckpoints.length)}</strong>后台检查点</span>
      </div>`;
  }

  function generateArtifactDraft() {
    const station = currentStation();
    const scenario = currentScenario();
    const option = selectedOption(station);
    const figure = buildFigureModel(station, scenario);
    const decisionText = option ? option.label : "尚未选择最终判断，建议先完成本站教学判断题。";
    const sections = {
      图表观察: `${figure.insight} 图注提示：${figure.caption}`,
      教学判断: `本站判断为“${decisionText}”。该判断服务于“${station.what}”。`,
      药事管理情境: `采用“${scenario.title}”语境，证据边界包括：${scenario.evidenceBoundary}。SWOT 仅作为管理学原理中的示例知识点。`,
      课堂动作或评价动作: `教师应执行：${station.how} 产出物为“${station.artifactType}”。`,
      证据与资产沉淀: `写入资产前需覆盖${station.backendCheckpoints.join("、")}，并对照${station.qualityDimensions.map((id) => dimensionById[id]?.label).filter(Boolean).join("、")}。`,
    };
    const draft = artifactRequiredSections.map((section) => `【${section}】\n${sections[section] || "请补充本站证据。"}`).join("\n\n");
    state.drafts[stationKey(station)] = draft;
    saveState();
    const textarea = $("artifactText");
    if (textarea) textarea.value = draft;
    toast("已生成本站产物草稿");
    renderArtifactPanel();
    renderGeneratedArtifactPreview();
    renderEvidenceChainCard();
    renderQualityRadar();
    return draft;
  }

  function saveTeachingAsset() {
    const station = currentStation();
    const textarea = $("artifactText");
    const text = (textarea?.value || state.drafts[stationKey(station)] || generateArtifactDraft()).trim();
    if (!text) return;
    state.drafts[stationKey(station)] = text;
    state.assets = state.assets.filter((asset) => String(asset.stationId) !== station.id);
    state.assets.push({
      stationId: station.id,
      title: `${station.title} · ${station.artifactType}`,
      text,
      createdAt: new Date().toISOString(),
      scenarioId: state.scenarioId,
      phaseId: station.phase,
    });
    saveState();
    toast("已保存为教学资产");
    render();
  }

  function renderQualityRadar() {
    const target = $("qualityRadar");
    if (!target) return;
    const scores = computeQualityScores();
    const points = radarPoints(scores, 124, 124, 82).join(" ");
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">质量诊断</span>
          <h2>六维教学设计质量雷达</h2>
        </div>
        <span class="figure-type">建议阈值 70%</span>
      </div>
      <svg class="radar-chart" viewBox="0 0 248 248" role="img" aria-label="六维质量雷达图">
        <title>六维教学设计质量雷达</title>
        <desc>根据当前任务站、教学判断和保存资产估算质量成熟度。</desc>
        ${[0.35, 0.7, 1].map((ratio) => `<polygon points="${radarPoints(scores.map(() => ({ value: ratio * 100 })), 124, 124, 82).join(" ")}" fill="none" stroke="${palette.grid}" />`).join("")}
        ${radarAxis(scores, 124, 124, 88)}
        <polygon points="${points}" fill="rgba(77,98,87,.20)" stroke="${palette.sage}" stroke-width="2" />
      </svg>
      <div class="radar-legend">
        ${scores.map((score) => `<span><i style="background:${esc(score.color)}"></i>${esc(score.shortLabel)} ${Math.round(score.value)}%</span>`).join("")}
      </div>`;
  }

  function exportNavigationSummary() {
    const summary = buildSummaryMarkdown();
    const output = $("summaryExport");
    if (output) {
      output.hidden = false;
      output.innerHTML = `<div class="panel-head"><div><span class="eyebrow">导出摘要</span><h2>教学导航摘要已生成</h2></div></div><pre>${esc(summary)}</pre>`;
    }
    const blob = new Blob([summary], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pharmacopilot-teaching-navigation-summary.md";
    link.click();
    URL.revokeObjectURL(url);
    toast("已导出教学导航摘要");
    return summary;
  }

  function renderArtifactPanel() {
    const station = currentStation();
    const title = $("artifactTitle");
    if (title) title.textContent = station.artifactType;
    const requirements = $("requirementRow");
    if (requirements) {
      requirements.innerHTML = artifactRequiredSections.map((section) => `<span>${esc(section)}</span>`).join("");
    }
    const textarea = $("artifactText");
    if (textarea && document.activeElement !== textarea) {
      textarea.value = state.drafts[stationKey(station)] || "";
      textarea.placeholder = `生成或直接撰写“${station.artifactType}”。草稿必须覆盖：${artifactRequiredSections.join("、")}。`;
    }
  }

  function renderAgentStatusPanel() {
    const target = $("agentStatusPanel");
    if (!target) return;
    const station = currentStation();
    const scenario = currentScenario();
    const option = selectedOption(station);
    const evidenceLevel = option?.score >= 3.4 ? "较充分" : option ? "需补证据" : "等待教师判断";
    const rows = [
      ["当前任务", `基于“${station.title}”生成可审校教学产物`],
      ["输入来源", `${scenario.title} / ${station.backendCheckpoints.slice(0, 3).join(" / ")}`],
      ["证据充分性", `${evidenceLevel}：${option ? option.label : "尚未选择主要判断"}`],
      ["待教师确认", `是否批准“${station.artifactType}”进入教学资产`],
    ];
    target.innerHTML = `
      <div class="agent-status-head">
        <div>
          <span class="agent-live-dot" aria-hidden="true"></span>
          <strong>系统按契约运行</strong>
        </div>
        <span>教师确认后写入资产</span>
      </div>
      <div class="agent-status-rows">
        ${rows.map(([key, value]) => `<div>
          <span>${esc(key)}</span>
          <p>${esc(value)}</p>
        </div>`).join("")}
      </div>`;
  }

  function renderGeneratedArtifactPreview() {
    const target = $("artifactPreview");
    if (!target) return;
    const station = currentStation();
    const option = selectedOption(station);
    const figure = buildFigureModel(station, currentScenario());
    const draft = state.drafts[stationKey(station)] || "";
    const diagnosis = option
      ? `当前判断为“${option.label}”，系统将其转化为“${station.artifactType}”。`
      : "当前尚未完成教师判断，产物预览会在选择后自动收敛。";
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">产物预览</span>
          <h2>${esc(station.artifactType)}</h2>
        </div>
        <span class="artifact-preview-status">${draft ? "可审校" : "待生成"}</span>
      </div>
      <div class="artifact-preview-body">
        <p><strong>诊断：</strong>${esc(diagnosis)}</p>
        <p><strong>调整：</strong>${esc(figure.insight)}</p>
        <p><strong>评价：</strong>${esc(station.backendCheckpoints.slice(0, 3).join("、"))} 将进入本站证据链。</p>
      </div>`;
  }

  function renderEvidenceChainCard() {
    const target = $("evidenceChain");
    if (!target) return;
    const station = currentStation();
    const scenario = currentScenario();
    const option = selectedOption(station);
    const items = [
      ["观点", option ? `本站主判断是：${option.label}` : "等待教师完成本站关键判断。"],
      ["依据", `${station.backendCheckpoints.join("、")}，并结合${scenario.evidenceBoundary}。`],
      ["教学理论", station.qualityDimensions.map((id) => dimensionById[id]?.theory).filter(Boolean).join("；")],
      ["药事管理场景", scenario.title],
      ["教师动作", station.how],
      ["评价方式", station.artifactType],
      ["资产沉淀", option?.score >= 3 ? "可保存为下一轮教案、任务单、量规或复盘素材。" : "先补充学生表现证据，再允许写入课程资产。"],
    ];
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">课程证据链</span>
          <h2>为什么这样设计</h2>
        </div>
        <span class="asset-count">${items.length} 项</span>
      </div>
      <div class="evidence-chain-list">
        ${items.map(([key, value]) => `<div>
          <span>${esc(key)}</span>
          <p>${esc(value || "待补充")}</p>
        </div>`).join("")}
      </div>`;
  }

  function renderAssetShelf() {
    const target = $("assetShelf");
    if (!target) return;
    const latestAssets = [...state.assets].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">资产保存</span>
          <h2>已沉淀教学资产</h2>
        </div>
        <span class="asset-count">${latestAssets.length} 项</span>
      </div>
      <div class="asset-list">
        ${latestAssets.length ? latestAssets.map((asset) => `<article>
          <strong>${esc(asset.title)}</strong>
          <p>${esc(asset.text.slice(0, 110))}${asset.text.length > 110 ? "..." : ""}</p>
          <small>${esc(formatDate(asset.createdAt))}</small>
        </article>`).join("") : `<p class="empty-hint">保存本站产物后，会在这里形成可复用教学资产。</p>`}
      </div>`;
  }

  function buildFigureModel(station, scenario) {
    const scenarioIndex = Math.max(0, scenarios.findIndex((item) => item.id === scenario.id));
    const seed = state.activeStationIndex + scenarioIndex + 1;
    const value = (offset) => 46 + ((seed * 17 + offset * 13) % 42);
    const checkpoints = station.backendCheckpoints.length ? station.backendCheckpoints : ["目标", "活动", "评价", "资产"];
    const dimensionColor = dimensionById[station.qualityDimensions[0]]?.color || palette.sage;
    const data = checkpoints.slice(0, 5).map((label, index) => ({
      label,
      value: value(index),
      color: [dimensionColor, palette.blue, palette.amber, palette.clay, palette.sage][index % 5],
    }));
    return {
      title: `${station.evidenceFigure} · ${scenario.title}`,
      axis: "证据充分性 / 教学可行动性",
      caption: `图注：本图用于支持“${station.title}”的教学判断，证据范围限定在${scenario.evidenceBoundary}。`,
      insight: `当前${scenario.title}情境中，${checkpoints[0]}与${checkpoints[1] || "评价证据"}是最需要显性化的依据。`,
      type: figureTypeFor(station),
      data,
    };
  }

  function figureTypeFor(station) {
    const id = Number(station.id);
    if (id === 1) return "triangle";
    if (id === 2) return "scatter";
    if (id === 3 || id === 9) return "radar";
    if (id === 4 || id === 5) return "structure";
    if (id === 6 || id === 8) return "timeline";
    if (id === 7) return "swimlane";
    if (id === 10) return "loop";
    return "bar";
  }

  function renderFigureSvg(figure) {
    if (figure.type === "triangle") return renderTriangleSvg(figure);
    if (figure.type === "scatter") return renderScatterSvg(figure);
    if (figure.type === "structure") return renderStructureSvg(figure);
    if (figure.type === "timeline") return renderTimelineSvg(figure);
    if (figure.type === "swimlane") return renderSwimlaneSvg(figure);
    if (figure.type === "radar") return renderHeatmapSvg(figure);
    if (figure.type === "loop") return renderLoopSvg(figure);
    return renderBarSvg(figure);
  }

  function renderBarSvg(figure) {
    const bars = figure.data.slice(0, 4);
    return `<svg viewBox="0 0 520 280" role="img" aria-label="${esc(figure.title)}">
      <title>${esc(figure.title)}</title>
      <desc>${esc(figure.caption)}</desc>
      <line x1="62" y1="218" x2="486" y2="218" stroke="${palette.line}" />
      <line x1="62" y1="40" x2="62" y2="218" stroke="${palette.line}" />
      <text x="62" y="252" fill="${palette.muted}" font-size="13">证据要素</text>
      <text x="18" y="44" fill="${palette.muted}" font-size="13">强度</text>
      <line x1="62" y1="86" x2="486" y2="86" stroke="${palette.grid}" stroke-dasharray="5 6" />
      <text x="438" y="80" fill="${palette.muted}" font-size="12">建议阈值</text>
      ${bars.map((bar, index) => {
        const x = 92 + index * 96;
        const height = Math.round((bar.value / 100) * 150);
        return `<g>
          <rect x="${x}" y="${218 - height}" width="48" height="${height}" rx="8" fill="${esc(bar.color)}" opacity=".86" />
          <text x="${x + 24}" y="${207 - height}" text-anchor="middle" fill="${palette.ink}" font-size="13">${Math.round(bar.value)}%</text>
          <text x="${x + 24}" y="239" text-anchor="middle" fill="${palette.muted}" font-size="12">${esc(bar.label.slice(0, 6))}</text>
        </g>`;
      }).join("")}
    </svg>`;
  }

  function renderTriangleSvg(figure) {
    const labels = figure.data.slice(0, 3);
    const coords = [[260, 56], [118, 210], [402, 210]];
    return `<svg viewBox="0 0 520 280" role="img" aria-label="${esc(figure.title)}">
      <title>${esc(figure.title)}</title>
      <desc>${esc(figure.caption)}</desc>
      <polygon points="260,56 118,210 402,210" fill="rgba(77,98,87,.10)" stroke="${palette.line}" />
      <text x="260" y="246" text-anchor="middle" fill="${palette.muted}" font-size="13">课程目标 · 药事任务 · 学生产出需要同时成立</text>
      ${labels.map((item, index) => `<g>
        <circle cx="${coords[index][0]}" cy="${coords[index][1]}" r="34" fill="${index === 0 ? palette.sage : index === 1 ? palette.blue : palette.amber}" opacity=".88" />
        <text x="${coords[index][0]}" y="${coords[index][1] - 2}" text-anchor="middle" fill="#fffaf4" font-size="12">${esc(item.label.slice(0, 5))}</text>
        <text x="${coords[index][0]}" y="${coords[index][1] + 15}" text-anchor="middle" fill="#fffaf4" font-size="11">${Math.round(item.value)}%</text>
      </g>`).join("")}
    </svg>`;
  }

  function renderScatterSvg(figure) {
    return `<svg viewBox="0 0 520 280" role="img" aria-label="${esc(figure.title)}">
      <title>${esc(figure.title)}</title>
      <desc>${esc(figure.caption)}</desc>
      <rect x="62" y="38" width="392" height="190" rx="14" fill="rgba(255,253,247,.72)" stroke="${palette.line}" />
      <line x1="62" y1="132" x2="454" y2="132" stroke="${palette.grid}" />
      <line x1="258" y1="38" x2="258" y2="228" stroke="${palette.grid}" />
      <text x="62" y="252" fill="${palette.muted}" font-size="13">预习参与度</text>
      <text x="18" y="220" fill="${palette.muted}" font-size="13" transform="rotate(-90 18 220)">诊断表现</text>
      ${figure.data.slice(0, 4).map((item, index) => {
        const x = 106 + index * 82 + (item.value % 18);
        const y = 214 - (item.value % 128);
        return `<g>
          <circle cx="${x}" cy="${y}" r="17" fill="${esc(item.color)}" opacity=".86" />
          <text x="${x}" y="${y + 5}" text-anchor="middle" fill="#fffaf4" font-size="12">${index + 1}</text>
          <text x="${x}" y="${y - 24}" text-anchor="middle" fill="${palette.ink}" font-size="12">${esc(item.label.slice(0, 5))}</text>
        </g>`;
      }).join("")}
    </svg>`;
  }

  function renderStructureSvg(figure) {
    return `<svg viewBox="0 0 520 280" role="img" aria-label="${esc(figure.title)}">
      <title>${esc(figure.title)}</title>
      <desc>${esc(figure.caption)}</desc>
      <text x="34" y="42" fill="${palette.muted}" font-size="13">结构链：材料 → 问题 → 学生活动 → 评价证据</text>
      ${figure.data.slice(0, 4).map((item, index) => {
        const x = 44 + index * 116;
        return `<g>
          <rect x="${x}" y="78" width="92" height="104" rx="14" fill="${index % 2 ? "rgba(72,104,123,.14)" : "rgba(77,98,87,.14)"}" stroke="${palette.line}" />
          <text x="${x + 46}" y="116" text-anchor="middle" fill="${palette.ink}" font-size="14">${esc(item.label.slice(0, 6))}</text>
          <text x="${x + 46}" y="145" text-anchor="middle" fill="${palette.muted}" font-size="12">${Math.round(item.value)}%</text>
          ${index < 3 ? `<path d="M${x + 94} 130 L${x + 112} 130" stroke="${palette.line}" stroke-width="2" marker-end="url(#arrow)" />` : ""}
        </g>`;
      }).join("")}
      <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="${palette.line}" /></marker></defs>
      <line x1="44" y1="216" x2="466" y2="216" stroke="${palette.grid}" />
      <text x="44" y="239" fill="${palette.muted}" font-size="12">每个结构节点都必须转化为可观察、可评价的学生证据</text>
    </svg>`;
  }

  function renderTimelineSvg(figure) {
    return `<svg viewBox="0 0 520 280" role="img" aria-label="${esc(figure.title)}">
      <title>${esc(figure.title)}</title>
      <desc>${esc(figure.caption)}</desc>
      <line x1="62" y1="142" x2="458" y2="142" stroke="${palette.line}" stroke-width="2" />
      ${figure.data.slice(0, 4).map((item, index) => {
        const x = 82 + index * 112;
        const y = index % 2 ? 170 : 96;
        return `<g>
          <circle cx="${x}" cy="142" r="8" fill="${esc(item.color)}" />
          <line x1="${x}" y1="142" x2="${x}" y2="${y}" stroke="${palette.grid}" />
          <rect x="${x - 42}" y="${y - 28}" width="84" height="44" rx="11" fill="rgba(255,253,247,.86)" stroke="${palette.line}" />
          <text x="${x}" y="${y - 5}" text-anchor="middle" fill="${palette.ink}" font-size="12">${esc(item.label.slice(0, 5))}</text>
          <text x="${x}" y="${y + 11}" text-anchor="middle" fill="${palette.muted}" font-size="11">${Math.round(item.value)}%</text>
        </g>`;
      }).join("")}
      <text x="62" y="228" fill="${palette.muted}" font-size="13">课堂检查点必须能触发反馈、调节或学生产出修正</text>
    </svg>`;
  }

  function renderSwimlaneSvg(figure) {
    const lanes = figure.data.slice(0, 4);
    return `<svg viewBox="0 0 520 280" role="img" aria-label="${esc(figure.title)}">
      <title>${esc(figure.title)}</title>
      <desc>${esc(figure.caption)}</desc>
      ${lanes.map((item, index) => {
        const y = 54 + index * 48;
        const width = 176 + item.value * 2;
        return `<g>
          <text x="34" y="${y + 21}" fill="${palette.muted}" font-size="12">${esc(item.label.slice(0, 7))}</text>
          <rect x="126" y="${y}" width="330" height="30" rx="8" fill="rgba(31,30,29,.05)" />
          <rect x="126" y="${y}" width="${clamp(width, 132, 330)}" height="30" rx="8" fill="${esc(item.color)}" opacity=".72" />
          <text x="468" y="${y + 20}" fill="${palette.ink}" font-size="12">${Math.round(item.value)}%</text>
        </g>`;
      }).join("")}
      <text x="126" y="252" fill="${palette.muted}" font-size="13">小组角色、证据判断和成果展示要形成可观察产出</text>
    </svg>`;
  }

  function renderHeatmapSvg(figure) {
    const cells = figure.data.slice(0, 4);
    return `<svg viewBox="0 0 520 280" role="img" aria-label="${esc(figure.title)}">
      <title>${esc(figure.title)}</title>
      <desc>${esc(figure.caption)}</desc>
      <text x="42" y="42" fill="${palette.muted}" font-size="13">行：评价要素；列：证据解释水平</text>
      ${cells.map((item, row) => [0, 1, 2].map((col) => {
        const value = clamp(item.value - col * 8 + row * 3, 20, 95);
        return `<g>
          <rect x="${92 + col * 98}" y="${70 + row * 42}" width="84" height="32" rx="7" fill="${heatColor(value)}" />
          <text x="${134 + col * 98}" y="${91 + row * 42}" text-anchor="middle" fill="${palette.ink}" font-size="12">${Math.round(value)}</text>
        </g>`;
      }).join("") + `<text x="36" y="${92 + row * 42}" fill="${palette.muted}" font-size="12">${esc(item.label.slice(0, 6))}</text>`).join("")}
    </svg>`;
  }

  function renderLoopSvg(figure) {
    const labels = figure.data.slice(0, 4);
    const coords = [[260, 64], [396, 140], [260, 218], [124, 140]];
    return `<svg viewBox="0 0 520 280" role="img" aria-label="${esc(figure.title)}">
      <title>${esc(figure.title)}</title>
      <desc>${esc(figure.caption)}</desc>
      <path d="M260 64 C382 70 426 176 260 218 C94 176 138 70 260 64" fill="none" stroke="${palette.grid}" stroke-width="2" />
      ${labels.map((item, index) => `<g>
        <circle cx="${coords[index][0]}" cy="${coords[index][1]}" r="34" fill="${index % 2 ? "rgba(179,132,66,.18)" : "rgba(77,98,87,.18)"}" stroke="${palette.line}" />
        <text x="${coords[index][0]}" y="${coords[index][1] - 3}" text-anchor="middle" fill="${palette.ink}" font-size="12">${esc(item.label.slice(0, 5))}</text>
        <text x="${coords[index][0]}" y="${coords[index][1] + 15}" text-anchor="middle" fill="${palette.muted}" font-size="11">${Math.round(item.value)}%</text>
      </g>`).join("")}
      <text x="260" y="144" text-anchor="middle" fill="${palette.muted}" font-size="13">证据回流</text>
    </svg>`;
  }

  function heatColor(value) {
    if (value > 74) return "rgba(77,98,87,.30)";
    if (value > 58) return "rgba(179,132,66,.28)";
    return "rgba(217,119,87,.26)";
  }

  function computeQualityScores() {
    const station = currentStation();
    const option = selectedOption(station);
    const hasDraft = Boolean(state.drafts[stationKey(station)]);
    const hasAsset = stationAssets(station.id).length > 0;
    return dimensions.map((dimension, index) => {
      const active = station.qualityDimensions.includes(dimension.id);
      const base = active ? 67 : 53 + ((state.activeStationIndex + index) % 10);
      const value = base + (option ? option.score * 5 : 0) + (hasDraft ? 4 : 0) + (hasAsset ? 5 : 0);
      return { ...dimension, active, value: clamp(value, 34, 94) };
    });
  }

  function radarPoints(scores, cx, cy, radius) {
    return scores.map((score, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / scores.length;
      const r = radius * clamp(score.value / 100, 0, 1);
      return `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
    });
  }

  function radarAxis(scores, cx, cy, radius) {
    return scores.map((score, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / scores.length;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      const labelX = cx + Math.cos(angle) * (radius + 18);
      const labelY = cy + Math.sin(angle) * (radius + 18);
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${palette.grid}" />
        <text x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="${esc(score.color)}" font-size="12">${esc(score.shortLabel)}</text>`;
    }).join("");
  }

  function buildSummaryMarkdown() {
    const scenario = currentScenario();
    const lines = [
      "# PharmacoPilot 教学导航摘要",
      "",
      `- 当前情境：${scenario.title}`,
      `- 情境证据：${scenario.evidenceBoundary}`,
      `- 已保存资产：${state.assets.length} 项`,
      "",
      "## 三时段任务站进展",
    ];
    phases.forEach((phase) => {
      lines.push("", `### ${phase.title}`);
      phaseStations(phase.id).forEach((station) => {
        const option = decisionOptionsFor(station).find((item) => item.id === state.decisions[stationKey(station)]);
        const asset = state.assets.find((item) => String(item.stationId) === station.id);
        lines.push(`- ${station.title}：${option ? option.label : "未判断"}；${asset ? "已保存资产" : "未保存资产"}`);
      });
    });
    return lines.join("\n");
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  function getConfiguredWendaDomain() {
    const env = window.__PHARMACOPILOT_ENV__ || {};
    const raw = env.VITE_WENDAO_DOMAIN || env.WENDAO_DOMAIN || "";
    return String(raw).trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
  }

  function buildWendaPlatformAuthUrl() {
    const domain = getConfiguredWendaDomain();
    if (!domain) return "";
    const url = new URL("/api/openAccess/redirect/home", `https://${domain}`);
    url.searchParams.set("hd", "0,1,1");
    return url.href;
  }

  function syncHeaderWendaAuthLinks() {
    const url = buildWendaPlatformAuthUrl();
    document.querySelectorAll("[data-wenda-platform-auth]").forEach((link) => {
      link.href = url || "about:blank";
      link.target = "_blank";
      link.rel = "noreferrer";
      link.setAttribute("aria-disabled", String(!url));
    });
  }

  function initProductizedGlobalNav() {
    const header = document.querySelector(".site-header");
    const button = $("navMenuToggle");
    const closeNav = () => {
      document.body.classList.remove("nav-open");
      button?.setAttribute("aria-expanded", "false");
    };
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === "teaching-navigation");
      if (link.dataset.nav === "teaching-navigation") link.setAttribute("aria-current", "page");
    });
    button?.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      document.body.classList.toggle("nav-open", !expanded);
      button.setAttribute("aria-expanded", String(!expanded));
    });
    header?.querySelectorAll(".topnav a, .top-actions a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
    header?.querySelectorAll("[data-auth-provider='github']").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        toast("GitHub 授权待接入：未来用于读取仓库、同步教学资产与版本。");
      });
    });
    syncHeaderWendaAuthLinks();
    header?.querySelectorAll("[data-wenda-platform-auth]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const url = buildWendaPlatformAuthUrl();
        if (!url) {
          event.preventDefault();
          toast("未配置闻道机构域名，请先在配置服务填写后再打开授权链接。");
          return;
        }
        event.currentTarget.href = url;
      });
    });
    const syncHeaderScrollState = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    syncHeaderScrollState();
    window.addEventListener("scroll", syncHeaderScrollState, { passive: true });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  function bindStaticActions() {
    $("generateArtifactBtn")?.addEventListener("click", generateArtifactDraft);
    $("writeAssetBtn")?.addEventListener("click", saveTeachingAsset);
    $("nextFrontStepBtn")?.addEventListener("click", () => {
      if (state.activeStationIndex < stations.length - 1) {
        state.activeStationIndex += 1;
        saveState();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast("十个任务站已完成，可导出导航摘要。");
      }
    });
    $("exportSummaryBtn")?.addEventListener("click", exportNavigationSummary);
    $("artifactText")?.addEventListener("input", (event) => {
      const station = currentStation();
      state.drafts[stationKey(station)] = event.target.value;
      saveState();
      renderQualityRadar();
    });
  }

  function toast(text) {
    const target = $("toast");
    if (!target) return;
    target.textContent = text;
    target.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => target.classList.remove("show"), 2200);
  }

  function initTeachingNavigationWorkbench() {
    if (!stations.length) return;
    initProductizedGlobalNav();
    bindStaticActions();
    render();
  }

  document.addEventListener("DOMContentLoaded", initTeachingNavigationWorkbench);
})();
