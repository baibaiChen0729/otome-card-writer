---
name: fanfic-market-research
description: 同人文市场调研。输入 CP 名（如"橹穆"）和角色名（如"王橹杰 穆祉丞"），自动从 AO3、微博、豆瓣、抖音等多平台检索同人生态数据，提取热点、流行梗、CP 糖点/刀点、文风要求、名场面、雷区，并输出高热度作品列表及直达链接。适用于同人创作者动笔前的市场调研、CP 热度分析、同人圈生态研究。触发词：「同人文调研」「调研一下 XX CP」「XX CP 的同人文市场」「帮我调研橹穆」「AO3 调研」「同人文市场分析」「同人圈调研」。
---

# 同人文市场调研 Skill

输入 CP 名 → 自动检索 AO3 + 社区 → 输出同人文市场情报报告。

## 核心流程

### Step 1: 理解 CP 身份（1~2 次搜索）

用 `web_search` 确认 CP 的基本信息：
- 哪两个角色/真人？
- 属于哪个作品/IP/公司？
- CP 名是否有别名/变体写法？（如"橹穆"也写作"鲁木""杰丞"）

```
web_search: "{CP名} CP 是谁 角色"
web_search: "{CP名} 同人文 平台"
```

### Step 2: AO3 数据抓取（核心，3~4 次抓取）

AO3 是最核心数据源，URL 格式：

```
https://archiveofourown.org/tags/{Tag名称}/works
```

**搜索策略（并行执行）：**

1. **中文 CP 名 tag**：`archiveofourown.org/tags/{CP中文名}/works`
2. **英文名/拼音 tag**：`archiveofourown.org/tags/{英文名或拼音}/works`
3. **AO3 work search**：`archiveofourown.org/works/search?work_search[query]={CP名}&work_search[other_tag_names]={CP名}`
4. **AO3 Collection**：`archiveofourown.org/collections/{缩写}`（如有）

从 AO3 页面提取：
- 作品总数（"X Works in {Tag}"）
- 每页作品标题、tag、summary、Kudos、Hits、Comments、字数
- 高频 Additional Tags（流行 trope 来源）
- Warning 标签分布
- Rating 分布

### Step 3: 多平台社区补充（4~6 次搜索）

```
# 推荐合集
web_search: "{CP名} 同人文推荐 必吃榜 ao3 lofter"
web_search: "{CP名} ao3 推荐 热门 长篇"

# 梗/人设/糖刀
web_search: "{CP名} 名场面 梗 人设 糖 刀"
web_search: "{CP名} 雷点 OOC 预警"

# 社区讨论（微博/豆瓣/抖音）
web_search: "site:weibo.com {CP名} 同人文"
web_search: "site:douban.com {CP名} 同人文"
```

提取：
- 热门作品推荐列表（带标题、平台、类型标注）
- 圈内黑话/昵称
- 社区共识人设
- 糖点 / 刀点
- 名场面
- 雷区/敏感话题

### Step 4: 生成报告

输出 Markdown 格式报告，保存到 `同人文调研/{日期}-{CP名}市场情报.md`。

## 报告模板

```markdown
# 🦞 {CP名}（{角色A} × {角色B}）同人文市场情报

> 调研日期 | 数据来源 | 调研方法

## 📊 一、总览
| CP | |
| 背景 | |
| AO3 作品数 | |
| AO3 Collection | |
| 粉丝自称 | |
| 社区活跃度 | |

## 🔥 二、圈内流行梗 & 高频 Tropes
Top 10 表格：排名 | 梗/Trope | 说明
+ 圈内黑话列表

## 💕 三、糖点 & 🔪 刀点
### 糖点
### 刀点

## 🎭 四、名场面盘点
表格：名场面 | 来源 | 社区提及度

## ✍️ 五、文风 & 写作要求
### 主流文风
### 读者偏好分布
### 热门 AU 设定

## 🚫 六、雷区警示
表格：雷区 | 说明
+ AO3 Warning 标签统计

## 🏆 七、Top 高热度作品
### 必吃榜/长篇
### 精选高热度作品（含直达链接）

## 💡 八、给创作者的建议
基于数据的 3~6 条建议

## 📌 九、本次调研技术备注
各平台数据可用性评估
```

## 数据源说明

| 平台 | 访问方式 | 数据 | 限制 |
|------|---------|------|------|
| **AO3** | web_fetch 直抓 | 作品列表/tag/summary/stats | ✅ 免登录，可抓取 |
| **微博超话** | web_search 摘要 | 推荐合集/讨论 | ✅ 搜索可获取 |
| **豆瓣** | web_search 摘要 | 必吃榜/书评 | ⚠️ 豆瓣页面有验证码，主要靠搜索摘要 |
| **抖音** | web_search 摘要 | 推文视频/标题 | ✅ 搜索可获取 |
| **Lofter** | web_search 摘要 | 部分标题 | ❌ tag 页面需登录，无法直接抓取 |
| **小红书** | web_search | 讨论帖 | ✅ 搜索可获取 |

## AO3 URL 构建规则

1. **Relationship tag**：`/tags/{角色A}%2F{角色B}/works` 或 `/tags/{CP名}%20-%20Relationship/works`
2. **Character tag**：`/tags/{角色名}%20-%20Freeform/works`
3. **Work search**：`/works/search?work_search[query]={关键词}&work_search[other_tag_names]={tag}`
4. **Collection**：`/collections/{缩写}/works`

URL 编码注意：中文用 `%{HEX}` 编码，`/` 用 `%2F`，空格用 `%20` 或 `+`。

## 频率控制

- 每次调研控制在 **8~12 次 web_search + 4~6 次 web_fetch**
- AO3 抓取间隔至少 1 秒（避免触发反爬）
- 优先抓取 AO3 第一页（默认按 relevance 排序，质量最高）

## 链接规范

- AO3 直达链接用完整 URL（`https://archiveofourown.org/works/{ID}`）
- 无法直达的作品给 AO3 搜索 URL
- Lofter 链接仅给搜索摘要中的可见链接
- 禁止编造笔记 ID 或作品链接

## 输出路径

报告保存至：`同人文调研/{YYYY-MM-DD}-{CP名}市场情报.md`
