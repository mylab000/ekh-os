# EKH OS v1.17.0 — Compact Workspace

**Build ID:** `EKH-OS-CWS-20260731-001`  
**Date:** 31 July 2026  
**Source:** v1.16.0 — Interactive Team Network  
**Deployment:** Not verified

## Objective

Reduce excessive vertical scrolling without deleting operational information.

## Scope completed

### Global Focus View

A persistent Focus control has been added to the topbar.

Focus View suppresses introduction-heavy and secondary sections while preserving the primary work area:

- Command Center introduction is hidden.
- Projects hero and summary metrics are hidden.
- Mia hero, summary metrics, governance strip and safeguard note are hidden.
- Organisation hero, summary metrics and governance notes are hidden.
- Project, Mia and Organisation work areas receive larger viewport-relative working space.
- Long rails and inspectors use contained scrolling on desktop.

Preference is stored locally under `ekh_compact_workspace_v117`.

Keyboard shortcut:

- Windows: `Ctrl + Shift + F`
- macOS: `Command + Shift + F`

### Organisation progressive disclosure

The Organisation overview now uses three sticky workspace tabs:

- Leadership
- Departments
- People

Only the selected primary information set is shown. Department and People content no longer sit below the full leadership map in one continuous page.

Additional behaviour:

- Introduction can be collapsed independently.
- Organisation KPI cards now navigate to the relevant tab.
- The cross-functional KPI opens the People directory with a focused filter.
- Existing department pages and member drawer remain available.
- Mobile tabs use horizontal navigation rather than a long vertical stack.

## Data and security

- No Supabase schema or authentication change.
- No operational project-status change.
- `project_progress_snapshot.json` remained byte-identical.
- Existing deployment and security files were preserved.

## Production status

No GitHub, Cloudflare or live-domain evidence was produced.

## Rollback

Replace v1.17.0 production-root files with the verified v1.16.0 package.
