import React, { useState } from "react";
import {
  buildWendaUrl,
  getRuntimeWendaDomain,
  WENDA_DEFAULT_AGENT_ID,
  WENDA_DEFAULT_HD,
  WENDA_DEFAULT_MODEL_ID,
  WENDA_DEFAULT_SEARCH_TEXT,
} from "../../lib/wenda";

function buildWorkspaceUrl(values: {
  domain: string;
  searchText: string;
  internetSearch: boolean;
}): string {
  const searchText = values.searchText.trim();
  if (!searchText) throw new Error("请先填写检索问题。");

  return buildWendaUrl({
    domain: values.domain,
    route: "history",
    agentId: WENDA_DEFAULT_AGENT_ID,
    modelId: WENDA_DEFAULT_MODEL_ID,
    searchText,
    hd: WENDA_DEFAULT_HD,
    internetSearch: values.internetSearch,
    datasetIds: [],
    imageIds: [],
    fileIds: [],
  });
}

export function WendaEmbedWorkspace() {
  const [domain] = useState(() => getRuntimeWendaDomain());
  const [searchText, setSearchText] = useState(WENDA_DEFAULT_SEARCH_TEXT);
  const [internetSearch, setInternetSearch] = useState(false);
  const [frameVersion, setFrameVersion] = useState(0);
  const [error, setError] = useState("");
  const [embedUrl, setEmbedUrl] = useState(() => {
    try {
      return buildWorkspaceUrl({
        domain,
        searchText: WENDA_DEFAULT_SEARCH_TEXT,
        internetSearch: false,
      });
    } catch {
      return "";
    }
  });

  function refreshFrame() {
    try {
      const nextUrl = buildWorkspaceUrl({ domain, searchText, internetSearch });
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
          <h2 id="wenda-embed-title">闻道学术服务平台内嵌工作区</h2>
        </div>
        <p>
          以页面内嵌方式接入闻道对话页。教师只需调整问题并刷新对话；如果平台限制内嵌，可使用新窗口打开。
        </p>
      </div>

      <div className="wenda-embed-grid">
        <aside className="wenda-embed-panel wenda-embed-params" aria-label="闻道任务参数">
          <div className="wenda-panel-card">
            <span>当前智能体</span>
            <strong>闻道医学影像学智能体</strong>
            <p>已接入学校默认智能体配置，可直接用于课堂任务设计。</p>
          </div>

          <label>
            <span>检索问题</span>
            <textarea rows={5} value={searchText} onChange={(event) => setSearchText(event.target.value)} />
          </label>

          <label className="wenda-toggle-row">
            <input type="checkbox" checked={internetSearch} onChange={(event) => setInternetSearch(event.target.checked)} />
            <span>启用联网检索</span>
          </label>

          {error ? <p className="wenda-error">{error}</p> : null}
          <button className="wenda-primary-action" type="button" onClick={refreshFrame}>
            刷新闻道对话
          </button>
        </aside>

        <section className="wenda-iframe-workspace" aria-label="闻道 iframe 工作区">
          <div className="wenda-iframe-toolbar">
            <div>
              <span>闻道页面</span>
              <strong>闻道对话工作区</strong>
            </div>
            <a className={`wenda-open-link ${embedUrl ? "" : "is-disabled"}`} href={embedUrl || "#"} target="_blank" rel="noopener noreferrer" aria-disabled={embedUrl ? "false" : "true"}>
              在新窗口打开闻道页面
            </a>
          </div>
          <p className="wenda-frame-warning">如果页面无法显示，可能是闻道平台限制跨站内嵌，请点击新窗口打开。</p>
          <iframe
            key={frameVersion}
            className="wenda-embed-frame"
            title="闻道学术服务平台"
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
