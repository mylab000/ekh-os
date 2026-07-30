# EKH OS v1.11.0 — Mission Control Foundation

**Build ID:** `EKH-OS-MCF-20260730-001`  
**Date:** 30 July 2026  
**Source:** v1.10.1 — Readable Typography & Contrast  
**Deployment:** Not verified

## Scope completed

This controlled first phase changes the typography and visual foundation while preserving navigation, views, Supabase integration, Staff Drive and the operational snapshot.

### Typography

- Display: Space Grotesk
- Body: Source Sans 3
- Metadata: IBM Plex Mono
- Font selection removed from Appearance.
- Colour theme and Light/Dark mode retained.
- Navigation, cards, tables, drawers and Staff Drive text enlarged.

### Mission Control interaction

- Living operational canvas with a subtle grid and Aurora light.
- Stronger dark control-rail sidebar.
- Clearer active, hover and focus states.
- Sticky topbar and controlled card lift.
- Page entry motion and status pulse.
- Reduced-motion support.

### Stabilisation

- Added `404.html`, expected by the documented deployment workflow.
- Preserved `_headers`, `_redirects`, `ekh-os-config.js` and `project_progress_snapshot.json`.
- Operational snapshot SHA-256 unchanged.
- All inline JavaScript passed `node --check`.

## Not included

- No backend, schema, RLS or authentication change.
- No project-status change.
- No GitHub or Cloudflare deployment.
- No live-domain claim.

## Rollback

Restore the original v1.10.1 handoff production-root files. The original package remains included in the build directory.
