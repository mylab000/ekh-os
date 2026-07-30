# EKH OS v1.13.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (16 scripts) | PASS | All passed `node --check`. |
| Project source records | PASS | 14 existing evidence records parsed. |
| Status distribution | PASS | 4 Active, 1 Review, 3 Hold and 6 Completed. |
| Smart Adventure record | PASS | Remains at 64% visual progress. |
| Search and status-filter implementation | PASS | Handlers and project index renderer present. |
| Summary, Dependencies and Evidence tabs | PASS | Inspector renderer and tab handlers present. |
| Existing evidence drawer integration | PASS | New inspector triggers the preserved v1.12 evidence card. |
| Operational snapshot integrity | PASS | SHA-256 unchanged. |
| Command Center v1.12.0 | PASS | Existing Interactive Command Center preserved. |
| Responsive CSS | PASS | Desktop, tablet and mobile breakpoints present. |
| Duplicate DOM IDs | PASS | None detected. |
| Chromium visual/runtime simulation | BLOCKED | Local navigation blocked by administrator policy. |
| Supabase authentication | BLOCKED | No authorised credentials used. |
| GitHub Actions deployment | BLOCKED | No workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live domain smoke test | BLOCKED | Build not deployed to `os.englishkidshub.com`. |