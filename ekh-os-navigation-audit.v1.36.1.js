
(() => {
  'use strict';

  const ROUTES = [{"index": 1, "view": "command-centre", "label": "Overview", "group": "Command Center", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 2, "view": "command-owner-decisions", "label": "Owner Decisions", "group": "Command Center", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 3, "view": "command-critical-path", "label": "Current Critical Path", "group": "Command Center", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 4, "view": "command-published-updates", "label": "Recently Published Updates", "group": "Command Center", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 5, "view": "notifications", "label": "Activity Calendar", "group": "My Activities", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 6, "view": "supabase-activities", "label": "Supabase Activities", "group": "My Activities", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 7, "view": "projects", "label": "Projects", "group": "Work", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 8, "view": "coo-progress-board", "label": "COO Progress Board", "group": "Work", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 9, "view": "kanban-board", "label": "Open Kanban Board", "group": "Work", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 10, "view": "organisation", "label": "Overview", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 11, "view": "org-bm", "label": "Malay Language", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 12, "view": "org-english", "label": "English Language & Language Education", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 13, "view": "org-technology", "label": "Technology, Software, Web & Systems", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 14, "view": "org-qa", "label": "Technical QA, Release & Automation", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 15, "view": "org-creative", "label": "Creative, Graphics & Visual Identity", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 16, "view": "org-marketing", "label": "Marketing, Content & Market Intelligence", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 17, "view": "org-assessment", "label": "Child Education & Assessment", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 18, "view": "org-multimedia", "label": "Multimedia, Video & Audio", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 19, "view": "org-political", "label": "Politics", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 20, "view": "org-publishing", "label": "E-book & Publishing", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 21, "view": "org-operational-principles", "label": "Operational Principles", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 22, "view": "org-master-register", "label": "Master Staff Register", "group": "Organisation Chart", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 23, "view": "handoffs", "label": "Workflow Console", "group": "Mia Queue", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 24, "view": "mia-workflow-help", "label": "Workflow Help", "group": "Mia Queue", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 25, "view": "mia-structured-intake", "label": "Structured Intake", "group": "Mia Queue", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 26, "view": "mia-publication-controls", "label": "Publication Controls", "group": "Mia Queue", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 27, "view": "mia-publication-audits", "label": "Publication Audits", "group": "Mia Queue", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 28, "view": "mia-kyo-release-gate", "label": "Kyo Release Gate", "group": "Mia Queue", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 29, "view": "system-overview", "label": "Control Workspace", "group": "System", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 30, "view": "tasks", "label": "Task Calendar", "group": "System", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 31, "view": "decision-rooms", "label": "Decision Rooms", "group": "System", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 32, "view": "activity", "label": "Activity & Audit", "group": "System", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 33, "view": "reports", "label": "Reports", "group": "System", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 34, "view": "settings", "label": "Settings", "group": "System", "type": "Grouped route", "target": "PASS", "palette": "COVERED", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 35, "view": "production-readiness", "label": "Production Readiness", "group": "System", "type": "Grouped route", "target": "PASS", "palette": "MISSING", "depth": 2, "direct_url": "MISSING", "history": "MISSING"}, {"index": 36, "view": "files", "label": "Staff Drive", "group": "Standalone", "type": "Standalone route", "target": "PASS", "palette": "COVERED", "depth": 1, "direct_url": "MISSING", "history": "MISSING"}];
  const FINDINGS = [{"id": "NAV-01", "severity": "PASS", "title": "All menu targets resolve", "detail": "36 routes have valid views.", "recommendation": "Preserve route integrity checks."}, {"id": "NAV-02", "severity": "HIGH", "title": "Deep links remain unavailable", "detail": "Routes lack URL state.", "recommendation": "Add a route registry."}, {"id": "NAV-03", "severity": "HIGH", "title": "Browser history remains disconnected", "detail": "Back navigation lacks route state.", "recommendation": "Add History API support."}, {"id": "NAV-04", "severity": "HIGH", "title": "Palette coverage remains partial", "detail": "11 of 36 routes appear.", "recommendation": "Generate palette commands automatically."}, {"id": "NAV-05", "severity": "MEDIUM", "title": "Organisation menu remains dense", "detail": "13 routes share one group.", "recommendation": "Add department subgroups."}, {"id": "NAV-06", "severity": "MEDIUM", "title": "Dropdowns remain independently open", "detail": "Multiple groups increase scrolling.", "recommendation": "Use a single-open accordion."}, {"id": "NAV-07", "severity": "MEDIUM", "title": "Global search misses routes", "detail": "Search scans page content only.", "recommendation": "Index route labels too."}, {"id": "NAV-08", "severity": "MEDIUM", "title": "Breadcrumbs remain non-interactive", "detail": "Headers show context only.", "recommendation": "Add clickable route ancestry."}, {"id": "NAV-09", "severity": "LOW", "title": "Last route is forgotten", "detail": "Sessions reopen the default page.", "recommendation": "Store the last route."}, {"id": "NAV-10", "severity": "PASS", "title": "Dropdown states expose accessibility", "detail": "Toggles use aria-expanded.", "recommendation": "Retain semantic controls."}, {"id": "NAV-11", "severity": "PASS", "title": "Mobile sidebar closes safely", "detail": "Selected routes close navigation.", "recommendation": "Retain mobile close behaviour."}, {"id": "NAV-12", "severity": "PASS", "title": "Keyboard palette already exists", "detail": "Control K opens commands.", "recommendation": "Expand complete route coverage."}];
  const GROUPS = {"Command Center": 4, "My Activities": 2, "Work": 3, "Organisation Chart": 13, "Mia Queue": 6, "System": 7};
  const PAGE_NAMES = [
    ['brief','Audit Brief'],
    ['routes','Route Inventory'],
    ['selected','Selected Route'],
    ['journeys','Journey Review'],
    ['findings','Findings & Priorities'],
    ['decision','Owner Decision']
  ];
  const REVIEW_KEY = 'ekh_nav320_navigation_audit_v1320';
  const NOTE_KEY = 'ekh_nav320_route_notes_v1320';

  if(typeof pageNames !== 'undefined'){
    pageNames['navigation-audit'] = [
      'Navigation Audit',
      'System / Route Control'
    ];
  }

  const page = document.getElementById('navigation-audit');
  if(!page) return;

  let pageIndex = 0;
  let selectedIndex = Number(
    localStorage.getItem('ekh_nav320_selected_route_v1320') || 0
  );
  let activeFilter = 'All';
  let touchStartX = null;

  const one = selector => page.querySelector(selector);
  const all = selector => [...page.querySelectorAll(selector)];
  const safe = value => String(value ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
  const normalise = value => String(value || '').replace(/\s+/g,' ').trim();

  function openPage(name,{focus=false}={}){
    const index = PAGE_NAMES.findIndex(item => item[0] === name);
    pageIndex = index >= 0 ? index : 0;
    const [key,title] = PAGE_NAMES[pageIndex];

    all('[data-nav320-panel]').forEach(panel => {
      const active = panel.dataset.nav320Panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
      panel.setAttribute('aria-hidden',String(!active));
    });

    all('[data-nav320-page]').forEach(button => {
      const active = button.dataset.nav320Page === key;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });

    one('[data-nav320-counter]').textContent =
      `Page ${pageIndex + 1} of ${PAGE_NAMES.length}`;
    one('[data-nav320-page-title]').textContent = title;
    one('[data-nav320-prev]').disabled = pageIndex === 0;
    one('[data-nav320-next]').disabled =
      pageIndex === PAGE_NAMES.length - 1;
    renderDots();

    if(focus){
      one('.nav320-viewport')?.scrollIntoView({
        behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto' : 'smooth',
        block:'start'
      });
    }
  }

  function move(delta){
    const next = Math.max(
      0,
      Math.min(PAGE_NAMES.length - 1,pageIndex + delta)
    );
    openPage(PAGE_NAMES[next][0],{focus:true});
  }

  function renderDots(){
    const holder = one('[data-nav320-dots]');
    holder.innerHTML = PAGE_NAMES.map((item,index) => `
      <button class="${index === pageIndex ? 'active' : ''}"
        data-nav320-dot="${item[0]}" type="button"
        aria-label="Open ${safe(item[1])}"></button>`).join('');
  }

  function routeNotes(){
    try{
      return JSON.parse(localStorage.getItem(NOTE_KEY) || '{}');
    }catch(error){
      return {};
    }
  }

  function saveRouteNote(){
    const route = ROUTES[selectedIndex];
    if(!route) return;
    const store = routeNotes();
    store[route.view] = one('[data-nav320-route-note]').value || '';
    localStorage.setItem(NOTE_KEY,JSON.stringify(store));
  }

  function renderRouteList(){
    all('[data-nav320-route-index]').forEach(button => {
      const index = Number(button.dataset.nav320RouteIndex);
      const route = ROUTES[index];
      const visible = activeFilter === 'All' || route.group === activeFilter;
      button.hidden = !visible;
      button.classList.toggle('active',index === selectedIndex);
    });
  }

  function renderSelected(index,{open=false}={}){
    selectedIndex = Math.max(0,Math.min(ROUTES.length - 1,index));
    const route = ROUTES[selectedIndex];

    all('[data-nav320-route-index]').forEach(button => {
      button.classList.toggle(
        'active',
        Number(button.dataset.nav320RouteIndex) === selectedIndex
      );
    });

    const values = {
      '[data-nav320-selected-label]':route.label,
      '[data-nav320-selected-view]':route.view,
      '[data-nav320-selected-status]':route.target,
      '[data-nav320-fact-group]':route.group,
      '[data-nav320-fact-type]':route.type,
      '[data-nav320-fact-target]':route.target,
      '[data-nav320-fact-depth]':String(route.depth),
      '[data-nav320-fact-palette]':route.palette,
      '[data-nav320-fact-url]':route.direct_url,
      '[data-nav320-fact-history]':route.history,
      '[data-nav320-fact-view]':route.view
    };
    Object.entries(values).forEach(([selector,value]) => {
      const node = one(selector);
      if(node) node.textContent = value;
    });

    one('[data-nav320-route-note]').value =
      routeNotes()[route.view] || '';

    localStorage.setItem(
      'ekh_nav320_selected_route_v1320',
      String(selectedIndex)
    );

    if(open) openPage('selected',{focus:true});
  }

  function applyFilter(filter){
    activeFilter = filter;
    all('[data-nav320-filter]').forEach(button => {
      button.classList.toggle(
        'active',
        button.dataset.nav320Filter === filter
      );
    });
    renderRouteList();
    openPage('routes',{focus:true});
  }

  function openSelectedRoute(){
    const route = ROUTES[selectedIndex];
    if(!route) return;
    const target = document.querySelector(
      `.nav-item[data-view="${CSS.escape(route.view)}"]`
    );
    if(target){
      target.click();
      return;
    }
    if(typeof showView === 'function') showView(route.view);
  }

  function reviewStore(){
    try{
      return JSON.parse(localStorage.getItem(REVIEW_KEY) || 'null');
    }catch(error){
      return null;
    }
  }

  function renderSignature(name){
    const preview = one('[data-nav320-signature-preview]');
    const clean = normalise(name);
    preview.textContent = clean || 'Owner signature';
    preview.classList.toggle('sig243-placeholder',!clean);
  }

  function renderReview(record){
    const holder = one('[data-nav320-record-output]');
    holder.classList.remove('approved','returned','hold');

    if(!record){
      holder.innerHTML = `
        <span class="section-kicker">CURRENT LOCAL RECORD</span>
        <strong>No audit decision exists.</strong>
        <p>Review, confirm, then sign.</p>`;
      one('[data-nav320-summary-decision]').textContent = 'PENDING';
      return;
    }

    const className = record.decision === 'ACCEPT_AUDIT'
      || record.decision === 'APPROVE_PHASE_THREE_FIXES'
      ? 'approved'
      : record.decision === 'HOLD'
        ? 'hold'
        : 'returned';

    holder.classList.add(className);
    holder.innerHTML = `
      <span class="section-kicker">CURRENT LOCAL RECORD</span>
      <strong>${safe(record.decision.replaceAll('_',' '))} · ${safe(record.signer)}</strong>
      <p>${safe(new Date(record.signed_at).toLocaleString('en-MY'))}${record.note ? ` · ${safe(record.note)}` : ''}</p>`;
    one('[data-nav320-summary-decision]').textContent =
      record.decision.replaceAll('_',' ');
  }

  function loadReview(){
    const record = reviewStore();

    all('input[name="nav320Decision"]').forEach(input => {
      input.checked = Boolean(record && input.value === record.decision);
    });

    one('[data-nav320-decision-note]').value = record?.note || '';

    all('[data-nav320-confirm]').forEach(input => {
      input.checked = Boolean(
        record?.confirmations?.[input.dataset.nav320Confirm]
      );
    });

    one('[data-nav320-sign-name]').value = record?.signer || '';
    renderSignature(record?.signer || '');
    one('[data-nav320-sign-time]').textContent = record?.signed_at
      ? new Date(record.signed_at).toLocaleString('en-MY')
      : 'Not signed';
    renderReview(record);
  }

  function recordReview(){
    const decision = one(
      'input[name="nav320Decision"]:checked'
    )?.value || '';
    const signer = normalise(one('[data-nav320-sign-name]').value);
    const note = normalise(one('[data-nav320-decision-note]').value);
    const confirmations = {};

    all('[data-nav320-confirm]').forEach(input => {
      confirmations[input.dataset.nav320Confirm] = input.checked;
    });

    const problems = [];
    if(!decision) problems.push('Select an audit decision.');
    if(!signer) problems.push('Type the owner name.');
    if(!Object.values(confirmations).every(Boolean)){
      problems.push('Complete all audit confirmations.');
    }

    const error = one('[data-nav320-error]');
    if(problems.length){
      error.textContent = problems.join(' ');
      return;
    }
    error.textContent = '';

    const record = {
      release:'v1.36.1',
      build_id:'EKH-OS-NAVD-20260731-001',
      audit:'navigation',
      baseline_routes:36,
      baseline_views:37,
      broken_routes:0,
      internal_only_views:1,
      command_palette_routes:11,
      longest_group:"Organisation Chart",
      longest_group_routes:13,
      finding_counts:{"PASS": 4, "HIGH": 3, "MEDIUM": 4, "LOW": 1},
      findings:FINDINGS,
      decision,
      note,
      signer,
      confirmations,
      signed_at:new Date().toISOString(),
      storage:'local-browser-draft',
      route_write:false,
      history_write:false,
      supabase_write:false,
      production_write:false
    };

    localStorage.setItem(REVIEW_KEY,JSON.stringify(record));
    loadReview();
  }

  function clearReview(){
    localStorage.removeItem(REVIEW_KEY);
    all('input[name="nav320Decision"]').forEach(input => {
      input.checked = false;
    });
    one('[data-nav320-decision-note]').value = '';
    all('[data-nav320-confirm]').forEach(input => {
      input.checked = false;
    });
    one('[data-nav320-sign-name]').value = '';
    renderSignature('');
    one('[data-nav320-sign-time]').textContent = 'Not signed';
    renderReview(null);
  }

  function exportReview(){
    const record = reviewStore() || {
      release:'v1.36.1',
      build_id:'EKH-OS-NAVD-20260731-001',
      audit:'navigation',
      decision:'NOT_RECORDED',
      routes:ROUTES,
      findings:FINDINGS,
      route_write:false,
      history_write:false,
      supabase_write:false,
      production_write:false
    };

    const blob = new Blob(
      [JSON.stringify(record,null,2)],
      {type:'application/json'}
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download =
      `EKH_OS_Navigation_Audit_${new Date().toISOString().replaceAll(':','-')}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),0);
  }

  page.addEventListener('click',event => {
    const tab = event.target.closest('[data-nav320-page]');
    if(tab) openPage(tab.dataset.nav320Page,{focus:true});

    const jump = event.target.closest('[data-nav320-open-page]');
    if(jump) openPage(jump.dataset.nav320OpenPage,{focus:true});

    const dot = event.target.closest('[data-nav320-dot]');
    if(dot) openPage(dot.dataset.nav320Dot,{focus:true});

    const route = event.target.closest('[data-nav320-route-index]');
    if(route){
      renderSelected(
        Number(route.dataset.nav320RouteIndex),
        {open:true}
      );
    }

    const filter = event.target.closest('[data-nav320-filter]');
    if(filter) applyFilter(filter.dataset.nav320Filter);

    const group = event.target.closest('[data-nav320-group]');
    if(group) applyFilter(group.dataset.nav320Group);
  });

  one('[data-nav320-prev]').addEventListener('click',() => move(-1));
  one('[data-nav320-next]').addEventListener('click',() => move(1));
  one('[data-nav320-open-route]').addEventListener('click',openSelectedRoute);
  one('[data-nav320-route-note]').addEventListener('input',saveRouteNote);
  one('[data-nav320-sign-name]').addEventListener(
    'input',
    event => renderSignature(event.target.value)
  );
  one('[data-nav320-record]').addEventListener('click',recordReview);
  one('[data-nav320-clear]').addEventListener('click',clearReview);
  one('[data-nav320-export]').addEventListener('click',exportReview);

  const viewport = one('.nav320-viewport');
  viewport.addEventListener('touchstart',event => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  },{passive:true});
  viewport.addEventListener('touchend',event => {
    if(touchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const distance = endX - touchStartX;
    touchStartX = null;
    if(Math.abs(distance) < 52) return;
    move(distance < 0 ? 1 : -1);
  },{passive:true});

  document.addEventListener('keydown',event => {
    const activeView = document.querySelector('.page-content > .view.active');
    if(activeView !== page) return;
    if(event.target.matches(
      'input,textarea,select,[contenteditable="true"]'
    )) return;

    if(['ArrowRight','PageDown'].includes(event.key)){
      event.preventDefault();
      move(1);
    }
    if(['ArrowLeft','PageUp'].includes(event.key)){
      event.preventDefault();
      move(-1);
    }
    if(event.key === 'Home'){
      event.preventDefault();
      openPage('brief',{focus:true});
    }
    if(event.key === 'End'){
      event.preventDefault();
      openPage('decision',{focus:true});
    }
  });

  renderSelected(selectedIndex);
  renderRouteList();
  loadReview();
  openPage('brief');
})();
