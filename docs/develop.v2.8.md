
# 凡人晨读 (Morning Reader) - v2.8 架构审计与改进路标

> **审计人**: Principal Engineer
> **版本目标**: v2.8 (磐石版) - 夯实地基，消除技术债，为 v3.0 实时互动做好准备。
> **审计结论**: 项目已具备优秀的原型完成度，但在**工程化规范**、**边界情况处理**及**安全性**上仍有“草莽气息”。

---

## 🏗️ 架构与设计模式 (Architecture & Patterns)

1.  **Context 职责纯净化 (Context Segregation)**
    *   **现状**: `GamificationContext` 混杂了状态管理（XP/Coins）和 UI 渲染（RewardQueue 弹窗）。
    *   **建议**: 将 UI 渲染剥离至独立的 `RewardsOverlay` 组件，Context 仅负责状态流转。遵循 "Headless Context" 原则。

2.  **领域驱动目录重构 (Feature-First Folder Structure)**
    *   **现状**: `pages/`, `components/`, `hooks/` 扁平化堆积，随着功能增加，维护难度呈指数级上升。
    *   **建议**: 迁移至 `features/` 结构（如 `features/auth`, `features/gamification`, `features/partner`），将相关组件、Hooks、Types 收敛至特性目录下。

3.  **网络层统一拦截 (Centralized API Client)**
    *   **现状**: `supabase` 客户端直接散落在各个 Hook 中，缺乏统一的错误拦截和重试机制。
    *   **建议**: 封装 `ApiClient` 或增强 `queryClient` 配置，统一处理 401 断连、全局 Loading 状态及 Toast 错误提示。

4.  **路由懒加载细粒度控制 (Granular Code Splitting)**
    *   **现状**: 路由级 lazy load 已做，但部分重型组件（如 `AICoach` 中的 Voice Mode 逻辑）未做拆分。
    *   **建议**: 对 `useLiveAI` 及相关可视化组件进行动态导入，避免首屏加载 Web Audio API 相关的大体积代码。

5.  **领域实体映射层 (Domain Mapper Layer)**
    *   **现状**: UI 直接消费 Supabase 返回的 DB 字段（如 `profiles.avatar`），导致后端改字段前端必崩。
    *   **建议**: 在 Service 层增加 `Mapper`，将 DB DTO (Data Transfer Object) 转换为前端 Domain Model，确保 UI 对数据结构变更免疫。

---

## ⚡ 性能与体验 (Performance & UX)

6.  **LocalStorage 同步读取阻塞 (Blocking Storage Read)**
    *   **现状**: `useLocalStorage` 在 `useState` 初始化时同步读取，可能会在低端设备上阻塞主线程。
    *   **建议**: 改为异步初始化或使用 `idb-keyval` (IndexedDB) 替代 LocalStorage 存储大数据（如聊天记录）。

7.  **Web Audio API 单例管理 (AudioContext Singleton)**
    *   **现状**: `useLiveAI` 内部创建 AudioContext，未做全局复用管理，频繁挂断/重连可能导致内存泄漏或超过浏览器上下文限制。
    *   **建议**: 建立 `AudioManager` 单例服务，统一管理 AudioContext 生命周期。

8.  **图片资源加载策略 (Advanced Image Loading)**
    *   **现状**: 虽有 `Image` 组件，但缺乏预加载（Preload）和特定设备的响应式尺寸请求（srcSet）。
    *   **建议**: 为 Avatar 和 Banner 引入 `sizes` 和 `srcSet`，并针对 LCP (Largest Contentful Paint) 元素添加 `<link rel="preload">`。

9.  **长列表渲染优化 (Virtuoso Implementation)**
    *   **现状**: `Community` 页面虽引入 `Virtuoso`，但 Feed Item 高度不固定可能导致抖动。
    *   **建议**: 为 Feed Item 实现 `React.memo` 避免重渲染，并固定图片容器比例防止布局偏移 (CLS)。

