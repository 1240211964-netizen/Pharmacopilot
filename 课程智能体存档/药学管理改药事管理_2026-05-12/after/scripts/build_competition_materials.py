from __future__ import annotations

from pathlib import Path
from typing import Iterable

from docx import Document
from docx.enum.section import WD_SECTION_START
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "申报材料"

ACCENT = "245C4F"
ACCENT_2 = "4E6E8E"
SOFT = "EEF5F1"
SOFT_BLUE = "EEF3FA"
LINE = "D7E1DA"
TEXT = RGBColor(31, 38, 35)
MUTED = RGBColor(88, 99, 94)


PROJECT = {
    "name": "CoursePilot Agent 药事管理课程智能体",
    "track": "课程智能体",
    "major": "医学",
    "specialty": "药学 / 药事管理 / 药事管理",
    "carrier": "网页端教学工作台 + 泛雅第三方入口 + 本地后端 Connector",
    "local_url": "http://localhost:5173",
    "launch_url": "https://[请替换为正式公网域名]/launch?courseId=[课程ID]&clazzId=[班级ID]&cpi=[教师CPI]&source=fanya",
}


CONTEST_REQUIREMENTS = [
    ("提交截止", "2026 年 5 月 15 日 15:00 前，通过大赛官网提交报名信息及参赛材料。"),
    ("申报书", "在大赛官网填写后导出，按附件 3 样式加盖公章。"),
    ("建设说明书", "不超过 3000 字；官网附件 4 字段中，简介限 1200 字以内，应用成效限 800 字以内。"),
    ("展示视频", "MP4，6-10 分钟，720P 及以上，文件大小不超过 1200MB，画面稳定、声音清楚。"),
    ("配套材料", "提供可公开访问测试账号，标注原创主体，并提供知识产权证明或研发过程佐证文件。"),
    ("匿名要求", "参赛材料和现场汇报不得出现参赛选手姓名、所在高校及院系名称等身份信息；公章审核版另行准备。"),
    ("评分导向", "医学专业性 30 分、智能与创新 30 分、实施与效果 25 分、展示与推广 15 分。"),
]


