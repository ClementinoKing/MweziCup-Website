create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  create type public.blog_post_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.media_type as enum ('image', 'video', 'document');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.message_status as enum ('new', 'read', 'replied');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscriber_status as enum ('active', 'unsubscribed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.admin_role as enum ('super_admin', 'editor', 'viewer');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.admin_status as enum ('active', 'invited', 'disabled');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.section_visibility as enum ('visible', 'hidden');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.website_section_type as enum ('hero', 'product', 'education', 'cta', 'faq', 'support');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.activity_kind as enum ('publish', 'draft', 'message', 'media', 'user', 'update');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.invitation_status as enum ('pending', 'sent', 'accepted', 'revoked', 'expired');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_blog_post_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;

  if tg_op = 'UPDATE' and new.status <> 'published' and old.status = 'published' and new.published_at is null then
    new.published_at = old.published_at;
  end if;

  return new;
end;
$$;

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_key text not null unique default 'default',
  website_name text not null,
  logo_url text not null,
  favicon_url text not null,
  contact_email citext not null,
  phone_number text not null,
  whatsapp_number text not null,
  facebook_link text not null,
  instagram_link text not null,
  tiktok_link text not null,
  seo_title text not null,
  seo_description text not null,
  footer_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.homepage_contents (
  id uuid primary key default gen_random_uuid(),
  site_key text not null unique default 'default',
  hero_title text not null,
  hero_subtitle text not null,
  cta_button_text text not null,
  hero_background_image_url text not null,
  product_image_url text not null,
  is_active boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz
);

create table if not exists public.homepage_marquee_words (
  id uuid primary key default gen_random_uuid(),
  homepage_content_id uuid not null references public.homepage_contents(id) on delete cascade,
  word text not null,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homepage_marquee_words_sort_order_check check (sort_order > 0)
);

create table if not exists public.homepage_feature_blocks (
  id uuid primary key default gen_random_uuid(),
  homepage_content_id uuid not null references public.homepage_contents(id) on delete cascade,
  title text not null,
  description text not null,
  icon text not null,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homepage_feature_blocks_sort_order_check check (sort_order > 0)
);

create table if not exists public.homepage_cta_sections (
  id uuid primary key default gen_random_uuid(),
  homepage_content_id uuid not null references public.homepage_contents(id) on delete cascade,
  title text not null,
  description text not null,
  button_text text not null,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homepage_cta_sections_sort_order_check check (sort_order > 0)
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'default',
  title text not null,
  slug text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  featured_image_url text not null,
  status public.blog_post_status not null default 'draft',
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  seo_title text not null,
  seo_description text not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  constraint blog_posts_published_requires_timestamp check (
    status <> 'published' or published_at is not null
  )
);

create table if not exists public.blog_post_tags (
  id uuid primary key default gen_random_uuid(),
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag text not null,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_post_tags_sort_order_check check (sort_order > 0)
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'default',
  name text not null,
  url text not null,
  storage_bucket text,
  storage_path text,
  type public.media_type not null,
  size_label text not null,
  size_bytes bigint,
  dimensions_label text not null,
  alt_text text not null,
  mime_type text,
  uploaded_by uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'default',
  name text not null,
  email citext not null,
  phone text not null,
  subject text not null,
  message text not null,
  status public.message_status not null default 'new',
  received_at timestamptz not null default now(),
  read_at timestamptz,
  replied_at timestamptz,
  replied_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'default',
  name text not null,
  email citext not null,
  status public.subscriber_status not null default 'active',
  subscription_date timestamptz not null default now(),
  unsubscribed_at timestamptz,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint newsletter_subscribers_unsubscribed_timestamp check (
    status <> 'unsubscribed' or unsubscribed_at is not null
  )
);

create table if not exists public.website_sections (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'default',
  title text not null,
  description text not null,
  sort_order smallint not null,
  visibility public.section_visibility not null default 'visible',
  type public.website_section_type not null default 'product',
  product_name text not null,
  product_description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  constraint website_sections_sort_order_check check (sort_order > 0)
);

create table if not exists public.website_section_benefits (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.website_sections(id) on delete cascade,
  value text not null,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint website_section_benefits_sort_order_check check (sort_order > 0)
);

create table if not exists public.website_section_usage_instructions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.website_sections(id) on delete cascade,
  value text not null,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint website_section_usage_instructions_sort_order_check check (sort_order > 0)
);

