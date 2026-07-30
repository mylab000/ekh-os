# EKH OS v1.19.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (22 scripts) | PASS | Every inline script passed `node --check`. |
| Duplicate DOM IDs | PASS | No duplicate IDs detected. |
| Five-tab Command Center | PASS | Briefing, Decisions, Critical Path, Projects and Activity are present. |
| Progressive disclosure | PASS | Only one Command Center panel is visible at a time. |
| Keyboard tab navigation | PASS | Left, Right, Home and End are implemented. |
| Tab persistence | PASS | Last selected tab is stored in local browser storage. |
| Hero collapse | PASS | Introduction can be collapsed independently. |
| Today’s Focus IDs | PASS | Existing Supabase activity bindings remain present. |
| Project Pulse IDs | PASS | Existing project filter and evidence interactions remain present. |
| Quick Command palette | PASS | Existing palette markup and controller remain present. |
| Global Focus View | PASS | Command Center deck is integrated with v1.17 compact mode. |
| Operational snapshot integrity | PASS | SHA-256 unchanged from v1.18.0. |
| Authorised Supabase activity session | BLOCKED | No approved account credentials were used. |
| Live project drawer test | BLOCKED | Browser runtime was not executed with production data. |
| GitHub Actions deployment | BLOCKED | No repository write or workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Not deployed to `os.englishkidshub.com`. |
