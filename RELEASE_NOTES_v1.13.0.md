# EKH OS v1.13.0 — Portfolio Workbench

**Build ID:** `EKH-OS-PW-20260730-001`  
**Date:** 30 July 2026  
**Source:** v1.12.0 — Interactive Command Center  
**Deployment:** Not verified

## Scope completed

The Projects page is now a page-specific Modular Workbench rather than a long portfolio page.

### New portfolio experience

- Compact portfolio metrics.
- Search by project, code, owner or team.
- Status filters: All, Active, Review, Hold and Completed.
- One selected project record at a time.
- Summary, Dependencies and Evidence inspector tabs.
- Operations Map with controlled dependency stages.
- Existing full evidence drawer remains connected.
- Direct routes to COO Progress Board and Kanban.
- Snapshot export remains connected to the packaged JSON.
- New icons use inline SVG rather than emoji.

### Control principles

- Existing project status and progress values were not altered.
- Visual progress remains an operational aid and is not technical approval.
- The original 14 project records remain the evidence source.
- No Supabase schema, authentication, RLS or operational snapshot change was made.

## Validation completed

- All inline JavaScript passed `node --check`.
- 14 project records were parsed successfully.
- Status distribution remained 4 Active, 1 Review, 3 Hold and 6 Completed.
- Smart Adventure remained at 64% visual progress.
- No duplicate DOM IDs were detected.
- Desktop, tablet and mobile responsive rules are present.

## Validation limitation

Chromium navigation to local HTML and localhost was blocked by the execution environment with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore, no browser screenshot or live interaction claim is included in this release.

## Not verified

- Authorised Supabase authentication
- Staff Drive live operations
- Browser runtime on a deployed environment
- GitHub Actions
- Cloudflare Pages
- Live domain `os.englishkidshub.com`