create table if not exists public.website_section_feature_highlights (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.website_sections(id) on delete cascade,
  value text not null,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint website_section_feature_highlights_sort_order_check check (sort_order > 0)
);

create table if not exists public.website_section_faq_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.website_sections(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint website_section_faq_items_sort_order_check check (sort_order > 0)
);

create table if not exists public.website_section_product_images (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.website_sections(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint website_section_product_images_sort_order_check check (sort_order > 0)
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'default',
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  email citext not null,
  role public.admin_role not null default 'viewer',
  status public.admin_status not null default 'invited',
  last_login_at timestamptz,
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint admin_users_user_id_unique unique (user_id),
  constraint admin_users_site_email_unique unique (site_key, email)
);

create table if not exists public.admin_invitations (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'default',
  email citext not null,
  role public.admin_role not null default 'viewer',
  status public.invitation_status not null default 'pending',
  invite_token uuid not null unique default gen_random_uuid(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  sent_at timestamptz,
  accepted_at timestamptz,
  accepted_user_id uuid references auth.users(id) on delete set null,
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint admin_invitations_site_email_unique unique (site_key, email)
);

create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'default',
  kind public.activity_kind not null,
  title text not null,
  description text not null,
  entity_type text,
  entity_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin_user(target_site_key text default 'default')
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and site_key = target_site_key
      and status = 'active'
      and deleted_at is null
  );
$$;

create or replace function public.is_super_admin(target_site_key text default 'default')
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and site_key = target_site_key
      and role = 'super_admin'
      and status = 'active'
      and deleted_at is null
  );
$$;

create index if not exists blog_posts_site_key_idx on public.blog_posts (site_key);
create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_category_idx on public.blog_posts (category);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create unique index if not exists blog_posts_site_slug_unique on public.blog_posts (site_key, lower(slug));

create index if not exists blog_post_tags_blog_post_id_idx on public.blog_post_tags (blog_post_id);
create unique index if not exists blog_post_tags_post_sort_unique on public.blog_post_tags (blog_post_id, sort_order);

create index if not exists media_items_site_key_idx on public.media_items (site_key);
create index if not exists media_items_type_idx on public.media_items (type);
create index if not exists media_items_uploaded_at_idx on public.media_items (created_at desc);

create index if not exists contact_messages_site_key_idx on public.contact_messages (site_key);
create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_received_at_idx on public.contact_messages (received_at desc);

create index if not exists newsletter_subscribers_site_key_idx on public.newsletter_subscribers (site_key);
create index if not exists newsletter_subscribers_status_idx on public.newsletter_subscribers (status);
create index if not exists newsletter_subscribers_subscription_date_idx on public.newsletter_subscribers (subscription_date desc);

create index if not exists website_sections_site_key_idx on public.website_sections (site_key);
create index if not exists website_sections_visibility_idx on public.website_sections (visibility);
create index if not exists website_sections_type_idx on public.website_sections (type);
create unique index if not exists website_sections_site_order_unique on public.website_sections (site_key, sort_order) where deleted_at is null;

create index if not exists website_section_benefits_section_idx on public.website_section_benefits (section_id);
create unique index if not exists website_section_benefits_unique on public.website_section_benefits (section_id, sort_order);

create index if not exists website_section_usage_instructions_section_idx on public.website_section_usage_instructions (section_id);
create unique index if not exists website_section_usage_instructions_unique on public.website_section_usage_instructions (section_id, sort_order);

create index if not exists website_section_feature_highlights_section_idx on public.website_section_feature_highlights (section_id);
create unique index if not exists website_section_feature_highlights_unique on public.website_section_feature_highlights (section_id, sort_order);

create index if not exists website_section_faq_items_section_idx on public.website_section_faq_items (section_id);
create unique index if not exists website_section_faq_items_unique on public.website_section_faq_items (section_id, sort_order);

create index if not exists website_section_product_images_section_idx on public.website_section_product_images (section_id);
create unique index if not exists website_section_product_images_unique on public.website_section_product_images (section_id, sort_order);

create index if not exists homepage_contents_site_key_idx on public.homepage_contents (site_key);
create unique index if not exists homepage_contents_single_active_unique on public.homepage_contents (site_key) where is_active and deleted_at is null;

create index if not exists homepage_marquee_words_homepage_idx on public.homepage_marquee_words (homepage_content_id);
create unique index if not exists homepage_marquee_words_unique on public.homepage_marquee_words (homepage_content_id, sort_order);

