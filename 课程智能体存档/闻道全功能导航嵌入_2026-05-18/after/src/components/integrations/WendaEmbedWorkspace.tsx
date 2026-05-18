import React, { useMemo, useState } from "react";
import {
  buildWendaUrl,
  getRuntimeWendaDomain,
  WENDA_DEEP_RESEARCH_APPLICATION_ID,
  WENDA_DEEP_RESEARCH_PROMPT_ID,
  WENDA_DEEP_RESEARCH_SEARCH_TEXT,
  WENDA_DEFAULT_AGENT_ID,
  WENDA_DEFAULT_HD,
  WENDA_DEFAULT_MODEL_ID,
  WENDA_DEFAULT_SEARCH_TEXT,
  WENDA_HOUDAO_AGENT_ID,
  WENDA_HOUDAO_MODEL_ID,
  type WendaRoute,
} from "../../lib/wenda";

type WendaNavGroupTitle = "问道" | "求索";

interface WendaNavItem {
  id: string;
  route: WendaRoute;
  group: WendaNavGroupTitle;
  label: string;
  shortLabel: string;
  description: string;
}

const WENDA_NAV_GROUPS: Array<{ title: WendaNavGroupTitle; items: WendaNavItem[] }> = [
  {
    title: "问道",
    items: [
      {
        id: "science-home",
        route: "home",
        group: "问道",
        label: "科学探索",
        shortLabel: "探",
        description: "进入闻道首页，承接科学导航和智能体入口。",
      },
      {
        id: "conversation",
        route: "history",
        group: "问道",
        label: "对话页面",
        shortLabel: "话",
        description: "进入普通对话页，默认使用医学影像学智能体和 DeepSeek-R1。",
      },
      {
        id: "ai-researcher",
        route: "ai_researcher",
        group: "问道",
        label: "AI研究员",
        shortLabel: "研",
        description: "打开 AI 研究员页面，用于研究辅助和学术任务推进。",
      },
      {
        id: "subscribe",
        route: "subscribe",
        group: "问道",
        label: "学术追踪",
        shortLabel: "追",
        description: "打开学术追踪页面，跟踪科研领域和订阅内容。",
      },
      {
        id: "ai-knowledge-base",
        route: "ai_knowledge_base",
        group: "问道",
        label: "AI知识库",
        shortLabel: "知",
        description: "进入 AI 知识库页面，维护和组织课程相关知识资源。",
      },
      {
        id: "ai-applications",
        route: "ai_applications",
        group: "问道",
        label: "AI应用",
        shortLabel: "用",
        description: "打开 AI 应用页面，进入平台提供的应用能力集合。",
      },
      {
        id: "ai-citation",
        route: "ai_citation",
        group: "问道",
        label: "AI引证网络",
        shortLabel: "引",
        description: "打开 AI 引证网络页面，用于文献和引证关系查看。",
      },
    ],
  },
  {
    title: "求索",
    items: [
      {
        id: "knowledge-base",
        route: "knowledge_base",
        group: "求索",
        label: "知识星链",
        shortLabel: "链",
        description: "打开知识星链页面，查看原工作集和知识链资源。",
      },
      {
        id: "project",
        route: "project",
        group: "求索",
        label: "课题 / 任务",
        shortLabel: "题",
        description: "打开课题页面，承接项目和任务类研究工作。",
      },
      {
        id: "deep-research",
        route: "deep_research_history",
        group: "求索",
        label: "DeepResearch",
        shortLabel: "深",
        description: "进入 DeepResearch 对话页，默认启用学术、网络和知识库检索源。",
      },
      {
        id: "houdao",
        route: "houdao_research_history",
        group: "求索",
        label: "厚道对话",
        shortLabel: "厚",
        description: "打开厚道对话页面，使用文档指引中的厚道智能体配置。",
      },
      {
        id: "search-history",
        route: "search_history",
        group: "求索",
        label: "历史记录",
        shortLabel: "史",
        description: "打开历史记录页面，回看已有检索和对话记录。",
      },
    ],
  },
];

const DEFAULT_ITEM_ID = "science-home";
const ALL_NAV_ITEMS = WENDA_NAV_GROUPS.flatMap((group) => group.items);

function findNavItem(itemId: string): WendaNavItem {
  return ALL_NAV_ITEMS.find((item) => item.id === itemId) || ALL_NAV_ITEMS[0];
}