FULL_DESCRIPTION = """
一、开发背景与拟解决问题
CoursePilot Agent 面向药事管理与药事服务相关课程，聚焦新教师首次授课和课程持续建设中的真实痛点。药学类课程中的管理学内容兼具专业性、政策性和实践性，教师既要讲清管理学概念，又要把概念落到药品经营、医院药学、医保支付、处方流转、慢病管理、患者教育和用药安全等真实场景。新教师常见困难包括：课程目标难以对齐培养方案，教材内容不会取舍，抽象理论难以转化为药学案例，学情预判不足，课堂互动和节奏控制不稳定，过程性评价与作业反馈缺少标准，课后复盘和课程资产沉淀不足。以上问题会导致课堂成为泛管理学讲授，学生知道概念却不知道如何在药学岗位情境中判断、举证和决策。

二、智能体定位与应用载体
本智能体申报赛道为“课程智能体”，定位为药事管理课程的教学工作台。它不是通用问答工具，而是围绕一门课程、一类教师和一组典型教学任务进行设计：以培养方案、课程大纲、教材章节、班级学情、泛雅课程上下文和教师输入主题为起点，辅助教师完成“课前诊断、课中设计、课后评价、持续改进”的全流程工作。当前应用载体包括网页端原型、本次课运行中心、教学痛点场景库、教学流程图、泛雅第三方入口参数识别和本地后端 Connector。教师可通过浏览器访问系统，也可将部署后的公网 HTTPS 地址作为泛雅第三方链接接入课程。

三、核心功能
1. 课程目标与内容结构化：将培养方案、课程大纲和教材章节映射为“课程-章节-课次”三级目标，给出必讲、可选、延伸内容建议，生成核心概念、关键关系、典型案例和易错点框架。
2. 药学场景转化：把 SWOT、组织管理、服务流程、绩效评价等管理学概念转化为连锁药店慢病服务、医院药房处方审核、医保政策约束、药品供应链和患者安全等药学情境，生成案例导入脚本、讨论题和岗位化解释。
3. 教学流程生成：围绕一次 45 分钟或 90 分钟授课，生成导入、讲授、互动、练习、总结、作业的完整课堂流程，同时输出 PPT 提纲、教案初稿、课堂话术、板书线索和节奏控制卡。
4. 互动与评价设计：为知识点生成分层提问、追问脚本、投票题、随堂练习和实践任务书；将学习目标映射为 Rubric、案例作业、讨论表现评价和题库组卷方案，帮助教师形成目标、任务、证据、反馈的一致关系。
5. 作业反馈与复盘沉淀：对文本型案例作业进行教师把关前的初步归类，提示薄弱概念、常见错因和补学资源；课后根据课堂记录、作业数据和学生反馈生成复盘报告，沉淀课程知识库和版本迭代记录。
6. 泛雅执行出口：系统能够识别 courseId、clazzId、cpi 等泛雅第三方入口参数，生成可粘贴到泛雅任务、讨论、作业或资源说明中的发布稿。后续在学校或超星开放接口授权后，可通过 Connector 读取课程列表、同步作业任务和回收学习数据。

四、技术路线
系统采用“课程知识结构化 + 场景化教学提示词 + 工作流状态管理 + 平台连接器”的技术路线。前端使用 HTML、CSS、JavaScript 构建教学工作台和交互式演示界面；后端使用 Node.js 提供本地 Connector，统一处理泛雅 API 鉴权、课程列表读取、作业同步和配置状态检测，避免在前端暴露密钥。业务流程上，系统先解析教师输入和平台上下文，再匹配四阶段二十类教学痛点，调用智能生成逻辑输出教案、任务、评价和发布稿，最后由教师确认后进入泛雅或课程资源库。系统强调教师主导、AI 辅助和人机协同：AI 负责结构化生成、案例转化和初步反馈，教师负责事实核验、专业把关、伦理判断和正式发布。

五、实施路径
项目已完成新教师痛点清单整理、四阶段教学流程梳理、CoursePilot 网页端原型、本次课运行中心、评审演示路径、泛雅第三方链接接入说明和本地 Connector 开发。以“药事管理中的 SWOT 分析：连锁药店慢病服务决策”为例，教师输入课程主题后，系统可生成课次目标、药学案例导入、课堂提问、Rubric、泛雅发布稿和课后复盘要点。正式参赛前，建议完成公网部署、测试账号配置、1-2 个真实班级或课程组的试运行记录，并补充备课时间变化、学生参与情况、作业质量或教师满意度等量化数据。

六、创新点
第一，课程专属性强。系统围绕药事管理课程构建知识与任务，不停留在通用聊天，而是把医学教育场景、课程目标、药学岗位能力和平台执行动作绑定起来。第二，真实问题导向。系统内置二十类新教师痛点，覆盖课前、课中、课后和课程建设全过程，使智能体服务真实教学流程。第三，药学场景深度融合。系统将管理学抽象概念转化为药事服务、医保政策、药品经营和患者安全案例，提升课程的医学专业性和岗位适配度。第四，闭环落地能力突出。系统从目标、内容、互动、评价到复盘形成链路，并通过泛雅入口把 AI 生成内容转化为教学平台中的任务、讨论和作业。第五，安全可控。所有正式发布动作均保留教师确认，敏感配置存放于后端环境变量，评审材料可生成匿名版本，降低数据和身份泄露风险。

七、应用成效与推广价值
当前项目已形成可演示、可部署、可迭代的课程智能体原型，沉淀了 20 个教学痛点场景、4 个教学阶段、1 套泛雅接入流程和 1 条 3 分钟评审体验路径。原型验证表明，系统能够把一次药事管理课程从“教师想讲什么”转化为“学生完成什么任务、教师获得什么学习证据、课程平台沉淀什么数据”的结构化方案。对新教师而言，系统降低了备课启动成本，减少材料拼接和口径不一致；对学生而言，药学案例、课堂讨论和 Rubric 让学习任务更清楚；对课程团队而言，系统可沉淀统一标准、共享案例和跨轮次改进记录。后续可推广至药事管理、临床药学服务、医药市场营销、医院药事管理等课程，也可作为医学类课程智能体建设的模板。

八、伦理、安全与质量控制
系统遵循医学教育的专业规范和人工智能使用边界，不直接替代教师判断，不自动发布正式教学内容，不在匿名评审材料中呈现姓名、学校、院系等身份信息。涉及政策、用药安全、患者权益和职业伦理的内容必须由教师复核；涉及学生学习数据的接入必须获得学校授权，并遵循最小必要、权限隔离、日志审计和可撤回原则。生成内容用于教学辅助，不用于医疗诊断或治疗建议。
""".strip()


