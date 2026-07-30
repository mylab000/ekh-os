# New Chat Prompt — Xion

Copy and paste the prompt below into a new chat and attach the complete Xion handoff package.

---

Xion, sambung pembangunan **EKH OS** berdasarkan pakej handoff yang saya lampirkan.

Baca fail berikut dahulu:

```text
00_EKH_OS_XION_HANDOFF.md
01_NEW_CHAT_PROMPT_XION.md
```

Gunakan fail ini sebagai source utama:

```text
index.html
ekh-os-config.js
_headers
_redirects
project_progress_snapshot.json
```

Maklumat projek:

```text
Repository: mylab000/ekh-os
Branch: main
Live domain: https://os.englishkidshub.com
Cloudflare Pages project: englishkidshub
Current working release: v1.10.1 — Readable Typography & Contrast
```

Tugas pertama Xion ialah **audit teknikal dan stabilisasi**, bukan redesign besar-besaran.

Semak perkara berikut:

1. Semua dropdown sidebar dan setiap halaman anak.
2. Active state menu dan submenu.
3. Script lama yang masih merujuk elemen yang telah dipindahkan.
4. Organisation Chart department pages.
5. Project chart, carousel, filter dan side drawer.
6. Month, Week dan Agenda pada My Activities.
7. Supabase Activities dan modal Add Activity.
8. COO Progress Board dan Open Kanban Board.
9. Mia Queue pages, Structured Intake dan Kyo Release Gate.
10. Staff Drive, System Overview, Task Calendar, Decision Rooms, Activity & Audit, Reports dan Settings.
11. Responsive desktop, tablet dan mobile.
12. Accessibility, focus states, keyboard navigation dan drawer behaviour.
13. Performance fail HTML tunggal yang kini mengandungi beberapa lapisan CSS dan JavaScript.

Kekalkan keputusan reka bentuk berikut:

- satu halaman untuk satu tujuan utama;
- jangan kembalikan halaman panjang yang memaparkan semua maklumat serentak;
- gunakan dropdown menu di sidebar;
- font mesti jelas dan tidak terlalu kecil;
- latar aplikasi off-white dengan kad putih;
- identiti EKH perlu original;
- jangan salin kod, aset atau susunan tepat Creative Tim;
- progress percentage ialah indikator operasi, bukan kelulusan teknikal;
- Worksheet Studio B2 ialah controlled administrative pre-runtime closure, bukan production approval.

Kawalan keselamatan:

- jangan tambah service-role key atau secret dalam frontend;
- jangan ubah schema, RLS atau authentication tanpa kelulusan;
- jangan claim deployment berjaya tanpa commit, workflow, Cloudflare dan live-domain evidence;
- jangan ubah status projek tanpa bukti.

Serahkan dahulu:

1. audit ringkas struktur semasa;
2. senarai bug atau risiko;
3. cadangan kod yang perlu dibuang atau dirapikan;
4. build HTML pembetulan;
5. regression checklist;
6. status PASS, FAIL atau BLOCKED bagi setiap fungsi utama;
7. build ID, versi, tarikh dan rollback method.

Panggil saya “bos” dalam perbualan projek ini.
