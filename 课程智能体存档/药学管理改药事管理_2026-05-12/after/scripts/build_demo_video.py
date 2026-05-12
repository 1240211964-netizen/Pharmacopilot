from __future__ import annotations

import json
import subprocess
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "申报材料" / "视频"
ASSETS = OUT / "assets"
SLIDES = ASSETS / "slides"
AUDIO = ASSETS / "audio"

W, H = 1920, 1080
BG = (246, 243, 236)
PANEL = (255, 254, 249)
INK = (35, 39, 36)
MUTED = (92, 101, 96)
GREEN = (33, 91, 77)
BLUE = (66, 101, 140)
AMBER = (183, 127, 59)
ROSE = (158, 91, 91)
LINE = (221, 214, 203)
SOFT_GREEN = (232, 241, 236)
SOFT_BLUE = (235, 241, 248)
SOFT_AMBER = (247, 239, 226)
BLACK = (20, 18, 16)

FONT_REG = "/System/Library/Fonts/Hiragino Sans GB.ttc"
FONT_BOLD = "/System/Library/Fonts/STHeiti Medium.ttc"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size=size)


def wrap_text(text: str, max_chars: int) -> list[str]:
    lines: list[str] = []
    for para in text.split("\n"):
        para = para.strip()
        if not para:
            lines.append("")
            continue
        current = ""
        for ch in para:
            if len(current) >= max_chars:
                lines.append(current)
                current = ch
            else:
                current += ch
        if current:
            lines.append(current)
    return lines


def draw_wrapped(draw: ImageDraw.ImageDraw, xy, text: str, fnt, fill=INK, max_chars=26, line_gap=10):
    x, y = xy
    for line in wrap_text(text, max_chars):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + line_gap
    return y


