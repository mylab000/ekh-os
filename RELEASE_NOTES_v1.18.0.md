# EKH OS v1.18.0 — Staff Drive Compact Preview

**Build ID:** `EKH-OS-SDCP-20260731-001`  
**Date:** 31 July 2026  
**Source:** v1.17.0 — Compact Workspace  
**Deployment:** Not verified

## Objective

Reduce Staff Drive scrolling while preserving the existing authenticated Supabase Storage controller.

## Scope completed

- Compact authenticated Staff Drive header.
- Split desktop workspace: file list and metadata inspector.
- Existing authorised staff selector and staff search preserved.
- Existing All, Recent, Shared and Archived filters preserved.
- Local search within the current returned file list.
- Sorting by modified date, filename or size.
- Total and visible result counts.
- Contained desktop file-list scrolling.
- Selecting a file opens the inspector rather than expanding an inline detail row.
- Download and archive/restore actions proxy the existing authenticated controller.
- Tablet and mobile inspector drawer.
- Full-screen inspector on narrow mobile.
- `/` focuses file search.
- `Esc` closes the inspector.
- Focus View integration.

## Inspector data

The inspector reads metadata already returned by the protected Storage request:

- status,
- modified time,
- size,
- inferred version,
- permission,
- handoff filename reference,
- Storage audit timestamp.

No second file database or public Storage URL is introduced.

## Security and data

- Existing Supabase authentication, RLS and Storage operations are preserved.
- No schema, bucket policy or RLS change.
- No operational project-status change.
- `project_progress_snapshot.json` remained byte-identical.

## Production status

No authorised live account, GitHub, Cloudflare or live-domain evidence was produced.

## Rollback

Replace v1.18.0 production-root files with the verified v1.17.0 package.
