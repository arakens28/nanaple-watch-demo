-- 助成金ナビ DBスキーマ
-- Supabase SQL Editor で実行してください

-- ユーザーごとの申請案件
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  company_name text,
  created_at timestamptz default now(),
  current_step int default 1 -- 1〜6
);

-- 各ステップの状態
create table if not exists step_statuses (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  step_number int not null, -- 1〜6
  status text default 'todo', -- todo / in_progress / done
  completed_at timestamptz,
  notes text,
  updated_at timestamptz default now(),
  unique (application_id, step_number)
);

-- 受講記録（ステップ3用）
create table if not exists training_records (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  training_date date,
  hours numeric(4,1),
  memo text,
  created_at timestamptz default now()
);

-- 書類アップロード
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  step_number int,
  file_name text,
  storage_path text,
  uploaded_at timestamptz default now()
);

-- ============================================================
-- RLS（Row Level Security）: ユーザーごとにデータを分離
-- ============================================================

alter table applications enable row level security;
alter table step_statuses enable row level security;
alter table training_records enable row level security;
alter table documents enable row level security;

-- applications: 本人のみ全操作可
create policy "own applications" on applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 子テーブル: 親 application の所有者のみ操作可
create policy "own step_statuses" on step_statuses
  for all using (
    exists (
      select 1 from applications a
      where a.id = step_statuses.application_id and a.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from applications a
      where a.id = step_statuses.application_id and a.user_id = auth.uid()
    )
  );

create policy "own training_records" on training_records
  for all using (
    exists (
      select 1 from applications a
      where a.id = training_records.application_id and a.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from applications a
      where a.id = training_records.application_id and a.user_id = auth.uid()
    )
  );

create policy "own documents" on documents
  for all using (
    exists (
      select 1 from applications a
      where a.id = documents.application_id and a.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from applications a
      where a.id = documents.application_id and a.user_id = auth.uid()
    )
  );

-- ============================================================
-- Storage: 受講履歴等のアップロード用バケット
-- ============================================================

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- パスの先頭フォルダ = 自分の user_id のみ操作可
create policy "own files read" on storage.objects
  for select using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "own files insert" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "own files delete" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
