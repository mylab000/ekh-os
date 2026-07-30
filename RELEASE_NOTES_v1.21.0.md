# EKH OS v1.21.0 — System Control Workspace

**Build ID:** `EKH-OS-SCW-20260731-001`  
**Date:** 31 July 2026  
**Source:** v1.20.0 — Activity Focus Planner  
**Deployment:** Not verified

## Objective

Combine system administration, audit, reporting and configuration into one compact control workspace without deleting the existing controllers.

## Scope completed

The System group now centres on one workspace with four mutually exclusive views:

- Overview
- Audit
- Reports
- Settings

### Overview

- Known service and verification-state board.
- Supabase marked configured but dependent on an authorised live session.
- GitHub and Cloudflare marked unverified.
- Browser preferences identified as device-scoped.
- Direct routes to Task Calendar, Decision Rooms, Staff Drive and My Activities.
- Collapsible production verification gate.

### Audit

- Existing Activity & Audit layout moved into the System Control Workspace.
- Existing event stream and integrity inspector retained.
- Timeline uses contained desktop scrolling.
- No second audit data source was created.

### Reports

- Existing four report templates retained.
- Existing intelligence chart and executive signals retained.
- Internal Report Library and Executive Signals tabs prevent one long report page.

### Settings

- Existing implemented settings sections retained:
  - Appearance
  - Notifications
  - Activity Data
- Existing IDs and Supabase activity controls remain available.
- Internal settings disclosure shows one configuration group at a time.
- Decorative unimplemented settings categories are no longer presented as active controls.

### Route compatibility

The original sidebar routes remain:

- Activity & Audit
- Reports
- Settings

Those routes now open the relevant System Control tab. Legacy route sections remain as lightweight aliases so existing navigation calls do not lose their destination.

### Interaction

- Sticky system tabs.
- Left, Right, Home and End keyboard navigation.
- Last selected system, report and settings tabs are stored locally.
- Introduction can be collapsed.
- Global Focus View remains supported.
- Mobile tabs use horizontal navigation.

## Data and security

- No Supabase schema, RLS, bucket or authentication change.
- Existing settings and activity IDs are preserved.
- No project-status change.
- `project_progress_snapshot.json` remained byte-identical.

## Production status

No authorised account, GitHub workflow, Cloudflare deployment or live-domain evidence was produced.

## Rollback

Replace v1.21.0 production-root files with the verified v1.20.0 package.