create index if not exists homepage_feature_blocks_homepage_idx on public.homepage_feature_blocks (homepage_content_id);
create unique index if not exists homepage_feature_blocks_unique on public.homepage_feature_blocks (homepage_content_id, sort_order);

create index if not exists homepage_cta_sections_homepage_idx on public.homepage_cta_sections (homepage_content_id);
create unique index if not exists homepage_cta_sections_unique on public.homepage_cta_sections (homepage_content_id, sort_order);

create index if not exists admin_users_site_key_idx on public.admin_users (site_key);
create index if not exists admin_users_role_idx on public.admin_users (role);
create index if not exists admin_users_status_idx on public.admin_users (status);

create index if not exists admin_invitations_site_key_idx on public.admin_invitations (site_key);
create index if not exists admin_invitations_status_idx on public.admin_invitations (status);
create index if not exists admin_activity_log_site_key_idx on public.admin_activity_log (site_key);
create index if not exists admin_activity_log_kind_idx on public.admin_activity_log (kind);
create index if not exists admin_activity_log_created_at_idx on public.admin_activity_log (created_at desc);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_contents_updated_at on public.homepage_contents;
create trigger set_homepage_contents_updated_at
before update on public.homepage_contents
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_marquee_words_updated_at on public.homepage_marquee_words;
create trigger set_homepage_marquee_words_updated_at
before update on public.homepage_marquee_words
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_feature_blocks_updated_at on public.homepage_feature_blocks;
create trigger set_homepage_feature_blocks_updated_at
before update on public.homepage_feature_blocks
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_cta_sections_updated_at on public.homepage_cta_sections;
create trigger set_homepage_cta_sections_updated_at
before update on public.homepage_cta_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_blog_posts_published_at on public.blog_posts;
create trigger set_blog_posts_published_at
before insert or update on public.blog_posts
for each row execute function public.set_blog_post_published_at();

drop trigger if exists set_blog_post_tags_updated_at on public.blog_post_tags;
create trigger set_blog_post_tags_updated_at
before update on public.blog_post_tags
for each row execute function public.set_updated_at();

drop trigger if exists set_media_items_updated_at on public.media_items;
create trigger set_media_items_updated_at
before update on public.media_items
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

drop trigger if exists set_newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger set_newsletter_subscribers_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

drop trigger if exists set_website_sections_updated_at on public.website_sections;
create trigger set_website_sections_updated_at
before update on public.website_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_website_section_benefits_updated_at on public.website_section_benefits;
create trigger set_website_section_benefits_updated_at
before update on public.website_section_benefits
for each row execute function public.set_updated_at();

drop trigger if exists set_website_section_usage_instructions_updated_at on public.website_section_usage_instructions;
create trigger set_website_section_usage_instructions_updated_at
before update on public.website_section_usage_instructions
for each row execute function public.set_updated_at();

drop trigger if exists set_website_section_feature_highlights_updated_at on public.website_section_feature_highlights;
create trigger set_website_section_feature_highlights_updated_at
before update on public.website_section_feature_highlights
for each row execute function public.set_updated_at();

drop trigger if exists set_website_section_faq_items_updated_at on public.website_section_faq_items;
create trigger set_website_section_faq_items_updated_at
before update on public.website_section_faq_items
for each row execute function public.set_updated_at();

drop trigger if exists set_website_section_product_images_updated_at on public.website_section_product_images;
create trigger set_website_section_product_images_updated_at
before update on public.website_section_product_images
for each row execute function public.set_updated_at();

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

drop trigger if exists set_admin_invitations_updated_at on public.admin_invitations;
create trigger set_admin_invitations_updated_at
before update on public.admin_invitations
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.homepage_contents enable row level security;
alter table public.homepage_marquee_words enable row level security;
alter table public.homepage_feature_blocks enable row level security;
alter table public.homepage_cta_sections enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.media_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.website_sections enable row level security;
alter table public.website_section_benefits enable row level security;
alter table public.website_section_usage_instructions enable row level security;
alter table public.website_section_feature_highlights enable row level security;
alter table public.website_section_faq_items enable row level security;
alter table public.website_section_product_images enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_invitations enable row level security;
alter table public.admin_activity_log enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
on public.site_settings
for select
to anon, authenticated
using (site_key = 'default');

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
on public.site_settings
for all
to authenticated
using (is_admin_user(site_key))
with check (is_admin_user(site_key));

