# EKH OS v1.21.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (24 scripts) | PASS | Every inline script passed `node --check`. |
| Duplicate DOM IDs | PASS | No duplicate IDs detected. |
| Four-view System workspace | PASS | Overview, Audit, Reports and Settings are mutually disclosed. |
| Existing audit surface | PASS | Event stream and integrity inspector remain present. |
| Existing report surface | PASS | Report cards, chart and executive signals remain present. |
| Existing settings IDs | PASS | Notification, owner, realtime, cloud totals and export controls remain present. |
| Legacy route compatibility | PASS | Activity, Reports and Settings routes redirect to the relevant System tab. |
| Report progressive disclosure | PASS | Library and Executive Signals are separate internal views. |
| Settings progressive disclosure | PASS | Appearance, Notifications and Activity Data are separate internal views. |
| Keyboard navigation | PASS | Left, Right, Home and End are implemented. |
| Focus View integration | PASS | System introduction and metrics are suppressed in compact mode. |
| Operational snapshot integrity | PASS | SHA-256 unchanged from v1.20.0. |
| Authorised Supabase settings session | BLOCKED | No approved account credentials were used. |
| Live audit verification | BLOCKED | Existing audit page contains static interface data and was not connected to a live evidence source in this build. |
| Report generation verification | BLOCKED | Report actions were not executed against a production service. |
| GitHub Actions deployment | BLOCKED | No repository write or workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Not deployed to `os.englishkidshub.com`. |
