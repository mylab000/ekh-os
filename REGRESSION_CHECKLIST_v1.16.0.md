# EKH OS v1.16.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (19 scripts) | PASS | Every inline script passed `node --check`. |
| Duplicate DOM IDs | PASS | No duplicate IDs detected. |
| Leadership map | PASS | CEO, COO and six directorate nodes are interactive. |
| Department mode | PASS | Ten existing department pages are represented. |
| People mode | PASS | Directory is derived and deduplicated from embedded member records. |
| Search and department filters | PASS | Name, role, responsibility and department fields are indexed. |
| Existing member drawer | PASS | Reused without removing existing department-page behaviour. |
| Inline SVG icons | PASS | New organisation interface contains no emoji arrows. |
| Responsive rules | PASS | Desktop, tablet and narrow-mobile layouts are defined. |
| Operational snapshot integrity | PASS | SHA-256 unchanged from v1.15.0. |
| Authorised Supabase session | BLOCKED | No approved account credentials were used. |
| GitHub Actions deployment | BLOCKED | No repository write or workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Not deployed to `os.englishkidshub.com`. |
