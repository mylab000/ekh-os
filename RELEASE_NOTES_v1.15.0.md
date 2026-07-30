# EKH OS v1.15.0 — Secure Access Portal

**Build ID:** `EKH-OS-SAP-20260730-001`  
**Date:** 30 July 2026  
**Source:** v1.14.0 — Mia Workflow Console  
**Deployment:** Not verified

## Scope completed

The login page has been rebuilt to match the EKH Mission Control design language.

### New login experience

- Dark operational briefing panel.
- Identity → Role → Workspace validation sequence.
- Clearer secure-access hierarchy.
- Larger readable labels, fields, messages and controls.
- Public Supabase connection status.
- Password visibility control.
- Caps Lock warning.
- Local device clock.
- First-device configuration redesigned without changing its IDs.
- Safe-area support for iPhone.
- Responsive desktop, tablet and mobile layouts.
- Reduced-motion support.
- Inline SVG interface icons; no emoji icons.

### Authentication compatibility

The following existing authentication IDs remain unchanged:

- `ekhLoginForm`
- `ekhLoginEmail`
- `ekhLoginPassword`
- `ekhTurnstile`
- `ekhLoginMessage`
- `ekhLoginSubmit`
- `ekhForgotPassword`
- `ekhClearSession`
- `ekhAccessDeniedState`
- `ekhSystemSetup`
- `ekhConfigUrl`
- `ekhConfigKey`
- `ekhConfigTurnstile`
- `ekhSaveConfig`

Supabase authentication, role validation, session expiry and Staff Drive logic were not replaced.

## Production status

No GitHub, Cloudflare or live-domain evidence was produced. This build must not be described as deployed or production-approved.

## Rollback

Replace the v1.15.0 production-root files with the verified v1.14.0 package.
