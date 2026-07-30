# EKH OS v1.14.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (17 scripts) | PASS | Every inline script passed `node --check`. |
| Duplicate DOM IDs | PASS | No duplicate IDs detected. |
| Five-stage workflow console | PASS | Inbox, Review, Decision, Published and Returned are present. |
| Structured Intake integration | PASS | Local queue save action added without removing payload validation. |
| Required-field gate | PASS | Review and Decision transitions are blocked when required fields are missing. |
| Owner and Kyo gates | PASS | Both are required before a local Published record. |
| Release-proof gate | PASS | Commit, deployment and rollback references are required. |
| Return reason | PASS | Returning a report requires a recorded reason. |
| Local-only safeguard | PASS | UI and controller state that production systems remain unchanged. |
| Operational snapshot integrity | PASS | SHA-256 matches the original handoff. |
| Runtime/deployment files | PASS | Config, headers, redirects and SPA fallback are present. |
| Live Supabase queue persistence | BLOCKED | This phase intentionally uses browser local storage only. |
| GitHub Actions deployment | BLOCKED | No repository write or workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Build has not been deployed to `os.englishkidshub.com`. |
| Authorised owner/Kyo approval | BLOCKED | No authenticated human approval evidence was supplied. |
