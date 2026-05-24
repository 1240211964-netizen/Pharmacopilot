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
  const documentationUrl = "https://github.com/1240211964-netizen/Pharmacopilot";
  const sharedNavItems = [
    { key: "home", label: "首页", href: "./index.html" },
    { key: "teaching-navigation", label: "教学导航", href: "./teaching-navigation.html" },
    { key: "practice", label: "教学实践", href: "./practice.html" },
    { key: "assets", label: "教学数据", href: "./teaching-data.html" },
    { key: "docs", label: "文档", href: documentationUrl, external: true },
  ];

  const syllabusMock = {
    loaded: false,
    fileName: "",
    courseGoal: "管理工具分析能力",
    syllabusPoint: "环境分析与战略判断工具",
    assessmentFocus: "案例分析与策略表达",
  };

  const learnerProfiles = {
    balanced: {
      id: "balanced",
      label: "均衡班级",
      tag: "取向均衡",
      recommended: "comprehensive",
      reason: "班级取向分散，主线应覆盖研究、服务与治理三类迁移。",
      distribution: [
        ["考研", 34],
        ["实习就业", 36],
        ["考公监管", 30],
      ],
    },
    postgraduate: {
      id: "postgraduate",
      label: "考研占优",
      tag: "研究表达偏高",
      recommended: "research",
      reason: "考研取向较高，适合强化证据提取、变量解释与分析表达。",
      distribution: [
        ["考研", 58],
        ["实习就业", 24],
        ["考公监管", 18],
      ],
    },
    internship: {
      id: "internship",
      label: "实习就业占优",
      tag: "岗位应用偏高",
      recommended: "service",
      reason: "实习就业取向较高，适合把 SWOT 转化为药事服务流程改进任务。",
      distribution: [
        ["考研", 22],
        ["实习就业", 57],
        ["考公监管", 21],
      ],
    },
    civil: {
      id: "civil",
      label: "考公监管占优",
      tag: "政策治理偏高",
      recommended: "policy",
      reason: "考公监管取向较高，适合强化政策目标、制度约束和风险边界判断。",
      distribution: [
        ["考研", 20],
        ["实习就业", 26],
        ["考公监管", 54],
      ],
    },
  };

  const positioningModes = {
    comprehensive: {
      id: "comprehensive",
      label: "综合决策型定位",
      short: "平衡研究、服务与治理",
      rationale: "适合取向均衡的班级，让学生同时处理证据、服务与政策约束。",
      constraints: ["案例需包含多方约束", "任务需形成策略取舍", "评价需看证据与判断质量"],
    },
    research: {
      id: "research",
      label: "证据研究型定位",
      short: "强调证据提取与分析表达",
      rationale: "适合考研取向较高的班级，把 SWOT 训练为结构化分析和论证表达。",
      constraints: ["材料需提供可引用证据", "任务需解释分类依据", "评价需看变量识别与论证表达"],
    },
    service: {
      id: "service",
      label: "服务运营型定位",
      short: "面向药事服务流程改进",
      rationale: "适合实习就业取向较高的班级，把 SWOT 转化为岗位服务和流程改进判断。",
      constraints: ["案例需来自服务现场", "任务需提出可执行改进", "评价需看流程、资源与患者需求匹配"],
    },
    policy: {
      id: "policy",
      label: "政策治理型定位",
      short: "面向医保、监管与制度约束",
      rationale: "适合考公监管取向较高的班级，把 SWOT 用于政策目标和治理风险判断。",
      constraints: ["案例需包含政策边界", "任务需识别利益相关者", "评价需看公平、效率与安全权衡"],
    },
  };

  const state = loadState();

  const supportToolLabels = [
    "导学问题",
    "判断流程卡",
    "案例阅读提示",
    "证据提取模板",
    "概念边界卡",
    "分层帮助卡",
    "课堂任务单",
    "示例与反例",
    "追问提示",
    "导学支持线",
    "需帮助卡",
  ];

  const stationSupportTools = {
    1: ["判断流程卡", "示例与反例"],
    2: ["导学问题", "案例阅读提示", "证据提取模板", "导学支持线", "需帮助卡"],
    3: ["判断流程卡", "分层帮助卡"],
    4: ["概念边界卡", "示例与反例"],
    5: ["案例阅读提示", "证据提取模板"],
    6: ["课堂任务单", "判断流程卡"],
    7: ["课堂任务单", "证据提取模板"],
    8: ["追问提示", "分层帮助卡"],
    9: ["示例与反例", "判断流程卡"],
    10: ["追问提示", "课堂任务单"],
  };

  const decisionBank = {
    1: [
      ["comprehensive", "综合决策型定位", positioningModes.comprehensive.rationale, 3.8],
      ["research", "证据研究型定位", positioningModes.research.rationale, 3.7],
      ["service", "服务运营型定位", positioningModes.service.rationale, 3.7],
      ["policy", "政策治理型定位", positioningModes.policy.rationale, 3.7],
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
    renderSharedPrimaryNav();
    bindChrome();
    render();
  });

  function loadState() {
    const fallback = {
      stationIndex: 0,
      scenarioId: scenarios[0]?.id || "",
      learnerProfileId: "balanced",
      syllabus: { ...syllabusMock },
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
        learnerProfileId: learnerProfiles[parsed.learnerProfileId] ? parsed.learnerProfileId : fallback.learnerProfileId,
        syllabus: parsed.syllabus && typeof parsed.syllabus === "object" ? { ...syllabusMock, ...parsed.syllabus } : fallback.syllabus,
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

    $("syllabusImportBtn")?.addEventListener("click", () => {
      $("syllabusFileInput")?.click();
    });

    $("syllabusFileInput")?.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      state.syllabus = {
        ...currentSyllabus(),
        loaded: true,
        fileName: file.name,
      };
      saveState();
      render();
      toast("课程大纲已载入，已用于第 1 站定位输入。", 2200);
    });

    $("generateArtifactBtn")?.addEventListener("click", () => {
      if (!requireDecisionFirst()) return;
      generateArtifact();
      renderArtifact();
      const drawer = $("artifactDrawer");
      if (drawer) drawer.open = true;
      toast("已生成本站产物草稿");
    });

    $("saveAssetBtn")?.addEventListener("click", () => {
      if (!requireDecisionFirst()) return;
      if (!canSaveAsset()) {
        toast("请先生成或填写本站产物，再保存资产。", 2200);
        return;
      }
      saveAsset();
    });

    $("nextStationBtn")?.addEventListener("click", () => {
      const station = currentStation();
      if (!state.decisions[station.id]) {
        toast("请先完成本站判断，再进入下一站。", 2200);
        return;
      }
      if (!hasSavedAsset(station)) {
        toast("请先保存本站教学资产，再进入下一站。", 2200);
        return;
      }
      state.stationIndex = Math.min(stations.length - 1, state.stationIndex + 1);
      saveState();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function renderSharedPrimaryNav() {
    const nav = $("primaryNav");
    if (!nav) return;
    const page = document.body.dataset.page;
    nav.innerHTML = sharedNavItems.map((item) => {
      const targetAttrs = item.external ? ' target="_blank" rel="noreferrer"' : "";
      const active = item.key === page ? " active" : "";
      return `<a class="nav-link${active}" data-nav="${esc(item.key)}" href="${esc(item.href)}"${targetAttrs}>${esc(item.label)}</a>`;
    }).join("");
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

  function currentSyllabus() {
    return { ...syllabusMock, ...(state.syllabus || {}) };
  }

  function currentLearnerProfile() {
    return learnerProfiles[state.learnerProfileId] || learnerProfiles.balanced;
  }

  function currentPositioningMode(modeId) {
    return positioningModes[modeId] || positioningModes[currentLearnerProfile().recommended] || positioningModes.comprehensive;
  }

  function recommendedPositioningMode() {
    return currentPositioningMode(currentLearnerProfile().recommended);
  }

  function positioningStatement(mode = recommendedPositioningMode()) {
    const scenario = currentScenario();
    const topic = "SWOT";
    const scenarioTitle = scenario.title || "药事管理";
    const statements = {
      comprehensive: `本节课将 ${topic} 定位为${scenarioTitle}情境中的综合决策训练。学生需要同时识别证据、服务、政策与资源约束，形成有依据的策略取舍。`,
      research: `本节课将 ${topic} 定位为${scenarioTitle}情境中的证据研究与分析表达训练。学生需要提取关键事实，解释内外部因素分类，并形成可论证的分析结论。`,
      service: `本节课将 ${topic} 定位为${scenarioTitle}情境中的服务运营与改进决策训练。学生需要识别流程、资源、患者需求和服务质量因素，并提出可执行的改进建议。`,
      policy: `本节课将 ${topic} 定位为${scenarioTitle}情境中的政策治理判断训练。学生需要识别政策目标、制度约束与利益相关者影响，形成兼顾公平、效率与安全的判断。`,
    };
    return statements[mode.id] || statements.comprehensive;
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

  function hasDraft(station = currentStation()) {
    return Boolean(String(state.drafts[station.id] || "").trim());
  }

  function hasSavedAsset(station = currentStation()) {
    return stationAssets(station.id).length > 0;
  }

  function canGenerateArtifact(station = currentStation()) {
    const selected = selectedOption(station);
    if (Number(station.id) === 1) return Boolean(selected);
    return Boolean(selected);
  }

  function canSaveAsset(station = currentStation()) {
    return canGenerateArtifact(station) && hasDraft(station);
  }

  function requireDecisionFirst(station = currentStation()) {
    if (canGenerateArtifact(station)) return true;
    toast("请先完成本站教学判断，再生成产物。", 2200);
    return false;
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
    document.querySelector("[data-example-course]")?.replaceChildren(document.createTextNode("管理学原理"));
    document.querySelector("[data-example-topic]")?.replaceChildren(document.createTextNode("SWOT 分析"));
    document.querySelector("[data-example-class]")?.replaceChildren(document.createTextNode("药事管理本科班"));

    const syllabus = currentSyllabus();
    const status = $("syllabusImportBtn");
    if (status) {
      status.textContent = syllabus.loaded ? "大纲已载入" : "示例大纲";
      status.classList.toggle("is-loaded", Boolean(syllabus.loaded));
      status.title = syllabus.loaded ? syllabus.fileName || "课程大纲已载入" : "点击导入课程大纲；当前使用示例大纲摘要";
    }
  }

  function renderRoute() {
    const activeStation = currentStation();
    const activePhase = String(activeStation?.phase || currentPhase().id || "");
    const activeStep = String(activeStation?.id || state.stationIndex + 1).padStart(2, "0");

    document.querySelectorAll("[data-pp-map-nav] .pp-map-stage").forEach((button) => {
      const isActive = button.dataset.stage === activePhase;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.onclick = () => {
        const index = stations.findIndex((station) => station.phase === button.dataset.stage);
        if (index < 0) return;
        state.stationIndex = index;
        saveState();
        render();
        scrollToWorkbench();
      };
    });

    document.querySelectorAll("[data-pp-map-nav] .pp-map-step").forEach((button) => {
      const step = String(button.dataset.step || "").padStart(2, "0");
      const station = stations.find((item) => String(item.id).padStart(2, "0") === step);
      const isActive = step === activeStep;
      const isComplete = station ? hasSavedAsset(station) : false;
      button.classList.toggle("is-active", isActive);
      button.classList.toggle("is-complete", isComplete);
      button.setAttribute("aria-current", isActive ? "step" : "false");
      button.onclick = () => {
        const index = stations.findIndex((item) => String(item.id).padStart(2, "0") === step);
        if (index < 0) return;
        const targetId = button.dataset.target;
        state.stationIndex = index;
        saveState();
        render();
        scrollToWorkbench(targetId);
      };
    });
  }

  function scrollToWorkbench(targetId = "") {
    const target = targetId ? document.getElementById(targetId) : null;
    (target || document.querySelector(".focus-workbench"))?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function renderStationCover() {
    const station = currentStation();
    const phase = currentPhase(station);
    const scenario = currentScenario();
    const syllabus = currentSyllabus();
    const profile = currentLearnerProfile();

    $("phasePill").textContent = `${phase.title || "教学导航"} · 第 ${state.stationIndex + 1} / ${stations.length} 站`;
    $("activeTitle").textContent = Number(station.id) === 1 ? "教学定位模拟器" : station.displayName || station.title;
    $("artifactTitle").textContent = Number(station.id) === 1 ? "定位产物" : station.artifactType || "生成本站产物";

    const chips = $("stationInputChips");
    if (!chips) return;

    if (Number(station.id) === 1) {
      chips.innerHTML = `
        <span><b>大纲目标</b>${esc(syllabus.courseGoal)}</span>
        <span><b>班级画像</b>${esc(profile.tag)}</span>
        <span><b>案例语境</b>${esc(scenario.title || "药事管理")}</span>`;
      return;
    }

    chips.innerHTML = `
      <span><b>当前任务</b>${esc(station.title || station.displayName || "教学判断")}</span>
      <span><b>产物</b>${esc(station.artifactType || "教学资产")}</span>
      <span><b>语境</b>${esc(scenario.title || "药事管理")}</span>`;
  }

  function supportToolsForStation(station = currentStation()) {
    return stationSupportTools[station.id] || supportToolLabels.slice(0, 3);
  }

  function renderFigure() {
    const station = currentStation();
    const target = $("evidenceFigure");
    if (!target) return;
    if (Number(station.id) === 1) {
      target.className = "evidence-figure positioning-lab-host";
      target.innerHTML = renderPositioningLab(station, selectedOption(station));
      bindPositioningLab(target, station);
      return;
    }
    target.className = "evidence-figure";
    const model = figureModel(station, currentScenario());
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">证据图</span>
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
    if (Number(station.id) === 1) {
      target.hidden = true;
      target.className = "decision-panel";
      target.innerHTML = "";
      return;
    }
    target.hidden = false;
    target.className = "decision-panel";
    const question = Number(station.id) === 1
      ? "看到这三项证据，本节课的主线更应该是什么？"
      : station.decisionQuestion || "当前最重要的教学判断是什么？";
    target.innerHTML = `
      <div class="panel-head">
        <div>
          <span class="eyebrow">教学判断题</span>
          <h2>${esc(question)}</h2>
        </div>
      </div>
      <div class="decision-options">
        ${decisionOptions(station).map((option, index) => `<button type="button" class="decision-option ${selected?.id === option.id ? "active" : ""}" data-option="${esc(option.id)}">
          <span class="option-index">${Number(station.id) === 1 ? ["A", "B", "C"][index] : index + 1}</span>
          <span><strong>${esc(option.label)}</strong>${Number(station.id) === 1 ? "" : `<span class="option-rationale">${esc(option.rationale)}</span>`}</span>
        </button>`).join("")}
      </div>`;
    target.querySelectorAll("[data-option]").forEach((button) => {
      button.addEventListener("click", () => {
        setDecision(station, button.dataset.option);
      });
    });
  }

  function renderPositioningLab(station, selected) {
    const syllabus = currentSyllabus();
    const profile = currentLearnerProfile();
    const scenario = currentScenario();
    const recommended = recommendedPositioningMode();
    const selectedMode = selected ? currentPositioningMode(selected.id) : null;
    const outputVisible = Boolean(selectedMode);

    return `<section class="pp-positioning-simulator" id="positioningLab" aria-labelledby="positioningTitle">
      <div class="pp-sim-grid">
        <article class="pp-sim-card pp-sim-profile">
          <div class="pp-sim-card-head">
            <span>01 看班级画像</span>
            <strong>${esc(profile.label)}</strong>
          </div>
          <div class="pp-profile-switch" aria-label="切换班级画像">
            ${Object.values(learnerProfiles).map((item) => `<button type="button" class="pp-profile-pill${item.id === profile.id ? " is-active" : ""}" data-profile-id="${esc(item.id)}">${esc(item.label)}</button>`).join("")}
          </div>
          <div class="pp-career-bars" aria-label="职业规划分布">
            ${profile.distribution.map(([label, value]) => `<div class="pp-career-bar">
              <span>${esc(label)}</span>
              <i><b style="width:${Math.max(4, Math.min(100, value))}%"></b></i>
              <em>${value}%</em>
            </div>`).join("")}
          </div>
        </article>

        <article class="pp-sim-card pp-sim-logic">
          <div class="pp-sim-card-head">
            <span>02 理解定位</span>
            <strong id="positioningTitle">大纲 × 学情 × 情境</strong>
          </div>
          <div class="pp-logic-triad" aria-label="教学定位三项输入">
            <div><span>大纲</span><strong>${esc(syllabus.courseGoal)}</strong></div>
            <div><span>学情</span><strong>${esc(profile.tag)}</strong></div>
            <div><span>情境</span><strong>${esc(scenario.title || "药事管理")}</strong></div>
          </div>
          <div class="pp-recommend-strip">
            <span>推荐定位</span>
            <strong>${esc(recommended.label)}</strong>
          </div>
        </article>

        <article class="pp-sim-card pp-sim-choice">
          <div class="pp-sim-card-head">
            <span>03 做定位</span>
            <strong>选择本课主线</strong>
          </div>
          <div class="pp-mode-options" role="radiogroup" aria-label="教学定位选择">
            ${decisionOptions(station).map((option) => {
              const mode = currentPositioningMode(option.id);
              const isSelected = selected?.id === mode.id;
              const isRecommended = recommended.id === mode.id;
              return `<button type="button" role="radio" aria-checked="${isSelected ? "true" : "false"}" class="pp-mode-option${isSelected ? " is-selected" : ""}${isRecommended ? " is-recommended" : ""}" data-positioning-answer="${esc(mode.id)}">
                <span>${esc(mode.label)}</span>
                <small>${esc(mode.short)}</small>
                ${isRecommended ? `<em>推荐</em>` : ""}
              </button>`;
            }).join("")}
          </div>
        </article>
      </div>

      <div class="pp-sim-feedback${selectedMode ? " is-visible" : ""}" id="positioningFeedback" aria-live="polite">
        ${renderPositioningFeedback(selected)}
      </div>

      <div class="pp-positioning-output" id="positioningOutput"${outputVisible ? "" : " hidden"}>
        <div class="pp-output-header">
          <div>
            <span>定位产物</span>
            <h3>本节课定位句</h3>
          </div>
          <button class="pp-copy-btn" type="button" id="copyPositioningStatement">复制</button>
        </div>
        <p id="positioningStatement">${esc(selectedMode ? positioningStatement(selectedMode) : "")}</p>
        <div class="pp-constraints">
          <h4>后续设计约束</h4>
          <ul>${(selectedMode?.constraints || []).map((rule) => `<li>${esc(rule)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>`;
  }

  function renderPositioningFeedback(selected) {
    const profile = currentLearnerProfile();
    const recommended = recommendedPositioningMode();
    if (!selected) {
      return `<strong>等待定位</strong><span>当前推荐：${esc(recommended.label)}</span>`;
    }

    const selectedMode = currentPositioningMode(selected.id);
    if (selectedMode.id === recommended.id) {
      return `<strong>定位匹配</strong><span>${esc(recommended.short)}</span>`;
    }

    return `<strong>可用，但需补偿</strong><span>当前画像更接近“${esc(recommended.label)}”。若采用“${esc(selectedMode.label)}”，后续活动需补足“${esc(recommended.short)}”。</span>`;
  }

  function bindPositioningLab(target, station) {
    target.querySelectorAll("[data-profile-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const profileId = button.dataset.profileId;
        if (!learnerProfiles[profileId]) return;
        state.learnerProfileId = profileId;
        delete state.drafts[station.id];
        state.assets = state.assets.filter((asset) => String(asset.stationId) !== String(station.id));
        saveState();
        render();
      });
    });

    target.querySelectorAll("[data-positioning-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        setDecision(station, button.dataset.positioningAnswer);
      });
    });

    target.querySelector("#copyPositioningStatement")?.addEventListener("click", () => {
      const option = selectedOption(station);
      copyTextToClipboard(positioningStatement(currentPositioningMode(option?.id)));
    });
  }

  function setDecision(station, optionId) {
    const previous = state.decisions[station.id];
    state.decisions[station.id] = optionId;
    if (previous !== optionId) {
      delete state.drafts[station.id];
      state.assets = state.assets.filter((asset) => String(asset.stationId) !== String(station.id));
    }
    if (Number(station.id) === 1) {
      if (positioningModes[optionId]) {
        state.drafts[station.id] = positioningArtifactDraft();
      } else {
        delete state.drafts[station.id];
      }
    }
    saveState();
    render();
  }

  function renderFeedback() {
    const station = currentStation();
    const option = selectedOption(station);
    const panel = $("feedbackPanel");
    if (!panel) return;
    if (Number(station.id) === 1) {
      panel.hidden = true;
      panel.classList.remove("show", "positioning-feedback");
      panel.innerHTML = "";
      return;
    }
    panel.hidden = false;
    if (!option) {
      panel.classList.remove("show", "positioning-feedback");
      panel.innerHTML = "";
      return;
    }
    if (Number(station.id) === 1) {
      panel.classList.add("show", "positioning-feedback");
      panel.innerHTML = `
        <span class="eyebrow">定位反馈</span>
        <h2>${option.id === "decision" ? "主线成立" : "需要调整主线"}</h2>
        <div class="positioning-feedback-list">
          ${decisionOptions(station).map((item) => `<p class="${item.id === option.id ? "active" : ""}">${esc(item.rationale)}</p>`).join("")}
        </div>`;
      return;
    }
    panel.classList.remove("positioning-feedback");
    const dimensionText = (station.qualityDimensions || [])
      .map((id) => dimensionById[id]?.shortLabel)
      .filter(Boolean)
      .join("、");
    panel.classList.add("show");
    panel.innerHTML = `
      <span class="eyebrow">系统反馈</span>
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
    const generateBtn = $("generateArtifactBtn");
    if (generateBtn) {
      generateBtn.disabled = !canGenerateArtifact(station);
      generateBtn.setAttribute("aria-disabled", String(generateBtn.disabled));
      generateBtn.title = generateBtn.disabled ? "请先完成本站教学判断" : "把判断转为本站产物草稿";
    }
    const saveBtn = $("saveAssetBtn");
    if (saveBtn) {
      saveBtn.disabled = !canSaveAsset(station);
      saveBtn.setAttribute("aria-disabled", String(saveBtn.disabled));
      saveBtn.title = saveBtn.disabled ? "请先生成或填写产物草稿" : "保存为教学资产";
    }
    const nextBtn = $("nextStationBtn");
    if (nextBtn) {
      nextBtn.disabled = !hasSavedAsset(station);
      nextBtn.setAttribute("aria-disabled", String(nextBtn.disabled));
      nextBtn.title = nextBtn.disabled ? "请先保存本站教学资产" : "进入下一站";
    }
    renderArtifactGuidance(station, draft);
  }

  function renderArtifactGuidance(station = currentStation(), draft = "") {
    const target = $("artifactGuidance");
    if (!target) return;
    if (Number(station.id) !== 1) {
      target.innerHTML = "";
      target.className = "";
      return;
    }
    target.innerHTML = "";
    target.className = "";
  }

  function generateArtifact() {
    const station = currentStation();
    const scenario = currentScenario();
    const option = selectedOption(station);
    if (!option) return "";
    if (Number(station.id) === 1) {
      const draft = positioningArtifactDraft();
      state.drafts[station.id] = draft;
      saveState();
      return draft;
    }
    const model = figureModel(station, scenario);
    const decision = option.label;
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

  function positioningArtifactDraft() {
    const station = currentStation();
    const option = selectedOption(station);
    const mode = currentPositioningMode(option?.id);
    const syllabus = currentSyllabus();
    const profile = currentLearnerProfile();
    const scenario = currentScenario();
    return [
      `【定位句】\n${positioningStatement(mode)}`,
      `【定位依据】\n- 大纲目标：${syllabus.courseGoal}\n- 大纲位置：${syllabus.syllabusPoint}\n- 班级画像：${profile.label}（${profile.distribution.map(([label, value]) => `${label}${value}%`).join("、")}）\n- 案例语境：${scenario.title || "药事管理"}`,
      `【后续设计约束】\n${mode.constraints.map((rule) => `- ${rule}`).join("\n")}`,
    ].join("\n\n");
  }

  function saveAsset() {
    const station = currentStation();
    let draft = $("artifactText")?.value?.trim() || state.drafts[station.id] || "";
    if (!draft) return;
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
      1: ["知识点教学功能定位", "课程目标、药事任务和学生产出共同决定本节课训练什么。"],
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
    const segments = [["导入", 8, "#b38442"], ["导学", 12, "#48687b"], ["分析", 30, "#d97757"], ["展示", 20, "#4d6257"], ["反馈", 20, "#6b6287"]];
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

  function copyTextToClipboard(text) {
    if (window.navigator?.clipboard?.writeText) {
      window.navigator.clipboard.writeText(text)
        .then(() => toast("已复制定位句"))
        .catch(() => fallbackCopyText(text));
      return;
    }
    fallbackCopyText(text);
  }

  function fallbackCopyText(text) {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.top = "-999px";
    document.body.appendChild(helper);
    helper.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    helper.remove();
    if (copied) {
      toast("已复制定位句");
      return;
    }
    selectPositioningStatement();
    toast("定位句已选中，请按 Ctrl/Command+C 复制", 2600);
  }

  function selectPositioningStatement() {
    const statement = $("positioningStatement");
    if (!statement || !window.getSelection) return;
    const range = document.createRange();
    range.selectNodeContents(statement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
})();
