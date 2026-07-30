# EKH OS v1.12.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax | PASS | All 15 inline scripts passed `node --check`. |
| Command Center replacement | PASS | New `mc112-command` view is present and remains the active default view. |
| Supabase dashboard bindings | PASS | Existing activity IDs, queue IDs, progress ring and attention-strip IDs were preserved. |
| Command palette structure | PASS | 12 commands configured; Ctrl/Cmd + K bridge added. |
| Project Pulse filters | PASS | Filters present: all, in-progress, review, blocked. |
| Project Pulse records | PASS | 6 verified snapshot cards: {'review': 1, 'in-progress': 4, 'blocked': 1}. |
| Project evidence drawer bridge | PASS | Command Center cards locate and click the existing `data-v190-project` record. |
| Inline SVG actions | PASS | New Command Center controls do not depend on emoji rendering. |
| Responsive CSS | PASS | Desktop, tablet and mobile breakpoints are defined. |
| Operational snapshot integrity | PASS | `project_progress_snapshot.json` SHA-256 remained unchanged. |
| Duplicate DOM IDs | PASS | No duplicate IDs detected. |
| Authentication and RLS | BLOCKED | No authorised Supabase credentials were used. |
| Browser visual simulation | BLOCKED | Chromium navigation is restricted by the current execution environment; no browser screenshot claim is made. |
| GitHub Actions deployment | BLOCKED | No repository write or workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Build has not been deployed to `os.englishkidshub.com`. |
