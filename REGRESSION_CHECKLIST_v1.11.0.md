# EKH OS v1.11.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (14 scripts) | PASS | All passed `node --check`. |
| HTML structure and duplicate IDs | PASS | No duplicate DOM IDs. |
| Typography system | PASS | Three locked font roles configured. |
| Font selector removal | PASS | Colour and mode selectors preserved. |
| Operational snapshot integrity | PASS | SHA-256 unchanged. |
| Cloudflare SPA fallback | PASS | `404.html` added and `_redirects` preserved. |
| Responsive shell — desktop 1440x1000 | PASS | No horizontal overflow; `visual_qa/mission_control_desktop_1440x1000.png`. |
| Responsive shell — tablet 820x1180 | PASS | No horizontal overflow; `visual_qa/mission_control_tablet_820x1180.png`. |
| Responsive shell — mobile 390x844 | PASS | No horizontal overflow; `visual_qa/mission_control_mobile_390x844.png`. |
| Supabase authentication | BLOCKED | No authorised credentials used. |
| Staff Drive live read/write | BLOCKED | Requires authorised Supabase session and RLS evidence. |
| Turnstile | BLOCKED | Site key blank; challenge not exercised. |
| GitHub Actions deployment | BLOCKED | No workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Not deployed to `os.englishkidshub.com`. |