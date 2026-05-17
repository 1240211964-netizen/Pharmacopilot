(function () {
  "use strict";

  const state = {
    currentAgent: null,
    agentMessages: [],
    actionLedger: [],
    artifacts: {},
    evidenceGaps: [],
    currentModule: "practice",
    runningStatus: "idle",
    completedStages: [],
  };

  function getState() {
    return state;
  }

  function setState(patch) {
    if (!patch || typeof patch !== "object") return state;
    Object.assign(state, patch);
    return state;
  }

  function setRunningStatus(status) {
    state.runningStatus = status || "idle";
    return state.runningStatus;
  }

  function setCurrentAgent(agent) {
    state.currentAgent = agent || null;
    return state.currentAgent;
  }

  function appendAgentMessage(message) {
    if (!message) return state.agentMessages;
    const entry = typeof message === "string" ? { text: message, at: new Date().toISOString() } : message;
    state.agentMessages.push(entry);
    return state.agentMessages;
  }

  function recordTeachingAction(action) {
    if (!action || typeof action !== "object") return state.actionLedger;
    state.actionLedger.push({
      ...action,
      receivedAt: new Date().toISOString(),
    });
    return state.actionLedger;
  }

  function mergeArtifacts(artifacts) {
    if (!artifacts || typeof artifacts !== "object") return state.artifacts;
    state.artifacts = {
      ...state.artifacts,
      ...artifacts,
    };
    return state.artifacts;
  }

  function setEvidenceGaps(gaps) {
    state.evidenceGaps = Array.isArray(gaps) ? gaps : [];
    return state.evidenceGaps;
  }

  window.AgentRuntimeStore = {
    state,
    getState,
    setState,
    setRunningStatus,
    setCurrentAgent,
    appendAgentMessage,
    recordTeachingAction,
    mergeArtifacts,
    setEvidenceGaps,
  };
})();
