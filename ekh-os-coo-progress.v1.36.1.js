
(() => {
  'use strict';

  const TEAM = [{"name": "Jeff", "role": "Application Engineer", "project": "Smart Adventure", "assignment": "Manages runtime architecture and integration."}, {"name": "Candice", "role": "Technology Director", "project": "Command Centre", "assignment": "Coordinates Command Centre documentation."}, {"name": "Baran", "role": "Database DevOps Operator", "project": "SA-QB7000", "assignment": "Controls database safety gates."}, {"name": "Kyo", "role": "Technical Verification Specialist", "project": "Smart Adventure", "assignment": "Runs runtime regression verification."}, {"name": "Reo", "role": "Education Director", "project": "English Adventure", "assignment": "Audits English Adventure content."}, {"name": "Ilica", "role": "Curriculum Validator", "project": "English Adventure", "assignment": "Reviews CEFR curriculum alignment."}, {"name": "Alya", "role": "Question Bank QA", "project": "SA-QB7000", "assignment": "Controls question-bank audit integrity."}, {"name": "Blanc", "role": "Worksheet Studio Lead", "project": "Worksheet Studio", "assignment": "Repackages and verifies Worksheet Studio."}, {"name": "Xion", "role": "Lead Web Developer", "project": "EKH OS", "assignment": "Develops website navigation systems."}, {"name": "Kamal", "role": "Creative Director", "project": "Visual Production", "assignment": "Produces required visual assets."}, {"name": "Farah", "role": "Visual Illustration Lead", "project": "Cuddle Paws", "assignment": "Protects illustration identity standards."}, {"name": "Zenon", "role": "Digital Asset Designer", "project": "Digital Assets", "assignment": "Prepares transparent digital assets."}, {"name": "Lei", "role": "Product Video Specialist", "project": "Video Production", "assignment": "Develops storyboards and video plans."}, {"name": "Arian", "role": "Multimedia Director", "project": "Application Audio", "assignment": "Reviews application audio requirements."}, {"name": "Mario", "role": "Marketing Director", "project": "Commercial Strategy", "assignment": "Directs copywriting and positioning."}, {"name": "Zack", "role": "Content Strategy Lead", "project": "Content System", "assignment": "Plans content strategy and cadence."}, {"name": "Syakila", "role": "Social Language Analyst", "project": "Social Copy", "assignment": "Reviews natural social-language usage."}, {"name": "Paula", "role": "Digital Market Researcher", "project": "Market Intelligence", "assignment": "Researches markets, pricing, positioning."}, {"name": "Arden", "role": "Technical Release Lead", "project": "Release Readiness", "assignment": "Supports release-readiness controls."}, {"name": "Vera", "role": "Test Automation Engineer", "project": "Test Automation", "assignment": "Supports automated technical validation."}, {"name": "Nara", "role": "English Language QA", "project": "Language Quality", "assignment": "Supports English language QA."}, {"name": "Elio", "role": "Standards Mapping Researcher", "project": "Curriculum Evidence", "assignment": "Maintains curriculum evidence mapping."}, {"name": "Luna", "role": "Assessment Researcher", "project": "Assessment Validation", "assignment": "Validates progression and assessment."}];
  const PAGES = [
    ['brief','Checkpoint Brief'],
    ['completed','Completed Records'],
    ['team','Team Progress Files'],
    ['constraints','Holds & Blockers'],
    ['decisions','Decisions & Actions'],
    ['record','COO Record']
  ];
  const page = document.getElementById('coo-progress-board');
  if(!page) return;

  let pageIndex = 0;
  let teamIndex = Number(
    localStorage.getItem('ekh_coo361_team_index') || 0
  );
  let pageTouchStart = null;
  let teamTouchStart = null;

  const one = selector => page.querySelector(selector);
  const all = selector => [...page.querySelectorAll(selector)];
  const safe = value => String(value ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');

  function openPage(name,{focus=false}={}){
    const index = PAGES.findIndex(item => item[0] === name);
    pageIndex = index >= 0 ? index : 0;
    const [key,title] = PAGES[pageIndex];

    all('[data-coo361-panel]').forEach(panel => {
      const active = panel.dataset.coo361Panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
      panel.setAttribute('aria-hidden',String(!active));
    });

    all('[data-coo361-page]').forEach(button => {
      const active = button.dataset.coo361Page === key;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });

    one('[data-coo361-counter]').textContent =
      `Page ${pageIndex + 1} of ${PAGES.length}`;
    one('[data-coo361-page-title]').textContent = title;
    one('[data-coo361-prev]').disabled = pageIndex === 0;
    one('[data-coo361-next]').disabled =
      pageIndex === PAGES.length - 1;
    renderDots();

    if(focus){
      one('.coo361-viewport')?.scrollIntoView({
        behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto' : 'smooth',
        block:'start'
      });
    }
  }

  function movePage(delta){
    const next = Math.max(
      0,
      Math.min(PAGES.length - 1,pageIndex + delta)
    );
    openPage(PAGES[next][0],{focus:true});
  }

  function renderDots(){
    one('[data-coo361-dots]').innerHTML = PAGES.map((item,index) => `
      <button class="${index === pageIndex ? 'active' : ''}"
        data-coo361-dot="${item[0]}" type="button"
        aria-label="Open ${safe(item[1])}"></button>`).join('');
  }

  function renderTeam(index){
    teamIndex = Math.max(0,Math.min(TEAM.length - 1,index));
    const person = TEAM[teamIndex];

    one('[data-coo361-team-select]').value = String(teamIndex);
    one('[data-coo361-team-counter]').textContent =
      `Person ${teamIndex + 1} of ${TEAM.length}`;
    one('[data-coo361-team-name]').textContent = person.name;
    one('[data-coo361-team-role]').textContent = person.role;
    one('[data-coo361-team-project]').textContent = person.project;
    one('[data-coo361-team-assignment]').textContent = person.assignment;
    one('[data-coo361-team-prev]').disabled = teamIndex === 0;
    one('[data-coo361-team-next]').disabled =
      teamIndex === TEAM.length - 1;

    localStorage.setItem(
      'ekh_coo361_team_index',
      String(teamIndex)
    );

    window.EKHFiveWordMicrocopy?.refresh?.();
  }

  function moveTeam(delta){
    renderTeam(teamIndex + delta);
  }

  function exportCheckpoint(){
    const payload = {
      release:'v1.36.1',
      build_id:'EKH-OS-COOTP-20260731-001',
      source:{
        title:'COO Checkpoint Progress Summary',
        review_date:'2026-07-31',
        usage:'internal',
        sha256:'41a872b9d361006b6f766ab5518f279480f670c8d59716119537a1046320f599',
        direct_contact_claimed:false
      },
      checkpoint:{
        new_progress_confirmed:false,
        completed_records:5,
        active_person_records:TEAM.length,
        holds:5,
        blocker_controls:5,
        decisions_required:6,
        next_actions:3
      },
      team:TEAM.map(person => ({
        ...person,
        status:'IN_PROGRESS',
        new_progress:'NOT_CONFIRMED',
        evidence_basis:'AVAILABLE_RECORDS'
      })),
      reporting_standard:'DOCX',
      exported_at:new Date().toISOString(),
      supabase_write:false,
      production_write:false
    };

    const blob = new Blob(
      [JSON.stringify(payload,null,2)],
      {type:'application/json'}
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download =
      `EKH_OS_COO_Checkpoint_2026-07-31_${Date.now()}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),0);
  }

  page.addEventListener('click',event => {
    const tab = event.target.closest('[data-coo361-page]');
    if(tab) openPage(tab.dataset.coo361Page,{focus:true});

    const jump = event.target.closest('[data-coo361-open]');
    if(jump) openPage(jump.dataset.coo361Open,{focus:true});

    const dot = event.target.closest('[data-coo361-dot]');
    if(dot) openPage(dot.dataset.coo361Dot,{focus:true});
  });

  one('[data-coo361-prev]').addEventListener(
    'click',
    () => movePage(-1)
  );
  one('[data-coo361-next]').addEventListener(
    'click',
    () => movePage(1)
  );
  one('[data-coo361-team-prev]').addEventListener(
    'click',
    () => moveTeam(-1)
  );
  one('[data-coo361-team-next]').addEventListener(
    'click',
    () => moveTeam(1)
  );
  one('[data-coo361-team-select]').addEventListener(
    'change',
    event => renderTeam(Number(event.target.value))
  );
  one('[data-coo361-export]').addEventListener(
    'click',
    exportCheckpoint
  );

  const viewport = one('.coo361-viewport');
  viewport.addEventListener('touchstart',event => {
    pageTouchStart = event.changedTouches[0]?.clientX ?? null;
  },{passive:true});
  viewport.addEventListener('touchend',event => {
    if(pageTouchStart === null) return;
    const endX = event.changedTouches[0]?.clientX ?? pageTouchStart;
    const distance = endX - pageTouchStart;
    pageTouchStart = null;
    if(Math.abs(distance) < 52) return;
    movePage(distance < 0 ? 1 : -1);
  },{passive:true});

  const teamViewport = one('[data-coo361-team-viewport]');
  teamViewport.addEventListener('touchstart',event => {
    event.stopPropagation();
    teamTouchStart = event.changedTouches[0]?.clientX ?? null;
  },{passive:true});
  teamViewport.addEventListener('touchend',event => {
    event.stopPropagation();
    if(teamTouchStart === null) return;
    const endX = event.changedTouches[0]?.clientX ?? teamTouchStart;
    const distance = endX - teamTouchStart;
    teamTouchStart = null;
    if(Math.abs(distance) < 48) return;
    moveTeam(distance < 0 ? 1 : -1);
  },{passive:true});

  document.addEventListener('keydown',event => {
    const activeView = document.querySelector('.page-content > .view.active');
    if(activeView !== page) return;
    if(event.target.matches(
      'input,textarea,select,[contenteditable="true"]'
    )) return;

    if(['ArrowRight','PageDown'].includes(event.key)){
      event.preventDefault();
      movePage(1);
    }
    if(['ArrowLeft','PageUp'].includes(event.key)){
      event.preventDefault();
      movePage(-1);
    }
  });

  renderTeam(teamIndex);
  openPage('brief');
})();
