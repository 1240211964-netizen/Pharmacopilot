(function () {
  "use strict";

  const phaseConfig = {
    pre: { id: "phase-track-pre", label: "课前准备", range: "STEP 01-06" },
    classroom: { id: "phase-track-classroom", label: "课堂实施", range: "STEP 07-16" },
    post: { id: "phase-track-post", label: "课后评价与沉淀", range: "STEP 17-20" },
  };

  const agentConfig = {
    director: { label: "Director", role: "调度、流程推进、质量门控、判断是否需要教师接管" },
    "practice-agent": { label: "Practice Agent", role: "生成教学实践方案、课堂活动、教学流程" },
    "rubric-agent": { label: "Rubric Agent", role: "生成评价维度、评分量规、达成度判断" },
    "evidence-agent": { label: "Evidence Agent", role: "校验证据链、识别证据缺口、提示来源边界" },
    "asset-agent": { label: "Asset Agent", role: "沉淀可复用教学资产、任务单、评价表、案例包、反思材料" },
  };

  const defaultSteps = [
    [1, "pre", "教学情境与课程任务分析"],
    [2, "pre", "学情分析与学习起点诊断"],
    [3, "pre", "教学目标与预期成果设计"],
    [4, "pre", "教学内容重构与概念提炼"],
    [5, "pre", "学习资源与案例材料开发"],
    [6, "pre", "课前学习支架与预习任务"],
    [7, "classroom", "诊断性评价与问题收集"],
    [8, "classroom", "活动序列与评价量规设计"],
    [9, "classroom", "问题情境创设与动机激发"],
    [10, "classroom", "先行组织与经验激活"],
    [11, "classroom", "核心概念讲解与支架提供"],
    [12, "classroom", "案例探究与证据分析活动"],
    [13, "classroom", "协作学习与角色任务推进"],
    [14, "classroom", "成果展示、课堂对话与追问"],
    [15, "classroom", "形成性评价与即时反馈"],
    [16, "classroom", "课堂总结、迁移与课后衔接"],
    [17, "post", "学习成果收集与表现性评价"],
    [18, "post", "学习数据分析与困难诊断"],
    [19, "post", "差异化反馈与拓展支持"],
    [20, "post", "教学反思、资源沉淀与改进"],
  ].map(([stepNo, phase, title]) => ({
    id: `step-${String(stepNo).padStart(2, "0")}`,
    stepNo,
    phase,
    title,
    status: "pending",
    ownerAgent: inferStepAgent(stepNo),
  }));

  function executeTeachingAction(action) {
    if (!action || typeof action !== "object") return;
    window.AgentRuntimeStore?.recordTeachingAction(action);

    switch (action.type) {
      case "practice.create_flow":
        renderPracticeFlow(action.payload || {});
        break;
      case "practice.update_step":
        renderPracticeStepUpdate(action.payload || {});
        break;
      case "rubric.create":
        renderRubricPreview(action.payload || {});
        break;
      case "evidence.flag_gap":
        renderEvidenceGap(action.payload || {});
        break;
      case "evidence.attach":
        renderEvidenceAttachment(action.payload || {});
        break;
      case "asset.create_node":
        renderAssetNode(action.payload || {});
        break;
      case "asset.create_edge":
        renderAssetEdge(action.payload || {});
        break;
      case "ui.focus":
        focusRuntimePanel(action.payload || {}, action.target);
        break;
      case "user.ask":
        renderTeacherQuestion(action.payload || {});
        break;
      case "system.complete_stage":
        renderCompletedStage(action.payload || {});
        break;
      case "course.update_profile":
        renderCourseProfile(action.payload || {});
        break;
      case "navigation.create_path":
        setAgentStatus("director", "done", "导航上下文已传入教学实践。");
        break;
    }
  }

  function resetWorkbench() {
    window.AgentRuntimeStore?.setState({
      currentAgent: null,
      agentMessages: [],
      actionLedger: [],
      artifacts: {},
      evidenceGaps: [],
      currentModule: "practice",
      runningStatus: "idle",
      completedStages: [],
    });
    setPageStatus("idle", "待启动", "Copilot 尚未运行。启动后 Director 将调度各专业 Agent 推进课堂实践方案。");
    ["director", "practice-agent", "rubric-agent", "evidence-agent", "asset-agent"].forEach((agentId) => setAgentStatus(agentId, "waiting"));
    renderStageTracks(defaultSteps);
    renderCurrentStepDetail(null);
    resetReviewPanels();
    renderArtifactOutput();
    updateRuntimeOverview();
    const eventLog = byId("agent-message-panel");
    if (eventLog) eventLog.innerHTML = "<p>运行事件会记录在这里，主判断以画布和审校面板为准。</p>";
  }

  function renderPracticeFlow(payload) {
    const flow = normalizePracticeFlow(payload);
    window.AgentRuntimeStore?.mergeArtifacts({ practiceFlow: flow });
    renderStageTracks(flow.steps);
    renderCurrentStepDetail(flow.currentStep);
    renderTeacherInterventions(flow);
    setAgentStatus("practice-agent", flow.currentStep ? "running" : "done", "已写入主画布。");
    setPageStatus("running", "推进中", "Practice Agent 已生成教学实践流程，正在等待后续校验与沉淀。");
    renderArtifactOutput();
    updateRuntimeOverview();
  }

  function renderPracticeStepUpdate(payload) {
    const state = window.AgentRuntimeStore?.getState();
    const existing = state?.artifacts?.practiceFlow || normalizePracticeFlow({});
    const nextStep = normalizeStep(payload, Number(payload.stepNo || payload.stepId || payload.id || 1) - 1);
    const steps = existing.steps.map((step) => (step.stepNo === nextStep.stepNo ? { ...step, ...nextStep } : step));
    const flow = {
      ...existing,
      steps,
      currentStep: steps.find((step) => step.stepNo === nextStep.stepNo) || existing.currentStep,
    };
    window.AgentRuntimeStore?.mergeArtifacts({ practiceFlow: flow });
    renderStageTracks(flow.steps);
    renderCurrentStepDetail(flow.currentStep);
    renderTeacherInterventions(flow);
    setAgentStatus("practice-agent", "running", "已更新当前节点。");
    renderArtifactOutput();
    updateRuntimeOverview();
  }

  function renderRubricPreview(payload) {
    window.AgentRuntimeStore?.mergeArtifacts({ rubric: payload });
    const panel = byId("rubric-preview-panel");
    if (!panel) return;
    const dimensions = normalizeRubricDimensions(payload);
    panel.innerHTML = [
      renderReviewHeading("评价量规", payload.title || "课堂实践评价量规"),
      dimensions.length
        ? `<div class="review-card-list">${dimensions.map(renderRubricDimension).join("")}</div>`
        : '<p class="review-empty-copy">Rubric Agent 尚未返回评价维度。</p>',
    ].join("");
    setAgentStatus("rubric-agent", "done", "评价量规已生成。");
    renderArtifactOutput();
    updateRuntimeOverview();
  }

  function renderEvidenceGap(payload) {
    const current = window.AgentRuntimeStore?.getState().evidenceGaps || [];
    window.AgentRuntimeStore?.setEvidenceGaps([payload, ...current]);
    const panel = byId("evidence-gap-panel");
    if (!panel) return;
    if (!panel.querySelector(".review-card-list")) {
      panel.innerHTML = `${renderReviewHeading("证据缺口", "需要教师补充或确认")}<div class="review-card-list"></div>`;
    }
    panel.querySelector(".review-card-list")?.insertAdjacentHTML("afterbegin", renderEvidenceGapCard(payload));
    setAgentStatus("evidence-agent", "blocked", "存在待补充证据。");
    renderArtifactOutput();
    updateRuntimeOverview();
  }

  function renderEvidenceAttachment(payload) {
    const state = window.AgentRuntimeStore?.getState();
    const evidence = [...((state?.artifacts?.evidenceLedger || [])), { ...payload, status: payload.status || "attached" }];
    window.AgentRuntimeStore?.mergeArtifacts({ evidenceLedger: evidence });
    setAgentStatus("evidence-agent", "done", "证据链已记录。");
    renderArtifactOutput();
    updateRuntimeOverview();
  }

  function renderAssetNode(payload) {
    const state = window.AgentRuntimeStore?.getState();
    const graph = state?.artifacts?.assetGraph || { nodes: [], edges: [] };
    const nextGraph = {
      nodes: [...(graph.nodes || []), payload],
      edges: graph.edges || [],
    };
    window.AgentRuntimeStore?.mergeArtifacts({ assetGraph: nextGraph });
    renderAssetSink(nextGraph);
    setAgentStatus("asset-agent", "done", "资产节点已沉淀。");
    renderArtifactOutput();
    updateRuntimeOverview();
  }

  function renderAssetEdge(payload) {
    const state = window.AgentRuntimeStore?.getState();
    const graph = state?.artifacts?.assetGraph || { nodes: [], edges: [] };
    const nextGraph = {
      nodes: graph.nodes || [],
      edges: [...(graph.edges || []), payload],
    };
    window.AgentRuntimeStore?.mergeArtifacts({ assetGraph: nextGraph });
    renderAssetSink(nextGraph);
    setAgentStatus("asset-agent", "done", "资产关系已记录。");
    renderArtifactOutput();
    updateRuntimeOverview();
  }

  function renderTeacherQuestion(payload) {
    window.AgentRuntimeStore?.mergeArtifacts({ teacherQuestion: payload });
    const panel = byId("teacher-confirmation-panel");
    if (!panel) return;
    panel.innerHTML = [
      renderReviewHeading("教师确认", payload.title || "需要教师判断"),
      `<article class="review-item-card is-confirmation"><p>${escapeHtml(
        payload.question || payload.prompt || payload.description || "请确认是否继续推进当前阶段。",
      )}</p><div class="runtime-question-actions"><button type="button">确认继续</button><button type="button">稍后处理</button></div></article>`,
    ].join("");
    updateRuntimeOverview();
  }

  function renderCompletedStage(payload) {
    const state = window.AgentRuntimeStore?.getState();
    const stage = payload.stage || payload.agentId || payload.title || "当前阶段";
    if (state && !state.completedStages.includes(stage)) state.completedStages.push(stage);
    if (payload.agentId) setAgentStatus(payload.agentId, "done", `${stage} 已完成。`);
    const phase = normalizePhase(payload.phase || payload.stage);
    if (phase) {
      document.querySelector(`[data-phase="${phase}"]`)?.setAttribute("data-phase-status", "done");
    }
    updateRuntimeOverview();
  }

  function renderCourseProfile(payload) {
    const context = payload.courseContext && typeof payload.courseContext === "object" ? payload.courseContext : payload;
    setText("practice-course-name", context.courseName || context.course || "管理学原理");
    setText("practice-learner-group", context.program || context.learnerGroup || context.className || "药事管理本科生");
    setText("practice-source-boundary", context.sourceBoundary || "等待教师上传材料 / 使用当前课程知识库");
    updateRuntimeOverview();
  }

  function normalizePracticeFlow(payload) {
    const incoming = Array.isArray(payload.steps) ? payload.steps.map(normalizeStep) : [];
    const byStepNo = new Map(defaultSteps.map((step) => [step.stepNo, { ...step }]));
    incoming.forEach((step) => byStepNo.set(step.stepNo, { ...byStepNo.get(step.stepNo), ...step }));
    const steps = Array.from(byStepNo.values()).sort((a, b) => a.stepNo - b.stepNo);
    let currentStepNo = getStepNo(payload.currentStep || payload.currentStepId || payload.currentStepNo);
    if (!currentStepNo) {
      const activeStep = steps.find((step) => ["running", "needs_review", "blocked"].includes(step.status));
      currentStepNo = activeStep?.stepNo || incoming[0]?.stepNo || null;
    }
    if (currentStepNo && !steps.some((step) => step.status === "running")) {
      const current = steps.find((step) => step.stepNo === currentStepNo);
      if (current && current.status === "pending") current.status = "running";
    }
    const currentStep = currentStepNo ? steps.find((step) => step.stepNo === currentStepNo) || null : null;
    return {
      id: payload.id || "practice-flow",
      title: payload.title || "教学实践 Copilot 方案",
      summary: payload.summary || payload.description || "",
      currentStep,
      steps,
      interventions: Array.isArray(payload.interventions) ? payload.interventions : [],
      raw: payload,
    };
  }

  function normalizeStep(step, index = 0) {
    const stepNo = getStepNo(step.stepNo || step.stepId || step.id) || index + 1;
    const status = normalizeStatus(step.status);
    const ownerAgent = normalizeAgentId(step.ownerAgent || step.agentId || step.responsibleAgent) || inferStepAgent(stepNo);
    const requiresTeacherConfirmation = Boolean(
      step.requiresTeacherConfirmation ||
        step.needsTeacherConfirmation ||
        step.teacherConfirmationRequired ||
        ["needs_review", "blocked"].includes(status) ||
        step.reviewQuestion,
    );
    return {
      ...step,
      id: step.id || `step-${String(stepNo).padStart(2, "0")}`,
      stepNo,
      phase: normalizePhase(step.phase) || phaseForStepNo(stepNo),
      title: step.title || step.name || defaultSteps[stepNo - 1]?.title || `教学实践步骤 ${stepNo}`,
      status,
      ownerAgent,
      nextAgent: normalizeAgentId(step.nextAgent || step.nextAgentId || step.nextDispatch),
      requiresTeacherConfirmation,
      evidenceStatus: step.evidenceStatus || step.evidenceState || "",
      artifactTypes: Array.isArray(step.artifactTypes) ? step.artifactTypes : Array.isArray(step.artifacts) ? step.artifacts : [],
      teachingIntent: step.teachingIntent || step.intent || "",
      teacherAction: step.teacherAction || step.teacherActions || "",
      studentActivity: step.studentActivity || "",
      studentOutput: step.studentOutput || step.output || "",
      evidence: step.evidence || step.evidenceRequirement || "",
      reviewQuestion: step.reviewQuestion || step.question || "",
    };
  }

  function renderStageTracks(steps) {
    Object.keys(phaseConfig).forEach((phase) => {
      const panel = byId(phaseConfig[phase].id);
      if (!panel) return;
      panel.innerHTML = steps.filter((step) => step.phase === phase).map(renderStageNode).join("");
    });
  }

  function renderStageNode(step) {
    return `<article class="practice-stage-node" data-stage-node="${escapeHtml(step.stepNo)}" data-node-status="${escapeHtml(step.status)}" data-responsible-agent="${escapeHtml(step.ownerAgent || inferStepAgent(step.stepNo))}">
      <span>STEP ${String(step.stepNo).padStart(2, "0")}</span>
      <strong>${escapeHtml(step.title)}</strong>
      <div class="stage-node-meta">
        <small>${escapeHtml(statusLabel(step.status))}</small>
        <em>${escapeHtml(agentDisplayName(step.ownerAgent || inferStepAgent(step.stepNo)))}</em>
      </div>
    </article>`;
  }

  function renderCurrentStepDetail(step) {
    const panel = byId("current-practice-step-detail");
    if (!panel) return;
    if (!step) {
      panel.innerHTML = `<div class="empty-state-block"><span>当前节点</span><h3>等待 Copilot 启动</h3><p>启动后，这里会展开当前教学节点的教学意图、教师动作、学生活动、课堂产出、评价证据和教师判断事项。</p></div>`;
      return;
    }
    const description = step.description || step.summary || "Practice Agent 已创建该节点，等待教师结合课程材料复核。";
    const ownerAgent = step.ownerAgent || inferStepAgent(step.stepNo);
    const nextAgent = step.nextAgent || inferNextAgentAfterStep(step);
    const evidenceStatus =
      step.evidenceStatus ||
      (arrayOrText(step.evidence) || arrayOrText(step.evidenceRefs)
        ? "已有证据要求，等待 Evidence Agent 校验证据链。"
        : "等待 Evidence Agent 校验证据链。");
    const confirmationStatus = step.requiresTeacherConfirmation
      ? step.reviewQuestion || "该节点需要教师确认后继续推进。"
      : "暂无强制接管点，教师可继续观察 Agent 推进结果。";
    const fields = [
      ["负责 Agent", `${agentDisplayName(ownerAgent)}：${agentRole(ownerAgent)}`],
      ["教学意图", step.teachingIntent || description],
      ["教师动作", step.teacherAction || "组织课堂推进，明确任务边界，并根据学生反馈进行追问。"],
      ["学生活动", step.studentActivity || "围绕管理学原理任务完成讨论、分析、表达或协作产出。"],
      ["学生课堂产出", step.studentOutput || "形成可评价的课堂记录、任务单、展示材料或反思文本。"],
      ["评价证据", arrayOrText(step.evidence) || arrayOrText(step.evidenceRefs) || evidenceStatus],
      ["需要教师判断的事项", confirmationStatus],
      ["Director 下一步", `调度 ${agentDisplayName(nextAgent)}：${agentRole(nextAgent)}`],
    ];
    panel.innerHTML = `<div class="current-step-head"><span>${escapeHtml(phaseConfig[step.phase]?.label || "当前阶段")} · STEP ${String(step.stepNo).padStart(2, "0")}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(description)}</p></div><div class="current-step-detail-grid">${fields
      .map(([label, value]) => `<article><strong>${escapeHtml(label)}</strong><p>${escapeHtml(value)}</p></article>`)
      .join("")}</div>`;
    updateRuntimeOverview();
  }

  function renderTeacherInterventions(flow) {
    const panel = byId("teacher-confirmation-panel");
    if (!panel) return;
    const stepQuestions = flow.steps
      .filter((step) => step.reviewQuestion || ["needs_review", "blocked"].includes(step.status))
      .map((step) => ({
        title: `STEP ${String(step.stepNo).padStart(2, "0")} · ${step.title}`,
        question: step.reviewQuestion || "该节点需要教师确认后继续推进。",
      }));
    const questions = [...stepQuestions, ...flow.interventions];
    if (!questions.length) {
      panel.innerHTML = `${renderReviewHeading("教师确认", "暂无接管点")}<p class="review-empty-copy">当前流程未要求教师立即判断。</p>`;
      updateRuntimeOverview();
      return;
    }
    panel.innerHTML = `${renderReviewHeading("教师确认", "待判断事项")}<div class="review-card-list">${questions
      .map((item) => `<article class="review-item-card is-confirmation"><strong>${escapeHtml(item.title || "待确认")}</strong><p>${escapeHtml(item.question || item.description || "请教师确认。")}</p></article>`)
      .join("")}</div>`;
    updateRuntimeOverview();
  }

  function renderAssetSink(graph) {
    const panel = byId("asset-sink-panel");
    if (!panel) return;
    const nodes = graph.nodes || [];
    const edges = graph.edges || [];
    panel.innerHTML = `${renderReviewHeading("资产沉淀", `${nodes.length} 个节点 · ${edges.length} 条关系`)}${
      nodes.length
        ? `<div class="review-card-list">${nodes
            .map((node) => `<article class="review-item-card"><strong>${escapeHtml(node.title || node.name || "资产节点")}</strong><p>${escapeHtml(node.summary || node.description || node.type || "已创建教学资产节点。")}</p></article>`)
            .join("")}</div>`
        : '<p class="review-empty-copy">等待 Asset Agent 写入。</p>'
    }`;
  }

  function renderArtifactOutput() {
    const state = window.AgentRuntimeStore?.getState() || {};
    const artifacts = state.artifacts || {};
    const flow = artifacts.practiceFlow;
    const rubric = artifacts.rubric;
    const gaps = state.evidenceGaps || [];
    const graph = artifacts.assetGraph || { nodes: [], edges: [] };
    setArtifactCard("plan", "教学实践方案", flow ? `${flow.title || "已生成方案"} · ${flow.steps?.length || 0} 个节点` : "等待 Practice Agent 生成。");
    setArtifactCard("rubric", "评价量规", rubric ? `${rubric.title || "已生成量规"} · ${normalizeRubricDimensions(rubric).length || "待复核"} 个维度` : "等待 Rubric Agent 生成。");
    setArtifactCard("evidence", "证据链", gaps.length ? `${gaps.length} 个证据缺口待补充` : artifacts.evidenceLedger?.length ? `${artifacts.evidenceLedger.length} 条证据已记录` : "等待 Evidence Agent 校验。");
    setArtifactCard("asset", "资产沉淀建议", graph.nodes?.length ? `${graph.nodes.length} 个资产节点待沉淀` : "等待 Asset Agent 写入。");
  }

  function setArtifactCard(kind, title, body) {
    const card = document.querySelector(`[data-artifact-card="${kind}"]`);
    if (!card) return;
    card.innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p>`;
  }

  function resetReviewPanels() {
    const panels = {
      "teacher-confirmation-panel": ["教师确认", "等待接管点", "当 Agent 需要教师判断时会显示在这里。"],
      "evidence-gap-panel": ["证据缺口", "暂无缺口", "证据链不足、来源边界不清或课堂数据缺失会进入这里。"],
      "rubric-preview-panel": ["评价量规", "等待生成", "Rubric Agent 会在这里生成维度、等级和证据要求。"],
      "asset-sink-panel": ["资产沉淀", "等待入库建议", "可复用的课堂任务、量规、证据链和反思材料会进入这里。"],
    };
    Object.entries(panels).forEach(([id, [kicker, title, body]]) => {
      const panel = byId(id);
      if (panel) panel.innerHTML = `${renderReviewHeading(kicker, title)}<p class="review-empty-copy">${escapeHtml(body)}</p>`;
    });
  }

  function setPageStatus(status, label, copy) {
    window.AgentRuntimeStore?.setRunningStatus(status);
    const hero = document.querySelector(".practice-workbench-hero");
    if (hero) hero.dataset.runtimeState = status;
    const badge = byId("practice-runtime-status");
    if (badge) {
      badge.dataset.runtimeStatus = status;
      badge.textContent = label || statusLabel(status);
    }
    setText("practice-runtime-status-copy", copy || "");
    updateRuntimeOverview();
  }

  function setAgentStatus(agentId, status, note) {
    const normalizedAgentId = normalizeAgentId(agentId) || agentId;
    const card = document.querySelector(`[data-agent-id="${normalizedAgentId}"]`);
    if (!card) return;
    card.dataset.agentStatus = status;
    const label = card.querySelector("small");
    if (label) label.textContent = statusLabel(status);
    if (note) {
      const copy = card.querySelector("p");
      if (copy) copy.textContent = note;
    }
    updateRuntimeOverview();
  }

  function appendEventLog(text) {
    const panel = byId("agent-message-panel");
    if (!panel || !text) return;
    panel.insertAdjacentHTML("beforeend", `<p>${escapeHtml(text)}</p>`);
    panel.scrollTop = panel.scrollHeight;
  }

  function updateRuntimeOverview() {
    const state = window.AgentRuntimeStore?.getState?.() || {};
    const artifacts = state.artifacts || {};
    const flow = artifacts.practiceFlow;
    const currentStep =
      flow?.currentStep ||
      flow?.steps?.find((step) => ["running", "needs_review", "blocked"].includes(step.status)) ||
      readCurrentStepFromDom();
    const ownerAgent = currentStep?.ownerAgent || normalizeAgentId(state.currentAgent?.id) || "director";
    const gaps = state.evidenceGaps || [];
    const evidenceLedger = artifacts.evidenceLedger || [];
    const confirmationCount = countTeacherConfirmations(flow, artifacts.teacherQuestion);
    const artifactSummary = summarizeArtifacts(artifacts, gaps);
    const nextDispatch = inferNextDispatch(state, currentStep);

    setRuntimeText("runtime-current-step", currentStep ? `STEP ${String(currentStep.stepNo).padStart(2, "0")}` : "等待启动");
    setRuntimeText(
      "runtime-current-step-note",
      currentStep ? currentStep.title || "当前节点已进入运行态。" : "Director 尚未开始调度。",
    );
    setRuntimeText("runtime-responsible-agent", agentDisplayName(ownerAgent));
    setRuntimeText("runtime-responsible-agent-note", agentRole(ownerAgent));
    setRuntimeText("runtime-evidence-gap", gaps.length ? `${gaps.length} 个缺口` : "0 个缺口");
    setRuntimeText(
      "runtime-evidence-gap-note",
      gaps.length
        ? "Evidence Agent 已标记待补充来源或课堂数据。"
        : evidenceLedger.length
        ? `${evidenceLedger.length} 条证据已记录，继续校验来源边界。`
        : "等待 Evidence Agent 校验来源边界。",
    );
    setRuntimeText("runtime-teacher-confirmation", confirmationCount ? `${confirmationCount} 个接管点` : "暂无接管点");
    setRuntimeText(
      "runtime-teacher-confirmation-note",
      confirmationCount ? "请查看右侧教师确认面板。" : "如需人工判断，会进入右侧审校面板。",
    );
    setRuntimeText("runtime-artifacts", `${artifactSummary.count} 类产物`);
    setRuntimeText("runtime-artifacts-note", artifactSummary.note);
    setRuntimeText("runtime-next-dispatch", agentDisplayName(nextDispatch.agentId));
    setRuntimeText("runtime-next-dispatch-note", nextDispatch.note);

    setMetricState("evidence-gap", gaps.length ? "warning" : "ok");
    setMetricState("teacher-confirmation", confirmationCount ? "warning" : "ok");
    setMetricState("artifacts", artifactSummary.count ? "ok" : "idle");
    setMetricState("next-dispatch", nextDispatch.agentId === "director" ? "idle" : "running");
  }

  function countTeacherConfirmations(flow, teacherQuestion) {
    const flowQuestions = flow?.steps?.filter((step) => step.reviewQuestion || step.requiresTeacherConfirmation || ["needs_review", "blocked"].includes(step.status)).length || 0;
    const interventions = Array.isArray(flow?.interventions) ? flow.interventions.length : 0;
    return flowQuestions + interventions + (teacherQuestion ? 1 : 0);
  }

  function readCurrentStepFromDom() {
    const node = document.querySelector(
      '.practice-stage-node[data-node-status="running"], .practice-stage-node[data-node-status="needs_review"], .practice-stage-node[data-node-status="blocked"]',
    );
    if (!node) return null;
    const stepNo = getStepNo(node.dataset.stageNode);
    return {
      stepNo,
      status: node.dataset.nodeStatus || "running",
      title: node.querySelector("strong")?.textContent?.trim() || defaultSteps[stepNo - 1]?.title || `教学实践步骤 ${stepNo}`,
      ownerAgent: normalizeAgentId(node.dataset.responsibleAgent) || inferStepAgent(stepNo),
    };
  }

  function summarizeArtifacts(artifacts, gaps) {
    const formed = [];
    if (artifacts.practiceFlow) formed.push("教学实践方案");
    if (artifacts.rubric) formed.push("评价量规");
    if ((artifacts.evidenceLedger || []).length || gaps.length) formed.push("证据链记录");
    if ((artifacts.assetGraph?.nodes || []).length) formed.push("可复用资产建议");
    return {
      count: formed.length,
      note: formed.length ? formed.join("、") : "实践方案、量规、证据链和资产建议将逐步形成。",
    };
  }

  function inferNextDispatch(state, currentStep) {
    const artifacts = state.artifacts || {};
    if (state.runningStatus === "error" || state.runningStatus === "blocked") {
      return { agentId: "director", note: "运行受阻，等待教师处理后再继续调度。" };
    }
    if (currentStep?.requiresTeacherConfirmation || ["needs_review", "blocked"].includes(currentStep?.status)) {
      return { agentId: "director", note: "当前节点需要教师确认，确认后再调度下一位 Agent。" };
    }
    if (currentStep?.nextAgent) {
      return { agentId: currentStep.nextAgent, note: `当前节点建议下一步调度 ${agentDisplayName(currentStep.nextAgent)}。` };
    }
    if (!artifacts.practiceFlow) {
      return { agentId: "practice-agent", note: "先生成 20 环节教学实践流程与当前节点。" };
    }
    if (!artifacts.rubric) {
      return { agentId: "rubric-agent", note: "补齐评价维度、评分量规和达成度判断。" };
    }
    if (!(artifacts.evidenceLedger || []).length || (state.evidenceGaps || []).length) {
      return { agentId: "evidence-agent", note: "校验方案依据、证据链与来源边界。" };
    }
    if (!(artifacts.assetGraph?.nodes || []).length) {
      return { agentId: "asset-agent", note: "沉淀任务单、评价表、案例包与反思材料。" };
    }
    return { agentId: "director", note: "本轮产物已形成，等待教师审校后决定是否继续。" };
  }

  function inferNextAgentAfterStep(step) {
    if (!step) return "practice-agent";
    if (["needs_review", "blocked"].includes(step.status) || step.requiresTeacherConfirmation) return "director";
    if ([8, 15, 17, 18].includes(Number(step.stepNo))) return "rubric-agent";
    if ([5, 7, 12, 14].includes(Number(step.stepNo))) return "evidence-agent";
    if (Number(step.stepNo) >= 19) return "asset-agent";
    return "practice-agent";
  }

  function inferStepAgent(stepNo) {
    const id = Number(stepNo);
    if ([8, 15, 17].includes(id)) return "rubric-agent";
    if ([5, 7, 12, 18].includes(id)) return "evidence-agent";
    if ([19, 20].includes(id)) return "asset-agent";
    return "practice-agent";
  }

  function normalizeAgentId(value) {
    const text = String(value || "").toLowerCase();
    if (!text) return "";
    if (text.includes("rubric") || text.includes("量规") || text.includes("评价")) return "rubric-agent";
    if (text.includes("evidence") || text.includes("证据")) return "evidence-agent";
    if (text.includes("asset") || text.includes("资产")) return "asset-agent";
    if (text.includes("practice") || text.includes("实践")) return "practice-agent";
    if (text.includes("director") || text.includes("context") || text.includes("diagnosis") || text.includes("navigation") || text.includes("导航")) return "director";
    return agentConfig[text] ? text : "";
  }

  function agentDisplayName(agentId) {
    return agentConfig[normalizeAgentId(agentId) || agentId]?.label || "Director";
  }

  function agentRole(agentId) {
    return agentConfig[normalizeAgentId(agentId) || agentId]?.role || agentConfig.director.role;
  }

  function setRuntimeText(id, value) {
    const node = byId(id);
    if (node) node.textContent = String(value ?? "");
  }

  function setMetricState(metric, state) {
    const node = document.querySelector(`[data-runtime-metric="${metric}"]`);
    if (node) node.dataset.metricState = state;
  }

  function normalizeRubricDimensions(payload) {
    return Array.isArray(payload.dimensions) ? payload.dimensions : Array.isArray(payload.sections) ? payload.sections : [];
  }

  function renderRubricDimension(item, index) {
    const title = item.title || item.name || item.dimension || `评价维度 ${index + 1}`;
    const body = item.description || item.summary || item.criteria || (Array.isArray(item.items) ? item.items.join("；") : "待教师复核。");
    return `<article class="review-item-card"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></article>`;
  }

  function renderEvidenceGapCard(payload) {
    const title = payload.title || payload.gap || "证据缺口";
    return `<article class="review-item-card is-gap"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(
      payload.reason || payload.description || payload.question || "需要教师补充来源或课堂数据后再确认。",
    )}</p></article>`;
  }

  function renderReviewHeading(kicker, title) {
    return `<div class="workbench-panel-heading"><span>${escapeHtml(kicker)}</span><h3>${escapeHtml(title)}</h3></div>`;
  }

  function focusRuntimePanel(payload, target) {
    const targetId = payload.panelId || payload.targetId || payload.id || target;
    if (!targetId) return;
    document.querySelectorAll(".agent-runtime-focus").forEach((node) => node.classList.remove("agent-runtime-focus"));
    const node = byId(targetId);
    if (!node) return;
    node.classList.add("agent-runtime-focus");
    node.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function phaseForStepNo(stepNo) {
    if (stepNo <= 6) return "pre";
    if (stepNo <= 16) return "classroom";
    return "post";
  }

  function normalizePhase(value) {
    if (["pre", "classroom", "post"].includes(value)) return value;
    if (value === "课前准备") return "pre";
    if (value === "课堂实施") return "classroom";
    if (value === "课后评价与沉淀" || value === "课后评价") return "post";
    return "";
  }

  function normalizeStatus(value) {
    if (value === "active" || value === "current" || value === "queued") return value === "queued" ? "pending" : "running";
    if (["pending", "running", "done", "needs_review", "blocked"].includes(value)) return value;
    return "pending";
  }

  function statusLabel(status) {
    return (
      {
        idle: "待启动",
        running: "推进中",
        pending: "待运行",
        done: "已完成",
        needs_review: "待教师确认",
        blocked: "证据受阻",
        ready_for_review: "待审校",
        error: "运行受阻",
        waiting: "等待",
      }[status] || status
    );
  }

  function getStepNo(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const match = value.match(/\d+/);
      if (match) return Number(match[0]);
    }
    if (value && typeof value === "object") return getStepNo(value.stepNo || value.stepId || value.id);
    return 0;
  }

  function arrayOrText(value) {
    if (Array.isArray(value)) return value.filter(Boolean).join("；");
    return typeof value === "string" ? value : "";
  }

  function setText(id, value) {
    const node = byId(id);
    if (node && value) node.textContent = value;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.executeTeachingAction = executeTeachingAction;
  window.AgentActionEngine = {
    appendEventLog,
    executeTeachingAction,
    renderArtifactOutput,
    resetWorkbench,
    setAgentStatus,
    setPageStatus,
    updateRuntimeOverview,
  };
})();
