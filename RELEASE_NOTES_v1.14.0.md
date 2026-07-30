# EKH OS v1.14.0 — Mia Workflow Console

**Build ID:** `EKH-OS-MWF-20260730-001`  
**Date:** 30 July 2026  
**Source:** v1.13.0 — Portfolio Workbench  
**Deployment:** Not verified

## Scope completed

The Mia Queue landing page is now an interactive controlled-publication workflow console.

### Workflow stages

- Inbox
- Review
- Decision
- Published
- Returned

### New interactions

- Save local queue records from Structured Intake.
- Search and filter records by workflow stage.
- Inspect one selected report at a time.
- Validate required fields and evidence completeness.
- Record owner approval locally.
- Record Kyo validation locally.
- Record Git commit, deployment and rollback references.
- Move records through controlled stages.
- Return a report with a required reason.
- Restore returned reports to Inbox.
- Delete local queue records.
- Reflect local counts in navigation and Owner Decisions.

### Production safeguard

Workflow records use browser local storage only. This release does not update Supabase, GitHub, Cloudflare or the published operational snapshot.

A local record can enter Published only when all local gates pass. That status still represents a local workflow record, not verified production evidence.

## Preserved

- Authentication and Supabase configuration.
- Existing Structured Intake validation.
- Staff Drive.
- Command Center.
- Portfolio Workbench.
- Project Progress Snapshot.
- `_headers`, `_redirects` and `404.html`.

## Rollback

Replace the v1.14.0 production-root files with the verified v1.13.0 package.
