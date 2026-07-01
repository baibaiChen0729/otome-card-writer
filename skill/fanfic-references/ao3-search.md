# AO3 搜索与 URL 构建参考

## Tag URL 格式

AO3 tag 页面 URL 规则：
```
https://archiveofourown.org/tags/{URL编码的Tag名}/works
```

### 中文 Tag 编码示例

- `橹穆` → `%E6%A9%B9%E7%A9%86`
- `王橹杰/穆祉丞` → `%E7%8E%8B%E6%A9%B9%E6%9D%B0%2F%E7%A9%86%E7%A5%89%E4%B8%9E`
- `橹穆 - Relationship` → `%E6%A9%B9%E7%A9%86%20-%20Relationship`

### 常见 Tag 后缀

| 类型 | 后缀 | 示例 |
|------|------|------|
| Relationship | `- Relationship` | 橹穆 - Relationship |
| Character | `- Character` or `- Freeform` | 王橹杰 - Freeform |
| Fandom | `(Fandom)` or `(Band)` or `(Anime)` | 时代少年团 \| Teens in Times (Band) |
| Freeform | `- Freeform` | 纯爱 - Freeform |

### 实际 URL 构建

```
# Relationship tag（最精确）
/tags/{CP名}%20-%20Relationship/works

# 角色对（斜杠分隔）
/tags/{角色A}%2F{角色B}/works

# Character tag
/tags/{角色名}%20-%20Character/works
/tags/{角色名}%20-%20Freeform/works

# Fandom 页面
/tags/{作品名}%20%7C%20{英文名}%20(Band)/works

# Collection
/collections/{缩写}/works
```

## Work Search URL

```
https://archiveofourown.org/works/search
 ?work_search[query]={关键词}
 &work_search[other_tag_names]={Additional Tag}
 &work_search[fandoms]={Fandom}
 &work_search[sort_column]=kudos
 &work_search[sort_direction]=desc
```

常用排序：
- `_score` = 默认相关性
- `kudos_count` = 按 kudos 降序
- `hits` = 按点击量降序
- `bookmarks_count` = 按收藏降序
- `revised_at` = 按更新时间

## 从 AO3 页面提取的字段

作品列表页每个作品块包含：

```
标题 → 作品名 + 章节信息
Tags → Warning tags + Relationship + Character + Additional Tags
Summary → 简介/文案
Stats → Words / Chapters / Comments / Kudos / Hits
```

## 跨平台补充搜索模板

```
# 推荐合集
"{CP名}" 同人文推荐 必吃榜 ao3
"{CP名}" ao3 推荐 热门 长篇

# 梗/人设
"{CP名}" 名场面 梗 人设
"{CP名}" 糖 刀 雷点 OOC

# 社区讨论
site:weibo.com "{CP名}" 同人文
site:douban.com "{CP名}" 同人文
"{CP名}" lofter 同人文 热门
```
