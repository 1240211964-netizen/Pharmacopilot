(function () {
  "use strict";

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
      case "navigation.create_path":
        renderStatusNote(action.type, action.payload || {});
        break;
    }
  }

  function renderPracticeFlow(payload) {
    window.AgentRuntimeStore?.mergeArtifacts({ practiceFlow: payload });
    const panel = byId("practice-flow-runtime");
    if (!panel) return;
    const steps = normalizeSteps(payload.steps);
    panel.innerHTML = [
      renderPanelHeading("教学实践运行流", payload.title || "PharmacoPilot 教学实践 Flow", payload.description || payload.summary),
      steps.length
        ? `<div class="runtime-flow-list">${steps.map(renderFlowStep).join("")}</div>`
        : '<p class="runtime-muted">Agent 尚未返回可渲染步骤。</p>',
    ].join("");
  }

  function renderPracticeStepUpdate(payload) {
    const panel = byId("practice-flow-runtime");
    if (!panel) return;
    const title = payload.title || payload.name || `STEP ${payload.stepId || payload.id || ""}`;
    const status = payload.status || "running";
    panel.insertAdjacentHTML(
      "beforeend",
      `<article class="runtime-step-card is-update"><span>${escapeHtml(status)}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(
        payload.summary || payload.description || "已更新当前教学实践步骤。",
      )}</p></article>`,
    );
  }

  function renderRubricPreview(payload) {
    window.AgentRuntimeStore?.mergeArtifacts({ rubric: payload });
    const panel = byId("rubric-preview-panel");
    if (!panel) return;
    const dimensions = Array.isArray(payload.dimensions) ? payload.dimensions : Array.isArray(payload.sections) ? payload.sections : [];
    panel.innerHTML = [
      renderPanelHeading("评价量规摘要", payload.title || "课堂实践评价量规", payload.summary || payload.description),
      dimensions.length
        ? `<div class="runtime-rubric-list">${dimensions.map(renderRubricDimension).join("")}</div>`
        : '<p class="runtime-muted">暂未生成评价维度。</p>',
    ].join("");
  }

  function renderEvidenceGap(payload) {
    const current = window.AgentRuntimeStore?.getState().evidenceGaps || [];
    window.AgentRuntimeStore?.setEvidenceGaps([payload, ...current]);
    const panel = byId("evidence-gap-panel");
    if (!panel) return;
    const title = payload.title || payload.gap || "证据缺口";
    panel.insertAdjacentHTML(
      "afterbegin",
      `<article class="runtime-gap-card"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(
        payload.reason || payload.description || payload.question || "需要教师补充来源或课堂数据后再确认。",
      )}</p></article>`,
    );
  }

  function renderEvidenceAttachment(payload) {
    renderStatusNote("evidence.attach", {
      title: payload.title || "已附加证据",
      summary: payload.summary || payload.description || payload.source || "Agent 已记录一条证据引用。",
    });
  }

  function renderAssetNode(payload) {
    const panel = ensureStatusSubPanel("agent-runtime-assets", "教学资产节点");
    if (!panel) return;
    panel.insertAdjacentHTML(
      "beforeend",
      `<article class="runtime-asset-card"><strong>${escapeHtml(payload.title || payload.name || "资产节点")}</strong><p>${escapeHtml(
        payload.summary || payload.description || payload.type || "已创建教学资产节点。",
      )}</p></article>`,
    );
  }

  function renderAssetEdge(payload) {
    const panel = ensureStatusSubPanel("agent-runtime-assets", "教学资产节点");
    if (!panel) return;
    panel.insertAdjacentHTML(
      "beforeend",
      `<p class="runtime-edge-note">${escapeHtml(payload.label || payload.relation || "已创建资产关系")}：${escapeHtml(
        [payload.source, payload.target].filter(Boolean).join(" -> ") || "关系已记录",
      )}</p>`,
    );
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

  function renderTeacherQuestion(payload) {
    const panel = ensureStatusSubPanel("agent-runtime-teacher-question", "教师确认");
    if (!panel) return;
    panel.innerHTML = `<article class="runtime-question-card"><strong>${escapeHtml(payload.title || "需要教师确认")}</strong><p>${escapeHtml(
      payload.question || payload.prompt || payload.description || "请确认是否继续推进当前阶段。",
    )}</p><div class="runtime-question-actions"><button type="button">确认继续</button><button type="button">稍后处理</button></div></article>`;
  }

  function renderCompletedStage(payload) {
    const stage = payload.stage || payload.title || "当前阶段";
    const state = window.AgentRuntimeStore?.getState();
    if (state && !state.completedStages.includes(stage)) state.completedStages.push(stage);
    renderStatusNote("system.complete_stage", {
      title: "阶段完成",
      summary: `${stage} 已标记为完成。`,
    });
  }

  function renderStatusNote(type, payload) {
    const panel = ensureStatusSubPanel("agent-runtime-notes", "运行记录");
    if (!panel) return;
    panel.insertAdjacentHTML(
      "afterbegin",
      `<p class="runtime-status-note"><strong>${escapeHtml(payload.title || type)}</strong><span>${escapeHtml(
        payload.summary || payload.description || "状态已更新。",
      )}</span></p>`,
    );
  }

  function renderPanelHeading(kicker, title, description) {
    return `<div class="runtime-panel-heading"><span>${escapeHtml(kicker)}</span><h3>${escapeHtml(title)}</h3>${
      description ? `<p>${escapeHtml(description)}</p>` : ""
    }</div>`;
  }

  function renderFlowStep(step, index) {
    const title = step.title || step.name || `教学实践步骤 ${index + 1}`;
    const status = step.status || (index === 0 ? "running" : "queued");
    return `<article class="runtime-step-card" data-runtime-step="${escapeHtml(step.id || index + 1)}"><span>${escapeHtml(
      status,
    )}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(step.summary || step.description || step.task || "等待 Agent 补充步骤说明。")}</p></article>`;
  }

  function renderRubricDimension(item, index) {
    const title = item.title || item.name || item.dimension || `维度 ${index + 1}`;
    const body = item.description || item.summary || item.criteria || (Array.isArray(item.items) ? item.items.join("；") : "待教师复核。");
    return `<article class="runtime-rubric-card"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></article>`;
  }

  function normalizeSteps(steps) {
    return Array.isArray(steps) ? steps.filter((step) => step && typeof step === "object") : [];
  }

  function ensureStatusSubPanel(id, title) {
    const statusPanel = byId("agent-status-panel");
    if (!statusPanel) return null;
    let panel = byId(id);
    if (panel) return panel;
    statusPanel.insertAdjacentHTML("beforeend", `<div class="runtime-status-subpanel" id="${id}"><h4>${escapeHtml(title)}</h4></div>`);
    return byId(id);
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
    executeTeachingAction,
  };
})();
