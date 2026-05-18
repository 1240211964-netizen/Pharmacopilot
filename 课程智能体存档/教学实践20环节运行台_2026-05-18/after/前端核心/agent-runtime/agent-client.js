(function () {
  "use strict";

  const Events = window.AgentRuntimeEvents || {};

  async function startAgentRun(payload) {
    const finalPayload = payload || buildPracticeAgentPayload();
    resetRuntimeWorkbench();
    setWorkbenchStatus("running", "运行中", "Director 正在判断下一步调度。");
    window.AgentActionEngine?.setAgentStatus("director", "running", "正在读取当前课程上下文。");

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
    if (!["error", "blocked"].includes(finalStatus)) {
      setWorkbenchStatus("ready_for_review", "待审校", "本轮 Copilot 推进完成，请检查右侧审校面板与下方产物。");
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
      appendEventLog("收到无法解析的 agent event。");
      return;
    }
    handleAgentEvent(event);
  }

  function handleAgentEvent(event) {
    switch (event.type) {
      case Events.DIRECTOR_THINKING:
        setWorkbenchStatus("running", "运行中", event.reason || "Director 正在分析运行状态。");
        window.AgentActionEngine?.setAgentStatus("director", "running", event.reason || "正在判断下一位 Agent。");
        appendEventLog(`Director：${event.reason || "正在判断下一位 Agent。"}`);
        window.AgentActionEngine?.updateRuntimeOverview?.();
        break;
      case Events.AGENT_START:
        window.AgentRuntimeStore?.setCurrentAgent({
          id: event.agentId,
          name: event.agentName,
          role: event.role,
        });
        window.AgentActionEngine?.setAgentStatus("director", "done", "已完成本次调度。");
        window.AgentActionEngine?.setAgentStatus(event.agentId, "running", event.role || "正在执行。");
        setWorkbenchStatus("running", "运行中", `${event.agentName} 正在推进任务。`);
        appendEventLog(`${event.agentName} 开始执行。`);
        window.AgentActionEngine?.updateRuntimeOverview?.();
        break;
      case Events.TEXT_DELTA:
        appendEventLog(event.delta || "");
        break;
      case Events.ACTION:
        window.executeTeachingAction?.(event.action);
        break;
      case Events.AGENT_END:
        window.AgentActionEngine?.setAgentStatus(event.agentId, "done", "本轮输出已写入工作台。");
        appendEventLog(`${event.summary?.agentName || event.agentId} 完成本轮输出。`);
        window.AgentActionEngine?.updateRuntimeOverview?.();
        break;
      case Events.SESSION_STATE:
        var existingState = window.AgentRuntimeStore?.getState() || {};
        window.AgentRuntimeStore?.setState({
          artifacts: {
            ...(existingState.artifacts || {}),
            ...(event.artifacts || {}),
          },
          evidenceGaps: event.storeState?.evidenceGaps || existingState.evidenceGaps || [],
          directorState: event.directorState || {},
          runningStatus: window.AgentRuntimeStore?.getState().runningStatus,
        });
        window.AgentActionEngine?.renderArtifactOutput();
        if (event.maxTurnsReached) {
          setWorkbenchStatus("ready_for_review", "待审校", "已达到本轮最多 3 个 Agent turn，请先审校当前结果。");
        }
        window.AgentActionEngine?.updateRuntimeOverview?.();
        break;
      case Events.ERROR:
        setWorkbenchStatus("error", "运行受阻", event.message || "Agent 运行失败。");
        window.AgentActionEngine?.setAgentStatus(window.AgentRuntimeStore?.getState()?.currentAgent?.id || "director", "blocked", event.message || "Agent 运行失败。");
        appendEventLog(event.message || "Agent 运行失败。");
        window.AgentActionEngine?.updateRuntimeOverview?.();
        break;
    }
  }

  function buildPracticeAgentPayload() {
    const courseContext = {
      userId: "local-teacher",
      courseId: "management-principles-pharmacy",
      courseName: "管理学原理",
      lessonTitle: "药品政策与机构管理课堂案例分析",
      className: "药事管理本科教学班",
      program: "药事管理本科生",
      learnerProfile: "已完成管理学基础概念预习，需要在药事管理场景中完成案例分析、证据化表达和管理建议论证。",
      sourceBoundary: "等待教师上传材料 / 使用当前课程知识库",
    };
    return {
      userId: courseContext.userId,
      courseId: courseContext.courseId,
      module: "practice",
      prompt: [
        "请启动 PharmacoPilot 教学实践 Copilot。",
        "请输出可被前端 Teaching Action Engine 渲染的 JSON actions。",
        "不要把 20 个教学环节生成 20 个真实 Agent；20 个环节只是教学实践流程中的状态节点。",
        "底层只使用 Director、Practice Agent、Rubric Agent、Evidence Agent、Asset Agent 这些专业 Agent 职责。",
        "practice.create_flow 的 steps 请尽量包含 phase、stepNo、title、status、ownerAgent、teachingIntent、teacherAction、studentActivity、studentOutput、evidence、reviewQuestion、nextAgent。",
        "不要把教学导航中的 SWOT 示例知识点作为教学实践默认主题；教学实践应围绕管理学原理在药事管理本科课堂中的实施。",
      ].join("\\n"),
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

  function resetRuntimeWorkbench() {
    window.AgentActionEngine?.resetWorkbench();
    window.AgentRuntimeStore?.setState({
      currentModule: "practice",
      runningStatus: "running",
      currentAgent: null,
      agentMessages: [],
      actionLedger: [],
      artifacts: {},
      evidenceGaps: [],
    });
  }

  function setWorkbenchStatus(status, label, copy) {
    window.AgentActionEngine?.setPageStatus(status, label, copy);
  }

  function appendEventLog(text) {
    if (!text) return;
    window.AgentRuntimeStore?.appendAgentMessage({ source: "runtime", text, at: new Date().toISOString() });
    window.AgentActionEngine?.appendEventLog(text);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.AgentActionEngine?.resetWorkbench();
    const button = byId("startPracticeCopilot");
    if (!button) return;
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.textContent = "正在生成实践方案";
      try {
        await startAgentRun();
      } catch (error) {
        setWorkbenchStatus("error", "运行受阻", error.message || "Agent 运行失败。");
        appendEventLog(error.message || "Agent 运行失败。");
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