INTRO_1200 = """
CoursePilot Agent 药事管理课程智能体面向药事管理与药事服务相关课程，针对新教师首次授课中目标不清、案例转化难、互动评价弱、平台沉淀不足等问题，构建贯穿课前诊断、课中设计、课后评价、持续改进的课程智能体。系统以培养方案、课程大纲、教材章节、班级学情、泛雅课程上下文和教师输入主题为起点，将课程目标拆解为“课程-章节-课次”三级目标，将管理学概念映射到连锁药店慢病服务、医院药房处方审核、医保支付、药品经营与用药安全等药学情境，自动生成教案、PPT 提纲、案例导入脚本、分层提问、Rubric、作业说明和复盘建议。

智能体已形成网页端教学工作台、20 个新教师痛点场景库、四阶段教学流程图、本次课运行中心、泛雅第三方入口参数识别、发布稿生成和本地后端 Connector。教师可先在系统中完成诊断、设计和确认，再将生成内容复制或同步到泛雅任务、讨论、作业和资源说明中。技术路线采用“课程知识结构化 + 场景化教学提示词 + 教学工作流状态管理 + 平台连接器”的方式，强调教师主导、AI 辅助、过程可追踪与内容可复核。系统的创新点在于把通用 AI 能力转化为药学课程专属教学流程，将医学专业性、课堂可执行性、评价证据和平台沉淀结合起来，形成具有示范推广价值的“人工智能 + 药学课程建设”模式。
""".strip()


EFFECT_800 = """
项目已形成可运行原型和完整评审演示路径，沉淀 20 个新教师教学痛点、4 个教学阶段、1 套泛雅接入流程和 1 个本次课运行中心。以“药事管理中的 SWOT 分析：连锁药店慢病服务决策”为例，系统可在一次操作中输出课次目标、药学案例导入、课堂提问、课堂节奏、Rubric、泛雅发布稿和复盘要点，帮助教师从“准备材料”转向“设计学习任务和评价证据”。

在原型验证阶段，系统已能展示从输入课程主题到生成平台发布稿的完整闭环：课前明确目标与案例，课中生成互动和实践任务，课后形成评价与反馈，最后沉淀为课程资产。对新教师而言，系统降低备课启动难度，减少资料拼接和口径不一致；对学生而言，药学情境、任务说明和 Rubric 提高学习目标清晰度；对课程团队而言，统一标准、共享案例和跨轮次复盘便于持续建设。正式提交前建议补充 1-2 个班级或课程组试用数据，如备课时长变化、学生参与率、作业达成度和教师满意度。
""".strip()


VIDEO_ROWS = [
    ("0:00-0:35", "片头与问题引入", "展示匿名标题页、赛道、智能体名称、课程场景；快速呈现新教师首次授课的 4 类核心困难。", "不得出现姓名、学校、院系；突出真实教学问题。"),
    ("0:35-1:25", "应用场景说明", "打开 CoursePilot 首页，说明面向药事管理与药事服务课程，服务课前、课中、课后和持续改进闭环。", "突出课程智能体，而非通用问答。"),
    ("1:25-2:20", "输入课程主题", "输入“药事管理中的 SWOT 分析：连锁药店慢病服务决策”，展示系统识别药学情境和教学阶段。", "体现课程上下文和药学场景转化。"),
    ("2:20-3:25", "课前诊断与目标生成", "展示课程目标拆解、重难点、案例导入和学情预判结果。", "对照评分中的医学专业性和场景贴合度。"),
    ("3:25-4:35", "课中教学流程", "展示导入、讲授、互动、练习、总结、作业的流程脚本，说明 45/90 分钟节奏控制。", "强调可执行课堂，而不是只生成文本。"),
    ("4:35-5:35", "评价与 Rubric", "展示分层提问、案例作业、Rubric 和作业反馈建议。", "强调成效可验证与评价闭环。"),
    ("5:35-6:40", "泛雅执行出口", "展示 courseId、clazzId、cpi 参数识别，生成可复制到泛雅任务/讨论/作业中的发布稿。", "如无学校授权，说明教师确认后复制使用；避免承诺自动写入。"),
    ("6:40-7:35", "技术路线与安全", "展示前端工作台、本地 Connector、后端保密配置、教师确认发布、匿名评审等安全机制。", "突出智能化程度、平台连接和安全可控。"),
    ("7:35-8:25", "应用成效与推广", "展示 20 个痛点、4 阶段流程图和可推广课程清单；说明后续试运行数据采集计划。", "回应推广价值和生态价值。"),
    ("8:25-8:50", "结尾", "用一句话总结：把药学课程从备课、授课、评价到复盘变成可执行、可沉淀、可推广的 AI 教学闭环。", "控制总时长 6-10 分钟。"),
]