function buildWorkspaceUrl(domain: string, item: WendaNavItem): string {
  if (item.id === "science-home") {
    return buildWendaUrl({
      domain,
      route: "home",
      hd: "0,1,1",
      selectAgentId: WENDA_DEFAULT_AGENT_ID,
    });
  }

  if (item.route === "history") {
    return buildWendaUrl({
      domain,
      route: item.route,
      agentId: WENDA_DEFAULT_AGENT_ID,
      modelId: WENDA_DEFAULT_MODEL_ID,
      searchText: WENDA_DEFAULT_SEARCH_TEXT,
      hd: WENDA_DEFAULT_HD,
      internetSearch: false,
    });
  }

  if (item.route === "deep_research_history") {
    return buildWendaUrl({
      domain,
      route: item.route,
      applicationId: WENDA_DEEP_RESEARCH_APPLICATION_ID,
      searchText: WENDA_DEEP_RESEARCH_SEARCH_TEXT,
      hd: "0,1,1",
      reportStyle: "survey",
      modeType: "exploration",
      retrievalSources: ["academic", "internet", "knowledge_base"],
      promptId: WENDA_DEEP_RESEARCH_PROMPT_ID,
    });
  }

  if (item.route === "houdao_research_history") {
    return buildWendaUrl({
      domain,
      route: item.route,
      agentId: WENDA_HOUDAO_AGENT_ID,
      modelId: WENDA_HOUDAO_MODEL_ID,
      searchText: WENDA_DEFAULT_SEARCH_TEXT,
      hd: WENDA_DEFAULT_HD,
    });
  }

  return buildWendaUrl({
    domain,
    route: item.route,
    hd: item.route === "search_history" ? "1,1,1" : WENDA_DEFAULT_HD,
  });
}

export function WendaEmbedWorkspace() {
  const [domain] = useState(() => getRuntimeWendaDomain());
  const [activeItemId, setActiveItemId] = useState(DEFAULT_ITEM_ID);
  const [frameVersion, setFrameVersion] = useState(0);
  const activeItem = useMemo(() => findNavItem(activeItemId), [activeItemId]);
  const urlState = useMemo(() => {
    try {
      return { error: "", url: buildWorkspaceUrl(domain, activeItem) };
    } catch (nextError) {
      return {
        error: nextError instanceof Error ? nextError.message : "闻道链接生成失败。",
        url: "",
      };
    }
  }, [activeItem, domain]);

  function selectItem(itemId: string) {
    setActiveItemId(itemId);
    setFrameVersion((value) => value + 1);
  }

  function refreshFrame() {
    setFrameVersion((value) => value + 1);
  }

  return (
    <section className="wenda-embed-workspace" aria-labelledby="wenda-embed-title">
      <div className="wenda-embed-grid">
        <aside className="wenda-embed-panel wenda-embed-params wenda-sidebar-shell" aria-label="闻道功能导航">
          <div className="wenda-sidebar-brand">
            <span className="wenda-brand-mark" aria-hidden="true">
              闻
            </span>
            <div>
              <h2 id="wenda-embed-title">闻道</h2>
              <p>学术服务平台</p>
            </div>
          </div>

          <nav className="wenda-nav-list" aria-label="闻道 openAccess 页面">
            {WENDA_NAV_GROUPS.map((group) => (
              <div className="wenda-nav-group" key={group.title}>
                <p>{group.title}</p>
                {group.items.map((item) => (
                  <button className={`wenda-nav-item ${activeItem.id === item.id ? "is-active" : ""}`} type="button" key={item.id} onClick={() => selectItem(item.id)}>
                    <span className="wenda-nav-icon" aria-hidden="true">
                      {item.shortLabel}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="wenda-sidebar-footer">
            <strong>页面级集成</strong>
            <span>所有页面按 Word 指引通过 iframe 内嵌，无法显示时使用新窗口打开。</span>
          </div>
        </aside>

        <section className="wenda-iframe-workspace" aria-label="闻道 iframe 工作区">
          <div className="wenda-iframe-toolbar">
            <div>
              <span>{activeItem.group}</span>
              <strong>{activeItem.label}</strong>
              <p>{activeItem.description}</p>
            </div>
            <div className="wenda-toolbar-actions">
              <button className="wenda-open-link" type="button" onClick={refreshFrame}>
                刷新
              </button>
              <a className={`wenda-open-link ${urlState.url ? "" : "is-disabled"}`} href={urlState.url || "#"} target="_blank" rel="noopener noreferrer" aria-disabled={urlState.url ? "false" : "true"}>
                新窗口打开
              </a>
            </div>
          </div>
          {urlState.error ? <p className="wenda-error">{urlState.error}</p> : <p className="wenda-frame-warning">如果页面无法显示，可能是闻道平台限制跨站内嵌，请点击新窗口打开。</p>}
          <iframe
            key={`${activeItem.id}-${frameVersion}`}
            className="wenda-embed-frame"
            title={`闻道 - ${activeItem.label}`}
            src={urlState.url || "about:blank"}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
          />
        </section>
      </div>
    </section>
  );
}
