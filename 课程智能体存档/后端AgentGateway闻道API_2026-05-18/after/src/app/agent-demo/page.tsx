import { AgentChatPanel } from "../../components/agent/AgentChatPanel";
import styles from "./page.module.css";

export default function AgentDemoPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p>External Agent Gateway</p>
        <h1>后端调用闻道智能体，前端保留 PharmacoPilot 自有对话界面。</h1>
        <span>不使用 iframe；API Key 仅由服务端环境变量读取。</span>
      </section>
      <AgentChatPanel
        courseId="cpu-pharm-admin-2026"
        knowledgePoint="药事管理中的医保支付改革案例"
        teachingStage="课前教学设计与准备"
        datasetList={["pharmaco-policy-course-pack"]}
        initialMessage="请基于药事管理本科课程目标，设计一个围绕医保支付改革的课堂讨论任务，并说明需要哪些证据来源。"
      />
    </main>
  );
}
