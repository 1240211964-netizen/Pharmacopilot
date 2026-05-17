(function () {
  "use strict";

  const Events = window.AgentRuntimeEvents || {};

  async function startAgentRun(payload) {
    const finalPayload = payload || buildPracticeAgentPayload();
    resetRuntimePanels();
    setStatus("running", "Director 正在判断下一位 agent。");

    const response = await fetch("/api/agent/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalPayload),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Agent endpoint failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split(/\r?\n\r?\n/);
      buffer = frames.pop() || "";
      frames.forEach(handleSseFrame);
    }

    if (buffer.trim()) handleSseFrame(buffer);
    const finalStatus = window.AgentRuntimeStore?.getState().runningStatus;
    if (!["error", "paused"].includes(finalStatus)) {
      setStatus("complete", "本轮 Copilot 运行结束。");
    }
  }

  function handleSseFrame(frame) {
    const data = frame
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data) return;
    let event;
    try {
      event = JSON.parse(data);
    } catch {
      appendMessage("system", "收到无法解析的 agent event。");
      return;
    }
    handleAgentEvent(event);
  }

  function handleAgentEvent(event) {
    switch (event.type) {
      case Events.DIRECTOR_THINKING:
        setStatus("thinking", event.reason || "Director 正在分析运行状态。");
        break;
      case Events.AGENT_START:
        window.AgentRuntimeStore?.setCurrentAgent({
          id: event.agentId,
          name: event.agentName,
          role: event.role,
        });
        setStatus("running", `${event.agentName} 开始工作。`);
        appendMessage("agent", `【${event.agentName}】开始：${event.role || ""}`);
        break;
      case Events.TEXT_DELTA:
        appendMessage("agent", event.delta || "");
        break;
      case Events.ACTION:
        window.executeTeachingAction?.(event.action);
        break;
      case Events.AGENT_END:
        setStatus("running", `${event.summary?.agentName || event.agentId} 已完成本轮。`);
        break;
      case Events.SESSION_STATE:
        window.AgentRuntimeStore?.setState({
          artifacts: event.artifacts || {},
          evidenceGaps: event.storeState?.evidenceGaps || [],
          runningStatus: event.maxTurnsReached ? "paused" : window.AgentRuntimeStore?.getState().runningStatus,
        });
        if (event.maxTurnsReached) setStatus("paused", "已达到本轮最多 3 个 agent turn。");
        break;
      case Events.ERROR:
        setStatus("error", event.message || "Agent 运行失败。");
        appendMessage("system", event.message || "Agent 运行失败。");
        break;
    }
  }

  function buildPracticeAgentPayload() {
    const courseContext = {
      userId: "local-teacher",
      courseId: "management-principles-pharmacy",
      courseName: "管理学原理",
      lessonTitle: "药事管理本科课堂教学实践",
      className: "药事管理 2024-1",
      program: "药事管理本科",
      learnerProfile: "已完成管理学基础概念预习，需要在药事管理场景中完成概念迁移和证据化表达。",
      sourceBoundary: "本地演示上下文；正式运行需接入教师上传材料和课程知识库引用。",
    };
    return {
      userId: courseContext.userId,
      courseId: courseContext.courseId,
      module: "practice",
      prompt: "请启动 PharmacoPilot 第一版教学实践 Copilot，生成可在 practice.html 渲染的运行状态、教学实践流程、评价量规、证据缺口和资产沉淀建议。",
      courseContext,
      storeState: {
        currentModule: "practice",
        courseContext,
        artifacts: window.AgentRuntimeStore?.getState().artifacts || {},
      },
      artifacts: window.AgentRuntimeStore?.getState().artifacts || {},
      evidenceLedger: [],
      directorState: {
        completedStages: [],
      },
    };
  }

  function resetRuntimePanels() {
    const messagePanel = byId("agent-message-panel");
    if (messagePanel) {
      messagePanel.innerHTML = '<div class="runtime-panel-heading"><span>Agent message</span><h3>运行消息</h3></div>';
    }
    const statusPanel = byId("agent-status-panel");
    if (statusPanel) {
      statusPanel.innerHTML = '<div class="runtime-panel-heading"><span>Status</span><h3>Copilot 状态</h3><p>等待 Director 选择下一位 agent。</p></div>';
    }
    const flowPanel = byId("practice-flow-runtime");
    if (flowPanel) {
      flowPanel.innerHTML = '<div class="runtime-panel-heading"><span>Practice flow</span><h3>教学实践流程</h3><p>启动后由 practice-agent 写入。</p></div>';
    }
    const rubricPanel = byId("rubric-preview-panel");
    if (rubricPanel) {
      rubricPanel.innerHTML = '<div class="runtime-panel-heading"><span>Rubric</span><h3>评价量规摘要</h3><p>启动后由 rubric-agent 写入。</p></div>';
    }
    const gapPanel = byId("evidence-gap-panel");
    if (gapPanel) {
      gapPanel.innerHTML = '<div class="runtime-panel-heading"><span>Evidence gaps</span><h3>证据缺口</h3><p>证据校验结果会显示在这里。</p></div>';
    }
  }

  function setStatus(status, text) {
    window.AgentRuntimeStore?.setRunningStatus(status);
    const statusPanel = byId("agent-status-panel");
    if (!statusPanel) return;
    const badge = statusPanel.querySelector("[data-agent-runtime-status]");
    if (badge) {
      badge.textContent = status;
      badge.dataset.state = status;
    } else {
      statusPanel.insertAdjacentHTML(
        "afterbegin",
        `<div class="agent-runtime-status-line"><span data-agent-runtime-status data-state="${escapeHtml(status)}">${escapeHtml(
          status,
        )}</span><p>${escapeHtml(text || "")}</p></div>`,
      );
      return;
    }
    const copy = statusPanel.querySelector(".agent-runtime-status-line p");
    if (copy) copy.textContent = text || "";
  }

  function appendMessage(source, text) {
    if (!text) return;
    window.AgentRuntimeStore?.appendAgentMessage({ source, text, at: new Date().toISOString() });
    const panel = byId("agent-message-panel");
    if (!panel) return;
    panel.insertAdjacentHTML(
      "beforeend",
      `<p class="runtime-message ${source === "system" ? "is-system" : ""}">${escapeHtml(text)}</p>`,
    );
    panel.scrollTop = panel.scrollHeight;
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

  document.addEventListener("DOMContentLoaded", () => {
    resetRuntimePanels();
    const button = byId("startPracticeCopilot");
    if (!button) return;
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.textContent = "Copilot 运行中";
      try {
        await startAgentRun();
      } catch (error) {
        setStatus("error", error.message || "Agent 运行失败。");
        appendMessage("system", error.message || "Agent 运行失败。");
      } finally {
        button.disabled = false;
        button.textContent = "启动教学实践 Copilot";
      }
    });
  });

  window.startAgentRun = startAgentRun;
  window.AgentClient = {
    startAgentRun,
    buildPracticeAgentPayload,
  };
})();
