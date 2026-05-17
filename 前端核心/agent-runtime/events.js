(function () {
  "use strict";

  window.AgentRuntimeEvents = Object.freeze({
    DIRECTOR_THINKING: "director_thinking",
    AGENT_START: "agent_start",
    TEXT_DELTA: "text_delta",
    ACTION: "action",
    AGENT_END: "agent_end",
    SESSION_STATE: "session_state",
    ERROR: "error",
  });
})();
