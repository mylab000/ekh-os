# EKH OS v1.16.0 — Interactive Team Network

**Build ID:** `EKH-OS-ITN-20260731-001`  
**Date:** 31 July 2026  
**Source:** v1.15.0 — Secure Access Portal  
**Deployment:** Not verified

## Scope completed

The Organisation overview has been rebuilt as an interactive team network.

### New organisation experience

- Mission Control hero and organisation summary.
- Interactive CEO → COO → directorate leadership map.
- Clickable leadership nodes using the existing member drawer.
- Department and People view modes.
- Search by name, role, responsibility or department.
- Department filter rail.
- Department cards with lead, member count and avatar stack.
- Deduplicated people directory derived from the existing department pages.
- Cross-functional labels for people listed in multiple functions.
- Direct navigation to all ten existing department pages.
- Responsive desktop, tablet and mobile layouts.
- Inline SVG controls without emoji arrows.

### Data approach

The new directory does not introduce a second staff database. It reads the existing ten department pages embedded in the current EKH OS build and derives:

- department records,
- member records,
- roles,
- responsibilities,
- cross-functional membership.

Existing reporting lines, department pages and member drawer remain available.

## Production status

No GitHub, Cloudflare or live-domain evidence was produced. The operational snapshot was not changed.

## Rollback

Replace the v1.16.0 production-root files with the verified v1.15.0 package.
