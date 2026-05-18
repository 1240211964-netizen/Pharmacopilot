import React from "react";
import { createRoot } from "react-dom/client";
import { WendaEmbedWorkspace } from "./components/integrations/WendaEmbedWorkspace";

const rootElement = document.getElementById("wendaEmbedWorkspaceRoot");

if (rootElement) {
  const variant = rootElement.dataset.wendaVariant === "home-dialog" ? "home-dialog" : "workspace";
  createRoot(rootElement).render(
    <React.StrictMode>
      <WendaEmbedWorkspace variant={variant} />
    </React.StrictMode>,
  );
}