drop policy if exists "Public read active homepage content" on public.homepage_contents;
create policy "Public read active homepage content"
on public.homepage_contents
for select
to anon, authenticated
using (site_key = 'default' and is_active and deleted_at is null);

drop policy if exists "Admins manage homepage content" on public.homepage_contents;
create policy "Admins manage homepage content"
on public.homepage_contents
for all
to authenticated
using (is_admin_user(site_key))
with check (is_admin_user(site_key));

drop policy if exists "Public read homepage marquee words" on public.homepage_marquee_words;
create policy "Public read homepage marquee words"
on public.homepage_marquee_words
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.homepage_contents hc
    where hc.id = homepage_content_id
      and hc.site_key = 'default'
      and hc.is_active
      and hc.deleted_at is null
  )
);

drop policy if exists "Admins manage homepage marquee words" on public.homepage_marquee_words;
create policy "Admins manage homepage marquee words"
on public.homepage_marquee_words
for all
to authenticated
using (
  exists (
    select 1
    from public.homepage_contents hc
    where hc.id = homepage_content_id
      and is_admin_user(hc.site_key)
  )
)
with check (
  exists (
    select 1
    from public.homepage_contents hc
    where hc.id = homepage_content_id
      and is_admin_user(hc.site_key)
  )
);

drop policy if exists "Public read homepage feature blocks" on public.homepage_feature_blocks;
create policy "Public read homepage feature blocks"
on public.homepage_feature_blocks
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.homepage_contents hc
    where hc.id = homepage_content_id
      and hc.site_key = 'default'
      and hc.is_active
      and hc.deleted_at is null
  )
);

drop policy if exists "Admins manage homepage feature blocks" on public.homepage_feature_blocks;
create policy "Admins manage homepage feature blocks"
on public.homepage_feature_blocks
for all
to authenticated
using (
  exists (
    select 1
    from public.homepage_contents hc
    where hc.id = homepage_content_id
      and is_admin_user(hc.site_key)
  )
)
with check (
  exists (
    select 1
    from public.homepage_contents hc
    where hc.id = homepage_content_id
      and is_admin_user(hc.site_key)
  )
);

drop policy if exists "Public read homepage CTA sections" on public.homepage_cta_sections;
create policy "Public read homepage CTA sections"
on public.homepage_cta_sections
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.homepage_contents hc
    where hc.id = homepage_content_id
      and hc.site_key = 'default'
      and hc.is_active
      and hc.deleted_at is null
  )
);

drop policy if exists "Admins manage homepage CTA sections" on public.homepage_cta_sections;
create policy "Admins manage homepage CTA sections"
on public.homepage_cta_sections
for all
to authenticated
using (
  exists (
    select 1
    from public.homepage_contents hc
    where hc.id = homepage_content_id
      and is_admin_user(hc.site_key)
  )
)
with check (
  exists (
    select 1
    from public.homepage_contents hc
    where hc.id = homepage_content_id
      and is_admin_user(hc.site_key)
  )
);

drop policy if exists "Public read published blog posts" on public.blog_posts;
create policy "Public read published blog posts"
on public.blog_posts
for select
to anon, authenticated
using (site_key = 'default' and status = 'published' and deleted_at is null);

drop policy if exists "Admins manage blog posts" on public.blog_posts;
create policy "Admins manage blog posts"
on public.blog_posts
for all
to authenticated
using (is_admin_user(site_key))
with check (is_admin_user(site_key));

drop policy if exists "Public read blog post tags" on public.blog_post_tags;
create policy "Public read blog post tags"
on public.blog_post_tags
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.blog_posts bp
    where bp.id = blog_post_id
      and bp.site_key = 'default'
      and bp.status = 'published'
      and bp.deleted_at is null
  )
);

drop policy if exists "Admins manage blog post tags" on public.blog_post_tags;
create policy "Admins manage blog post tags"
on public.blog_post_tags
for all
to authenticated
using (
  exists (
    select 1
    from public.blog_posts bp
    where bp.id = blog_post_id
      and is_admin_user(bp.site_key)
  )
)
with check (
  exists (
    select 1
    from public.blog_posts bp
    where bp.id = blog_post_id
      and is_admin_user(bp.site_key)
  )
);

drop policy if exists "Admin-only media select" on public.media_items;
create policy "Admin-only media select"
on public.media_items
for select
to authenticated
using (is_admin_user(site_key) and deleted_at is null);

