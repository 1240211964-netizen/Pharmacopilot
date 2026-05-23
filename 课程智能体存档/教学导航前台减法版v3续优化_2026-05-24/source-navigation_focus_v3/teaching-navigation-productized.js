(() => {
  "use strict";

  const contract = window.PharmacoPilotNavigationContract;
  const STORAGE_KEY = "pharmacopilot.navigation.focus.v3";
  const $ = (id) => document.getElementById(id);
  const esc = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  if (!contract) {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.innerHTML = `<main class="nav-shell"><article class="feedback-panel show"><h2>教学导航契约未加载</h2><p>请确认 teaching-navigation-contract.js 已在 productized 脚本之前加载。</p></article></main>`;
    });
    return;
  }

  const phases = contract.NAVIGATION_PHASES || [];
  const stations = contract.NAV_STATIONS || [];
  const scenarios = contract.PHARMACY_SCENARIOS || [];
  const dimensions = contract.QUALITY_DIMENSIONS || [];
  const phaseById = Object.fromEntries(phases.map((phase) => [String(phase.id), phase]));
  const stationById = Object.fromEntries(stations.map((station) => [String(station.id), station]));
  const scenarioById = Object.fromEntries(scenarios.map((scenario) => [String(scenario.id), scenario]));
  const dimensionById = Object.fromEntries(dimensions.map((dimension) => [String(dimension.id), dimension]));

  const state = loadState();

  const decisionBank = {
    1: [
      ["decision", "定位为药事管理情境中的管理决策训练", "让 SWOT 服务专业判断，而不是停留在工具介绍。", 3.8],
      ["concept", "定位为管理学工具概念讲授", "可以讲清概念，但对专业迁移支持较弱。", 2.1],
      ["exam", "定位为期末考试知识点复习", "适合复习课，不适合作为新课主线。", 1.8],
    ],
    2: [
      ["evidence", "学生会填表，但证据链表达不足", "这是最容易被忽略的高风险问题，应前置证据引用训练。", 3.7],
      ["boundary", "内部条件与外部环境边界混淆", "需要通过正反例和判断流程卡澄清。", 3.3],
      ["participation", "低参与学生无法进入任务", "需要低门槛入口和小组角色支持。", 3.0],
    ],
    3: [
      ["evidence", "为每个目标配置评价证据", "最能建立目标、活动、产出和评价之间的闭环。", 3.8],
      ["verb", "把“理解”改写为可观察行为", "能减少空泛目标，是必要改进。", 3.4],
      ["more", "增加更多目标以显得完整", "目标过多会稀释课堂主线。", 1.7],
    ],
    4: [
      ["chain", "按“概念边界—证据判断—策略建议”组织", "能把教材内容转化为学生可操作的问题链。", 3.8],
      ["textbook", "按教材章节顺序逐段讲授", "结构清楚，但容易退回概念讲授。", 2.1],
      ["all", "尽量覆盖所有内容点", "会显著增加认知负荷。", 1.6],
    ],
    5: [
      ["tag", "标注可用于判断的事实、政策和数据依据", "能让学生每条判断都有证据来源。", 3.8],
      ["length", "继续增加背景材料，让案例更丰满", "材料越多不一定越好，可能压垮学生。", 1.9],
      ["answer", "直接给出参考答案，降低难度", "会削弱学生探究和论证。", 1.5],
    ],
    6: [
      ["student", "压缩讲授，增加证据分析和反馈修正时间", "更符合高阶参与和形成性评价要求。", 3.8],
      ["lecture", "延长教师讲授，保证内容覆盖", "内容覆盖不等于学习发生。", 1.8],
      ["free", "扩大自由讨论，弱化量规约束", "讨论会热闹，但证据质量难保证。", 2.0],
    ],
    7: [
      ["roles", "为每个角色设置独立证据产出", "能避免小组讨论由少数学生包办。", 3.7],
      ["leader", "指定组长完成主要任务", "效率高但协作必要性不足。", 1.8],
      ["random", "随机分组后自由讨论", "灵活但过程证据薄弱。", 2.0],
    ],
    8: [
      ["checkpoint", "在案例探究前设置概念边界即时判断", "能防止学生带着误区进入核心任务。", 3.7],
      ["after", "课后再通过作业判断", "反馈过晚，不能调节课堂。", 1.8],
      ["random", "随机提问几名学生", "有互动，但覆盖面和证据强度不足。", 2.0],
    ],
    9: [
      ["rubric", "按量规逐项对照学生证据评分", "能保证评分解释性和反馈效度。", 3.8],
      ["format", "主要看矩阵格式是否完整", "形式完整不代表思维质量。", 1.9],
      ["impression", "按小组展示印象给分", "主观性过强，证据不足。", 1.6],
    ],
    10: [
      ["asset", "沉淀低分样例、反馈语和改进后的案例材料", "能直接服务下一轮教学优化。", 3.8],
      ["plan", "只保存最终教案", "缺少学生证据和迭代依据。", 2.1],
      ["mood", "只记录课堂气氛是否活跃", "不能形成可验证改进。", 1.6],
    ],
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindChrome();
    render();
  });

  function loadState() {
    const fallback = {
      stationIndex: 0,
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
        stationIndex: Math.max(0, Math.min(stations.length - 1, Number(parsed.stationIndex) || 0)),
        scenarioId: scenarioById[parsed.scenarioId] ? parsed.scenarioId : fallback.scenarioId,
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
      toast("本地存储不可用，当前进度仅保留在页面会话中。", 2200);
    }
  }

  function bindChrome() {
    const toggle = $("navMenuToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const isOpen = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    $("scenarioSelect")?.addEventListener("change", (event) => {
      state.scenarioId = event.target.value;
      saveState();
      render();
    });

    $("generateArtifactBtn")?.addEventListener("click", () => {
      generateArtifact();
      renderArtifact();
      const drawer = $("artifactDrawer");
      if (drawer) drawer.open = true;
      toast("已生成本站产物草稿");
    });

    $("saveAssetBtn")?.addEventListener("click", () => {
      saveAsset();
    });

    $("nextStationBtn")?.addEventListener("click", () => {
      const station = currentStation();
      if (!state.decisions[station.id]) {
        toast("请先完成本站判断，再进入下一站。", 2200);
        return;
      }
      state.stationIndex = Math.min(stations.length - 1, state.stationIndex + 1);
      saveState();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function currentStation() {
    return stations[state.stationIndex] || stations[0];
  }

  function currentPhase(station = currentStation()) {
    return phaseById[station?.phase] || phases[0] || {};
  }

  function currentScenario() {
    return scenarioById[state.scenarioId] || scenarios[0] || {};
  }

  function stationAssets(stationId) {
    return state.assets.filter((asset) => String(asset.stationId) === String(stationId));
  }

  function selectedOption(station = currentStation()) {
    const selectedId = state.decisions[station.id];
    return decisionOptions(station).find((option) => option.id === selectedId) || null;
  }

  function decisionOptions(station = currentStation()) {
    const entries = decisionBank[String(station.id)] || [];
    return entries.map((item) => ({ id: item[0], label: item[1], rationale: item[2], score: item[3] }));
  }

  function completedCount() {
    return new Set(state.assets.map((asset) => String(asset.stationId))).size;
  }

  function render() {
    renderContext();
    renderRoute();
    renderStationCover();
    renderFigure();
    renderDecision();
    renderFeedback();
    renderArtifact();
  }

  function renderContext() {
    const select = $("scenarioSelect");
    if (select) {
      select.innerHTML = scenarios.map((scenario) => `<option value="${esc(scenario.id)}" ${scenario.id === state.scenarioId ? "selected" : ""}>${esc(scenario.title)}</option>`).join("");
    }
    const progress = $("progressText");
    if (progress) progress.textContent = `${completedCount()} / ${stations.length}`;
  }

  function renderRoute() {
    const activePhase = currentPhase().id;
    const phaseTabs = $("phaseTabs");
    if (phaseTabs) {
      phaseTabs.innerHTML = phases.map((phase) => {
        const phaseStations = stations.filter((station) => station.phase === phase.id);
        const saved = phaseStations.filter((station) => stationAssets(station.id).length).length;
        const status = phase.id === activePhase ? "active" : saved === phaseStations.length && saved > 0 ? "done" : "";
        return `<button type="button" class="phase-tab ${status}" data-phase="${esc(phase.id)}">
          <span>${esc(phase.title)}</span>
          <strong>${esc(phase.outputPackage)}</strong>
          <em>${saved}/${phaseStations.length} 已保存</em>
        </button>`;
      }).join("");
      phaseTabs.querySelectorAll("[data-phase]").forEach((button) => {
        button.addEventListener("click", () => {
          const index = stations.findIndex((station) => station.phase === button.dataset.phase);
          if (index >= 0) {
            state.stationIndex = index;
            saveState();
            render();
          }
        });
      });
    }

    const chips = $("stationChips");
    if (chips) {
      chips.innerHTML = stations.map((station, index) => {
        const status = index === state.stationIndex ? "active" : stationAssets(station.id).length ? "done" : "";
        return `<button type="button" class="station-chip ${status}" data-index="${index}" aria-current="${status === "active" ? "step" : "false"}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${esc(station.title)}</strong>
        </button>`;
      }).join("");
      chips.querySelectorAll("[data-index]").forEach((button) => {
        button.addEventListener("click", () => {
          state.stationIndex = Number(button.dataset.index) || 0;
          saveState();
          render();
        });
      });
    }
  }

  function renderStationCover() {
    const station = currentStation();
    const phase = currentPhase(station);
    const scenario = currentScenario();
    $("phasePill").textContent = `${phase.title || "教学导航"} · 第 ${state.stationIndex + 1} / ${stations.length} 站`;
    $("activeTitle").textContent = station.displayName || station.title;
    $("activeTask").textContent = station.userMindset || station.how || "完成本站教学判断。";
    $("artifactTitle").textContent = station.artifactType || "生成本站产物";
    const rationale = $("stationRationale");
    if (rationale) {
      rationale.innerHTML = `
        <div><strong>是什么：</strong>${esc(station.what || "")}</div>
        <div><strong>为什么：</strong>${esc(station.why || "")}</div>
        <div><strong>如何做：</strong>${esc(station.how || "")}</div>
        <div><strong>当前语境：</strong>${esc(scenario.evidenceBoundary || "")}</div>`;
    }
  }

  function renderFigure() {
    const station = currentStation();
    const model = figureModel(station, currentScenario());
    const target = $("evidenceFigure");
    if (!target) return;
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">Evidence figure</span>
          <h2>${esc(model.title)}</h2>
        </div>
        <span class="figure-type">${esc(model.type)}</span>
      </div>
      <div class="figure-canvas">${renderSvg(model)}</div>
      <p class="figure-caption">${esc(model.caption)}</p>`;
  }

  function renderDecision() {
    const station = currentStation();
    const selected = selectedOption(station);
    const target = $("decisionPanel");
    if (!target) return;
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">One decision</span>
          <h2>${esc(station.decisionQuestion || "当前最重要的教学判断是什么？")}</h2>
        </div>
      </div>
      <div class="decision-options">
        ${decisionOptions(station).map((option, index) => `<button type="button" class="decision-option ${selected?.id === option.id ? "active" : ""}" data-option="${esc(option.id)}">
          <span class="option-index">${index + 1}</span>
          <span><strong>${esc(option.label)}</strong><small>${esc(option.rationale)}</small></span>
        </button>`).join("")}
      </div>`;
    target.querySelectorAll("[data-option]").forEach((button) => {
      button.addEventListener("click", () => {
        state.decisions[station.id] = button.dataset.option;
        saveState();
        renderDecision();
        renderFeedback();
      });
    });
  }

  function renderFeedback() {
    const station = currentStation();
    const option = selectedOption(station);
    const panel = $("feedbackPanel");
    if (!panel) return;
    if (!option) {
      panel.classList.remove("show");
      panel.innerHTML = "";
      return;
    }
    const dimensionText = (station.qualityDimensions || [])
      .map((id) => dimensionById[id]?.shortLabel)
      .filter(Boolean)
      .join("、");
    panel.classList.add("show");
    panel.innerHTML = `
      <span class="eyebrow">System feedback</span>
      <h2>${option.score >= 3.4 ? "建议采用这个判断" : option.score >= 2.5 ? "可以推进，但要补证据" : "不建议作为主路径"}</h2>
      <p>${esc(option.rationale)} 当前判断主要影响：${esc(dimensionText || "教学质量") }。</p>
      <div class="feedback-next">下一步：点击“生成”，把这个判断转为「${esc(station.artifactType)}」。</div>`;
  }

  function renderArtifact() {
    const station = currentStation();
    const draft = state.drafts[station.id] || "";
    const textarea = $("artifactText");
    if (textarea) textarea.value = draft;
    const summary = $("artifactSummary");
    if (summary) summary.textContent = draft ? `查看 / 编辑：${station.artifactType}` : "生成后查看 / 编辑产物草稿";
  }

  function generateArtifact() {
    const station = currentStation();
    const scenario = currentScenario();
    const option = selectedOption(station);
    const model = figureModel(station, scenario);
    const decision = option?.label || "尚未完成判断，请先选择一个教学判断。";
    const draft = [
      `【图表观察】\n${model.insight}`,
      `【教学判断】\n本站选择“${decision}”。该判断服务于“${station.userMindset || station.title}”。`,
      `【药事管理情境】\n采用“${scenario.title}”案例语境，证据边界为：${scenario.evidenceBoundary}`,
      `【课堂动作或评价动作】\n${station.how}`,
      `【证据与资产沉淀】\n本产物保存后进入“${currentPhase(station).outputPackage || "教学资产"}”，供教学实践页继续调用。`,
    ].join("\n\n");
    state.drafts[station.id] = draft;
    saveState();
    return draft;
  }

  function saveAsset() {
    const station = currentStation();
    let draft = $("artifactText")?.value?.trim() || state.drafts[station.id] || "";
    if (!draft) draft = generateArtifact();
    state.drafts[station.id] = draft;
    const exists = state.assets.some((asset) => String(asset.stationId) === String(station.id));
    if (!exists) {
      state.assets.push({
        stationId: station.id,
        title: station.artifactType,
        phase: station.phase,
        createdAt: new Date().toISOString(),
      });
    }
    saveState();
    render();
    toast("已保存为教学资产");
  }

  function figureModel(station, scenario) {
    const id = Number(station.id);
    const base = {
      title: station.evidenceFigure || "证据图",
      type: ["一图一题", "药事管理", "教学判断"].join(" · "),
      caption: `图表为教学导航模拟证据，用于支持新教师完成当前任务。当前案例语境：${scenario.title || "药事管理"}。`,
      insight: "当前图表提示：应先依据证据完成教学判断，再生成产物。",
      variant: id,
    };
    const titles = {
      1: ["课程定位三角图", "课程目标、药事任务和学生产出需要形成一致定位。"],
      2: ["学情诊断图", "学生预习参与较高，但开放题中的证据引用率偏低。"],
      3: ["目标—证据对齐矩阵", "部分学习目标缺少可观察产出和评价证据。"],
      4: ["内容问题链", "教材内容需要转化为概念边界、证据判断和策略建议。"],
      5: ["案例证据密度图", "角色立场和风险边界证据不足，容易导致学生凭常识填表。"],
      6: ["90 分钟课堂时间线", "讲授比例需要控制，核心时间应留给证据分析和反馈修正。"],
      7: ["小组任务泳道图", "每个角色都应有独立证据产出，避免协作流于形式。"],
      8: ["形成性评价触发点", "案例探究前的概念边界检查点最关键。"],
      9: ["学生作品量规诊断", "证据引用和风险边界通常是低分维度。"],
      10: ["复盘资产优先级", "最有价值的资产是低分样例、反馈语和改进后的案例材料。"],
    };
    base.title = titles[id]?.[0] || base.title;
    base.insight = titles[id]?.[1] || base.insight;
    return base;
  }

  function renderSvg(model) {
    const id = Number(model.variant);
    if (id === 1) return triangleSvg();
    if (id === 2) return barSvg([72, 64, 42, 58], ["预习", "前测", "证据", "参与"], "证据引用偏低");
    if (id === 3) return matrixSvg();
    if (id === 4) return chainSvg();
    if (id === 5) return barSvg([78, 62, 55, 38, 34], ["事实", "政策", "数据", "角色", "边界"], "角色与边界需补强");
    if (id === 6) return timelineSvg();
    if (id === 7) return swimlaneSvg();
    if (id === 8) return triggerSvg();
    if (id === 9) return barSvg([82, 46, 68, 40], ["分类", "证据", "策略", "风险"], "证据与风险是短板");
    return assetSvg();
  }

  function svgWrap(inner) {
    return `<svg viewBox="0 0 560 320" role="img" aria-label="证据图">${inner}</svg>`;
  }

  function grid(x = 60, y = 56, w = 420, h = 180) {
    let lines = "";
    for (let i = 0; i <= 4; i += 1) {
      const yy = y + (h * i) / 4;
      lines += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" class="chart-grid" />`;
    }
    return lines;
  }

  function triangleSvg() {
    return svgWrap(`
      <text x="24" y="30" class="chart-title">把 SWOT 放回药事管理任务</text>
      <polygon points="280,72 120,240 440,240" fill="rgba(217,119,87,.10)" stroke="#d97757" stroke-width="2" />
      <circle cx="280" cy="72" r="34" fill="rgba(72,104,123,.18)" stroke="#48687b" />
      <circle cx="120" cy="240" r="34" fill="rgba(77,98,87,.18)" stroke="#4d6257" />
      <circle cx="440" cy="240" r="34" fill="rgba(179,132,66,.20)" stroke="#b38442" />
      <text x="280" y="77" text-anchor="middle" class="chart-label">课程目标</text>
      <text x="120" y="245" text-anchor="middle" class="chart-label">药事任务</text>
      <text x="440" y="245" text-anchor="middle" class="chart-label">学生产出</text>
      <text x="280" y="286" text-anchor="middle" class="chart-note">最优定位：工具学习 → 专业判断训练</text>`);
  }

  function barSvg(values, labels, note) {
    const bars = values.map((value, index) => {
      const x = 86 + index * (values.length === 5 ? 78 : 98);
      const barH = value * 1.72;
      const color = value < 50 ? "#d97757" : index % 2 ? "#48687b" : "#4d6257";
      return `<rect x="${x}" y="${238 - barH}" width="44" height="${barH}" rx="6" fill="${color}" opacity=".86" />
        <text x="${x + 22}" y="262" text-anchor="middle" class="chart-label">${esc(labels[index])}</text>
        <text x="${x + 22}" y="${228 - barH}" text-anchor="middle" class="chart-label">${value}%</text>`;
    }).join("");
    return svgWrap(`
      <text x="24" y="30" class="chart-title">关键证据分布</text>
      ${grid(60,58,420,180)}
      <line x1="60" y1="238" x2="500" y2="238" class="chart-axis" />
      <line x1="60" y1="58" x2="60" y2="238" class="chart-axis" />
      ${bars}
      <text x="280" y="300" text-anchor="middle" class="chart-note">${esc(note)}</text>`);
  }

  function matrixSvg() {
    const cells = [
      ["目标1", "覆盖", "覆盖", "覆盖"],
      ["目标2", "覆盖", "覆盖", "缺口"],
      ["目标3", "覆盖", "缺口", "缺口"],
    ];
    const cols = ["活动", "产出", "评价"];
    return svgWrap(`
      <text x="24" y="30" class="chart-title">目标—活动—产出—评价对齐矩阵</text>
      ${cols.map((col, i) => `<text x="${168 + i * 108}" y="72" text-anchor="middle" class="chart-label">${col}</text>`).join("")}
      ${cells.map((row, r) => `<text x="84" y="${112 + r * 58}" text-anchor="end" class="chart-label">${row[0]}</text>${row.slice(1).map((cell, c) => `<rect x="${132 + c * 108}" y="${88 + r * 58}" width="72" height="36" rx="10" fill="${cell === "缺口" ? "rgba(217,119,87,.18)" : "rgba(77,98,87,.18)"}" stroke="${cell === "缺口" ? "#d97757" : "#4d6257"}" /><text x="${168 + c * 108}" y="${111 + r * 58}" text-anchor="middle" class="chart-label">${cell}</text>`).join("")}`).join("")}
      <text x="280" y="286" text-anchor="middle" class="chart-note">目标过多会导致证据缺口，需优先补证据</text>`);
  }

  function chainSvg() {
    const nodes = ["概念边界", "证据判断", "策略建议", "风险说明"];
    return svgWrap(`
      <text x="24" y="30" class="chart-title">内容重构：把教材变成问题链</text>
      ${nodes.map((node, i) => `<rect x="${58 + i * 118}" y="130" width="86" height="52" rx="14" fill="${i < 2 ? "rgba(72,104,123,.14)" : "rgba(217,119,87,.14)"}" stroke="${i < 2 ? "#48687b" : "#d97757"}"/><text x="${101 + i * 118}" y="160" text-anchor="middle" class="chart-label">${node}</text>${i < nodes.length - 1 ? `<path d="M${146 + i * 118} 156 H${172 + i * 118}" class="chart-axis"/>` : ""}`).join("")}
      <text x="280" y="252" text-anchor="middle" class="chart-note">不要按教材逐段讲；要让学生沿问题链完成判断</text>`);
  }

  function timelineSvg() {
    const segments = [["导入", 8, "#b38442"], ["支架", 12, "#48687b"], ["分析", 30, "#d97757"], ["展示", 20, "#4d6257"], ["反馈", 20, "#6b6287"]];
    let x = 56;
    const blocks = segments.map(([label, minutes, color]) => {
      const w = minutes * 4.7;
      const block = `<rect x="${x}" y="125" width="${w}" height="70" rx="14" fill="${color}" opacity=".84"/><text x="${x + w / 2}" y="156" text-anchor="middle" fill="#fffefa" font-size="12" font-weight="760">${label}</text><text x="${x + w / 2}" y="176" text-anchor="middle" fill="#fffefa" font-size="11">${minutes}min</text>`;
      x += w + 7;
      return block;
    }).join("");
    return svgWrap(`
      <text x="24" y="30" class="chart-title">90 分钟课堂时间线</text>
      <line x1="56" y1="160" x2="500" y2="160" class="chart-axis" />
      ${blocks}
      <text x="280" y="260" text-anchor="middle" class="chart-note">核心时间应留给学生证据分析、展示追问和修正</text>`);
  }

  function swimlaneSvg() {
    const rows = [["事实员", "提取案例事实"], ["政策员", "查找政策依据"], ["策略员", "提出管理建议"], ["风险员", "标注风险边界"]];
    return svgWrap(`
      <text x="24" y="30" class="chart-title">小组角色—证据产出泳道</text>
      ${rows.map((row, i) => `<rect x="58" y="${72 + i * 48}" width="112" height="34" rx="10" fill="rgba(72,104,123,.12)" stroke="#48687b"/><text x="114" y="94 + ${i * 48}" text-anchor="middle" class="chart-label">${row[0]}</text><rect x="208" y="${72 + i * 48}" width="240" height="34" rx="10" fill="rgba(77,98,87,.12)" stroke="#4d6257"/><text x="328" y="${94 + i * 48}" text-anchor="middle" class="chart-label">${row[1]}</text>`).join("")}
      <text x="280" y="286" text-anchor="middle" class="chart-note">每个角色必须留下独立证据，协作才有必要性</text>`);
  }

  function triggerSvg() {
    const points = [[82,220], [172,178], [262,118], [352,146], [452,88]];
    return svgWrap(`
      <text x="24" y="30" class="chart-title">形成性反馈触发点</text>
      ${grid(60,58,420,180)}
      <line x1="60" y1="238" x2="500" y2="238" class="chart-axis" />
      <line x1="60" y1="58" x2="60" y2="238" class="chart-axis" />
      <path d="${points.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ")}" class="chart-line" stroke="#d97757" />
      ${points.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="${i === 1 ? "#d97757" : "#4d6257"}" class="chart-dot" />`).join("")}
      <text x="172" y="160" text-anchor="middle" class="chart-note">关键：探究前检查</text>
      <text x="280" y="300" text-anchor="middle" class="chart-note">越早反馈，越能调节课堂</text>`);
  }

  function assetSvg() {
    const nodes = [["样例", 120, 128, "#d97757"], ["反馈语", 245, 88, "#4d6257"], ["量规", 384, 128, "#48687b"], ["案例", 188, 220, "#b38442"], ["改进", 330, 220, "#6b6287"]];
    return svgWrap(`
      <text x="24" y="30" class="chart-title">复盘资产优先级</text>
      <path d="M120 128 L245 88 L384 128 L330 220 L188 220 Z" fill="none" stroke="rgba(31,30,29,.18)" stroke-width="2" />
      ${nodes.map(([label, x, y, color]) => `<circle cx="${x}" cy="${y}" r="34" fill="${color}" opacity=".16" stroke="${color}" /><text x="${x}" y="${y + 4}" text-anchor="middle" class="chart-label">${label}</text>`).join("")}
      <text x="280" y="286" text-anchor="middle" class="chart-note">保存能直接改进下一轮教学的资产</text>`);
  }

  function toast(message, timeout = 1800) {
    const node = $("toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), timeout);
  }
})();
