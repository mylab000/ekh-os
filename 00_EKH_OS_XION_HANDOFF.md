# EKH OS — Xion Technical and Design Handoff

**Project:** English Kids Hub Operating System  
**Current working release:** `v1.10.1 — Readable Typography & Contrast`  
**Handoff date:** 30 July 2026  
**Prepared by:** Candice  
**Receiving lead:** Xion  
**Owner:** Azuar Fahmi  
**Repository:** `mylab000/ekh-os`  
**Production branch:** `main`  
**Live domain:** `https://os.englishkidshub.com`  
**Cloudflare Pages project:** `englishkidshub`

---

## 1. Handoff Purpose

This handoff transfers the current EKH OS frontend design and navigation work to Xion.

The main objective is to continue developing EKH OS into a polished, clear and enjoyable owner operating system without returning to long pages that display every record at the same time.

The latest release is a local production-root package. It has passed static HTML and JavaScript syntax checks but has **not yet been verified as deployed on the live domain**.

---

## 2. Current Source of Truth

Use the files packaged with this handoff as the current working source:

1. `index.html`
2. `ekh-os-config.js`
3. `_headers`
4. `_redirects`
5. `project_progress_snapshot.json`

Do not start from an older Link Bio, Ceritera or unrelated application build.

The main file is:

```text
index.html
```

The public runtime configuration is:

```text
ekh-os-config.js
```

### Public Supabase configuration currently preserved

```text
URL: https://zhpqqxdnhhpvrgwnjwrh.supabase.co
Public key: sb_publishable_Md3ogGMFE-z_cyT04YkmQg__0XFFPh8
Owner UUID: c0b363c4-0033-4418-9813-679a5c6dec35
Owner email: azuarfahmi@gmail.com
```

These are browser-visible public values. Never add a service-role key, private secret or privileged credential to the frontend.

---

## 3. Deployment Workflow

The repository workflow is:

```text
.github/workflows/deploy-cloudflare-pages.yml
```

The workflow copies these root files into `dist/`:

```text
index.html
404.html
_redirects
_headers
ekh-os-config.js
project_progress_snapshot.json
```

It then deploys to Cloudflare Pages:

```text
Project: englishkidshub
Branch: main
```

### Important deployment status

A direct write to GitHub through the connected integration was attempted during this work and returned:

```text
403 — Resource not accessible by integration
```

Therefore, no deployment claim should be made without checking:

1. GitHub commit;
2. GitHub Actions workflow result;
3. Cloudflare Pages deployment;
4. live-domain behaviour.

---

## 4. Product Direction Confirmed by Owner

The owner does not want the website to copy Creative Tim or any other template.

The required direction is:

- premium dashboard neatness;
- strong spacing discipline;
- readable typography;
- controlled soft depth;
- polished sidebar and navigation;
- clear hierarchy;
- original EKH identity;
- fewer simultaneous information blocks;
- interactive exploration instead of continuous scrolling;
- one page for one primary purpose.

The owner specifically said the previous pages contained too much information and caused cognitive overload.

---

## 5. Current Design System

### Visual direction

Current release uses:

- off-white application background;
- white content cards;
- visible light borders;
- controlled shadows;
- Aurora violet as the main accent;
- cyan, green, amber and red for status;
- wider white floating sidebar;
- system typography using Segoe UI or the closest available system font.

### Readability changes in v1.10.1

The previous interface used many labels between 7 and 9 pixels. This was judged too small and unclear on white pages.

The current release increases:

- sidebar labels;
- submenu text;
- body copy;
- headings;
- card content;
- project cards;
- tables;
- forms;
- calendar text;
- organisation cards;
- Mia Queue records;
- drawers and modal content.

The application background is now off-white so white cards remain visually separated.

---

## 6. Current Navigation Architecture

The sidebar now uses dropdown menu groups.

### Command Center

- Overview
- Owner Decisions
- Current Critical Path
- Recently Published Updates

### My Activities

- Activity Calendar
- Supabase Activities