drop policy if exists "Admins manage media" on public.media_items;
create policy "Admins manage media"
on public.media_items
for all
to authenticated
using (is_admin_user(site_key))
with check (is_admin_user(site_key));

drop policy if exists "Public create contact messages" on public.contact_messages;
create policy "Public create contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (site_key = 'default');

drop policy if exists "Admins read contact messages" on public.contact_messages;
create policy "Admins read contact messages"
on public.contact_messages
for select
to authenticated
using (is_admin_user(site_key) and deleted_at is null);

drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages"
on public.contact_messages
for all
to authenticated
using (is_admin_user(site_key))
with check (is_admin_user(site_key));

drop policy if exists "Public create newsletter subscribers" on public.newsletter_subscribers;
create policy "Public create newsletter subscribers"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (site_key = 'default');

drop policy if exists "Admins read newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins read newsletter subscribers"
on public.newsletter_subscribers
for select
to authenticated
using (is_admin_user(site_key) and deleted_at is null);

drop policy if exists "Admins manage newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins manage newsletter subscribers"
on public.newsletter_subscribers
for all
to authenticated
using (is_admin_user(site_key))
with check (is_admin_user(site_key));

drop policy if exists "Public read visible website sections" on public.website_sections;
create policy "Public read visible website sections"
on public.website_sections
for select
to anon, authenticated
using (site_key = 'default' and visibility = 'visible' and deleted_at is null);

drop policy if exists "Admins manage website sections" on public.website_sections;
create policy "Admins manage website sections"
on public.website_sections
for all
to authenticated
using (is_admin_user(site_key))
with check (is_admin_user(site_key));

drop policy if exists "Public read website section benefits" on public.website_section_benefits;
create policy "Public read website section benefits"
on public.website_section_benefits
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and ws.site_key = 'default'
      and ws.visibility = 'visible'
      and ws.deleted_at is null
  )
);

drop policy if exists "Admins manage website section benefits" on public.website_section_benefits;
create policy "Admins manage website section benefits"
on public.website_section_benefits
for all
to authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
)
with check (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
);

drop policy if exists "Public read website section usage instructions" on public.website_section_usage_instructions;
create policy "Public read website section usage instructions"
on public.website_section_usage_instructions
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and ws.site_key = 'default'
      and ws.visibility = 'visible'
      and ws.deleted_at is null
  )
);

drop policy if exists "Admins manage website section usage instructions" on public.website_section_usage_instructions;
create policy "Admins manage website section usage instructions"
on public.website_section_usage_instructions
for all
to authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
)
with check (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
);

drop policy if exists "Public read website section feature highlights" on public.website_section_feature_highlights;
create policy "Public read website section feature highlights"
on public.website_section_feature_highlights
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and ws.site_key = 'default'
      and ws.visibility = 'visible'
      and ws.deleted_at is null
  )
);

drop policy if exists "Admins manage website section feature highlights" on public.website_section_feature_highlights;
create policy "Admins manage website section feature highlights"
on public.website_section_feature_highlights
for all
to authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
)
with check (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
);

drop policy if exists "Public read website section FAQ items" on public.website_section_faq_items;
create policy "Public read website section FAQ items"
on public.website_section_faq_items
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and ws.site_key = 'default'
      and ws.visibility = 'visible'
      and ws.deleted_at is null
  )
);

drop policy if exists "Admins manage website section FAQ items" on public.website_section_faq_items;
create policy "Admins manage website section FAQ items"
on public.website_section_faq_items
for all
to authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
)
with check (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
);

drop policy if exists "Public read website section product images" on public.website_section_product_images;
create policy "Public read website section product images"
on public.website_section_product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and ws.site_key = 'default'
      and ws.visibility = 'visible'
      and ws.deleted_at is null
  )
);

drop policy if exists "Admins manage website section product images" on public.website_section_product_images;
create policy "Admins manage website section product images"
on public.website_section_product_images
for all
to authenticated
using (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
)
with check (
  exists (
    select 1
    from public.website_sections ws
    where ws.id = section_id
      and is_admin_user(ws.site_key)
  )
);

drop policy if exists "Admins read admin users" on public.admin_users;
create policy "Admins read admin users"
on public.admin_users
for select
to authenticated
using (site_key = 'default' and deleted_at is null and (user_id = auth.uid() or is_admin_user(site_key)));

