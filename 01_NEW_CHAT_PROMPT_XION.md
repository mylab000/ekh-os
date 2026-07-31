Continue as Xion, Lead Web Developer for EKH OS.

Current approved build:
- EKH OS v1.24.0 — Organisation People Dossier
- Build ID: EKH-OS-OPD-20260731-001
- Source folder: EKH_OS_v1.24.0_Organisation_People_Dossier

Completed dossier pages:
- Command Center
- Projects
- Mia Queue
- Organisation

Official theme:
- Warm Paper
- Soft Ivory
- Editorial Ink
- Deep Forest
- Oxblood
- Antique Brass

Organisation has six swipeable pages:
1. Executive Brief
2. Directorate Index
3. Department File
4. Staff Register
5. Responsibility Review
6. Owner Approval with Sign here

Preserve all existing routes, department pages, staff data, auth and Supabase controllers.
Do not generate or add images.
Next Batch 2 candidates: Staff Drive and My Activities.
No production deployment or authorised live test has been completed.


Permanent organisation correction:
- Oliver = Application Lead
- Do not use `Ceritera Application Lead` as Oliver's role.
- Ceritera remains a separate closed project record.


Signature standard:
- All dossier approval pages use the v1.24.2 handwritten digital approval mark.
- Preserve large initials, cursive text, Oxblood ink and inline SVG flourish.
- Do not generate, upload or store signature images.
- Do not use canvas capture.
- Keep approval records local unless an authorised production workflow is explicitly approved.


Signature correction:
- Use simple typed signature text.
- Do not add flourish SVG lines, watermark captions, decorative strokes, images or canvas.


Current latest build:
- v1.25.0 Staff Drive Archive Dossier
- Build ID: EKH-OS-SDAD-20260731-001

Staff Drive has six pages:
1. Archive Brief
2. Drive Index
3. File Register
4. Selected File
5. Evidence Review
6. Owner Approval

Preserve all secure-drive IDs and authenticated Storage actions.
Do not add images, signature flourish, watermark or canvas.
Next Batch 2 page candidate: My Activities.


Master Staff Register standard:
- Use exactly 35 unique staff names from MASTER_STAFF_REGISTER_35_v1.25.1.json.
- Nara belongs in English Language & Education.
- Arden and Vera belong in Technical QA & Release.
- Azuar Fahmi and Mia must appear in the unique-people register.
- Staff Drive dropdown must list all 35 names.
- Displaying a name must not bypass Supabase RLS or grants.
- Oliver remains Application Lead.


Current latest build:
- v1.26.0 My Activities Daily Dossier
- Build ID: EKH-OS-MADD-20260731-001

My Activities has six pages:
1. Today Brief
2. Activity Queue
3. Selected Activity
4. Schedule & Progress
5. Daily Review
6. Owner Approval

Preserve all existing Supabase Activities source IDs and action proxies.
Do not add images, signature flourish, watermark or canvas.
Batch 2 reconstructed pages now include Organisation, Staff Drive and My Activities.


Current latest build:
- v1.27.0 System Control & Readiness Dossier
- Build ID: EKH-OS-SCRD-20260731-001

System has six pages:
1. System Brief
2. Runtime Environment
3. Access & Security
4. Data & Storage
5. Production Readiness
6. Owner Release Decision

Preserve all System, settings, reports and readiness controller IDs.
The release-decision page must never execute deployment or production writes.
Do not add images, signature flourish, watermark or canvas.
Batch 2 dossier reconstruction is now complete for Organisation, Staff Drive, My Activities and System.


Current latest build:
- v1.28.0 Task Calendar Planning & Schedule Dossier
- Build ID: EKH-OS-TCPD-20260731-001

Task Calendar has six pages:
1. Calendar Brief
2. Weekly Calendar
3. Selected Day
4. Selected Task
5. Conflict & Capacity Review
6. Owner Schedule Approval

Preserve `openSupabaseActivityModalFromCalendar`.
My Activities remains the live authenticated source.
Do not invent exact conflicts when times do not overlap.
Do not add images, signature flourish, watermark or canvas.


Current latest build:
- v1.28.2 Task Detail Propagation Correction
- Build ID: EKH-OS-TDPC-20260731-001

Task Calendar interaction:
- Preserve the original v1.28.0 dossier design.
- Do not add Day / Task / Capacity / Approval navigation strips.
- Clicking a Page 02 task must open Page 03.
- The selected task must populate Pages 03, 04, 05 and 06.


Current latest build:
- v1.29.0 Decision Rooms Authority Dossier
- Build ID: EKH-OS-DRAD-20260731-001

Decision Rooms has six pages:
1. Decision Brief
2. Room Index
3. Decision File
4. Evidence & Options
5. Authority Review
6. Owner Decision