### Work

- Projects
- COO Progress Board
- Open Kanban Board

### Organisation Chart

- Overview
- One separate page for each department
- Operational Principles
- Master Staff Register

Current department pages:

1. Executive Leadership
2. Education & Curriculum
3. Technology, Software, Web & Systems
4. Technical QA, Release & Automation
5. Creative, Graphics & Visual Identity
6. Marketing, Copywriting & Social Media
7. Market Research & Product Strategy
8. E-book Development & Quality Assurance
9. Political Analysis & Design
10. Audio, Video & Multimedia

The department names in the actual file are the source of truth if wording differs slightly.

### Mia Queue

- Command Center Mia
- Workflow Help
- Structured Intake
- Publication Controls
- Publication Audits
- Kyo Release Gate

### Staff Drive

Staff Drive remains a direct menu because it is a focused file-access function.

### System

- System Overview
- Task Calendar
- Decision Rooms
- Activity & Audit
- Reports
- Settings

System is reserved for administration, scheduling, governance, audit, reporting and workspace configuration.

Project content, organisation records and publication workflow must stay within their dedicated menu groups.

---

## 7. Interactive Features Already Added

### Command Center

- project-status donut chart;
- clickable status legend;
- quick navigation to filtered Projects;
- activity summary;
- project pulse;
- owner operating summary.

### Projects

- portfolio donut chart;
- average-progress ring;
- horizontal project carousel;
- project search;
- status filtering;
- project detail drawer;
- COO checkpoint separated into its own page;
- Kanban separated into its own page.

### My Activities

- Month view;
- Week view;
- Agenda view;
- clickable dates;
- selected-date activity preview;
- live Supabase activity section;
- corrected empty state;
- Add Activity action.

### Organisation Chart

- department-specific pages;
- centred typography and cards;
- staff detail drawer;
- Operational Principles on its own page;
- Master Staff Register on its own page.

### Mia Queue

The following content was separated into dedicated pages:

- workflow guide;
- structured progress intake;
- publication controls;
- publication audit;
- Kyo release gate.

---

## 8. Progress and Operational Data Added

The Projects area and export snapshot contain the following checkpoint.

### Completed or closed

- Cuddle Paws — Coloring Book Vol. 3 fully completed and closed.
- Ceritera closed as a completed project.
- Novel “Di Antara Dua Langit” passed final audit for PDF production.
- EKH Worksheet Studio B2 series closed as controlled administrative pre-runtime closure.
- Team Organisation Chart V2 updated with name audit and missing members.

The Worksheet Studio B2 closure must never be described as technical production approval.

### In progress

- Reo — English Adventure audit and final handoff.
- Alya — 7,000-question audit management and Question_ID integrity.
- Jeff — Smart Adventure staging, runtime adapter and integration.
- Blanc — Worksheet Studio development and source-data repack.
- Candice — Command Centre coordination and operational documentation.
- Baran — SA-QB7000 DBA/DevOps preparation.
- Kamal — visual assets and Facebook Pages.
- Mario, Zack and Syakila — marketing and social strategy.
- Paula — market and pricing research.
- Love and Torrie — active e-book development and QA.
- Zenon and Farah — visual identity and illustration standards.
- Xion — web and landing-page development.
- Cuddle Paws RM10.90 promotion for the first 50 buyers remains active in the latest record.

### Hold

- Smart English.
- Cookbook e-book project.
- Full Worksheet Studio production activity pending genuine runtime validation.
- Official active scope for five new team members.

### Dependencies

- Smart Adventure depends on audited content.
- Worksheet Studio depends on source repack and verification.
- SA-QB7000 production import depends on technical gates and approval.
- Cuddle Paws marketing depends on complete assets and sales monitoring.

### Decisions required

1. Official final-content handoff date to Jeff.
2. Development priority between Smart Adventure and Worksheet Studio.
3. Cuddle Paws price increase after the promotional quota.
4. Official assignments for five new team members.
5. Reopening schedule for held projects.
6. Technical closure criteria for Smart Adventure and Worksheet Studio.

