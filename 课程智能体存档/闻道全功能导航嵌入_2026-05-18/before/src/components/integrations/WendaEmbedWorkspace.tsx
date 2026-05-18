import React, { useState } from "react";
import {
  buildWendaUrl,
  getRuntimeWendaDomain,
  WENDA_DEFAULT_AGENT_ID,
  WENDA_DEFAULT_HD,
} from "../../lib/wenda";

function buildWorkspaceUrl(domain: string): string {
  return buildWendaUrl({
    domain,
    route: "ai_knowledge_base",
    agentId: WENDA_DEFAULT_AGENT_ID,
    hd: WENDA_DEFAULT_HD,
    internetSearch: false,
    datasetIds: [],
    imageIds: [],
    fileIds: [],
  });
}

export function WendaEmbedWorkspace() {
  const [domain] = useState(() => getRuntimeWendaDomain());
  const [frameVersion, setFrameVersion] = useState(0);
  const [error, setError] = useState("");
  const [embedUrl, setEmbedUrl] = useState(() => {
    try {
      return buildWorkspaceUrl(domain);
    } catch {
      return "";
    }
  });

  function refreshFrame() {
    try {
      const nextUrl = buildWorkspaceUrl(domain);
      setEmbedUrl(nextUrl);
      setFrameVersion((value) => value + 1);
      setError("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "闻道链接生成失败。");
    }
  }

  return (
    <section className="wenda-embed-workspace" aria-labelledby="wenda-embed-title">
      <div className="wenda-embed-head">
        <div>
          <p className="eyebrow">外部学术服务</p>
          <h2 id="wenda-embed-title">闻道 AI 知识库内嵌工作区</h2>
        </div>
        <p>
          以页面内嵌方式接入闻道 AI 知识库页面。知识库维护和资源查看仍在闻道页面内完成；如果平台限制内嵌，可使用新窗口打开。
        </p>
      </div>

      <div className="wenda-embed-grid">
        <aside className="wenda-embed-panel wenda-embed-params" aria-label="闻道 AI 知识库入口">
          <div className="wenda-panel-card">
            <span>当前入口</span>
            <strong>AI 知识库</strong>
            <p>用于进入闻道知识库工作区，查看、维护和组织课程相关知识资源。</p>
          </div>

          {error ? <p className="wenda-error">{error}</p> : null}
          <button className="wenda-primary-action" type="button" onClick={refreshFrame}>
            刷新知识库页面
          </button>
        </aside>

        <section className="wenda-iframe-workspace" aria-label="闻道 iframe 工作区">
          <div className="wenda-iframe-toolbar">
            <div>
              <span>闻道页面</span>
              <strong>AI 知识库工作区</strong>
            </div>
            <a className={`wenda-open-link ${embedUrl ? "" : "is-disabled"}`} href={embedUrl || "#"} target="_blank" rel="noopener noreferrer" aria-disabled={embedUrl ? "false" : "true"}>
              在新窗口打开 AI 知识库
            </a>
          </div>
          <p className="wenda-frame-warning">如果页面无法显示，可能是闻道平台限制跨站内嵌，请点击新窗口打开。</p>
          <iframe
            key={frameVersion}
            className="wenda-embed-frame"
            title="闻道 AI 知识库"
            src={embedUrl || "about:blank"}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
          />
        </section>
      </div>
    </section>
  );
}