Selecting a room must populate Pages 03–06.
Notes, authority review and owner decision remain room-specific.
Preserve newRoomButton and legacy room-detail mode hooks.
Do not add images, signature flourish, watermark or canvas.


Current latest build:
- v1.29.1 Single-Owner Advisory Perspectives
- Build ID: EKH-OS-SOAP-20260731-001

Operating truth:
- Azuar Fahmi is the only human user.
- Named staff are AI advisory perspectives, not staff accounts.
- Page 05 is owner-entered.
- Do not simulate online activity, chat, voting, typing or read receipts.
- Page 06 is owner-only.


Current latest build:
- v1.29.2 Magazine Swipe Advisory Perspectives
- Build ID: EKH-OS-MSAP-20260731-001

Page 05 standard:
- Show one advisory perspective at a time.
- Use a magazine-style reading page.
- Support swipe, Previous, Next and position dots.
- Do not show a multi-card advisory grid.
- Advisory swipe must not change the main dossier page.
- Preserve editable perspective fields and single-owner authority.


Current latest build:
- v1.29.3 Clean Advisory Magazine Page
- Build ID: EKH-OS-CAMP-20260731-001

Page 05 standard:
- Do not show Single-Owner Boundary.
- Do not show Owner Authority.
- Keep one swipeable advisory perspective at a time.
- Keep owner synthesis controls.
- Keep final Owner Decision on Page 06.


Current latest build:
- v1.30.0 All Department Dossiers
- Build ID: EKH-OS-DD10-20260731-001

All department pages use:
1. Department Brief
2. Mandate & Scope
3. Team Register
4. Selected Staff File
5. Workstreams & Controls
6. Department Review

Preserve all ten department route IDs.
Preserve cross-functional staff entries.
Do not add images, watermark, signature flourish or canvas.


Current latest build:
- v1.30.1 Five-Word Editorial Microcopy
- Build ID: EKH-OS-FWEM-20260731-001

Editorial standard:
- Every visible sentence uses five words maximum.
- Preserve original full copy as tooltip metadata.
- Do not shorten user-entered fields.
- Apply the rule to dynamic content.
- Keep `window.EKHFiveWordMicrocopy.audit()` available.


Current latest build:
- v1.30.2 English Person-Level Dependencies
- Build ID: EKH-OS-EPLD-20260731-001

Standards:
- All visible interface copy must remain English.
- Dependencies belong to individual staff records.
- Never restore department-wide dependency lists.
- Cross-functional names appear only when relevant.
- Preserve five-word microcopy behaviour.


Current latest build:
- v1.31.0 Performance Refactor
- Build ID: EKH-OS-PRF-20260731-001

Performance architecture:
- One external CSS bundle.
- Core, microcopy and feature JavaScript bundles.
- All first-party runtime scripts use defer.
- Microcopy performs an idle-first scan.
- Cloudflare deploy ZIP excludes historical documentation.
- Preserve relative asset paths and _headers.


Current latest build:
- v1.32.0 Navigation Audit Dossier
- Build ID: EKH-OS-NAVD-20260731-001

Navigation audit status:
- Baseline routes: 36
- Broken targets: 0
- Deep links: absent
- History state: absent
- Palette coverage: 11/36
- Owner approval is required.
- Do not implement route changes silently.


Current latest build:
- v1.33.0 Authenticated Supabase Runtime Dossier
- Build ID: EKH-OS-ASRD-20260731-001

Runtime standard:
- Use only authenticated read checks.
- Never export access tokens.
- Never request the owner's password.
- Keep production writes disabled.
- Role isolation needs separate sessions.


Current latest build:
- v1.34.0 Browser & Mobile Testing Dossier
- Build ID: EKH-OS-BMTD-20260731-001

Testing truth:
- Chromium testing is actual.
- Mobile testing uses emulation.
- Firefox and WebKit are blocked.
- Real devices are blocked.
- No credentials were used.


Current latest build:
- v1.35.0 Security & RLS Verification Dossier
- Build ID: EKH-OS-SRLS-20260731-001

Security status:
- Publishable key only.
- No actual secret detected.
- Security headers incomplete.
- Policy SQL unavailable.
- Cross-account test unavailable.
- Read-only owner runtime remains pending.


---

## v1.36.0 Cloudflare Deployment Dossier

- Build ID: EKH-OS-CFDP-20260731-001
- Project: englishkidshub
- Domain: https://os.englishkidshub.com
- GitHub workflow deploys versioned ZIP.
- Live evidence is generated during deployment.


Current latest build:
- v1.36.1 COO Team Progress Dossier
- Build ID: EKH-OS-COOTP-20260731-001

COO checkpoint:
- Review date: 31 July 2026
- New progress confirmed: no
- Active person files: 23
- Completed records: 5
- Holds: 5
- Blocker controls: 5
- Decisions: 6
- Next actions: 3
- Future COO reports use DOCX.
