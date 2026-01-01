-- Migration: Add course_shares table for storing reflections and AI insights
-- Date: 2026-01-01

create table if not exists public.course_shares (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id text not null,
  share_content text, -- The user's reflection or transcribed text
  ai_insight text,    -- Xiao Fan's feedback
  source text default 'app', -- 'app', 'n8n', 'meeting'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id) -- One share per lesson per user
);

-- Add RLS policies (optional but recommended if using Supabase client directly)
alter table public.course_shares enable row level security;

create policy "Users can view their own shares"
  on public.course_shares for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own shares"
  on public.course_shares for all
  using (auth.uid() = user_id);
