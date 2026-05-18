import React from "react";
import { createRoot } from "react-dom/client";
import { WendaEmbedWorkspace } from "./components/integrations/WendaEmbedWorkspace";

const rootElement = document.getElementById("wendaEmbedWorkspaceRoot");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <WendaEmbedWorkspace />
    </React.StrictMode>,
  );
}
