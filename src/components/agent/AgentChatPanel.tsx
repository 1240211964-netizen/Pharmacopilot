"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { AgentChatRequest, AgentChatResponse, AgentCitation } from "../../server/agents/types";
import styles from "./AgentChatPanel.module.css";

type ChatRole = "user" | "assistant";
type GenerationState = "idle" | "loading" | "complete" | "error";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  citations?: AgentCitation[];
}

interface AgentChatPanelProps {
  courseId?: string;
  knowledgePoint?: string;
  teachingStage?: string;
  datasetList?: string[];
  fileIds?: string[];
  imageIds?: string[];
  initialMessage?: string;
}

const DEFAULT_PROMPT = "请围绕药事管理本科课程，设计一个兼顾政策证据和课堂互动的讨论任务。";

export function AgentChatPanel({
  courseId = "pharmacy-management-001",
  knowledgePoint = "医保支付改革与药事管理",
  teachingStage = "课前教学设计与准备",
  datasetList,
  fileIds,
  imageIds,
  initialMessage = DEFAULT_PROMPT,
}: AgentChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      content: "这里是 PharmacoPilot 自有聊天界面。输入教学问题后，后端 Agent Gateway 会代你调用外部闻道智能体。",
    },
  ]);
  const [input, setInput] = useState(initialMessage);
  const [state, setState] = useState<GenerationState>("idle");
  const [error, setError] = useState("");

  const latestCitations = useMemo(() => {
    return [...messages].reverse().find((message) => message.citations?.length)?.citations || [];
  }, [messages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || state === "loading") return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
    };
    setMessages((items) => [...items, userMessage]);
    setInput("");
    setError("");
    setState("loading");

    try {
      const payload: AgentChatRequest = {
        message,
        courseId,
        knowledgePoint,
        teachingStage,
        datasetList,
        fileIds,
        imageIds,
      };
      // Frontend only calls the unified Agent Gateway. WENDAO_API_KEY and the
      // external agent URL stay server-side in /api/agent/chat.
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as AgentChatResponse & { ok?: boolean; message?: string; error?: { message?: string } };
      if (!response.ok) throw new Error(result.error?.message || result.message || "外部智能体调用失败。");

      setMessages((items) => [
        ...items,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: result.answer,
          citations: result.citations,
        },
      ]);
      setState("complete");
    } catch (nextError) {
      const messageText = nextError instanceof Error ? nextError.message : "外部智能体调用失败。";
      setError(messageText);
      setState("error");
    }
  }

  return (
    <section className={styles.shell} aria-label="PharmacoPilot Agent Chat">
      <aside className={styles.contextPanel}>
        <p className={styles.kicker}>Agent Gateway</p>
        <h2>教学智能体对话</h2>
        <dl>
          <div>
            <dt>课程</dt>
            <dd>{courseId}</dd>
          </div>
          <div>
            <dt>知识点</dt>
            <dd>{knowledgePoint}</dd>
          </div>
          <div>
            <dt>阶段</dt>
            <dd>{teachingStage}</dd>
          </div>
        </dl>
        <div className={styles.statusCard} data-state={state}>
          <span>生成状态</span>
          <strong>{state === "loading" ? "正在生成" : state === "error" ? "需要处理" : state === "complete" ? "已完成" : "待输入"}</strong>
          <p>{state === "loading" ? "后端正在调用外部闻道智能体。" : "前端不会加载 iframe，也不会接触外部 API Key。"}</p>
        </div>
      </aside>

      <div className={styles.chatPanel}>
        <div className={styles.messages} aria-live="polite">
          {messages.map((message) => (
            <article className={`${styles.message} ${styles[message.role]}`} key={message.id}>
              <span>{message.role === "user" ? "教师" : "PharmacoPilot"}</span>
              <p>{message.content}</p>
              {message.citations?.length ? <CitationList citations={message.citations} /> : null}
            </article>
          ))}
          {state === "loading" ? (
            <article className={`${styles.message} ${styles.assistant}`}>
              <span>PharmacoPilot</span>
              <p>正在通过后端 Agent Gateway 获取外部智能体结果...</p>
            </article>
          ) : null}
        </div>

        {error ? <div className={styles.errorBox}>{error}</div> : null}

        <form className={styles.composer} onSubmit={handleSubmit}>
          <label htmlFor="agent-chat-message">输入检索或教学设计问题</label>
          <textarea id="agent-chat-message" value={input} onChange={(event) => setInput(event.target.value)} rows={4} />
          <div className={styles.composerActions}>
            <button type="submit" disabled={state === "loading" || !input.trim()}>
              {state === "loading" ? "生成中" : "发送给教学智能体"}
            </button>
          </div>
        </form>
      </div>

      <aside className={styles.evidencePanel}>
        <span>证据来源</span>
        {latestCitations.length ? (
          <CitationList citations={latestCitations} compact />
        ) : (
          <p>等待外部智能体返回 citations 后在这里沉淀。未来可扩展为多智能体证据编排面板。</p>
        )}
      </aside>
    </section>
  );
}

function CitationList({ citations, compact = false }: { citations: AgentCitation[]; compact?: boolean }) {
  return (
    <ol className={compact ? styles.compactCitations : styles.citations}>
      {citations.map((citation, index) => (
        <li key={`${citation.title}-${index}`}>
          {citation.url ? (
            <a href={citation.url} target="_blank" rel="noreferrer">
              {citation.title}
            </a>
          ) : (
            <strong>{citation.title}</strong>
          )}
          {citation.excerpt ? <small>{citation.excerpt}</small> : null}
        </li>
      ))}
    </ol>
  );
}
