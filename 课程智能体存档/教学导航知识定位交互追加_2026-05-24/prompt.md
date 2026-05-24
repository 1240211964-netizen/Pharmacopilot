# Prompt

User requested appending the provided JavaScript module to `teaching-navigation-productized.js`.

Key instruction:

```js
/* === Pharmacopilot · Knowledge positioning interaction === */

(function initPositioningLabModule() {
  const POSITIONING_STATEMENT =
    "本节课将 SWOT 定位为药事管理情境中的管理决策训练工具。学生将基于医保支付与药品可及性案例，识别内外部因素，形成有证据支撑的策略判断，而不是停留在 SWOT 四象限定义记忆。";

  const feedbackMap = {
    decision: {
      type: "correct",
      title: "判断成立：这应该作为本节课主线",
      text:
        "三项证据都指向同一件事：本节课不能只讲 SWOT 概念，而要让学生把 SWOT 用到药事管理情境中，形成有证据支撑的策略判断。",
    },
    concept: {
      type: "wrong",
      title: "需要下调为前置讲解，而不是主线",
      text:
        "管理学工具概念讲授是必要的，但它只能解决“知道 SWOT 是什么”。如果停在这里，学生很难把工具迁移到医保支付、药品可及性等药事管理问题中。",
    },
    review: {
      type: "wrong",
      title: "这是复习课定位，不适合作为新课主线",
      text:
        "期末复习可以围绕知识点回顾和题型训练展开；但本节新课的任务是建立工具到专业判断的迁移路径，不能把主线降格为考点回忆。",
    },
  };

  function emitPositioningComplete() {
    window.dispatchEvent(
      new CustomEvent("pharmacopilot:positioning-complete", {
        detail: {
          step: "knowledge-positioning",
          course: "管理学原理",
          topic: "SWOT 分析",
          major: "药事管理",
          positioningStatement: POSITIONING_STATEMENT,
          constraints: [
            "案例必须来自药事管理真实情境",
            "课堂任务必须要求学生做判断，而不只是填表",
            "评价标准必须关注证据使用、专业相关性和策略合理性",
          ],
        },
      })
    );
  }

  function initPositioningLab() {
    const lab = document.getElementById("positioningLab");
    if (!lab || lab.dataset.initialized === "true") return;

    lab.dataset.initialized = "true";

    const options = Array.from(
      lab.querySelectorAll("[data-positioning-answer]")
    );
    const feedback = document.getElementById("positioningFeedback");
    const output = document.getElementById("positioningOutput");
    const copyButton = document.getElementById("copyPositioningStatement");
    const statement = document.getElementById("positioningStatement");

    if (!options.length || !feedback || !output) return;

    options.forEach((option) => {
      option.addEventListener("click", () => {
        const answer = option.dataset.positioningAnswer;
        const result = feedbackMap[answer];

        if (!result) return;

        options.forEach((item) => {
          item.classList.remove("is-selected", "is-correct", "is-wrong");
          item.setAttribute("aria-checked", "false");
        });

        option.classList.add("is-selected");
        option.classList.add(
          result.type === "correct" ? "is-correct" : "is-wrong"
        );
        option.setAttribute("aria-checked", "true");

        feedback.classList.remove("is-correct", "is-wrong");
        feedback.classList.add(
          result.type === "correct" ? "is-correct" : "is-wrong"
        );
        feedback.innerHTML = `
          <strong>${result.title}</strong>
          <p>${result.text}</p>
        `;

        if (result.type === "correct") {
          output.hidden = false;
          emitPositioningComplete();
        } else {
          output.hidden = true;
        }
      });
    });

    if (copyButton && statement) {
      copyButton.addEventListener("click", async () => {
        const text = statement.textContent.trim();

        try {
          await navigator.clipboard.writeText(text);
          copyButton.textContent = "已复制";
          window.setTimeout(() => {
            copyButton.textContent = "复制";
          }, 1400);
        } catch (error) {
          copyButton.textContent = "请手动复制";
          window.setTimeout(() => {
            copyButton.textContent = "复制";
          }, 1800);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPositioningLab);
  } else {
    initPositioningLab();
  }

  window.initPositioningLab = initPositioningLab;
})();
```