---

## 9. Version History Created During This Chat

### v1.7.3.7

English organisation-chart hotfix.

### v1.8.0

Editorial Operations System experiment.

Result: too editorial and not sufficiently aligned with the premium dashboard reference.

### v1.8.1

Soft Professional UI.

Added premium spacing, soft surfaces, polished sidebar, KPI cards and clearer hierarchy.

### v1.8.2

Activity Empty State Fix.

Fixed legacy CSS that treated an empty-state text span as a 58×58 icon and caused one-word-per-line wrapping.

### v1.8.3

COO Progress Checkpoint.

Added completed, active, hold, dependencies, pending decisions and next actions.

### v1.9.0

Interactive Overview.

Added project charts, carousel, drawers, Month/Week/Agenda views and department-focused organisation navigation.

### v1.9.1

Organisation Centred Text.

Centred Organisation Chart headings, department cards, staff cards, register and member drawer.

### v1.10.0

Dropdown Page Architecture.

Separated major information blocks into dedicated pages through sidebar dropdown groups.

### v1.10.1

Readable Typography & Contrast.

Increased font sizes, improved contrast, widened sidebar and changed the page background to off-white.

This is the current working release.

---

## 10. Known Risks and Items Requiring Xion Review

### A. Runtime navigation review

The application was progressively patched over earlier single-file builds.

Xion should audit:

- duplicate or obsolete event listeners;
- old scripts referring to moved sections;
- hidden-state logic;
- navigation state after direct page switching;
- browser back-button behaviour;
- deep-link or hash support;
- active submenu state;
- mobile sidebar close behaviour.

### B. Organisation department script

The old organisation filtering script was superseded by dedicated department pages.

Confirm there is no remaining script that hides department cards unexpectedly after page load.

### C. Calendar data

The interactive month and agenda currently include demonstration entries in the frontend layer.

Xion should connect these views to the actual authenticated Supabase activity records and remove any demonstration-only data before production approval.

### D. Progress percentages

Some visual percentages are operational indicators, not technical certification.

Do not present them as production readiness without evidence.

### E. Accessibility

Review:

- keyboard navigation;
- focus visibility;
- semantic headings;
- drawer focus trap;
- Escape behaviour;
- ARIA-expanded values;
- colour contrast;
- reduced-motion support.

### F. Responsive behaviour

Test at minimum:

```text
360 × 800
390 × 844
768 × 1024
1024 × 768
1366 × 768
1440 × 900
1920 × 1080
```

### G. Browser testing

Test current versions of:

- Chrome;
- Edge;
- Safari;
- Firefox.

### H. Performance

The app remains a large single HTML file with accumulated CSS and JavaScript patches.

Xion should recommend whether to:

1. retain controlled single-file architecture; or
2. refactor into modules while preserving the current Cloudflare deployment contract.

Do not refactor only for aesthetics. Refactor when it reduces defects, improves testability or materially improves performance.

---

## 11. Xion Immediate Work Order

### Phase 1 — Technical audit

1. Open `index.html`.
2. Build a navigation map of all views.
3. Verify every sidebar dropdown item opens the correct dedicated page.
4. Identify obsolete CSS and JavaScript.
5. Check all required IDs and modal triggers.
6. Verify Supabase configuration remains public-only.
7. Run desktop and mobile regression.

### Phase 2 — UX refinement

1. Ensure each page has one dominant purpose.
2. Reduce unnecessary repeated descriptions.
3. Preserve readable font sizes.
4. Keep off-white page background and white cards.
5. Use progressive disclosure for secondary evidence.
6. Make the first screen of each page useful without scrolling.
7. Avoid adding new dashboard cards unless they support a decision.

### Phase 3 — Data integration

1. Connect Month and Agenda to actual activity data.
2. Verify project counts against `project_progress_snapshot.json`.
3. Ensure owner decisions and release audit records do not imply nonexistent approvals.
4. Keep administrative closure distinct from technical approval.