drop policy if exists "Super admins manage admin users" on public.admin_users;
create policy "Super admins manage admin users"
on public.admin_users
for all
to authenticated
using (is_super_admin(site_key))
with check (is_super_admin(site_key));

drop policy if exists "Admins read admin invitations" on public.admin_invitations;
create policy "Admins read admin invitations"
on public.admin_invitations
for select
to authenticated
using (is_admin_user(site_key) and deleted_at is null);

drop policy if exists "Super admins manage admin invitations" on public.admin_invitations;
create policy "Super admins manage admin invitations"
on public.admin_invitations
for all
to authenticated
using (is_super_admin(site_key))
with check (is_super_admin(site_key));

drop policy if exists "Admins read activity log" on public.admin_activity_log;
create policy "Admins read activity log"
on public.admin_activity_log
for select
to authenticated
using (is_admin_user(site_key));

drop policy if exists "Admins create activity log" on public.admin_activity_log;
create policy "Admins create activity log"
on public.admin_activity_log
for insert
to authenticated
with check (is_admin_user(site_key));

create or replace view public.blog_posts_v as
select
  bp.id,
  bp.site_key,
  bp.title,
  bp.slug,
  bp.excerpt,
  bp.content,
  bp.category,
  bp.featured_image_url,
  bp.status,
  bp.author_id,
  bp.author_name,
  bp.seo_title,
  bp.seo_description,
  bp.published_at,
  bp.created_at,
  bp.updated_at,
  bp.created_by,
  bp.updated_by,
  bp.deleted_at,
  coalesce(
    (
      select array_agg(tag.tag order by tag.sort_order)
      from public.blog_post_tags tag
      where tag.blog_post_id = bp.id
    ),
    '{}'::text[]
  ) as tags
from public.blog_posts bp
where bp.deleted_at is null;

create or replace view public.homepage_contents_v as
select
  hc.id,
  hc.site_key,
  hc.hero_title,
  hc.hero_subtitle,
  hc.cta_button_text,
  hc.hero_background_image_url,
  hc.product_image_url,
  hc.is_active,
  hc.published_at,
  hc.created_at,
  hc.updated_at,
  hc.created_by,
  hc.updated_by,
  coalesce(
    (
      select array_agg(word.word order by word.sort_order)
      from public.homepage_marquee_words word
      where word.homepage_content_id = hc.id
    ),
    '{}'::text[]
  ) as marquee_words,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', block.id,
          'title', block.title,
          'description', block.description,
          'icon', block.icon
        )
        order by block.sort_order
      )
      from public.homepage_feature_blocks block
      where block.homepage_content_id = hc.id
    ),
    '[]'::jsonb
  ) as feature_blocks,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', cta.id,
          'title', cta.title,
          'description', cta.description,
          'buttonText', cta.button_text
        )
        order by cta.sort_order
      )
      from public.homepage_cta_sections cta
      where cta.homepage_content_id = hc.id
    ),
    '[]'::jsonb
  ) as cta_sections
from public.homepage_contents hc
where hc.deleted_at is null;

create or replace view public.website_sections_v as
select
  ws.id,
  ws.site_key,
  ws.title,
  ws.description,
  ws.sort_order,
  ws.visibility,
  ws.type,
  ws.product_name,
  ws.product_description,
  ws.created_at,
  ws.updated_at,
  ws.created_by,
  ws.updated_by,
  ws.deleted_at,
  coalesce(
    (
      select array_agg(item.value order by item.sort_order)
      from public.website_section_benefits item
      where item.section_id = ws.id
    ),
    '{}'::text[]
  ) as benefits,
  coalesce(
    (
      select array_agg(item.value order by item.sort_order)
      from public.website_section_usage_instructions item
      where item.section_id = ws.id
    ),
    '{}'::text[]
  ) as usage_instructions,
  coalesce(
    (
      select array_agg(item.value order by item.sort_order)
      from public.website_section_feature_highlights item
      where item.section_id = ws.id
    ),
    '{}'::text[]
  ) as feature_highlights,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'question', item.question,
          'answer', item.answer
        )
        order by item.sort_order
      )
      from public.website_section_faq_items item
      where item.section_id = ws.id
    ),
    '[]'::jsonb
  ) as faq_items,
  coalesce(
    (
      select array_agg(item.url order by item.sort_order)
      from public.website_section_product_images item
      where item.section_id = ws.id
    ),
    '{}'::text[]
  ) as product_images
from public.website_sections ws
where ws.deleted_at is null;
