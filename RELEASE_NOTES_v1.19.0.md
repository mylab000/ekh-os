# EKH OS v1.19.0 — Command Center Focus Deck

**Build ID:** `EKH-OS-CCFD-20260731-001`  
**Date:** 31 July 2026  
**Source:** v1.18.0 — Staff Drive Compact Preview  
**Deployment:** Not verified

## Objective

Reduce Command Center vertical scrolling by showing one operational purpose at a time.

## Scope completed

The previous continuous Command Center has been reorganised into five sticky workspace tabs:

- Briefing
- Decisions
- Critical Path
- Projects
- Activity

### Briefing

- Current attention strip.
- Four operational KPI cards.
- Today’s Focus.
- Quick Actions.

### Decisions

- Existing Decision Desk.
- Compact decision operating rule.
- Direct access to Owner Decisions and Decision Rooms.

### Critical Path

- Existing Reo → Jeff → Blanc evidence sequence.
- Dedicated full-height workspace rather than a lower page section.

### Projects

- Existing six-project Project Pulse.
- Existing status filters and evidence-drawer interactions.
- Contained desktop project scrolling.

### Activity

- Existing upcoming authenticated activity stream.
- Direct controls for Activity Calendar, Supabase Activities and Add Activity.

### Interaction

- Sticky tab navigation.
- Keyboard tab navigation using Left, Right, Home and End.
- Last selected tab stored locally.
- Command Center introduction can be collapsed independently.
- Existing global Focus View integration is preserved.
- Mobile tabs use horizontal navigation.

## Preserved

- Quick Command palette.
- Supabase activity IDs and private-record loading.
- Project status data and project evidence actions.
- Owner-decision and critical-path destination pages.
- Staff Drive, Organisation, Mia Queue and Projects workspaces.
- Authentication, security and deployment files.

## Data integrity

`project_progress_snapshot.json` remained byte-identical.

## Production status

No authorised live session, GitHub, Cloudflare or live-domain evidence was produced.

## Rollback

Replace v1.19.0 production-root files with the verified v1.18.0 package.
