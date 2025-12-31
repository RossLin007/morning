
# 凡人晨读 (Morning Reader) - 技术重构与开发指南

> **版本目标**: v3.0 (觉醒版) - 开启实时多模态交互新纪元。
> **当前状态**: v3.0.0 (觉醒版 - 启动) 正在集成 Gemini Live API。
> **优先级说明**: P0 (高危/阻断), P1 (性能/体验), P2 (维护性/规范).

---

## 🟢 v2.3 技术债清理 (已归档)

*   ✅ **状态管理**: 全面迁移至 React Query (`usePartner`, `useCommunity`).
*   ✅ **性能优化**: 长列表虚拟化 (`Virtuoso`) 与图片加载策略。
*   ✅ **离线支持**: PWA Service Worker 策略完善。
*   ✅ **代码规范**: TypeScript 类型收束与 Zod 表单验证。

---

## 🔵 v3.0 P0: 核心体验觉醒 (Awakening Core)

### 1. AI 实时语音教练 (Gemini Live Integration)
*   🔄 **状态**: 进行中。
*   **目标**: 利用 `gemini-2.5-flash-native-audio-preview` 模型，实现低延迟、可打断的双向语音通话。
*   **技术点**: 
    *   WebSocket 连接管理 (`useLiveAI` Hook).
    *   PCM 音频流的实时编码与解码 (Web Audio API).
    *   沉浸式通话 UI (Visualizer).

### 2. 多人实时语音共修 (Multi-user Audio)
*   📅 **状态**: 规划中。
*   **目标**: 模拟线下读书会，支持举手发言。
*   **技术点**: 评估 Supabase Realtime vs Agora/LiveKit 方案。

---

## 🔵 v3.0 P1: 商业化闭环 (Monetization)

### 3. 真实支付接入 (Stripe/WeChat)
*   📅 **状态**: 待办。
*   **目标**: 替换 Mock 支付，实现订阅制自动续费。

### 4. 会员权益系统 (Entitlements)
*   📅 **状态**: 待办。
*   **目标**: 细化 PRO 会员权益（如 AI 通话时长限制、高级统计报表）。

---

## 🔵 v3.0 P2: 多端同步增强 (Sync)

### 5. 离线操作队列 (Offline Mutation Queue)
*   📅 **状态**: 待办。
*   **目标**: 确保断网期间的点赞、笔记操作在重连后自动提交。

---
*Last Updated: v3.0 Kickoff*
