-- 1) สร้างตาราง todos ที่ผูกไว้กับระบบสมาชิกหลัก (auth.users)
create table if not exists public.todos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  completed boolean default false not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone default null
);

-- 2) เปิดใช้งานระบบความปลอดภัย Row Level Security (RLS)
alter table public.todos enable row level security;

-- 3) ตั้งกฎความปลอดภัย (Policies) เพื่อให้แต่ละคนเห็นเฉพาะข้อมูลของตัวเอง
drop policy if exists "Individuals can view their own todos" on public.todos;
create policy "Individuals can view their own todos" on public.todos
    for select using (auth.uid() = user_id);

drop policy if exists "Individuals can create their own todos" on public.todos;
create policy "Individuals can create their own todos" on public.todos
    for insert with check (auth.uid() = user_id);

drop policy if exists "Individuals can update their own todos" on public.todos;
create policy "Individuals can update their own todos" on public.todos
    for update using (auth.uid() = user_id);

drop policy if exists "Individuals can delete their own todos" on public.todos;
create policy "Individuals can delete their own todos" on public.todos
    for delete using (auth.uid() = user_id);
