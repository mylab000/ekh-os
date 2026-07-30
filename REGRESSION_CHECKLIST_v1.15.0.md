# EKH OS v1.15.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (18 scripts) | PASS | Every inline script passed `node --check`. |
| Duplicate DOM IDs | PASS | No duplicate IDs detected. |
| Existing authentication IDs | PASS | All IDs required by the current Supabase controller remain present. |
| Password visibility | PASS | Accessible toggle added without changing the password field ID. |
| Caps Lock warning | PASS | Uses `KeyboardEvent.getModifierState`. |
| Device connection indicator | PASS | Reads public injected/local configuration only. |
| iPhone safe area | PASS | Safe-area insets included. |
| Inline SVG icons | PASS | New login interface contains no emoji icons. |
| Operational snapshot integrity | PASS | SHA-256 unchanged from v1.14.0. |
| Chromium login preview — desktop 1440x1000 | BLOCKED | Browser execution was blocked. |
| Chromium login preview — mobile 390x844 | BLOCKED | Browser execution was blocked. |
| Authorised Supabase sign-in | BLOCKED | No approved account credentials were used. |
| Role and RLS verification | BLOCKED | Requires an authorised session and live database evidence. |
| Cloudflare Turnstile | BLOCKED | No configured live sitekey/challenge evidence. |
| GitHub Actions deployment | BLOCKED | No repository write or workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Not deployed to `os.englishkidshub.com`. |