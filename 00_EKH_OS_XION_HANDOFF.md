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