TECH_SECTIONS = [
    ("一、原创主体与版本说明", [
        "原创主体：参赛团队自主设计与开发。审核原始版可填写学校/医院/团队名称并加盖教务管理部门公章；匿名评审版请替换为“参赛团队”。",
        "项目名称：CoursePilot Agent 药事管理课程智能体。",
        "当前版本：0.1.0 原型验证版，已具备静态部署和本地后端 Connector 两种运行方式。",
        "主要源码：前端核心/index.html、前端核心/interface-review-improved.html、前端核心/app.js、前端核心/styles.css、后端核心/启动入口/server.cjs、package.json、部署、接入说明/docs/ 系列说明文档。",
    ]),
    ("二、系统架构", [
        "前端层：教学工作台、痛点场景库、本次课运行中心、泛雅发布稿生成区、评审演示路径。",
        "业务层：四阶段教学工作流、二十类痛点场景、药学情境识别、教学动作选择、发布稿模板组装。",
        "连接层：Node.js 本地 Connector 提供 /api/fanya/status、/api/fanya/connect、/api/fanya/courses、/api/fanya/sync-assignment 等接口。",
        "配置层：泛雅 API 地址、鉴权方式、Token、Cookie、App Secret 等放在环境变量或 .env 中，不写入前端源码。",
    ]),
    ("三、数据与流程", [
        "输入：培养方案、课程大纲、教材章节、教师输入主题、班级学情、泛雅启动参数、教师上传附件线索。",
        "处理：识别课程主题与药学情境，匹配教学阶段和痛点，生成目标、案例、互动、评价、发布稿和复盘建议。",
        "输出：课次目标卡、内容结构图、药学案例导入脚本、课堂流程脚本、Rubric、作业反馈建议、泛雅发布稿、复盘报告。",
        "闭环：教师确认后发布到泛雅或复制使用，后续回收作业与学习数据，再用于下一轮教学优化。",
    ]),
    ("四、安全与合规", [
        "教师确认机制：AI 生成内容不直接覆盖正式课程，发布前由教师核验事实、政策、伦理和用药安全表述。",
        "身份匿名机制：评审视频、汇报课件和匿名材料不展示参赛者姓名、学校、院系等身份信息。",
        "密钥保护机制：所有平台接口密钥均由后端读取，前端不保存 Token、Cookie 或 App Secret。",
        "数据最小化：接入学生学习数据前需获得学校授权，遵循最小必要、权限隔离、日志审计和可撤回原则。",
    ]),
    ("五、研发过程证据清单", [
        "数据库和RAG/数据资料/新教师第一次授课痛点.xlsx：形成 20 个教学痛点、表现、影响、解决方式和智能体功能。",
        "docs/teaching-flowchart.md：形成课前、课中、课后、持续改进的教学闭环流程图。",
        "docs/fanya-integration.md：记录泛雅真实接入能力、接口清单和安全注意事项。",
        "docs/deploy-url-guide.md：记录公网部署与泛雅第三方链接接入方案。",
        "docs/interface-review-feedback.md：记录模拟评审反馈、用户反馈和完善思路。",
        "server.js：实现泛雅状态检查、连接验证、课程读取和作业同步的后端 Connector。",
        "app.js：实现痛点场景库、教学工作流、药学情境识别和泛雅发布稿生成。",
    ]),
]


def chinese_len(text: str) -> int:
    return len("".join(text.split()))