### Phase 4 — Production gate

Before release, provide:

- build ID;
- version;
- changed-file list;
- syntax result;
- responsive test result;
- authentication/Supabase test result;
- before-and-after screenshots;
- Git commit;
- GitHub Actions status;
- Cloudflare deployment result;
- live-domain verification;
- rollback method.

---

## 12. Non-Negotiable Controls

- Do not add secret keys to frontend files.
- Do not change database schema without explicit approval.
- Do not alter RLS or authentication silently.
- Do not claim production deployment without evidence.
- Do not mark Worksheet Studio B2 as technical production approval.
- Do not mark Smart Adventure or Worksheet Studio completed without defined closure evidence.
- Do not copy Creative Tim source code, assets or exact layout.
- Do not restore long pages containing every information block.
- Do not reduce typography back to unreadable 7–9 px body labels.
- Do not remove the project progress export without replacement.

---

## 13. Recommended First Deliverable from Xion

Xion should first deliver a short technical review containing:

1. current architecture map;
2. confirmed navigation defects;
3. scripts and CSS safe to remove;
4. runtime risks;
5. proposed refactor boundary;
6. one corrected HTML build;
7. regression checklist.

Do not redesign the entire interface again before confirming the current navigation and runtime behaviour.

---

## 14. Current Verification Status

```text
HTML duplicate IDs: PASS
Inline JavaScript syntax: PASS
Dropdown page structure: PASS
Dedicated organisation department pages: PASS
Typography override: PASS
Supabase schema changes: NONE
Authentication changes: NONE
Production import changes: NONE
Live deployment verification: NOT COMPLETED
```

---

## 15. Suggested Commit Message

```text
Audit and stabilise EKH OS dropdown page architecture after v1.10.1 handoff
```

---

## Latest release — v1.24.0 Organisation People Dossier

- Build ID: `EKH-OS-OPD-20260731-001`
- Source: v1.23.5 Heritage Office Archive Theme
- Batch 2 started.
- Organisation rebuilt as six swipeable office-file pages.
- Ten department files and ten department routes preserved.
- Existing directory/search/drawer controllers preserved.
- Owner approval includes local `Sign here` and JSON export.
- No images or canvas added.
- Static JavaScript validation: full 32 PASS; preview 33 PASS; light 1 PASS.
- Deployment and authorised runtime evidence remain pending.


---

## v1.24.1 correction

- Oliver's official organisation role is **Application Lead**.
- Do not label Oliver as `Ceritera Application Lead`.
- Oliver's focus is general application development and application-level coordination.
- The separate Ceritera project remains closed and is not part of Oliver's role title.


---

## v1.24.2 — Handwritten Digital Approval Mark

- All four dossier `Sign here` surfaces now use one shared handwritten renderer.
- Owner name remains typed text; no signature image or canvas is stored.
- Styling: Oxblood ink, enlarged initials, connected cursive words and inline SVG flourish.
- Existing local approval controllers and records remain unchanged.
- Empty fields remain visibly unsigned.


---

## v1.24.3 — Signature Cleanup

- Removed all decorative signature flourish SVG lines.
- Removed the signature watermark caption.
- Keep the owner signature as simple typed text only.
- Do not restore decorative signature graphics, watermark captions, images or canvas.


---

## v1.25.0 — Staff Drive Archive Dossier

- Staff Drive rebuilt as six swipeable archive pages.
- Existing authenticated Supabase Storage controller IDs are preserved.
- Upload, refresh, filters, search, sort, download, archive and restore remain connected.
- Selected file metadata feeds Evidence Review and Owner Approval.
- Approval uses simple typed signature text with no watermark or decorative flourish.
- No images, picture or canvas added.
- Authorised runtime and deployment evidence remain pending.


---

## v1.25.1 — Master Staff Register 35 Sync

