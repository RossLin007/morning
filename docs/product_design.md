# 凡人页面设计原则

> 愿每个凡人都能看见自己的不凡

---

## 七大设计原则

### 1. 说通及心通
**核心理念**：通过表达来实现内心的通透。

- 创作入口置于视觉中心（底部 + 号按钮）
- 降低分享门槛，鼓励即时记录
- Story 设计轻量化：一张图 + 一句觉察

---

### 2. 在场感设计
**目标**：让书友感受到"大家都在修行"的陪伴。

- Story 气泡渐变光圈提示新动态
- 信息流实时展示书友分享
- AI 洞察卡片强化个人成长轨迹

---

### 3. 高级感视觉
**美学方向**：禅意、克制、温润。

- 使用玻璃态（glassmorphism）效果
- 渐变色系：Sage Green → Emerald → Teal
- 圆角设计（16px-28px）
- 微动效：呼吸、脉冲、悬浮

---

### 4. 层次分明
**信息架构**：置顶 → 洞察 → 公告 → 动态

| 层级 | 内容类型 | 视觉特征 |
|------|----------|----------|
| 1 | Featured | 全出血大图 + 渐变遮罩 |
| 2 | AI 洞察 | 紫色玻璃态卡片 |
| 3 | 公告 | 暖色调（琥珀/橙） |
| 4 | 书友动态 | 白底简洁卡片 |

---

### 5. 场景化引导
**触发时机**：在正确的时间提供正确的入口。

- 晨读时间自动推送打卡提醒
- 完成阅读后引导发布 Story
- 金句触动时提供一键分享

---

### 6. 深浅互补
**内容深度**：轻记录 + 深反思并存。

| 形式 | 深度 | 时效 | 场景 |
|------|------|------|------|
| Story | 浅 | 即时 | 觉察瞬间 |
| 觉察日记 | 深 | 永久 | 反思总结 |

Story 可转化为日记，形成完整的觉察闭环。

---

### 7. 小凡常伴
**AI 定位**：不打扰，但随时在。

- 悬浮按钮置于右下角
- 紫色渐变区别于主色调
- 点击即可开启对话

---

## 信息流卡片类型与配色规范

根据源代码分析，凡人信息流包含以下卡片类型：

### 一、凡人首页卡片类型（Dashboard.tsx）

| 类型 | 中文名 | 用途 | 来源 |
|------|--------|------|------|
| `featured` | 置顶/精选 | 晨读营官方重要内容 | 晨读营 |
| `insight` | AI 洞察 | 小凡生成的个人成长数据分析 | 小凡 |
| `announcement` | 公告 | 通知、活动、提醒 | 晨读营/系统 |
| `normal` | 书友分享 | 用户发布的日常分享、觉察日记 | 书友 |

---

### 二、通用卡片组件类型（FeedCard.tsx）

适用于其他页面场景的扩展类型：

| 类型 | 中文名 | 图标 | 配色 |
|------|--------|------|------|
| `reading` | 阅读内容 | `auto_stories` | Primary 绿色 |
| `reflection` | 反思/日记 | `edit_note` | 橙色 |
| `partner` | 书友互动 | `group` | 蓝色 |
| `system` | 系统消息 | `info` | 灰色 |
| `feedback` | 反馈通知 | `done_all` | 绿色 |
| `summary` | 总结报告 | `summarize` | 青色 |
| `reward` | 奖励通知 | `military_tech` | 黄色 |
| `insight` | AI 洞察 | `lightbulb` | 紫色 |

---

### 配色规范

#### 1. Featured（置顶/精选）

#### 1. Featured（置顶/精选 - Top Card）

```css
宽/高：mx-4 (16px margin) / 内容自适应 (min-h-[160px])
圆角：rounded-2xl (16px)
背景：全出血封面图 (Object-cover)
遮罩：bg-gradient-to-t from-black/60 via-black/20 to-transparent
内容布局：p-6 (24px padding) flex-row items-end
排版：
  - 金句: text-[17px] font-medium text-white
  - 按钮: w-10 h-10 (40px) rounded-full bg-white/90 backdrop-blur (纯图标)
```

