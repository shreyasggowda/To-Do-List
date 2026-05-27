-- FocusFlow multi-user schema
-- Run this in the Supabase SQL editor before using the deployed app.

create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  completed boolean not null default false,
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date date,
  tags text[] not null default '{}',
  order_index integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_user_id_order_index_idx on public.tasks (user_id, order_index);

alter table public.tasks enable row level security;

create policy "Users can view their own tasks"
on public.tasks
for select
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can insert their own tasks"
on public.tasks
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can update their own tasks"
on public.tasks
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can delete their own tasks"
on public.tasks
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;

create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();