def set_cell_shading(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def cm_to_twips(value: float) -> int:
    return int(round(value * 567))


def set_table_widths(table, widths_cm: list[float]) -> None:
    table.autofit = False
    tbl = table._tbl
    tbl_pr = tbl.tblPr

    tbl_layout = tbl_pr.find(qn("w:tblLayout"))
    if tbl_layout is None:
        tbl_layout = OxmlElement("w:tblLayout")
        tbl_pr.append(tbl_layout)
    tbl_layout.set(qn("w:type"), "fixed")

    tbl_w = tbl_pr.find(qn("w:tblW"))
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:type"), "dxa")
    tbl_w.set(qn("w:w"), str(sum(cm_to_twips(w) for w in widths_cm)))

    existing_grid = tbl.find(qn("w:tblGrid"))
    if existing_grid is not None:
        tbl.remove(existing_grid)
    grid = OxmlElement("w:tblGrid")
    for width in widths_cm:
        grid_col = OxmlElement("w:gridCol")
        grid_col.set(qn("w:w"), str(cm_to_twips(width)))
        grid.append(grid_col)
    tbl.insert(1, grid)

    for row in table.rows:
        for idx, cell in enumerate(row.cells):
            if idx >= len(widths_cm):
                continue
            width = widths_cm[idx]
            cell.width = Cm(width)
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:type"), "dxa")
            tc_w.set(qn("w:w"), str(cm_to_twips(width)))


def set_cell_margins(cell, top=90, start=120, bottom=90, end=120) -> None:
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for m, v in [("top", top), ("start", start), ("bottom", bottom), ("end", end)]:
        node = tc_mar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(v))
        node.set(qn("w:type"), "dxa")


def format_cell(cell, fill: str | None = None, bold: bool = False, color: RGBColor | None = None) -> None:
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    set_cell_margins(cell)
    if fill:
        set_cell_shading(cell, fill)
    for paragraph in cell.paragraphs:
        paragraph.paragraph_format.space_after = Pt(0)
        for run in paragraph.runs:
            run.bold = bold
            if color:
                run.font.color.rgb = color
            run.font.name = "Microsoft YaHei"
            run._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")


def set_doc_style(doc: Document) -> None:
    sec = doc.sections[0]
    sec.top_margin = Cm(2.2)
    sec.bottom_margin = Cm(2.0)
    sec.left_margin = Cm(2.25)
    sec.right_margin = Cm(2.25)

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Microsoft YaHei"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = TEXT
    normal.paragraph_format.line_spacing = 1.35
    normal.paragraph_format.space_after = Pt(6)

    for name, size, color in [
        ("Title", 20, ACCENT),
        ("Heading 1", 15, ACCENT),
        ("Heading 2", 12.5, ACCENT_2),
        ("Heading 3", 11.5, ACCENT_2),
    ]:
        style = styles[name]
        style.font.name = "Microsoft YaHei"
        style._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
        style.font.size = Pt(size)
        style.font.color.rgb = RGBColor.from_string(color)
        style.font.bold = True
        style.paragraph_format.space_before = Pt(8)
        style.paragraph_format.space_after = Pt(5)


def add_title(doc: Document, title: str, subtitle: str | None = None) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(title)
    r.bold = True
    r.font.name = "Microsoft YaHei"
    r._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
    r.font.size = Pt(21)
    r.font.color.rgb = RGBColor.from_string(ACCENT)
    if subtitle:
        p2 = doc.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r2 = p2.add_run(subtitle)
        r2.font.name = "Microsoft YaHei"
        r2._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = MUTED


def add_note(doc: Document, text: str, title: str = "提示") -> None:
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.2)
    p.paragraph_format.right_indent = Cm(0.2)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(10)
    r = p.add_run(f"{title}：")
    r.bold = True
    r.font.color.rgb = RGBColor.from_string(ACCENT)
    r.font.name = "Microsoft YaHei"
    r._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
    body = p.add_run(text)
    body.font.name = "Microsoft YaHei"
    body._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
    body.font.size = Pt(10)
    body.font.color.rgb = TEXT


def add_bullets(doc: Document, items: Iterable[str]) -> None:
    for item in items:
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.left_indent = Cm(0.55)
        p.paragraph_format.space_after = Pt(3)
        p.add_run(item)


def add_kv_table(doc: Document, rows: Iterable[tuple[str, str]], widths=(3.2, 12.2), header_fill=SOFT) -> None:
    for key, value in rows:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Cm(0.35)
        p.paragraph_format.first_line_indent = Cm(-0.35)
        p.paragraph_format.space_after = Pt(3)
        label = p.add_run(f"{key}：")
        label.bold = True
        label.font.color.rgb = RGBColor.from_string(ACCENT)
        label.font.name = "Microsoft YaHei"
        label._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
        parts = str(value).split("\n")
        body = p.add_run(parts[0])
        body.font.name = "Microsoft YaHei"
        body._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
        body.font.color.rgb = TEXT
        for part in parts[1:]:
            body.add_break()
            body.add_text(part)
    doc.add_paragraph()