def rounded(draw, box, radius=28, fill=PANEL, outline=LINE, width=2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def add_header(draw: ImageDraw.ImageDraw, slide_no: int, title: str):
    draw.text((110, 72), "CoursePilot Agent", font=font(38, True), fill=BLACK)
    draw.text((112, 120), "PHARMACY TEACHING INTELLIGENCE", font=font(18, True), fill=MUTED)
    draw.rounded_rectangle((1580, 76, 1810, 128), radius=26, fill=BLACK)
    draw.text((1620, 88), f"{slide_no:02d} / 11", font=font(24, True), fill=(255, 255, 255))
    draw.text((110, 188), title, font=font(58, True), fill=GREEN)


def bullet(draw, x, y, text, color=GREEN, max_chars=32):
    draw.ellipse((x, y + 12, x + 14, y + 26), fill=color)
    return draw_wrapped(draw, (x + 30, y), text, font(31), INK, max_chars=max_chars, line_gap=11)


def pill(draw, x, y, text, color=GREEN, w=None):
    f = font(25, True)
    bbox = draw.textbbox((0, 0), text, font=f)
    width = w or (bbox[2] - bbox[0] + 54)
    draw.rounded_rectangle((x, y, x + width, y + 54), radius=27, fill=color)
    draw.text((x + 26, y + 12), text, font=f, fill=(255, 255, 255))
    return x + width + 16


def workflow(draw):
    steps = [
        ("诊断", "目标/内容/学情"),
        ("设计", "案例/互动/节奏"),
        ("发布", "泛雅任务/作业"),
        ("复盘", "反馈/数据/改课"),
    ]
    x = 210
    y = 560
    for i, (name, desc) in enumerate(steps):
        color = [GREEN, BLUE, AMBER, ROSE][i]
        rounded(draw, (x, y, x + 300, y + 170), 34, fill=(255, 255, 255), outline=color, width=3)
        draw.text((x + 38, y + 32), name, font=font(42, True), fill=color)
        draw.text((x + 38, y + 92), desc, font=font(27), fill=INK)
        if i < 3:
            draw.line((x + 320, y + 85, x + 405, y + 85), fill=color, width=5)
            draw.polygon([(x + 405, y + 85), (x + 380, y + 70), (x + 380, y + 100)], fill=color)
        x += 405


slides = [
    {
        "title": "从第一次上药事管理课开始",
        "subtitle": "课程智能体赛组 | 匿名展示视频",
        "narration": "本项目是 CoursePilot Agent 药事管理课程智能体，申报课程智能体赛组。它面向药事管理与药事服务相关课程的新教师，解决第一次授课中目标不清、案例转化难、互动评价弱和平台沉淀不足的问题。下面的展示全程使用匿名画面，不出现参赛者姓名、学校和院系信息。",
        "bullets": ["申报赛道：课程智能体", "应用课程：药事管理 / 药事服务相关课程", "演示主题：连锁药店慢病服务决策中的 SWOT 分析"],
    },
    {
        "title": "真实痛点：新教师不是缺材料",
        "narration": "药学类课程中的管理学内容兼具专业性、政策性和实践性。新教师常常不是没有材料，而是不知道怎样把培养目标、教材章节、药学岗位场景和课堂评价连在一起。结果是课堂容易变成泛管理学讲授，学生知道概念，却不知道如何在药学情境中判断、举证和决策。",
        "bullets": ["目标难对齐：课程目标、章节目标、课次目标容易脱节", "案例难转化：管理学概念难落到药店、医院药房、医保与患者安全场景", "评价难闭环：作业、讨论和 Rubric 与学习目标不一致", "经验难沉淀：案例、反馈和复盘分散在个人文档中"],
    },
    {
        "title": "定位：一门课程的教学工作台",
        "narration": "CoursePilot 不是通用问答工具，而是围绕一门课程、一类教师和一组典型教学任务设计的课程智能体。它以培养方案、课程大纲、教材章节、班级学情、教师输入主题和泛雅课程上下文为起点，辅助教师完成课前诊断、课中设计、课后评价和持续改进。",
        "bullets": ["输入：培养方案、课程大纲、教材章节、班级学情、泛雅上下文", "处理：匹配四阶段、二十类新教师教学痛点", "输出：目标卡、案例脚本、课堂流程、Rubric、发布稿、复盘报告"],
    },
    {
        "title": "示例输入：连锁药店慢病服务决策",
        "narration": "本次演示以药事管理中的 SWOT 分析为例。教师输入连锁药店慢病服务决策后，智能体会识别药学情境，关联药品经营、患者教育、医保支付和用药安全约束，再把抽象管理学工具转化为学生可以讨论和提交的学习任务。",
        "bullets": ["课程主题：药事管理中的 SWOT 分析", "药学情境：连锁药店慢病服务、患者教育、医保支付、门店运营", "教学目标：让学生能用证据分析药事服务方案的优势、风险和合规边界"],
    },
    {
        "title": "闭环流程：诊断、设计、发布、复盘",
        "narration": "智能体的核心不是单次生成文本，而是把一堂课拆成可以执行的闭环。课前先诊断课程目标、内容结构和学生基础；课中生成导入、讲授、互动、练习、总结和作业；课后形成 Rubric、作业反馈和班级共性问题画像；最后把经验沉淀为下一轮课程建设资产。",
        "bullets": ["课前：目标对齐、内容取舍、学情预判", "课中：案例导入、互动提问、节奏控制、实践任务", "课后：Rubric、作业反馈、题库与复盘", "迭代：课程知识库、团队共享、版本记录"],
        "workflow": True,
    },
    {
        "title": "核心能力一：课程目标与药学场景转化",
        "narration": "在目标与内容层面，系统会把课程、章节和课次目标拆成三级结构，并提示必讲、可选和延伸内容。更关键的是，它会把 SWOT、组织管理、服务流程和绩效评价等概念，转化为连锁药店、医院药房、医药企业渠道、医保政策和患者安全相关案例。",
        "bullets": ["三级目标：课程目标、章节目标、课次目标", "内容结构：核心概念、关键关系、典型案例、易错点", "场景转化：从泛管理学概念到药学岗位任务"],
    },
    {
        "title": "核心能力二：课堂执行与评价证据",
        "narration": "在课堂执行层面，智能体会输出完整教学流程、PPT 提纲、课堂话术、板书线索和节奏控制卡。它还会生成分层提问、追问脚本、投票题、随堂练习和实践任务书，并把学习目标映射为 Rubric、案例作业和讨论表现评价标准。",
        "bullets": ["课堂流程：导入、讲授、互动、练习、总结、作业", "互动设计：记忆型、理解型、应用型、判断型问题", "评价证据：Rubric、案例作业、讨论表现、题库覆盖度"],
    },
    {
        "title": "泛雅执行出口：从建议到发布稿",
        "narration": "系统已经设计了泛雅第三方入口能力。它能够识别 courseId、clazzId 和 cpi 等课程参数，生成可复制到泛雅任务、讨论、作业或资源说明中的发布稿。正式写入平台前仍保留教师确认，避免 AI 自动覆盖正式课程内容。",
        "bullets": ["识别参数：courseId、clazzId、cpi、source", "生成内容：学生任务说明、药学专业提醒、教师执行建议、配套材料", "执行边界：教师确认后复制或同步，真实写入需学校或超星授权"],
    },
    {
        "title": "技术路线：前端工作台 + 后端 Connector",
        "narration": "技术上，前端使用网页工作台呈现教学场景、运行中心和发布出口；后端使用 Node.js Connector 统一处理泛雅接口鉴权、课程读取、作业同步和配置状态检测。接口密钥、Token、Cookie 和 App Secret 不写在前端，降低泄露风险。",
        "bullets": ["前端：HTML、CSS、JavaScript 教学工作台", "业务：课程知识结构化、场景化提示词、工作流状态管理", "连接：/api/fanya/status、connect、courses、sync-assignment", "安全：密钥后端读取，前端不暴露敏感配置"],
    },
    {
        "title": "安全与质量控制：教师主导，AI 辅助",
        "narration": "本项目坚持教师主导、AI 辅助。生成内容不直接替代教师专业判断，不用于医疗诊断或治疗建议。涉及政策、用药安全、患者权益和职业伦理的内容必须由教师复核。匿名评审材料和视频中不出现个人姓名、学校和院系。",
        "bullets": ["教师确认：正式发布前核验事实、政策、伦理和用药安全", "匿名评审：删除姓名、学校、院系和平台身份字段", "数据合规：接入学生学习数据前需学校授权", "应用边界：教学辅助，不做医疗诊断或治疗建议"],
    },
    {
        "title": "应用成效与推广价值",
        "narration": "目前项目已经形成可运行原型，沉淀二十个新教师痛点、四个教学阶段、一套泛雅接入流程和一条评审体验路径。它可以帮助新教师降低备课启动难度，让学生获得更清楚的药学情境任务，也让课程团队沉淀统一标准、共享案例和跨轮次复盘记录。后续可推广到药事管理、临床药学服务、医药市场营销和医院药事管理等课程。",
        "bullets": ["已完成：20 个痛点场景、4 阶段流程、网页原型、泛雅接入设计", "教师价值：降低备课启动成本，提升课堂执行稳定性", "学生价值：任务、案例和 Rubric 更清楚", "团队价值：统一标准、共享案例、持续复盘、可推广"],
    },
]


def draw_mock_console(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int):
    rounded(draw, (x, y, x + w, y + h), 36, fill=(255, 255, 255), outline=(213, 204, 191), width=2)
    draw.text((x + 44, y + 38), "本次课运行中心", font=font(34, True), fill=GREEN)
    sample = [
        ("输入", "药事管理中的 SWOT 分析"),
        ("诊断", "目标对齐 + 学情预判"),
        ("设计", "案例导入 + 分层提问 + 课堂节奏"),
        ("评价", "Rubric + 案例作业 + 反馈建议"),
        ("发布", "转为泛雅任务/讨论/作业说明"),
    ]
    cy = y + 105
    for idx, (k, v) in enumerate(sample):
        color = [GREEN, BLUE, AMBER, ROSE, GREEN][idx]
        draw.rounded_rectangle((x + 44, cy, x + 148, cy + 48), radius=24, fill=color)
        draw.text((x + 70, cy + 9), k, font=font(23, True), fill=(255, 255, 255))
        draw.text((x + 176, cy + 6), v, font=font(27), fill=INK)
        if idx < len(sample) - 1:
            draw.line((x + 96, cy + 54, x + 96, cy + 78), fill=color, width=4)
        cy += 78


def draw_slide(i: int, spec: dict, path: Path) -> None:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    # restrained background bands
    draw.rectangle((0, 0, W, 160), fill=(252, 250, 245))
    draw.rectangle((0, H - 130, W, H), fill=(242, 239, 232))
    add_header(draw, i + 1, spec["title"])

    if i == 0:
        draw.text((112, 286), spec["subtitle"], font=font(36), fill=BLUE)
        y = 390
        for b in spec["bullets"]:
            y = bullet(draw, 128, y, b, GREEN, max_chars=38) + 24
        draw_mock_console(draw, 1040, 300, 660, 500)
    elif spec.get("workflow"):
        y = 310
        for b in spec["bullets"]:
            y = bullet(draw, 126, y, b, GREEN, max_chars=42) + 18
        workflow(draw)
    else:
        y = 318
        for idx, b in enumerate(spec["bullets"]):
            color = [GREEN, BLUE, AMBER, ROSE][idx % 4]
            y = bullet(draw, 126, y, b, color, max_chars=44) + 24

        if i in {2, 3, 7, 8}:
            draw_mock_console(draw, 1070, 362, 650, 430)
        elif i in {5, 6}:
            rounded(draw, (1110, 350, 1710, 770), 32, fill=(255, 255, 255), outline=(213, 204, 191), width=2)
            draw.text((1160, 398), "生成结果示意", font=font(34, True), fill=GREEN)
            demo_lines = [
                "课次目标卡",
                "药学案例导入脚本",
                "分层提问与追问",
                "Rubric 与作业说明",
                "课后复盘建议",
            ]
            yy = 470
            for line in demo_lines:
                draw.rounded_rectangle((1160, yy, 1660, yy + 48), radius=24, fill=SOFT_GREEN)
                draw.text((1192, yy + 9), line, font=font(25), fill=INK)
                yy += 64

    # bottom caption as burned-in subtitle summary
    caption = spec["narration"]
    caption_short = " ".join(wrap_text(caption, 46)[:2])
    rounded(draw, (110, 900, 1810, 1000), 26, fill=(255, 254, 249), outline=(230, 224, 214), width=2)
    draw_wrapped(draw, (145, 924), caption_short, font(28), fill=INK, max_chars=55, line_gap=8)
    img.save(path, quality=95)


def write_script_files():
    OUT.mkdir(parents=True, exist_ok=True)
    script_path = OUT / "CoursePilot_Agent_展示视频旁白稿.txt"
    srt_path = OUT / "CoursePilot_Agent_展示视频字幕.srt"
    with script_path.open("w", encoding="utf-8") as f:
        for idx, spec in enumerate(slides, 1):
            f.write(f"{idx:02d}. {spec['title']}\n{spec['narration']}\n\n")
    return script_path, srt_path


def generate_audio():
    AUDIO.mkdir(parents=True, exist_ok=True)
    audio_paths = []
    for idx, spec in enumerate(slides, 1):
        txt = AUDIO / f"{idx:02d}.txt"
        aiff = AUDIO / f"{idx:02d}.aiff"
        txt.write_text(spec["narration"], encoding="utf-8")
        subprocess.run(
            ["say", "-v", "Tingting", "-r", "168", "-f", str(txt), "-o", str(aiff)],
            check=True,
        )
        audio_paths.append(aiff)
    return audio_paths


def compose_video(slide_paths, audio_paths, srt_path: Path):
    import sys

    sys.path.insert(0, "/tmp/coursepilot_video_py")
    from moviepy import AudioFileClip, ImageClip, concatenate_videoclips

    clips = []
    srt_blocks = []
    current = 0.0
    for idx, (slide, audio, spec) in enumerate(zip(slide_paths, audio_paths, slides), 1):
        audio_clip = AudioFileClip(str(audio))
        duration = max(audio_clip.duration + 1.2, 35)
        clip = ImageClip(str(slide)).with_duration(duration).with_audio(audio_clip)
        clips.append(clip)

        start = current
        end = current + duration
        srt_blocks.append((idx, start, end, spec["narration"]))
        current = end

    def ts(sec: float) -> str:
        h = int(sec // 3600)
        m = int((sec % 3600) // 60)
        s = int(sec % 60)
        ms = int(round((sec - int(sec)) * 1000))
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    with srt_path.open("w", encoding="utf-8") as f:
        for idx, start, end, text in srt_blocks:
            f.write(f"{idx}\n{ts(start)} --> {ts(end)}\n")
            for line in wrap_text(text, 28):
                f.write(line + "\n")
            f.write("\n")

    meta = {
        "duration_seconds": round(current, 1),
        "duration_minutes": round(current / 60, 2),
        "slides": len(slides),
    }

    final = concatenate_videoclips(clips, method="compose")
    out_mp4 = OUT / "CoursePilot_Agent_药事管理课程智能体_展示视频初稿.mp4"
    final.write_videofile(
        str(out_mp4),
        fps=6,
        codec="libx264",
        audio_codec="aac",
        preset="ultrafast",
        bitrate="4500k",
        threads=4,
        logger=None,
    )
    final.close()
    for clip in clips:
        clip.close()
    meta["video"] = str(out_mp4)
    (OUT / "video_build_meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    return out_mp4, meta


def main():
    SLIDES.mkdir(parents=True, exist_ok=True)
    script_path, srt_path = write_script_files()
    slide_paths = []
    for idx, spec in enumerate(slides):
        path = SLIDES / f"{idx+1:02d}.png"
        draw_slide(idx, spec, path)
        slide_paths.append(path)
    audio_paths = generate_audio()
    out_mp4, meta = compose_video(slide_paths, audio_paths, srt_path)
    print(json.dumps({
        "video": str(out_mp4),
        "script": str(script_path),
        "srt": str(srt_path),
        **meta,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