- Official website master register contains 35 unique names.
- Nara added to English overview.
- Arden and Vera added to Technical QA & Release overview.
- Azuar Fahmi and Mia included in dynamic Master Staff Register.
- Staff Drive dropdown and staff search use all 35 names.
- Supabase rows override matching local directory records.
- RLS and access grants remain authoritative.
- Oliver remains Application Lead.
- No images, picture or canvas added.


---

## v1.26.0 — My Activities Daily Dossier

- My Activities rebuilt as six swipeable daily-file pages.
- Existing authenticated Supabase activity list remains the source.
- Add, refresh, filters, search, project, priority, complete, snooze, edit and cancel hooks are preserved.
- Selected activities receive a dedicated detail page and local owner note.
- Daily Review and Owner Approval are local dossier records only.
- Week, Month and Agenda reference views remain separate from live records.
- No images, picture or canvas added.
- Authorised runtime and deployment evidence remain pending.


---

## v1.27.0 — System Control & Readiness Dossier

- System rebuilt as six swipeable control-file pages.
- Existing Overview, Audit, Reports, Settings and Readiness controllers are preserved.
- Activity, Reports, Settings and Production Readiness sidebar aliases redirect to the correct dossier page.
- Owner Release Decision is local only and cannot deploy.
- No images, picture or canvas added.
- Authorised runtime and deployment evidence remain pending.


---

## v1.28.0 — Task Calendar Planning & Schedule Dossier

- Task Calendar rebuilt as six swipeable planning-file pages.
- Original reference week, seven days and eight tasks are preserved.
- Add Task still uses `openSupabaseActivityModalFromCalendar`.
- My Activities remains the authenticated live record interface.
- Capacity review distinguishes high-load days from exact time conflicts.
- Schedule approval is local only and cannot update Supabase.
- No images, picture or canvas added.
- Authorised runtime and deployment evidence remain pending.


---

## v1.28.2 — Task Detail Propagation Correction

- Reverted to the original v1.28.0 Task Calendar dossier design.
- Removed the additional downstream workflow strips from v1.28.1.
- Clicking a Page 02 task opens Page 03 and propagates the task through Pages 03–06.
- Capacity and approval records remain task-specific.
- No images, picture or canvas added.


---

## v1.29.0 — Decision Rooms Authority Dossier

- Decision Rooms rebuilt as six swipeable governance-file pages.
- Three room files populate Decision File, Evidence & Options, Authority Review and Owner Decision.
- Room notes, authority reviews and decisions are stored separately by room.
- Existing new-room and legacy room-detail controller hooks are preserved through a hidden compatibility bridge.
- No images, picture or canvas added.
- Authorised runtime and deployment evidence remain pending.


---

## v1.29.1 — Single-Owner Advisory Perspectives

- Azuar Fahmi is the only human user.
- Page 05 now records owner-entered AI advisory perspectives.
- Perspective fields: position, reasoning, evidence, recommendation and source.
- No online, chat, typing, voting or read-receipt simulation.
- Page 06 remains owner-only.
- No images, picture or canvas added.


---

## v1.29.2 — Magazine Swipe Advisory Perspectives

- Page 05 displays one advisory perspective at a time.
- Advisory navigation supports swipe, Previous, Next and position dots.
- Nested advisory swipes do not change the main dossier page.
- Editable perspective fields and room-specific storage are preserved.
- Single-owner authority and Page 06 decision controls are preserved.
- No images, picture or canvas added.


---

## v1.29.3 — Clean Advisory Magazine Page

- Removed Single-Owner Boundary from Page 05.
- Removed Owner Authority section from Page 05.
- Preserved the magazine-style advisory carousel.
- Preserved editable advisory fields and owner synthesis note.
- Preserved Owner Decision on Page 06.
- No images, picture or canvas added.


---

## v1.30.0 — All Department Dossiers

- All ten Organisation department pages use the six-page dossier pattern.
- Department route IDs remain unchanged.
- Page 03 team rows open Page 04 selected staff files.
- Staff notes are local and stored by department/staff.
- Page 05 contains department workstreams, evidence and controls.
- Page 06 contains a local owner review and JSON export.
- Organisation overview, Operational Principles, Master Staff Register and Staff Drive 35-name dropdown are preserved.
- No images, picture or canvas added.