def add_footer(doc: Document) -> None:
    for section in doc.sections:
        footer = section.footer.paragraphs[0]
        footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = footer.add_run("CoursePilot Agent 参赛申报材料草案")
        run.font.size = Pt(8.5)
        run.font.color.rgb = MUTED


def save_doc(doc: Document, filename: str) -> Path:
    add_footer(doc)
    path = OUT / filename
    doc.save(path)
    return path


def build_checklist() -> Path:
    doc = Document()
    set_doc_style(doc)
    add_title(doc, "全球数智教育创新大赛参赛材料提交清单", "基于《大赛通知及方案》整理 | 2026 年 5 月")
    add_note(doc, "本清单按 2026 年 5 月 15 日 15:00 前提交初赛材料准备。请在正式上传前核对官网最新表单、团队信息、公章流程和匿名要求。")

    doc.add_heading("一、推荐申报定位", level=1)
    add_kv_table(doc, [
        ("智能体名称", PROJECT["name"]),
        ("建议赛组", PROJECT["track"]),
        ("专业大类", PROJECT["major"]),
        ("细分专业", PROJECT["specialty"]),
        ("应用载体", PROJECT["carrier"]),
        ("本地测试地址", PROJECT["local_url"]),
        ("正式测试链接", PROJECT["launch_url"]),
    ])

    doc.add_heading("二、通知硬性要求", level=1)
    add_kv_table(doc, CONTEST_REQUIREMENTS)

    doc.add_heading("三、材料包内容", level=1)
    add_bullets(doc, [
        "01_大赛申报书_填写草案.docx：用于整理官网申报书字段、推荐意见和盖章流程。",
        "02_智能体建设说明书_3000字内.docx：用于官网建设说明书字段复制和完整正文上传/留档。",
        "03_智能体展示视频脚本_6到10分钟.docx：用于录制 6-10 分钟 MP4 展示视频。",
        "04_研发过程佐证材料_技术路线与设计文档.docx：用于替代或补充软著/专利等知识产权证明材料。",
    ])

    doc.add_heading("四、正式提交前需补全", level=1)
    add_bullets(doc, [
        "主讲人员姓名、性别、出生年月、民族、职务、学历、政治面貌、邮箱、手机。",
        "团队成员信息和每位成员承担任务，团队总人数不超过 4 人且至少含 1 名教师。",
        "工作单位、学校/医院教务部门意见、思想政治审查意见、学校/医院意见和盖章日期。",
        "公网 HTTPS 测试链接、测试账号、测试密码或二维码。",
        "可佐证应用成效的数据：试用班级数、教师试用次数、备课时间变化、学生参与率、作业达成度、教师/学生反馈。",
        "原创主体和研发过程证明材料的审核原始版；匿名评审版需删除姓名、学校、院系等身份信息。",
    ])

    doc.add_heading("五、视频文件命名和匿名提醒", level=1)
    add_bullets(doc, [
        "视频建议命名为：CoursePilot Agent 药事管理课程智能体.mp4。",
        "画面中不要出现浏览器账号头像、学校 LOGO、真实姓名、院系名称、课程平台中的身份字段。",
        "若演示泛雅参数，请使用测试 courseId、clazzId、cpi 或打码处理。",
        "解说可说明“参赛团队”“课程组”“教师”，避免出现具体个人和单位。",
    ])
    return save_doc(doc, "00_材料提交清单与时间表.docx")