**设计意图**：大气、沉浸、电影海报质感、单一视觉焦点

---

#### 2. Reading Hero（晨读页置顶）

```css
宽/高：mx-4 (16px margin) / 内容自适应
圆角：rounded-2xl (16px)
背景：全出血封面图 (Object-cover)
遮罩：bg-gradient-to-t from-black/70 via-black/20 to-transparent
内容布局：p-6 pt-24 (顶部预留空间)
排版：
  - 标题: text-[22px] font-bold text-white
  - 副题: text-[14px] text-white/70 (单行截断)
  - 信息: text-[12px] text-white/60 (Day X · Duration)
  - 按钮: w-10 h-10 (40px) rounded-full bg-white/90 (纯图标)
```

**设计意图**：焦点聚焦于课程内容，移除干扰元素 (No Badges)

---

#### 2. Insight（AI 洞察）

```css
/* 亮色模式 */
背景：bg-white
边框：border-b border-gray-100
图标：bg-gradient-to-br from-purple-500 to-indigo-600
图标形状：rounded-lg (48px)

/* 暗色模式 */
背景：dark:bg-[#191919]
边框：dark:border-gray-800
图标：bg-gradient-to-br from-purple-500 to-indigo-600
```

**设计意图**：智慧、简洁、扁平化列表视图

---

#### 3. Announcement（公告）

```css
/* 亮色模式 */
背景：bg-white
边框：border-b border-gray-100
图标：bg-gradient-to-br from-amber-400 to-orange-500
图标形状：rounded-lg (48px)

/* 暗色模式 */
背景：dark:bg-[#191919]
边框：dark:border-gray-800
图标：bg-gradient-to-br from-amber-400 to-orange-500
```

**设计意图**：醒目、统一、融入列表流

---

#### 4. Normal（书友动态）

```css
/* 亮色模式 */
背景：bg-white
边框：border-b border-gray-100
头像：rounded-md (48px)

/* 暗色模式 */
背景：dark:bg-[#191919]
边框：dark:border-gray-800
头像：dark:bg-gray-800
```

**设计意图**：微信风格、扁平、内容为王

---

### 共用设计规范

| 属性 | 值 |
|------|------|
| 属性 | 值 |
|------|------|
| 列表布局 | 全宽 (Twitter/WeChat Style flat list) |
| 内边距 | `px-4 py-4` (padding 16px) |
| 头像尺寸 | `w-12 h-12` (48px) |
| 头像形状 | `rounded-md` (User) / `rounded-lg` (System) |
| 分割线 | `border-b border-gray-100` |
| 悬停效果 | `hover:bg-gray-50` |
| 交互反馈 | `active:bg-gray-50/80` |

---

## Story 设计的价值定位

关于 Story 设计的价值定位，让我结合凡人晨读的产品理念来分析：

### Story 解决的核心问题

**1. 降低分享门槛**

传统的动态发布需要用户"想好内容"，这会造成心理压力。Story 的特点是：
- 轻量化 → 一张图+一句话就够了
- 非常适合记录 **"此刻的觉察"**，与晨读的核心理念契合

**2. 建立社区"在场感"**

- 书友看到其他人的 Story 有更新（渐变光圈亮起）
- 产生"大家都在修行"的陪伴感
- 强化互赖阶段的社交连接

**3. 适配晨读场景**

凡人晨读有明确的时间节奏（早晨 6:30），Story 非常适合：
- 📸 打卡晨读现场
- 💭 分享当天的金句感悟
- 🌅 记录早起的瞬间

---

### 潜在的产品方向

| 功能 | 说明 |
|------|------|
| 晨读打卡 Story | 自动生成带日期/天数的打卡卡片 |
| 金句 Story | 一键把今日金句转为可分享的 Story |
| 觉察瞬间 | 鼓励用户随时记录觉察时刻 |
| 共修直播 | Story 滑入直播间入口 |

---

**总结**：Story 是为了让"分享觉察"这件事变得更轻、更即时、更有温度——符合"凡人"的定位，不需要完美，只需要真实。