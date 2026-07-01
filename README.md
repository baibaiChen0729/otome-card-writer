# otome-card-writer

乙女向 AI roleplay 角色卡指令生成 Skill

为任意乙女游戏 / 影视 / 小说角色制作 DS（DeepSeek）/ 豆包 / Claude System Prompt 角色扮演指令卡。

## 功能

- 基于角色原设搜集人设，防 OOC 校准
- 设计有身体张力 / 信息差 / 情感克制的五节点剧情
- 生成含 OC 创建 / 五节点剧情 / 多条结局线的完整指令文本
- 输出 Markdown + docx 双格式
- 支持玩家开局自选 HE / BE 结局

## 文件结构

```
skill/                          # Skill 主体
├── SKILL.md                    # 触发条件 + 六步工作流
├── references/
│   ├── card-format.md          # 角色卡格式规范（13个模块）
│   ├── ooc-guide.md            # 防 OOC 人设校准指南
│   └── tension-craft.md        # 叙事张力 + 性张力写法指南
└── scripts/
    └── gen_docx.js             # Markdown → docx 渲染脚本

cards/                          # 已生成的角色卡示例
├── 秦彻·小猫变人角色卡指令·v1.0.md        # 黑帮大佬 AU × 雨夜捡猫变成人
└── 秦彻·ABO角色卡指令·信息素对陌生人·v2.1.md  # ABO × 分手重逢
```

## 角色卡使用方法

将 `cards/` 里的 `.md` 文件全文复制进 DeepSeek / 豆包 / Claude 的 System Prompt 框，以触发语开始对话。

**小猫变人触发语：**
> 「开始游戏。我是一只黑色小母猫，左耳尖缺一小块，眼睛是琥珀色的。我的结局方向是——」

**ABO 触发语：**
> 「开始游戏。我叫——，我的信息素气味是——，我的职业是——。」

## 适用场景

`「帮我做一个 XX 角色的角色卡」` `「给 XX 做 DS 指令」` `「我想玩 XX 的剧情，帮我写 roleplay 指令」`

---

*输出语言：中文，第二人称「你」，梦女 / Reader 视角*
