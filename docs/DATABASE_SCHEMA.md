# 凡人晨读 (Morning Reader) - 数据库架构文档

**版本:** v1.1 (Full Schema)
**日期:** 2025-12-30
**状态:** 建议实施

本指南包含了支持当前 BFF 架构所需的 Supabase (PostgreSQL) 数据库全量表结构。

---

## 1. 核心表 (Core)

### `public.profiles`
```sql
create table public.profiles (
  id uuid primary key,
  name text,
  avatar text,
  bio text,
  level int default 1,
  xp int default 0,
  coins int default 50,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### `public.error_logs` (新增：修复 500 错误)
```sql
create table public.error_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  message text,
  stack text,
  context text,
  url text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 2. 社区系统 (Community)

### `public.posts`, `public.post_likes`, `public.comments`
```sql
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  image_url text,
  likes_count int default 0,
  comments_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.post_likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(post_id, user_id)
);

create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 3. 游戏化与任务 (Gamification)

### `public.user_tasks` (新增)
```sql
create table public.user_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  task_id text not null,
  status text default 'todo',
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### `public.user_achievements` (新增)
```sql
create table public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id text not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);
```

### `public.user_checkins` (新增)
```sql
create table public.user_checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  checkin_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, checkin_date)
);
```

---

## 4. 社交与进度 (Social & Progress)

### `public.relationships`, `public.relation_logs`, `public.user_progress`
```sql
create table public.relationships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  partner_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('buddy', 'mentor', 'mentee')) not null,
  tree_level int default 0,
  relation_days int default 1,
  sync_rate int default 0,
  last_interaction timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.relation_logs (
  id uuid default gen_random_uuid() primary key,
  relationship_id uuid references public.relationships(id) on delete cascade not null,
  actor_id uuid references public.profiles(id) not null,
  type text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id text not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);
```

---

## 5. AI 聊天 (AI Chat)

### `public.chat_sessions`, `public.chat_messages`
```sql
create table public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default '新对话',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text check (role in ('user', 'model')) not null,
  content text not null,
  sources jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```