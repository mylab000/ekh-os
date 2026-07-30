# EKH OS v1.20.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (23 scripts) | PASS | Every inline script passed `node --check`. |
| Duplicate DOM IDs | PASS | No duplicate IDs detected. |
| Four-view activity planner | PASS | Week, Month, Agenda and Live Queue are mutually disclosed. |
| Existing month and agenda IDs | PASS | Current v1.9 rendering hooks remain present. |
| Existing Supabase activity IDs | PASS | Current controller inputs, stats and list remain present. |
| Reference/live distinction | PASS | Embedded week, month and agenda are explicitly labelled reference data. |
| Live queue mirror | PASS | Mirrors the existing authenticated list without a second query. |
| Activity action proxy | PASS | Complete, Snooze, Edit and Cancel use the existing controller. |
| Search and filter proxy | PASS | Status, search, project and priority controls use existing inputs. |
| Connection and metrics mirror | PASS | Existing runtime values are observed and reflected. |
| Keyboard navigation | PASS | Tab arrows, Home, End and `/` search are implemented. |
| Inline SVG navigation | PASS | Newly rebuilt activity controls use SVG rather than text arrows. |
| Global Focus View | PASS | Activity introduction and metrics are suppressed in compact mode. |
| Operational snapshot integrity | PASS | SHA-256 unchanged from v1.19.0. |
| Authorised Supabase activity session | BLOCKED | No approved account credentials were used. |
| Realtime update verification | BLOCKED | Requires a live authenticated session. |
| Activity action verification | BLOCKED | Requires live owner records and database write evidence. |
| GitHub Actions deployment | BLOCKED | No repository write or workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Not deployed to `os.englishkidshub.com`. |
