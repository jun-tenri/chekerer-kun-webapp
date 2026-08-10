-- チケラーくんが行く！ Supabaseスキーマ(実装用・最終形)
-- db_schema_design.md の設計変遷を、実装しやすいよう1本のCREATE TABLE群にまとめたもの。
-- Supabaseのダッシュボード > SQL Editor にそのまま貼り付けて実行できます。

create extension if not exists "uuid-ossp";

-- =========================================
-- ENUM型
-- =========================================
create type reward_confidence as enum ('confirmed','estimated','unknown');
create type source_type as enum ('company_site','instagram');
create type review_status as enum ('pending','resolved');
create type resolution_source as enum ('manual_text','screenshot_ocr');
create type instagram_check_method as enum ('manual','automated');
create type notify_channel as enum ('push','line','email');
create type report_target_type as enum ('question','answer','review','reply');
create type report_status as enum ('pending','reviewed');

-- =========================================
-- 企業
-- =========================================
create table companies (
    id uuid primary key default uuid_generate_v4(),
    name varchar(200) not null,
    official_site_url text,
    instagram_handle varchar(100),
    monitors_official_site boolean default false,
    monitors_instagram boolean default false,
    instagram_check_method instagram_check_method default 'manual',
    japanese_support boolean default false,
    has_referral_program boolean default false,
    referral_bonus_amount numeric,
    created_at timestamp not null default now()
);

-- =========================================
-- 治験
-- =========================================
create table trials (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid references companies(id),
    title_ja text not null,
    status varchar(20) not null default '募集中',
    target_text varchar(200),
    location_text varchar(200),
    japanese_support_text varchar(100),

    -- 報酬
    reward_amount_min numeric,
    reward_amount_max numeric,
    reward_currency varchar(3) default 'USD',
    reward_confidence reward_confidence not null default 'unknown',

    -- 期間
    hospitalization_start date,
    hospitalization_end date,
    outpatient_visits int,
    duration_text varchar(100),
    washout_period_days int,

    -- 出典・取得
    source_type source_type,
    source_url text,
    source_post_url text,
    fetched_at timestamp not null default now(),

    -- AI要約・公開制御
    ai_summary_ja text,
    ai_model_version varchar(50),
    needs_review boolean not null default false,
    is_published boolean not null default false,

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);
create index idx_trials_published on trials(is_published) where is_published = true;
create index idx_trials_company on trials(company_id);

-- =========================================
-- ユーザー(簡易ログイン)
-- =========================================
create table users (
    id uuid primary key default uuid_generate_v4(),
    email varchar(255) unique not null,
    name varchar(100) not null default '',
    nickname varchar(50) not null default '',
    line_user_id varchar(100),
    created_at timestamp not null default now()
);
create unique index idx_users_line_user_id on users(line_user_id) where line_user_id is not null;

-- =========================================
-- 参加履歴・休薬期間
-- =========================================
create table user_participations (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    trial_id uuid references trials(id),
    trial_name_manual text,
    company_name varchar(200) not null,
    start_date date not null,
    end_date date not null,
    reward_amount numeric,
    reward_currency varchar(3) default 'USD',
    washout_period_days int,
    notes text,
    created_at timestamp not null default now()
);
create index idx_participations_user on user_participations(user_id, end_date desc);

-- =========================================
-- 通知設定
-- =========================================
create table notification_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    channel notify_channel not null default 'line',
    target_company_ids uuid[],
    min_reward_amount numeric,
    notify_new_trial boolean not null default true,
    notify_washout_reminder boolean not null default false,
    washout_reminder_days_before int not null default 3,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

-- =========================================
-- 運営レビュー(LINE Bot連携)
-- =========================================
create table review_tasks (
    id uuid primary key default uuid_generate_v4(),
    trial_id uuid references trials(id) on delete cascade,
    missing_fields text[] not null,
    status review_status not null default 'pending',
    notified_at timestamp not null default now(),
    resolved_at timestamp,
    resolution_source resolution_source,
    resolved_value jsonb
);

create table line_review_sessions (
    id uuid primary key default uuid_generate_v4(),
    line_user_id varchar(100) not null,
    active_review_task_id uuid references review_tasks(id),
    expires_at timestamp not null
);

-- =========================================
-- データ取得バッチ履歴
-- =========================================
create table data_sync_log (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid references companies(id),
    source_type source_type,
    started_at timestamp not null,
    completed_at timestamp,
    records_fetched int,
    records_created int,
    records_updated int,
    status varchar(20)
);

-- =========================================
-- チケラー掲示板: Q&A
-- =========================================
create table qa_questions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    company_id uuid references companies(id),
    title varchar(200) not null,
    body text not null,
    is_hidden boolean not null default false,
    created_at timestamp not null default now()
);

create table qa_answers (
    id uuid primary key default uuid_generate_v4(),
    question_id uuid references qa_questions(id) on delete cascade,
    user_id uuid references users(id) on delete cascade,
    body text not null,
    is_hidden boolean not null default false,
    created_at timestamp not null default now()
);

-- =========================================
-- チケラー掲示板: 企業レビュー
-- =========================================
create table company_reviews (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    company_id uuid references companies(id),
    rating_response int check (rating_response between 1 and 5),
    rating_payment_speed int check (rating_payment_speed between 1 and 5),
    rating_facility int check (rating_facility between 1 and 5),
    rating_clarity int check (rating_clarity between 1 and 5),
    comment text,
    helpful_count int not null default 0,
    is_hidden boolean not null default false,
    created_at timestamp not null default now()
);

create table review_replies (
    id uuid primary key default uuid_generate_v4(),
    review_id uuid references company_reviews(id) on delete cascade,
    user_id uuid references users(id) on delete cascade,
    body text not null,
    is_hidden boolean not null default false,
    created_at timestamp not null default now()
);

create table content_votes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    review_id uuid references company_reviews(id) on delete cascade,
    created_at timestamp not null default now(),
    unique (user_id, review_id)
);

create table content_reports (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    target_type report_target_type not null,
    target_id uuid not null,
    reason text,
    status report_status not null default 'pending',
    created_at timestamp not null default now()
);

-- =========================================
-- 初期データ: 4社
-- =========================================
insert into companies (name, official_site_url, instagram_handle, monitors_official_site, monitors_instagram, instagram_check_method, japanese_support, has_referral_program, referral_bonus_amount) values
('Altasciences LA', 'https://jp.altasciencesla.com', 'altasciencesla_jp', true, true, 'manual', true, true, 1000),
('CenExcel CNS', null, 'cns_japan', false, true, 'manual', true, false, null),
('Parexel', 'https://www.parexel.com/trials/locations/los-angeles-jp', null, true, false, 'manual', true, false, null),
('UK治験', 'https://chikenglobal.com', null, true, true, 'manual', true, false, null);
