
# 凡人晨读 (Morning Reader) - 项目总结报告

> **版本状态**: v2.3 (智慧共生版)  
> **项目代号**: Project Sage  
> **核心理念**: 从依赖到独立，从独立到互赖，让成长不再孤独。

## 1. 项目愿景与定位 (Executive Summary)

**凡人晨读** 是一款融合了**正念心理学**、**游戏化机制**与**生成式 AI** 的习惯养成类社交学习应用。

我们致力于解决现代人自我提升过程中的“孤独感”与“难以坚持”两大痛点。通过将《高效能人士的七个习惯》等经典智慧拆解为每日 15 分钟的微课程，辅以“共修生态”和“AI 教练”，帮助用户在数字世界中找到内心的宁静与成长的力量。

---

## 2. 核心功能模块 (Product Modules)

本项目包含五大核心业务模块，构建了完整的用户价值闭环：

### 📚 2.1 沉浸式学习系统 (Immersive Learning)
*   **晨读课程**: 支持图文混排 (Markdown)、音频导读 (TTS)、金句卡片生成。
*   **交互式练习**: 在课程底部集成了“选择题/排序题”模块，通过即时反馈强化“积极主动”、“关注圈”等核心概念。
*   **智能摘要**: 集成 Google Gemini AI，一键提炼每日课程精华 (Bullet Points)。
*   **响应式阅读体验**: 针对手机、平板、桌面端优化了阅读容器与排版。

### 🌱 2.2 共修社交生态 (Social Ecosystem)
*   **伙伴匹配 (Partner Match)**: 基于“雷达扫描”动画的仪式感匹配流程，支持寻找“同修”或“导师”。
*   **共生树 (Relationship Tree)**: 可视化的关系成长系统。用户通过“浇水”、“寄明信片”等互动行为，让树苗升级，直观呈现羁绊深度。
*   **共修直播间 (Live Room)**: 模拟多人在线专注场景，提供白噪音、番茄钟、弹幕互动，营造“此时此刻，我们在一起”的氛围。
*   **社区广场**: 支持图文动态发布、点赞、评论及全文搜索。

### 🎮 2.3 游戏化成长引擎 (Gamification)
*   **PBL 系统**: 
    *   **Points (XP)**: 衡量投入度，决定等级。
    *   **Badges (徽章)**: 记录里程碑 (如“初出茅庐”、“全勤之王”)。
    *   **Leaderboards (等级)**: 可视化的等级体系。
*   **Zen Coins (经济系统)**: 通过学习获得代币，可在“灵性商店”兑换补签卡、主题皮肤或进行公益捐赠。
*   **五维能力雷达图**: 在个人中心实时计算并展示用户的“恒毅力、智慧、洞察、影响、专注”五大维度数据。

### 🤖 2.4 AI 智慧赋能 (AI Integration)
*   **AI 晨读教练**: 基于 `gemini-2.5-flash` 模型，具备**联网搜索 (Grounding)** 能力，能回答书籍相关问题并提供延伸阅读链接。
*   **笔记共鸣**: 在用户撰写感悟时，AI 会分析内容，提供“共情反馈”与“引导性提问”，将单向记录转变为双向启发。

### 📊 2.5 数据与个人中心
*   **学习周报**: 热力图、周趋势图表，量化用户的每一次坚持。
*   **全端适配**: 实现了 PC/Pad 端的双栏 Grid 布局，底部导航栏自适应居中，背景防溢出处理。

---

## 3. 技术架构 (Technical Architecture)

### 前端技术栈
*   **Core**: React 18, TypeScript, Vite.
*   **Routing**: React Router DOM v6.
*   **Styling**: Tailwind CSS (自定义 `primary` 鼠尾草绿主题, Dark Mode 支持).
*   **State Management**: Context API (Auth, Gamification, Toast) + Custom Hooks (`useLocalStorage`).
*   **UX Enhancement**: Haptics (震动反馈), CSS Animations (`fade-in-up`, `pulse`, `shimmer`).

### 后端与服务
*   **BaaS**: Supabase (Auth, PostgreSQL Database, Realtime).
*   **AI Service**: Google GenAI SDK (`@google/genai`), Models: `gemini-2.5-flash`.

### 数据流设计
1.  **用户认证**: Supabase Auth 处理手机号/邮箱登录。
2.  **本地持久化**: 关键交互数据优先写入 LocalStorage 实现“乐观 UI (Optimistic UI)”，随后异步同步至 Supabase。
3.  **实时通信**: 直播间消息流采用模拟 Socket 机制 (可无缝迁移至 Supabase Realtime)。

---

## 4. 用户体验设计亮点 (UX Highlights)

1.  **禅意美学**: 全站采用低饱和度的 **Sage Green (鼠尾草绿)** 与 **Warm Sand (暖沙色)**，配合毛玻璃 (Glassmorphism) 效果，降低视觉噪点。
2.  **微交互**: 
    *   点赞时的心跳动画。
    *   达成目标时的粒子庆祝 (Confetti)。
    *   关键操作 (如匹配成功、浇水) 配合不同强度的 Haptic 震动反馈。
3.  **跨端一致性**: 通过 `max-w-4xl` 容器约束与相对定位优化，确保应用在 6.7寸手机与 27寸显示器上均有优雅表现。

---

## 5. 项目进度与规划 (Roadmap Status)

| 阶段 | 代号 | 核心目标 | 状态 |
| :--- | :--- | :--- | :--- |
| **v1.0** | 启程 | 基础阅读功能、本地数据存储、UI 框架搭建 | ✅ 已完成 |
| **v2.0** | 联结 | 引入 Supabase 后端、伙伴系统、社区广场 | ✅ 已完成 |
| **v2.1** | 激励 | 游戏化引擎 (XP/金币)、成就系统、商店 | ✅ 已完成 |
| **v2.2** | 适配 | 响应式重构 (PC/Pad 支持)、全局 Toast | ✅ 已完成 |
| **v2.3** | 智慧 | **AI 教练联网**、**笔记共鸣**、**能力雷达图** | ✅ **当前版本** |
| **v3.0** | 觉醒 | 离线模式 (PWA)、真实支付接入、多人实时语音共修 | 📅 规划中 |

---

## 6. 快速开始 (Getting Started)

### 环境要求
*   Node.js > 16.x
*   API Keys: 
    *   `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`
    *   `API_KEY` (Google Gemini)

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm start
# 或
npm run dev

# 3. 构建生产版本
npm run build
```

---

**总结**: 
本项目不仅完成了一个功能完备的 LMS 系统开发，更在**情感化设计**与**AI 场景化落地**上做出了深入探索。代码结构清晰，组件复用性高，具备良好的扩展性，已准备好迎接下一阶段的商业化迭代。

---
*Project Manager: Claude*
*Date: 2024-05-22*