def build_application_form() -> Path:
    doc = Document()
    set_doc_style(doc)
    add_title(doc, "大赛申报书填写草案", "请在大赛官网填写后导出，并按要求加盖公章")
    add_note(doc, "本文件用于内部整理。正式申报书以大赛官方网站导出的版本为准；评审匿名材料不得出现个人姓名、学校及院系名称。")

    doc.add_heading("一、基本情况", level=1)
    doc.add_heading("1. 主讲人员", level=2)
    add_kv_table(doc, [
        ("姓名", "[请补充]"),
        ("性别", "[请补充]"),
        ("出生年月", "[请补充]"),
        ("照片", "[请按官网要求上传/粘贴]"),
        ("民族", "[请补充]"),
        ("职务", "[请补充]"),
        ("学历", "[请补充]"),
        ("工作单位", "[请补充；匿名评审版删除]"),
        ("政治面貌", "[请补充]"),
        ("邮箱", "[请补充]"),
        ("手机", "[请补充]"),
    ])

    doc.add_heading("2. 团队成员", level=2)
    tasks = [
        "[主讲/课程设计/专业审核]",
        "[系统原型开发/平台接入]",
        "[教学资源与案例库建设]",
        "[测试评估/视频与材料制作]",
    ]
    for i in range(1, 5):
        doc.add_heading(f"团队成员 {i}", level=3)
        add_kv_table(doc, [
            ("姓名", "[请补充]"),
            ("性别", "[请补充]"),
            ("出生年月", "[请补充]"),
            ("学历", "[请补充]"),
            ("工作单位", "[请补充]"),
            ("在过程中承担的任务", tasks[i - 1]),
        ])
    doc.add_paragraph("注：每团队不超过 4 人，至少含 1 名教师。")

    doc.add_heading("3. 医学教育智能体情况", level=2)
    add_kv_table(doc, [
        ("名称", PROJECT["name"]),
        ("申报赛道", PROJECT["track"]),
        ("专业大类", PROJECT["major"]),
        ("细分专业", PROJECT["specialty"]),
        ("应用载体", PROJECT["carrier"]),
        ("测试链接/二维码", PROJECT["launch_url"]),
        ("测试账号", "[请补充测试账号；若仅公开访问，请写“无需登录/公开访问”]"),
        ("原创主体", "[审核原始版填写团队/单位；匿名评审版写“参赛团队自主研发”]"),
    ])

    doc.add_heading("二、推荐意见", level=1)
    add_kv_table(doc, [
        ("学校/医院教务部门意见（盖章）", "该智能体围绕药事管理课程教学真实问题开展设计，具有课程建设价值和推广潜力。建议推荐参赛。\n\n年    月    日"),
        ("思想政治审查意见", "该智能体及上传的申报材料思想导向正确。主讲选手及团队成员不存在道德缺失、学术不端等问题，遵纪守法，无违法违纪行为，五年内未出现过教学事故。\n\n学校/医院二级党委（盖章）\n年    月    日"),
        ("学校/医院意见", "同意推荐该项目参加全球数智教育创新大赛 AI for Medicine 赛道暨“厚道泛雅”医学教育智能体大赛。\n\n学校/医院（盖章）\n年    月    日"),
    ], widths=(4.4, 11.0))
    return save_doc(doc, "01_大赛申报书_填写草案.docx")


def build_description() -> Path:
    doc = Document()
    set_doc_style(doc)
    add_title(doc, "智能体建设说明书", "官网填写版 + 3000 字内正文草案")
    add_note(doc, f"简介约 {chinese_len(INTRO_1200)} 字，应用成效约 {chinese_len(EFFECT_800)} 字，完整正文约 {chinese_len(FULL_DESCRIPTION)} 字。正式提交前请补充测试链接、账号和真实试用数据。")

    doc.add_heading("一、官网字段速填", level=1)
    add_kv_table(doc, [
        ("智能体名称", PROJECT["name"]),
        ("申报赛道", PROJECT["track"]),
        ("测试链接/二维码", PROJECT["launch_url"]),
        ("测试账号", "[请补充公开测试账号、测试密码或“无需登录”]"),
        ("应用安全", "如已有相关材料可勾选：网络安全等级保护备案表 / 网络安全等级测评报告 / 生成式人工智能服务备案编号 / 生成式人工智能服务安全评估报告。若暂无，可在备注说明当前为教学辅助原型，采用教师确认、后端密钥保护和匿名评审机制。"),
        ("备注", "系统不替代教师专业判断，生成内容须由教师核验后发布；涉及学生学习数据时需取得学校授权并遵循最小必要原则。"),
    ], widths=(3.4, 12.0))

    doc.add_heading("二、简介（限 1200 字以内）", level=1)
    for para in INTRO_1200.split("\n\n"):
        doc.add_paragraph(para)

    doc.add_heading("三、应用成效（限 800 字以内）", level=1)
    for para in EFFECT_800.split("\n\n"):
        doc.add_paragraph(para)

    doc.add_page_break()
    doc.add_heading("四、完整建设说明书正文（不超过 3000 字）", level=1)
    for block in FULL_DESCRIPTION.split("\n\n"):
        if block.startswith(("一、", "二、", "三、", "四、", "五、", "六、", "七、", "八、")):
            lines = block.split("\n", 1)
            doc.add_heading(lines[0], level=2)
            if len(lines) > 1:
                doc.add_paragraph(lines[1])
        else:
            doc.add_paragraph(block)
    return save_doc(doc, "02_智能体建设说明书_3000字内.docx")


