EKH OS v1.36.2 — FULL OPERATION PORTABLE BUILD

WHAT CHANGED
The interface CSS and all first-party JavaScript are embedded directly.
Opening index.html no longer requires an assets folder.

LOGIN
The secure Supabase login remains enabled.
The protected operational workspace appears only after successful login.
No password or service-role key is embedded.

OPENING
Open index.html directly.
The page should display the fully styled secure operations gate.

DEPLOYMENT
Upload index.html, 404.html and _headers to the website root.
Do not upload only an older standalone index file.

NETWORK REQUIREMENT
Login needs internet access to load the official Supabase browser SDK and
connect to the configured Supabase project.

SECURITY NOTE
This portable build permits data: scripts in its CSP because all local
JavaScript is embedded as deferred data-URL scripts. The earlier modular
build remains preferable for long-term production caching.


FINAL VALIDATION
- Secure login gate: PASS
- Protected workspace: PASS
- Embedded theme: PASS
- Embedded JavaScript: PASS
- Remaining local asset dependencies: 0
- Chromium visual test: PASS
- Login heading size: 68px
- Email input height: 48px
- Submit button height: 50px

EXPECTED FLOW
1. Open index.html.
2. The fully styled secure login appears.
3. Sign in using the approved Supabase account.
4. The complete EKH OS operational workspace opens.
