# EKH OS v1.18.0 — Regression Checklist

| Function | Status | Evidence / limitation |
|---|---|---|
| Inline JavaScript syntax (21 scripts) | PASS | Every inline script passed `node --check`. |
| Duplicate DOM IDs | PASS | No duplicate IDs detected. |
| Existing Staff Drive runtime IDs | PASS | Current authentication and Storage controller IDs remain present. |
| Compact file workspace | PASS | Split view and contained file-list scrolling are defined. |
| Local file search and sorting | PASS | DOM-level filtering and sorting are implemented. |
| Metadata inspector | PASS | Existing inline details are redirected into a fixed inspector. |
| Download proxy | PASS | Uses the existing authenticated download button and controller. |
| Archive/restore proxy | PASS | Uses existing write-access controls and controller. |
| Mobile inspector drawer | PASS | Right-side and full-screen responsive modes are defined. |
| Existing file filters | PASS | All, Recent, Shared and Archived remain connected to `loadDrive`. |
| Operational snapshot integrity | PASS | SHA-256 unchanged from v1.17.0. |
| Authorised Supabase session | BLOCKED | No approved account credentials were used. |
| Live Storage records | BLOCKED | Requires an authorised Staff Drive account. |
| RLS verification | BLOCKED | Requires live database and Storage evidence. |
| GitHub Actions deployment | BLOCKED | No repository write or workflow evidence. |
| Cloudflare Pages deployment | BLOCKED | No deployment evidence. |
| Live-domain smoke test | BLOCKED | Not deployed to `os.englishkidshub.com`. |
