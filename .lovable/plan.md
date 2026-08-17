# Blog System Rebuild — Implementation Plan

## What exists today

- `blog_posts` table with 17 columns (title, slug, content, excerpt, featured_image, category_id, tags, meta_title, meta_description, meta_keywords, og_image, status, published_at, author_id, timestamps) + `blog_categories`.
- Admin: `AdminBlog.tsx` (simple table), `AdminBlogEditor.tsx` (Tiptap-based `RichTextEditor.tsx`, 760 lines), `ImageUploader.tsx`, `blog-images` storage bucket (admin-only writes).
- AI already wired: edge functions `optimize-blog-content`, `generate-blog-from-file`, `auto-seo-blogs` via Lovable AI Gateway (no new keys needed).
- Frontend: `Blog.tsx` listing, `BlogPost.tsx` with Helmet meta + Article JSON-LD, DOMPurify sanitization in `src/lib/sanitize.ts`.
- SEO: `scripts/generate-sitemap.ts` (sitemap index + main/locations/blog children), `robots.txt`, page-view analytics in `page_views`.

Everything above is preserved and extended — no data loss, no rewrite of unrelated pages.

## Phase 1 — Database (additive migration only)

Add nullable columns to `blog_posts`: `scheduled_at`, `raw_imported_content`, `featured_image_alt`, `focus_keyword`, `secondary_keywords text[]`, `canonical_url`, `robots_index bool default true`, `robots_follow bool default true`, `og_title`, `og_description`, `twitter_title`, `twitter_description`, `twitter_image`, `reading_time int`, `old_slugs text[]`, `updated_by`, `archived_at`.

New tables (with GRANTs + RLS: public read where needed, admin write):
- `blog_redirects` (old_slug unique, new_slug, created_at) for 301s.
- `media_library` (path, url, alt, caption, width, height, size_bytes, mime, created_by).
- `blog_events` (post_id, type: view/cta_click/share/read_progress, value, created_at) for analytics.

`status` gains `scheduled` and `archived` values; existing `draft`/`published` rows untouched. A scheduled-publish job promotes `scheduled` → `published` when `scheduled_at` passes (cron edge function).

## Phase 2 — Admin blog manager

Rebuild `AdminBlog.tsx`: searchable/filterable table (status, author, category, tag, date range), sorting, pagination, bulk-free row actions — edit, live preview, publish/unpublish, schedule, duplicate, archive, delete. Confirm dialogs for delete and for slug changes on published posts (slug change writes a `blog_redirects` row automatically).

## Phase 3 — Editor

Extend the existing Tiptap editor rather than replacing it: H1–H4, inline marks, lists, quotes, code blocks with highlighting, tables, dividers, images (alt/caption/alignment), galleries, YouTube embeds, links, CTA buttons, download buttons, info/warning/tip/success callouts, FAQ block, related-content block, TOC, author box, custom-HTML block. Plus fullscreen mode, undo/redo, drag handles for block reordering, responsive preview toggle (desktop/tablet/mobile), Visual ↔ HTML mode switch, autosave every ~20s with "Last saved"/"Last updated" indicators. All content sanitized through an extended `sanitize.ts` allowlist (no scripts, no iframes except a vetted YouTube embed wrapper, no event handlers).

## Phase 4 — DOCX import

Add `mammoth` (single new dependency) for DOCX → HTML. Flow: validate type/size client and server side → convert → clean Word cruft (empty paragraphs, inline styles, `MsoNormal`) → extract embedded images, upload to `blog-images`, swap in permanent URLs → AI pass for structure + alt-text suggestions → editable preview with Original vs AI-Formatted comparison → save as **draft only**. Raw HTML stored in `raw_imported_content` so nothing is lost on failure.

## Phase 5 — AI assistant panel

One new edge function `blog-ai-assist` (Lovable AI Gateway, server-side key) with actions: format, readability, grammar, structure, titles, intro, conclusion, FAQs, CTA, internal links, external references, alt text, SEO metadata, social text, DOCX cleanup. Language selector: English / Hindi / Hinglish / Gujarati. Long posts are chunked at heading boundaries. Rewrites show before/after diff with Accept / Reject / Edit. Loading, error, retry states; per-user rate limit in the function.

## Phase 6 — SEO panel + metadata

In-editor real-time SEO analyser (client-side, deterministic checks, score /100): focus + secondary keywords, intent, title/meta lengths, slug, content length, keyword density with stuffing warning, heading hierarchy, duplicate/missing H1, readability, internal/external link counts, image alt coverage, featured image, FAQ, TOC, canonical, robots. Every metadata field is editable; AI only pre-fills.

`BlogPost.tsx` renders per-post title, description, canonical, robots, full OG + Twitter tags, `article:*` tags, and a single JSON-LD graph: BlogPosting + BreadcrumbList + Person (author) + FAQPage only when visible FAQs exist. No duplicate schema blocks, no fake ratings.

## Phase 7 — Frontend redesign

Listing: premium hero, search, featured article, category filters, cards (image, category badge, title, excerpt, author, date, reading time), load-more, empty/loading skeletons, responsive.

Post page: breadcrumbs, category, large title, subtitle, author, published/updated dates, reading time, featured image (priority, width/height), sticky collapsible TOC, refined article typography, styled tables/lists, responsive images with captions, share + copy-link buttons, prev/next, related posts, author profile, contact CTA, back-to-top. Accessible labels, keyboard support, visible focus, contrast — all using existing design tokens and branding.

## Phase 8 — Technical SEO

- Sitemap generator pulls published, indexable posts from the database (excludes draft/scheduled/archived/noindex) into `sitemap-blog.xml`; robots.txt already references it.
- New `public/rss.xml` generated in the same prebuild script.
- Redirect handling: `/blog/:slug` looks up `blog_redirects` on miss and 301-style redirects to the current slug.
- Lazy-loading, width/height on images, graceful missing-image and 404 handling, unique-slug enforcement at DB level.

## Phase 9 — Analytics + QA

Reuse the existing `page_views` tracking, add `blog_events` for CTA clicks, shares and reading progress; surface per-post views, top posts and referrers in an admin blog analytics panel. No new third-party service.

Then: manual create, real DOCX import, every block type, AI success/failure paths, metadata in rendered HTML, schema validation, draft→schedule→publish→unpublish→archive, slug redirects, sitemap/RSS, three viewports, admin authorization, sanitizer against unsafe input, TypeScript/build clean.

## Notes and constraints

- New dependency: `mammoth` only (DOCX parsing). Code highlighting reuses Tiptap's existing lowlight path.
- No new environment variables — AI uses the existing managed gateway key; email/Telegram secrets untouched.
- Admin routes keep the current server-side `user_roles` admin check.
- Honest limitation: this app is a client-rendered Vite SPA, so blog HTML is not in the initial server response. Google renders JS and will index it, but non-JS social crawlers see only the static head. Full server-rendered blog HTML would need SSR — the app can get that by upgrading to Lovable's latest template (type "/" in chat → "Migrate to TanStack Start"), see [what the upgrade gives you](https://lovable.dev/blog/building-apps-using-tanstack-start). Not required for this rebuild.
