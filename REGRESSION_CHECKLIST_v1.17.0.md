# EKH OS v1.17.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (20 scripts) | PASS | Every inline script passed `node --check`. |
| Duplicate DOM IDs | PASS | No duplicate IDs detected. |
| Global Focus View | PASS | Topbar control, local persistence and keyboard shortcut are present. |
| Command Center compact rule | PASS | Introduction is suppressed in Focus View. |
| Projects compact rule | PASS | Hero and metrics are suppressed; split workspace is expanded. |
| Mia compact rule | PASS | Secondary panels are suppressed; queue and inspector remain. |
| Organisation sticky tabs | PASS | Leadership, Departments and People are mutually disclosed. |
| Organisation hero collapse | PASS | Independent local preference is present. |
| KPI navigation | PASS | Four organisation metrics open relevant information sets. |
| Existing department pages | PASS | All ten pages remain in the build. |
| Responsive rules | PASS | Desktop, tablet, mobile and narrow-mobile layouts are defined. |
| Operational snapshot integrity | PASS | SHA-256 unchanged from v1.16.0. |
| Authorised Supabase session | BLOCKED | No approved account credentials were used. |
| GitHub Actions deployment | BLOCKED | No repository write or workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Not deployed to `os.englishkidshub.com`. |