---

## v1.30.1 — Five-Word Editorial Microcopy

- Visible sentences use five words maximum.
- The rule covers dynamic content.
- Original copy remains in tooltips.
- User-entered fields remain untouched.
- Six editorial lenses were applied: Haikal, Mario, Mia, Candice, Zenon and Kamal.
- Browser audit: `window.EKHFiveWordMicrocopy.audit()`.
- Static simulation reports zero violations.
- No images, picture or canvas added.


---

## v1.30.2 — English Person-Level Dependencies

- All visible interface copy is English.
- Department-level dependency strips were removed.
- Every staff assignment has separate dependencies.
- Page 03 shows each person's dependencies.
- Page 04 updates dependencies by selection.
- Malay Language separates Reo and Candice by person.
- Five-word microcopy remains active.
- No images, picture or canvas added.


---

## v1.31.0 — Performance Refactor

- Extracted all inline CSS into one cacheable stylesheet.
- Extracted all inline JavaScript into deferred runtime bundles.
- Added a lightweight idle-first microcopy scan.
- Added CDN and Supabase preconnect hints.
- Added immutable asset cache headers.
- Added a production-only Cloudflare package.
- Added a safe public Supabase config file only.
- Preserved all dossiers, routes and controller IDs.
- No images, private keys or production writes added.


---

## v1.32.0 — Navigation Audit Dossier

- Build ID: EKH-OS-NAVD-20260731-001
- Added System → Navigation Audit.
- Added six audit pages.
- Inventoried 36 baseline routes.
- Confirmed zero broken targets.
- Identified deep-link and history gaps.
- Palette covers 11 baseline routes.
- No route behaviour changed.
- No images were added.


---

## v1.33.0 — Authenticated Supabase Runtime Dossier

- Build ID: EKH-OS-ASRD-20260731-001
- Added System → Authenticated Runtime.
- Added six dossier pages.
- Added nine read-only checks.
- Automatic run follows `ekh-auth-ready`.
- Manual rerun and access refresh exist.
- Evidence export excludes tokens.
- No database, Storage or RPC writes.
- Authorised live evidence remains pending.


---

## v1.34.0 — Browser & Mobile Testing Dossier

- Build ID: EKH-OS-BMTD-20260731-001
- Actual Chromium 144 testing completed.
- Seven viewport profiles passed.
- Five touch profiles passed.
- Four authentication-gate profiles passed.
- Firefox and WebKit remain blocked.
- Physical devices remain blocked.
- No screenshots were created.


---

## v1.35.0 — Security & RLS Verification Dossier

- Build ID: EKH-OS-SRLS-20260731-001
- Added System → Security & RLS Verification.
- Added six dossier pages.
- Added seventeen security checks.
- Verification runtime uses read-only probes.
- No database, Storage or RPC writes.
- Policy SQL and second-account evidence remain blocked.
- Security headers remain a high-priority finding.


---

## v1.36.0 Cloudflare Deployment Dossier

- Build ID: EKH-OS-CFDP-20260731-001
- Project: englishkidshub
- Domain: https://os.englishkidshub.com
- GitHub workflow deploys versioned ZIP.
- Live evidence is generated during deployment.


## v1.36.0 deployment attempt

- Status: BLOCKED.
- GitHub branch creation: 403.
- GitHub file write: 403.
- Commit created: no.
- GitHub Actions triggered: no.
- Cloudflare deployment created: no.
- Production package remains ready.


---

## v1.36.1 — COO Team Progress Dossier

- Build ID: EKH-OS-COOTP-20260731-001
- Updated Work → COO Progress Board.
- Published checkpoint: 31 July 2026.
- Added six dossier pages.
- Separated 23 active person files.
- Updated Current Critical Path.
- Updated Recently Published Updates.
- Preserved English-only interface.
- Original DOCX is not deployed.
- Deployment remains blocked.
