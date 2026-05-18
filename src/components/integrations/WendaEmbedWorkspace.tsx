import React, { useMemo, useState } from "react";
import {
  buildWendaUrl,
  getRuntimeWendaDomain,
  WENDA_DEFAULT_AGENT_ID,
  WENDA_DEFAULT_HD,
  WENDA_DEFAULT_MODEL_ID,
  WENDA_DEFAULT_SEARCH_TEXT,
} from "../../lib/wenda";

const DRAFT_STORAGE_KEY = "pharmacopilot:wenda-design-draft";

function parseIdInput(value: string): string[] {
  return value
    .split(/[\n,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildWorkspaceUrl(values: {
  domain: string;
  searchText: string;
  internetSearch: boolean;
  datasetText: string;
  imageText: string;
  fileText: string;
  exploreId: string;
}): string {
  return buildWendaUrl({
    domain: values.domain,
    route: "history",
    agentId: WENDA_DEFAULT_AGENT_ID,
    modelId: WENDA_DEFAULT_MODEL_ID,
    searchText: values.searchText,
    hd: WENDA_DEFAULT_HD,
    internetSearch: values.internetSearch,
    datasetIds: parseIdInput(values.datasetText),
    imageIds: parseIdInput(values.imageText).slice(0, 1),
    fileIds: parseIdInput(values.fileText).slice(0, 1),
    exploreId: values.exploreId,
  });
}

export function WendaEmbedWorkspace() {
  const [domain, setDomain] = useState(getRuntimeWendaDomain());
  const [searchText, setSearchText] = useState(WENDA_DEFAULT_SEARCH_TEXT);
  const [internetSearch, setInternetSearch] = useState(false);
  const [datasetText, setDatasetText] = useState("");
  const [imageText, setImageText] = useState("");
  const [fileText, setFileText] = useState("");
  const [exploreId, setExploreId] = useState("");
  const [draftText, setDraftText] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const [frameVersion, setFrameVersion] = useState(0);
  const [error, setError] = useState("");
  const [embedUrl, setEmbedUrl] = useState(() => {
    try {
      return buildWorkspaceUrl({
        domain: getRuntimeWendaDomain(),
        searchText: WENDA_DEFAULT_SEARCH_TEXT,
        internetSearch: false,
        datasetText: "",
        imageText: "",
        fileText: "",
        exploreId: "",
      });
    } catch {
      return "";
    }
  });

  const previewUrl = useMemo(() => {
    try {
      return buildWorkspaceUrl({ domain, searchText, internetSearch, datasetText, imageText, fileText, exploreId });
    } catch {
      return "";
    }
  }, [datasetText, domain, exploreId, fileText, imageText, internetSearch, searchText]);

  function refreshFrame() {
    try {
      const nextUrl = buildWorkspaceUrl({ domain, searchText, internetSearch, datasetText, imageText, fileText, exploreId });
      setEmbedUrl(nextUrl);
      setFrameVersion((value) => value + 1);
      setError("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "闻道链接生成失败。");
    }
  }

  function saveDraft() {
    const payload = {
      source: "wenda-open-access",
      savedAt: new Date().toISOString(),
      embedUrl,
      content: draftText,
    };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
    console.log("Wenda teaching design draft saved", payload);
    setSavedAt(new Date(payload.savedAt).toLocaleString("zh-CN"));
  }

  return (
    <section className="wenda-embed-workspace" aria-labelledby="wenda-embed-title">
      <div className="wenda-embed-head">
        <div>
          <p className="eyebrow">Wendao academic workspace</p>
          <h2 id="wenda-embed-title">闻道学术服务平台内嵌工作区</h2>
        </div>
        <p>
          以页面级集成方式接入闻道 openAccess 普通对话页。当前不读取 iframe 内容，也不实现上传接口；教学结果由教师复制后沉淀到右侧草稿区。
        </p>
      </div>

      <div className="wenda-embed-grid">
        <aside className="wenda-embed-panel wenda-embed-params" aria-label="闻道任务参数">
          <div className="wenda-panel-card">
            <span>当前智能体</span>
            <strong>闻道医学影像学智能体</strong>
            <p>Agent ID：{WENDA_DEFAULT_AGENT_ID}</p>
          </div>

          <label>
            <span>机构闻道域名</span>
            <input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="由 VITE_WENDAO_DOMAIN 注入，例如 xxx.libsp.net" />
          </label>

          <label>
            <span>模型</span>
            <input value="DeepSeek-R1" readOnly />
          </label>

          <label>
            <span>检索问题</span>
            <textarea rows={5} value={searchText} onChange={(event) => setSearchText(event.target.value)} />
          </label>

          <label className="wenda-toggle-row">
            <input type="checkbox" checked={internetSearch} onChange={(event) => setInternetSearch(event.target.checked)} />
            <span>启用联网检索</span>
          </label>

          <label>
            <span>知识库 ID</span>
            <textarea rows={3} value={datasetText} onChange={(event) => setDatasetText(event.target.value)} placeholder="每行一个 ID，生成 datasetList JSON 字符串" />
          </label>

          <div className="wenda-id-grid">
            <label>
              <span>图片 ID</span>
              <input value={imageText} onChange={(event) => setImageText(event.target.value)} placeholder="最多 1 个" />
            </label>
            <label>
              <span>文件 ID</span>
              <input value={fileText} onChange={(event) => setFileText(event.target.value)} placeholder="最多 1 个" />
            </label>
          </div>

          <p className="wenda-inline-note">图片和文件同时存在时，闻道文档说明图片优先级高于文件；当前仅传入各 1 个已有资源 ID。</p>

          <label>
            <span>Explore ID</span>
            <input value={exploreId} onChange={(event) => setExploreId(event.target.value)} placeholder="可选，没有值时不传入" />
          </label>

          {error ? <p className="wenda-error">{error}</p> : null}
          <button className="wenda-primary-action" type="button" onClick={refreshFrame}>
            生成嵌入链接 / 刷新对话
          </button>
        </aside>

        <section className="wenda-iframe-workspace" aria-label="闻道 iframe 工作区">
          <div className="wenda-iframe-toolbar">
            <div>
              <span>普通对话页</span>
              <strong>/api/openAccess/redirect/history</strong>
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
          <div className="wenda-url-preview" title={previewUrl || "待生成"}>
            {previewUrl || "请先配置 VITE_WENDAO_DOMAIN 或在左侧填写机构闻道域名。"}
          </div>
        </section>

        <aside className="wenda-embed-panel wenda-embed-deposit" aria-label="PharmacoPilot 结果沉淀区">
          <div className="wenda-panel-card">
            <span>PharmacoPilot 结果沉淀区</span>
            <strong>页面级集成</strong>
            <p>当前为页面级集成。请在闻道页面中完成生成后，将关键结果复制到此处进行课程设计沉淀。</p>
          </div>
          <label>
            <span>闻道生成结果</span>
            <textarea rows={16} value={draftText} onChange={(event) => setDraftText(event.target.value)} placeholder="在这里粘贴课堂讨论任务、活动流程、评价建议或其他教学设计结果。" />
          </label>
          <button className="wenda-primary-action" type="button" onClick={saveDraft}>
            保存为教学设计草稿
          </button>
          <p className="wenda-inline-note">{savedAt ? `已保存到本地浏览器：${savedAt}` : "当前按钮仅保存到前端 localStorage，并在控制台输出草稿对象。"}</p>
        </aside>
      </div>
    </section>
  );
}