def build_video_script() -> Path:
    doc = Document()
    set_doc_style(doc)
    add_title(doc, "智能体展示视频脚本", "建议总时长 8-9 分钟 | MP4 | 720P 及以上")
    add_note(doc, "视频需展示智能体核心搭建步骤、应用效果和解决问题过程；不得出现参赛选手姓名、所在学校及院系名称等身份信息。")

    doc.add_heading("一、录制前准备", level=1)
    add_bullets(doc, [
        "准备一个匿名浏览器环境，退出个人账号或打码头像、姓名、学校信息。",
        "启动本地服务：npm start；或使用已部署的公网 HTTPS 演示地址。",
        "建议演示主题：药事管理中的 SWOT 分析：连锁药店慢病服务决策。",
        "准备 1 个测试 courseId、clazzId、cpi 参数，用于展示泛雅第三方入口识别。",
        "录屏分辨率不低于 720P，声音清楚，建议总时长控制在 8 分 30 秒左右。",
    ])

    doc.add_heading("二、分镜脚本", level=1)
    for idx, (time, scene, narration, scoring) in enumerate(VIDEO_ROWS, 1):
        doc.add_heading(f"{idx}. {time} | {scene}", level=2)
        add_bullets(doc, [
            f"解说/操作：{narration}",
            f"评分对应点：{scoring}",
        ])

    doc.add_heading("三、开场解说词参考", level=1)
    doc.add_paragraph(
        "本项目是 CoursePilot Agent 药事管理课程智能体，面向药事管理与药事服务相关课程的新教师，"
        "解决首次授课中目标不清、案例转化难、互动评价弱和平台沉淀不足的问题。下面将以"
        "“药事管理中的 SWOT 分析：连锁药店慢病服务决策”为例，展示智能体如何把课程主题转化为"
        "目标、案例、课堂流程、Rubric、泛雅发布稿和课后复盘。"
    )

    doc.add_heading("四、结尾解说词参考", level=1)
    doc.add_paragraph(
        "CoursePilot Agent 的价值不只是生成文本，而是把药学课程的目标、场景、互动、评价和平台沉淀连成闭环。"
        "它帮助教师把抽象管理学概念转化为真实药学任务，把课堂表现转化为可评价证据，并通过泛雅入口沉淀为可复用课程资产。"
    )
    return save_doc(doc, "03_智能体展示视频脚本_6到10分钟.docx")


def build_technical_evidence() -> Path:
    doc = Document()
    set_doc_style(doc)
    add_title(doc, "研发过程佐证材料", "技术路线与设计文档 | 可作为知识产权证明的补充材料")
    add_note(doc, "该文档适合随申报材料上传或内部留档。若学校需要审核原始版，请补充原创主体、单位信息并盖章；匿名评审版请删除身份信息。")

    add_kv_table(doc, [
        ("项目名称", PROJECT["name"]),
        ("版本", "0.1.0 原型验证版"),
        ("运行方式", "静态网页部署 / Node.js 本地服务 / 泛雅第三方链接入口"),
        ("主要技术", "HTML、CSS、JavaScript、Node.js、环境变量配置、平台 API Connector"),
        ("核心文件", "前端核心/index.html、前端核心/interface-review-improved.html、前端核心/app.js、前端核心/styles.css、后端核心/启动入口/server.cjs、部署、接入说明/docs/、数据库和RAG/数据资料/新教师第一次授课痛点.xlsx"),
    ])

    for title, bullets in TECH_SECTIONS:
        doc.add_heading(title, level=1)
        add_bullets(doc, bullets)

    doc.add_heading("六、建议补充附件", level=1)
    add_bullets(doc, [
        "系统截图：首屏、教学全景、本次课运行中心、泛雅执行出口、评审路径。",
        "代码仓库记录：提交记录、版本说明、主要功能截图。",
        "测试记录：浏览器兼容性、发布稿复制、泛雅参数识别、Connector 配置状态。",
        "试运行记录：教师试用反馈、学生任务样例、Rubric 评分样例、课后复盘报告样例。",
    ])
    return save_doc(doc, "04_研发过程佐证材料_技术路线与设计文档.docx")


def main() -> None:
    OUT.mkdir(exist_ok=True)
    paths = [
        build_checklist(),
        build_application_form(),
        build_description(),
        build_video_script(),
        build_technical_evidence(),
    ]
    print("Generated:")
    for path in paths:
        print(path)


if __name__ == "__main__":
    main()
