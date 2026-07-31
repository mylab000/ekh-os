# EKH OS v1.34.0 — Browser & Mobile Testing Dossier

**Build ID:** `EKH-OS-BMTD-20260731-001`  
**Date:** 31 July 2026  
**Source:** v1.33.0  

## Actual testing

Chromium 144 executed actual headless DOM tests.

- Seven responsive viewport profiles passed.
- Five touch-emulated profiles passed.
- Four authentication-gate profiles passed.
- Twelve interaction checks passed.
- No root horizontal overflow appeared.
- No uncaught page errors appeared.
- No critical clipping appeared.

## Tested viewports

- 1440×900
- 1280×800
- 1024×768
- 768×1024
- 430×932
- 390×844
- 360×800

## Tested interactions

- representative route navigation;
- mobile sidebar opening and closure;
- dropdown aria state;
- Control K command palette;
- dossier Previous and Next;
- touch-emulated dossier swiping;
- advisory perspective navigation;
- authentication-gate focus sequence.

## Honest limitations

- Firefox testing is blocked.
- WebKit testing is blocked.
- Physical Android testing is blocked.
- Physical iOS Safari testing is blocked.
- Authenticated owner-session testing is blocked.
- Deployed CDN delivery is blocked.

No screenshots were created.
No credentials were entered.
No production writes occurred.
