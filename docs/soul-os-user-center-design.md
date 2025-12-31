# Soul OS 用户中心设计讨论

> **讨论日期**: 2024-12-31  
> **版本**: v1.0  
> **状态**: 讨论稿

---

## 1. Soul OS 愿景

**Soul OS** 是灵魂意识的产物，为人类构建灵魂觉醒而助力，服务人类**全生命周期**。

### 核心理念

- 将用户散落在各处的行为、思想、习惯，整合成一面"灵魂之镜"
- 让用户看见真实的自己，并引导他走向觉醒
- 从碎片到整体，从无意识到觉醒

### 产品矩阵

| 站点 | 定位 | 核心问题 |
|------|------|---------|
| **Morning** | 心智培养，习惯养成 | "我每天在成为什么样的人？" |
| **Note** | 思想记录，知识沉淀 | "我在想什么？我知道什么？" |
| **Tools** | 效率提升，行动支持 | "我在做什么？" |
| **用户中心** | 自我画像，洞察反馈 | "这些碎片如何拼成完整的我？" |

---

## 2. 架构设计

### 2.1 整体架构

```
                    ┌─────────────────────┐
                    │     客户端 Apps      │
                    │  Morning Note Tools │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌─────────────────┐    ┌───────────────┐
│  SSO 认证服务  │    │  用户中心服务    │    │  各站点 API   │
│ sso.55387.xyz │◄───│ (User Center)   │───►│  业务数据     │
└───────────────┘    └─────────────────┘    └───────────────┘
        │                      │
        ▼                      ▼
┌───────────────┐    ┌─────────────────┐
│  认证数据库    │    │  用户资料数据库  │
│ (accounts)    │    │  (profiles)     │
└───────────────┘    └─────────────────┘
```

### 2.2 职责划分

| 服务 | 职责 | 不负责 |
|------|------|--------|
| **SSO** | 认证、登录、Token、MFA | 用户资料、偏好设置 |
| **用户中心** | 用户资料、偏好、隐私设置 | 登录认证 |
| **各站点** | 业务数据（笔记、学习进度等） | 通用用户信息 |

---

## 3. 何时需要统一用户中心？

### 明确需要的场景

1. **跨站点共享用户资料** - 头像、昵称在所有站点同步
2. **统一用户管理后台** - 一处封禁，全站生效
3. **跨站点社交功能** - 好友/关注系统跨站点
4. **统一订阅/会员体系** - VIP 权益全站通用
5. **数据合规要求** - GDPR 一键导出/注销

### 当前阶段建议

**暂时不需要**，但要确保：
- 所有站点使用 SSO 返回的 `user_id` 作为用户标识
- 各站点的 `user_profiles` 表结构保持一致

---

## 4. Person 数据模型设计

### 4.1 参考 schema.org/Person

采用 schema.org/Person 作为基础框架，在此基础上扩展：

- ✅ 遵循 schema.org 命名约定
- ✅ 参考属性分类结构
- ⚠️ 扩展"内在自我"维度
- ⚠️ 增加"时间维度"（过去/现在/未来）
- ⚠️ 增加"行为数据"聚合

### 4.2 Soul Person 模型

```typescript
interface SoulPerson {
  // 基础身份 (schema.org)
  identity: {
    name: string;
    nickname: string[];
    avatar: string;
    pronouns: string;
  };

  // 人口信息 (schema.org)
  demographics: {
    birthDate: Date;
    gender: string;
    nationality: string;
    languages: string[];
  };

  // 社会身份 (schema.org)
  socialIdentity: {
    occupation: Occupation;
    organization: Organization;
    education: Education[];
    skills: string[];
  };

  // 🆕 内在自我 (Soul OS 扩展)
  innerSelf: {
    values: Value[];           // 核心价值观
    personality: PersonalityTraits;
    strengths: string[];
    interests: Interest[];
  };

  // 🆕 人生叙事 (Soul OS 扩展)
  lifeNarrative: {
    past: { achievements: [], lessons: [] };
    present: { roles: [], challenges: [] };
    future: { vision: string, goals: Goal[] };
  };

  // 🆕 行为数据 (各站点聚合)
  behaviorData: {
    readingHabits: {};  // from Morning
    writingHabits: {};  // from Note
  };

  // 🆕 自我反思
  reflections: {
    journalEntries: [];
    insights: [];       // AI 洞察
  };
}
```

---

## 5. 全生命周期服务

### 5.1 人生阶段与服务

| 人生阶段 | 核心需求 | Soul OS 服务 |
|---------|---------|-------------|
| **童年** | 习惯培养、学习启蒙 | 成长记录、亲子互动 |
| **青年** | 知识积累、自我探索 | Morning、Note |
| **壮年** | 效率提升、事业发展 | Tools、Goals |
| **中年** | 家庭平衡、人生反思 | 关系管理、生命回顾 |
| **老年** | 智慧沉淀、价值传承 | 回忆录、知识遗产 |

### 5.2 技术考量

- **数据持久性** → 几十年的数据存储策略
- **隐私至上** → 用户完全拥有数据
- **跨时代兼容** → 技术更迭时数据不丢失
- **可继承性** → 用户离世后数据处理

---

## 6. 下一步计划

### 阶段 1：基础设施（当前）
- [ ] 完善 SSO 认证服务
- [ ] 各站点统一使用 SSO user_id

### 阶段 2：用户中心 MVP
- [ ] 设计用户中心 API
- [ ] 实现基础资料管理
- [ ] 发布客户端 SDK

### 阶段 3：数据整合
- [ ] 各站点接入用户中心
- [ ] 行为数据聚合
- [ ] AI 洞察生成

---

## 附录：API 设计预览

```yaml
# 用户资料
GET    /api/v1/users/me
PUT    /api/v1/users/me
POST   /api/v1/users/me/avatar

# 用户偏好
GET    /api/v1/users/me/preferences
PUT    /api/v1/users/me/preferences

# 扩展属性
GET    /api/v1/users/me/attributes/:namespace
PUT    /api/v1/users/me/attributes/:namespace/:key

# 用户关系
GET    /api/v1/users/me/following
POST   /api/v1/users/:userId/follow

# 账号管理
POST   /api/v1/users/me/export
DELETE /api/v1/users/me
```
