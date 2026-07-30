# EKH OS v1.20.0 — Activity Focus Planner

**Build ID:** `EKH-OS-AFP-20260731-001`  
**Date:** 31 July 2026  
**Source:** v1.19.0 — Command Center Focus Deck  
**Deployment:** Not verified

## Objective

Reduce My Activities scrolling while separating embedded planning references from authenticated Supabase activity records.

## Scope completed

The My Activities page now uses four mutually exclusive workspace views:

- Week
- Month
- Agenda
- Live Queue

### Week

- Existing 27 July–2 August reference schedule preserved.
- Reference-data label added so it is not mistaken for live Supabase truth.
- A selected-day inspector replaces additional vertical detail.
- Day cards support keyboard selection.

### Month

- Existing month calendar and selected-date preview preserved.
- Calendar and date inspector use one contained split workspace.

### Agenda

- Existing seven-day agenda preserved.
- Agenda list uses contained desktop scrolling.

### Live Queue

- Mirrors the existing authenticated `supabaseActivityList`.
- Does not create a second activity database or Supabase query.
- Existing Complete, Snooze, Edit and Cancel actions are proxied to the original controller.
- Search, project, priority and status controls proxy the existing controller.
- Refresh and browser-alert controls use the existing runtime buttons.

### Live summary

The page mirrors the current controller values for:

- due today,
- overdue,
- upcoming,
- completed,
- authenticated owner,
- realtime state,
- last sync,
- browser permission,
- connection state.

### Interaction

- Sticky view tabs.
- Left, Right, Home and End keyboard tab navigation.
- `/` opens Live Queue search.
- Introduction can be collapsed.
- Last selected tab and introduction state are stored locally.
- Global Focus View remains supported.
- Mobile views use horizontal tabs and single-column workspaces.

## Data and security

- Existing owner-ID Supabase filtering is preserved.
- No schema, RLS or authentication change.
- No project-status change.
- `project_progress_snapshot.json` remained byte-identical.

## Production status

No authorised account, GitHub, Cloudflare or live-domain evidence was produced.

## Rollback

Replace v1.20.0 production-root files with the verified v1.19.0 package.