10. **交互反馈标准化 (Interaction Consistency)**
    *   **现状**: Haptics 散落在各个点击事件中，缺乏统一规范。
    *   **建议**: 封装 `<InteractiveButton>`，内置 Haptics 和防抖 (Debounce) 逻辑。

---

## 🛡️ 安全与隐私 (Security & Privacy)

11. **API Key 泄露风险 (Critical Security Risk)**
    *   **现状**: `lib/config.ts` 中包含硬编码的 API Key fallback，且 Gemini API Key 在客户端直接使用。
    *   **建议**: **立即移除**代码中的硬编码 Key。Gemini 调用必须经过 Supabase Edge Function 代理，禁止在客户端直接暴露 AI 服务商 Key。

12. **Zod Schema 严格模式 (Strict Schema Validation)**
    *   **现状**: 目前仅校验了部分字段，Profile 更新逻辑中 `safeParse` 失败处理较宽容。
    *   **建议**: 在写入 Supabase 前强制执行严格的 Schema 校验，拒绝任何非法字段（如用户恶意篡改 `level` 或 `coins`）。

13. **内容安全策略 (Content Safety)**
    *   **现状**: 社区发帖未见敏感词过滤或内容审核逻辑。
    *   **建议**: 集成 Gemini 的 `safetySettings` 或 Supabase 触发器进行文本风控。

---

## 🧠 AI 工程化 (AI Engineering)

14. **Prompt 版本管理 (Prompt Engineering Lifecycle)**
    *   **现状**: System Instruction 硬编码在组件中，难以A/B测试或热更新。
    *   **建议**: 将 Prompts 移至远程配置（如 Supabase Remote Config 或专门的 Table），支持动态下发和版本回滚。

15. **流式响应稳定性 (Streaming Resilience)**
    *   **现状**: `useAIChat` 处理流式响应时，网络抖动可能导致 Markdown 截断渲染崩溃。
    *   **建议**: 引入流式解析器缓冲池（Stream Buffer），确保渲染给 `ReactMarkdown` 的始终是完整的 Token 块。

16. **Live API 降级策略 (Live API Fallback)**
    *   **现状**: 若 WebSocket 连接失败，用户卡在连接中状态。
    *   **建议**: 实现自动降级策略，当 Live API 不可用时，自动切换回传统的 STT (Whisper) -> LLM -> TTS 链路。

---

## 🔧 代码质量与规范 (Code Quality & DX)

17. **样式系统原子化 (Tailwind CVA)**
    *   **现状**: 组件中充斥着复杂的模板字符串拼接类名。
    *   **建议**: 引入 `cva` (Class Variance Authority) 管理组件变体，提升样式可读性。

18. **Explicit Any 清除计划 (No Implicit Any)**
    *   **现状**: `usePartnerQuery` 等文件中仍存在 `any` 类型转换。
    *   **建议**: 开启 TypeScript `noImplicitAny` 并设立 CI 卡点，定义完整的 DTO 类型。

19. **错误日志聚合优化 (Error Log Batching)**
    *   **现状**: `monitor.ts` 直接触发 insert，高频错误会轰炸数据库。
    *   **建议**: 实现日志队列，使用 `requestIdleCallback` 进行批量上报，并增加采样率控制。

20. **测试金字塔补全 (Testing Pyramid)**
    *   **现状**: 仅有 Utils 单元测试。
    *   **建议**: 引入 `React Testing Library` 为核心组件（如 `AudioPlayer`, `Timer`）编写组件测试，并为关键路径（登录->打卡）编写 E2E 测试 (Playwright)。

---

## 📅 实施计划 (Action Plan)

*   **Phase 1 (快速赢面)**: 1, 11, 17, 18 (解决安全隐患与代码脏乱)
*   **Phase 2 (性能攻坚)**: 2, 6, 7, 9 (提升运行流畅度)
*   **Phase 3 (架构升级)**: 3, 5, 14, 16 (为 v3.0 铺路)

*Last Updated: v2.8 Draft*
