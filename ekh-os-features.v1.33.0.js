/* ---- inline-script-02 ---- */


(() => {
  const body = document.body;
  const themeKey = 'ekh_os_v10_visual_theme';

  function showMiniToast(title, detail = 'Prototype action') {
    const stack = document.querySelector('#toastStack');
    if (!stack) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">✦</span><div><strong>${title}</strong><span>${detail}</span></div><button aria-label="Close">×</button>`;
    stack.appendChild(toast);
    toast.querySelector('button').addEventListener('click', () => toast.remove());
    setTimeout(() => toast.remove(), 3600);
  }

  function applyTheme(theme) {
    body.dataset.theme = theme;
    localStorage.setItem(themeKey, theme);
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.classList.toggle('active', button.dataset.themeChoice === theme);
    });
  }

  const storedTheme = localStorage.getItem(themeKey) || 'aurora';
  applyTheme(storedTheme);

  document.addEventListener('click', event => {
    const themeChoice = event.target.closest('[data-theme-choice]');
    if (themeChoice) {
      applyTheme(themeChoice.dataset.themeChoice);
      showMiniToast(`${themeChoice.dataset.themeChoice[0].toUpperCase()}${themeChoice.dataset.themeChoice.slice(1)} theme applied`, 'Saved in this browser');
    }

    const demo = event.target.closest('.demo-action');
    if (demo) showMiniToast(demo.dataset.message || 'Action ready', 'This visual prototype keeps data local');

    const segmented = event.target.closest('.segmented-control button');
    if (segmented) {
      segmented.parentElement.querySelectorAll('button').forEach(button => button.classList.remove('active'));
      segmented.classList.add('active');
    }
  });

  const paletteButton = document.querySelector('#paletteButton');
  if (paletteButton) {
    paletteButton.addEventListener('click', () => {
      const order = ['aurora', 'ocean', 'sunrise'];
      const current = body.dataset.theme || 'aurora';
      const next = order[(order.indexOf(current) + 1) % order.length];
      applyTheme(next);
      showMiniToast(`${next[0].toUpperCase()}${next.slice(1)} theme applied`, 'Use Settings for a visual preview');
    });
  }

  function syncPageState() {
    const active = document.querySelector('.view.active');
    if (active) body.dataset.page = active.id;
  }

  const observer = new MutationObserver(syncPageState);
  document.querySelectorAll('.view').forEach(view => observer.observe(view, { attributes: true, attributeFilter: ['class'] }));
  syncPageState();

  const settingsAlert = document.querySelector('#settingsBrowserAlert');
  const originalAlert = document.querySelector('#browserAlertToggle');
  if (settingsAlert && originalAlert) {
    settingsAlert.checked = originalAlert.checked;
    settingsAlert.addEventListener('change', () => {
      originalAlert.checked = settingsAlert.checked;
      originalAlert.dispatchEvent(new Event('change', { bubbles: true }));
    });
    originalAlert.addEventListener('change', () => settingsAlert.checked = originalAlert.checked);
  }
})();


;

/* ---- inline-script-03 ---- */


(() => {
  const scheduleKey = 'ekh_os_v12_tomorrow_agenda_2026_07_30';

  function readAgendaState() {
    try { return JSON.parse(localStorage.getItem(scheduleKey) || '{}'); }
    catch { return {}; }
  }

  function saveAgendaState(state) {
    localStorage.setItem(scheduleKey, JSON.stringify(state));
  }

  const agendaState = readAgendaState();
  document.querySelectorAll('[data-agenda-id]').forEach(item => {
    const id = item.dataset.agendaId;
    if (agendaState[id]) item.classList.add('completed');
    const button = item.querySelector('.agenda-check');
    button?.addEventListener('click', () => {
      item.classList.toggle('completed');
      agendaState[id] = item.classList.contains('completed');
      saveAgendaState(agendaState);
    });
  });

  const profileButton = document.querySelector('#profileMenuButton');
  const profilePopover = document.querySelector('#profilePopover');

  function closeProfile() {
    if (!profilePopover || !profileButton) return;
    profilePopover.setAttribute('aria-hidden', 'true');
    profileButton.setAttribute('aria-expanded', 'false');
  }

  profileButton?.addEventListener('click', event => {
    event.stopPropagation();
    const opening = profilePopover?.getAttribute('aria-hidden') === 'true';
    document.querySelector('#createPopover')?.setAttribute('aria-hidden', 'true');
    if (profilePopover) profilePopover.setAttribute('aria-hidden', opening ? 'false' : 'true');
    profileButton.setAttribute('aria-expanded', opening ? 'true' : 'false');
  });

  profilePopover?.addEventListener('click', event => {
    const nav = event.target.closest('[data-view-target]');
    if (nav) closeProfile();
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('#profilePopover') && !event.target.closest('#profileMenuButton')) closeProfile();
  });

  document.querySelector('#profileReminderShortcut')?.addEventListener('click', () => {
    closeProfile();
    document.querySelector('[data-view="settings"]')?.click();
    setTimeout(() => document.querySelector('#settingsBrowserAlert')?.scrollIntoView({behavior:'smooth',block:'center'}), 120);
  });

  document.querySelector('.profile-signout-demo')?.addEventListener('click', () => closeProfile());

  const footerClock = document.querySelector('#footerClock');
  const updateClock = () => {
    if (!footerClock) return;
    footerClock.textContent = new Intl.DateTimeFormat('ms-MY', {
      timeZone:'Asia/Kuala_Lumpur', weekday:'short', hour:'2-digit', minute:'2-digit'
    }).format(new Date());
  };
  updateClock();
  setInterval(updateClock, 30000);

  // Ensure footer navigation uses the same page router.
  document.querySelectorAll('.ekh-footer [data-view-target]').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.viewTarget;
      document.querySelector(`[data-view="${target}"]`)?.click();
    });
  });
})();


;

/* ---- inline-script-04 ---- */


(() => {
  const byId = id => document.getElementById(id);
  function appToast(title, detail) { if (typeof showToast === 'function') showToast(title, detail); }

  function scheduleReminderExists(item) {
    return reminders.some(reminder => reminder.sourceAgendaId === item.dataset.agendaId && !reminder.completed);
  }

  function syncScheduleReminderButtons() {
    document.querySelectorAll('[data-agenda-id]').forEach(item => {
      item.querySelector('.agenda-reminder-button')?.classList.toggle('active', scheduleReminderExists(item));
    });
  }

  function addScheduleReminder(item, silent = false) {
    if (scheduleReminderExists(item)) {
      if (!silent) appToast('Reminder already exists', item.dataset.reminderTitle);
      return false;
    }
    reminders.push({
      id: uid(),
      sourceAgendaId: item.dataset.agendaId,
      title: item.dataset.reminderTitle,
      category: item.classList.contains('social') ? 'social' : 'operations',
      channel: item.classList.contains('social') ? 'fb-page' : 'general',
      date: item.dataset.reminderDate,
      time: item.dataset.reminderTime,
      repeat: 'none',
      priority: item.classList.contains('deep-work') || item.classList.contains('executive') ? 'high' : 'normal',
      notes: `CEO Operating Schedule — ${item.querySelector('p')?.textContent.trim() || ''}`,
      offsets: [30, 10, 0],
      completed: false,
      read: false,
      triggered: false,
      createdAt: new Date().toISOString()
    });
    renderAll();
    syncScheduleReminderButtons();
    if (!silent) appToast('Schedule reminder added', `${item.dataset.reminderTitle} • ${item.dataset.reminderTime}`);
    return true;
  }

  function initScheduleReminderControls() {
    document.querySelectorAll('[data-agenda-id]').forEach(item => {
      item.querySelector('.agenda-reminder-button')?.addEventListener('click', () => addScheduleReminder(item));
    });
    byId('addAllScheduleReminders')?.addEventListener('click', () => {
      let added = 0;
      document.querySelectorAll('[data-agenda-id]').forEach(item => { if (addScheduleReminder(item, true)) added += 1; });
      appToast('CEO schedule reminders ready', `${added} new reminder(s) added for 30 July 2026.`);
      if (typeof showView === 'function') showView('notifications');
    });
    byId('enableScheduleNotifications')?.addEventListener('click', () => {
      if (typeof enableBrowserAlerts === 'function') enableBrowserAlerts();
    });
    syncScheduleReminderButtons();
  }


  initScheduleReminderControls();
  // v1.7.3: legacy Staff Drive initialisation is disabled; secure drive bootstraps after session and role validation.
})();


;

/* ---- inline-script-05 ---- */


(() => {
  const setupStateKey = 'ekh_os_v133_staff_drive_setup_collapsed';
  const drive = document.querySelector('#staffDrive');
  const setupPanel = document.querySelector('#staffDriveSetupPanel');
  const toggle = document.querySelector('#toggleStaffDriveSetup');
  const fileBrowser = document.querySelector('#staffFileBrowser');

  function applySetupState(collapsed) {
    setupPanel?.classList.toggle('collapsed', collapsed);
    drive?.classList.toggle('setup-collapsed', collapsed);
    if (toggle) {
      toggle.textContent = collapsed ? 'Show setup' : 'Hide setup';
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
    localStorage.setItem(setupStateKey, collapsed ? '1' : '0');
  }

  const stored = localStorage.getItem(setupStateKey);
  const hasSavedConnection = Boolean(localStorage.getItem('ekh_os_v13_supabase_config'));
  applySetupState(stored === null ? hasSavedConnection : stored === '1');

  toggle?.addEventListener('click', () => {
    applySetupState(!setupPanel.classList.contains('collapsed'));
  });

  function syncMobileSelectedFolder() {
    const name = document.querySelector('#selectedStaffFolderName')?.textContent || 'Selected folder';
    const initials = document.querySelector('#selectedStaffInitials')?.textContent || 'AF';
    const mobileName = document.querySelector('#mobileSelectedName');
    const mobileInitials = document.querySelector('#mobileSelectedInitials');
    if (mobileName) mobileName.textContent = name;
    if (mobileInitials) mobileInitials.textContent = initials;
  }

  document.querySelector('#staffFolderGrid')?.addEventListener('click', event => {
    if (!event.target.closest('[data-staff-slug]')) return;
    setTimeout(() => {
      syncMobileSelectedFolder();
      fileBrowser?.classList.remove('folder-updated');
      void fileBrowser?.offsetWidth;
      fileBrowser?.classList.add('folder-updated');
    }, 30);
  });

  document.querySelector('#mobileChooseFiles')?.addEventListener('click', () => {
    document.querySelector('#staffFileInput')?.click();
  });

  document.querySelector('#mobileUploadFiles')?.addEventListener('click', () => {
    document.querySelector('#uploadStaffFiles')?.click();
  });

  syncMobileSelectedFolder();
})();


;

/* ---- inline-script-06 ---- */


(() => {
  const projectSearch = document.querySelector('#projectProgressSearch');
  const projectButtons = document.querySelector('#projectFilterButtons');
  const projectCards = [...document.querySelectorAll('.real-project-card')];
  let activeProjectFilter = 'ALL';

  function filterProjects() {
    const query = (projectSearch?.value || '').trim().toLowerCase();
    projectCards.forEach(card => {
      const statusMatch = activeProjectFilter === 'ALL' || card.dataset.projectStatus === activeProjectFilter;
      const searchMatch = !query || card.dataset.projectSearch.includes(query);
      card.hidden = !(statusMatch && searchMatch);
    });
  }

  projectButtons?.addEventListener('click', event => {
    const button = event.target.closest('[data-project-filter]');
    if (!button) return;
    activeProjectFilter = button.dataset.projectFilter;
    projectButtons.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
    filterProjects();
  });
  projectSearch?.addEventListener('input', filterProjects);

  const teamStatus = document.querySelector('#teamStatusFilter');
  const teamSearch = document.querySelector('#teamProgressSearch');
  const teamRows = [...document.querySelectorAll('#teamProgressBody tr')];

  function filterTeam() {
    const status = teamStatus?.value || 'ALL';
    const query = (teamSearch?.value || '').trim().toLowerCase();
    teamRows.forEach(row => {
      const statusMatch = status === 'ALL' || row.dataset.teamStatus === status;
      const searchMatch = !query || row.dataset.teamSearch.includes(query);
      row.hidden = !(statusMatch && searchMatch);
    });
  }
  teamStatus?.addEventListener('change', filterTeam);
  teamSearch?.addEventListener('input', filterTeam);

  document.querySelector('#openTeamProgress')?.addEventListener('click', () => {
    document.querySelector('#teamProgressPanel')?.scrollIntoView({behavior:'smooth', block:'start'});
  });

  document.querySelector('#exportProjectSnapshot')?.addEventListener('click', async () => {
    try {
      const response = await fetch('project_progress_snapshot.json');
      const snapshot = await response.blob();
      const url = URL.createObjectURL(snapshot);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'EKH_OS_Project_Progress_2026-07-30_1748.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      const fallback = {
        snapshot_date: '2026-07-30',
        note: 'Open the packaged COO checkpoint project_progress_snapshot.json file.'
      };
      const blob = new Blob([JSON.stringify(fallback, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'EKH_OS_Project_Progress_2026-07-30_1748.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  });
})();


;

/* ---- inline-script-07 ---- */


(() => {
  const CONFIG_KEY = 'ekh_os_v13_supabase_config';
  const ACTIVITY_TABLE = 'ekh_activities';
  const EVENT_TABLE = 'ekh_activity_reminder_events';
  const OWNER_UUID = 'c0b363c4-0033-4418-9813-679a5c6dec35';

  let client = null;
  let user = null;
  let activities = [];
  let realtimeChannel = null;
  let currentStatusFilter = 'open';
  let claimingEvents = new Set();

  const q = selector => document.querySelector(selector);
  const qa = selector => [...document.querySelectorAll(selector)];
  const htmlSafe = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

  function toast(title, detail) {
    if (typeof showToast === 'function') showToast(title, detail);
  }

  function config() {
    try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'); }
    catch { return {}; }
  }

  function localDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function startOfDay(date = new Date()) {
    const value = new Date(date);
    value.setHours(0,0,0,0);
    return value;
  }

  function endOfDay(date = new Date()) {
    const value = new Date(date);
    value.setHours(23,59,59,999);
    return value;
  }

  function dueDate(activity) {
    return new Date(activity.scheduled_at);
  }

  function dueLabel(activity) {
    const due = dueDate(activity);
    const diff = due - new Date();
    const mins = Math.round(diff / 60000);
    if (activity.status === 'completed') return 'Completed';
    if (activity.status === 'cancelled') return 'Cancelled';
    if (mins < -1440) return `${Math.abs(Math.round(mins / 1440))}d overdue`;
    if (mins < 0) return `${Math.abs(mins)}m overdue`;
    if (mins < 60) return `In ${Math.max(0, mins)}m`;
    if (mins < 1440) return `In ${Math.floor(mins / 60)}h ${mins % 60}m`;
    return due.toLocaleDateString('ms-MY', {day:'numeric',month:'short'});
  }

  function formatDateTime(value) {
    return new Date(value).toLocaleString('ms-MY', {
      timeZone:'Asia/Kuala_Lumpur',
      weekday:'short', day:'numeric', month:'short',
      hour:'numeric', minute:'2-digit'
    });
  }

  function typeIcon(type) {
    return ({
      operations:'◎', project:'▦', social:'f', review:'⌕',
      approval:'✓', follow_up:'↗', break:'☕'
    })[type] || '◔';
  }

  function setConnection(mode, title, detail) {
    const node = q('#activityConnectionState');
    if (!node) return;
    node.classList.remove('connected','error');
    if (mode) node.classList.add(mode);
    node.querySelector('strong').textContent = title;
    node.querySelector('small').textContent = detail;
    const footer = q('#footerActivityStatus');
    if (footer) footer.innerHTML = `<i></i> ${htmlSafe(title)}`;
  }

  function updatePermissionState() {
    const permission = ('Notification' in window) ? Notification.permission : 'unsupported';
    const label = q('#activityBrowserPermission');
    const switchNode = q('#settingsBrowserAlert');
    if (label) label.textContent = permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Blocked' : permission === 'unsupported' ? 'Unsupported' : 'Not enabled';
    if (switchNode) switchNode.checked = permission === 'granted';
  }

  async function enableBrowserNotifications() {
    if (!('Notification' in window)) {
      toast('Browser notifications unavailable', 'This browser does not support the Notifications API.');
      return;
    }
    const permission = await Notification.requestPermission();
    updatePermissionState();
    toast(permission === 'granted' ? 'Browser alerts enabled' : 'Permission not granted', permission === 'granted' ? 'Due Supabase activities can alert while EKH OS is open.' : 'In-app activity alerts will still work.');
  }

  async function getClient() {
    if (window.ekhSupabase) {
      client = window.ekhSupabase;
      return client;
    }
    const saved = config();
    if (!saved.url || !saved.key || !window.supabase?.createClient) return null;
    client = window.supabase.createClient(saved.url, saved.key, {
      auth: {persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    });
    window.ekhSupabase = client;
    return client;
  }

  async function loadSession() {
    await getClient();
    if (!client) {
      setConnection('error','Supabase not configured','Open Files → Staff Drive and save the Project URL and publishable key.');
      q('#drawerActivityStatus').textContent = 'Supabase is not configured.';
      return false;
    }
    const {data, error} = await client.auth.getUser();
    if (error || !data.user) {
      user = null;
      setConnection('error','Sign-in required','Sign in through Files → Staff Drive to access your private activities.');
      q('#drawerActivityStatus').textContent = 'Sign in through Staff Drive.';
      return false;
    }
    user = data.user;
    q('#activityOwnerLabel').textContent = user.email || user.id.slice(0,8);
    q('#activitySettingsOwner').textContent = user.email || user.id;
    q('#activitySettingsSyncState').textContent = 'Connected';
    q('#activitySettingsSyncState').className = 'table-badge track';
    setConnection('connected','Supabase activities connected',`Authenticated as ${user.email || user.id}`);
    return true;
  }

  async function loadActivities(showToast = false) {
    const ready = await loadSession();
    if (!ready) {
      activities = [];
      renderAllActivities();
      return;
    }
    const {data, error} = await client
      .from(ACTIVITY_TABLE)
      .select('*')
      .eq('owner_id', user.id)
      .order('scheduled_at', {ascending:true});
    if (error) {
      setConnection('error','Activity table unavailable',error.message);
      q('#supabaseActivityList').innerHTML = `<div class="activity-loading-state">Run the v1.5 Supabase activity SQL migration.<br><code>${htmlSafe(error.message)}</code></div>`;
      q('#drawerActivityStatus').textContent = 'Activity table is not ready.';
      return;
    }
    activities = data || [];
    q('#activityLastSync').textContent = new Date().toLocaleTimeString('ms-MY', {hour:'2-digit',minute:'2-digit'});
    renderAllActivities();
    syncScheduleButtons();
    if (showToast) toast('Activities refreshed', `${activities.length} Supabase record(s) loaded.`);
  }

  function activityMatches(activity) {
    const now = new Date();
    const due = dueDate(activity);
    const query = (q('#activitySearch')?.value || '').trim().toLowerCase();
    const project = q('#activityProjectFilter')?.value || 'all';
    const priority = q('#activityPriorityFilter')?.value || 'all';
    const haystack = `${activity.title} ${activity.description || ''} ${activity.project_code || ''} ${activity.activity_type || ''}`.toLowerCase();

    let statusMatch = true;
    if (currentStatusFilter === 'open') statusMatch = !['completed','cancelled'].includes(activity.status);
    if (currentStatusFilter === 'overdue') statusMatch = !['completed','cancelled'].includes(activity.status) && due < now;
    if (currentStatusFilter === 'today') statusMatch = due >= startOfDay(now) && due <= endOfDay(now);
    if (currentStatusFilter === 'completed') statusMatch = activity.status === 'completed';

    return statusMatch &&
      (project === 'all' || activity.project_code === project) &&
      (priority === 'all' || activity.priority === priority) &&
      (!query || haystack.includes(query));
  }

  function renderProjectFilter() {
    const select = q('#activityProjectFilter');
    if (!select) return;
    const current = select.value;
    const projects = [...new Set(activities.map(item => item.project_code).filter(Boolean))].sort();
    select.innerHTML = '<option value="all">All projects</option>' + projects.map(project => `<option value="${htmlSafe(project)}">${htmlSafe(project)}</option>`).join('');
    if ([...select.options].some(option => option.value === current)) select.value = current;
  }

  function renderActivityList() {
    const list = q('#supabaseActivityList');
    const empty = q('#supabaseActivityEmpty');
    if (!list || !empty) return;
    const filtered = activities.filter(activityMatches);
    empty.hidden = filtered.length > 0;
    list.innerHTML = filtered.map(activity => {
      const due = dueDate(activity);
      const overdue = due < new Date() && !['completed','cancelled'].includes(activity.status);
      const offsets = Array.isArray(activity.reminder_offsets) ? activity.reminder_offsets.join(', ') : '';
      return `<article class="supabase-activity-card ${overdue ? 'overdue' : ''} ${htmlSafe(activity.status)}" data-activity-id="${activity.id}">
        <span class="activity-type-icon">${typeIcon(activity.activity_type)}</span>
        <div class="activity-card-copy">
          <h4>${htmlSafe(activity.title)}</h4>
          <p>${htmlSafe(activity.description || 'No additional description.')}</p>
          <div class="activity-card-meta">
            <span>${htmlSafe(activity.project_code || 'GENERAL')}</span>
            <span>${htmlSafe(activity.priority || 'normal')}</span>
            <span>${htmlSafe(activity.source || 'manual')}</span>
            <span>Alerts: ${htmlSafe(offsets || '0')} min</span>
          </div>
        </div>
        <div class="activity-due-block"><time>${htmlSafe(formatDateTime(activity.scheduled_at))}</time><small>${htmlSafe(dueLabel(activity))}</small></div>
        <div class="activity-card-actions">
          ${activity.status !== 'completed' ? '<button data-activity-action="complete" title="Complete">✓</button>' : ''}
          ${!['completed','cancelled'].includes(activity.status) ? '<button data-activity-action="snooze" title="Snooze one hour">◷</button>' : ''}
          <button data-activity-action="edit" title="Edit">✎</button>
          ${activity.status !== 'cancelled' ? '<button data-activity-action="cancel" title="Cancel activity">×</button>' : ''}
        </div>
      </article>`;
    }).join('');
  }

  function renderStats() {
    const now = new Date();
    const overdue = activities.filter(a => !['completed','cancelled'].includes(a.status) && dueDate(a) < now);
    const today = activities.filter(a => dueDate(a) >= startOfDay(now) && dueDate(a) <= endOfDay(now) && !['completed','cancelled'].includes(a.status));
    const upcoming = activities.filter(a => dueDate(a) > endOfDay(now) && !['completed','cancelled'].includes(a.status));
    const completed = activities.filter(a => a.status === 'completed');
    const open = activities.filter(a => !['completed','cancelled'].includes(a.status));

    q('#activityOverdueStat').textContent = overdue.length;
    q('#activityTodayStat').textContent = today.length;
    q('#activityUpcomingStat').textContent = upcoming.length;
    q('#activityCompletedStat').textContent = completed.length;
    q('#dashboardReminderCount').textContent = open.length;
    q('#dashboardActivityTrend').textContent = `${today.length} due today`;
    q('#dashboardActivityFootA').textContent = `${overdue.length} overdue`;
    q('#dashboardActivityFootB').textContent = `${upcoming.length} upcoming`;
    q('#navNotificationCount').textContent = overdue.length + today.length;
    q('#bellCount').textContent = overdue.length + today.length;
    q('#activityCloudTotal').textContent = activities.length;
    q('#activityCloudOpen').textContent = open.length;
    q('#activityCloudCompleted').textContent = completed.length;
    q('#activitySettingsRealtime').textContent = realtimeChannel ? 'Connected' : 'Polling';
    q('#activityCloudTotal').closest('.settings-section')?.classList.remove('activity-settings-disconnected');

    const attention = overdue.length + today.length;
    q('#activityAttentionTitle').textContent = attention ? `${attention} Supabase activit${attention === 1 ? 'y' : 'ies'} need attention` : 'No urgent Supabase activities';
    q('#activityAttentionSummary').textContent = attention ? `${overdue.length} overdue and ${today.length} due today. These values come from your authenticated activity records.` : `${upcoming.length} upcoming activity record(s).`;
    q('#supabaseAttentionStrip').classList.toggle('no-activities', attention === 0);

    const todayTotal = activities.filter(a => dueDate(a) >= startOfDay(now) && dueDate(a) <= endOfDay(now) && a.status !== 'cancelled');
    const todayCompleted = todayTotal.filter(a => a.status === 'completed');
    const progress = todayTotal.length ? Math.round((todayCompleted.length / todayTotal.length) * 100) : 0;
    q('#dashboardActivityRing').style.setProperty('--progress', progress);
    q('#dashboardActivityRingText').textContent = `${todayCompleted.length}/${todayTotal.length}`;
    q('#dashboardActivitySummaryTitle').textContent = todayTotal.length ? `${today.length} activity item(s) remain today` : 'No activities scheduled today';
    q('#dashboardActivitySummaryText').textContent = todayTotal.length ? `${todayCompleted.length} completed; ${overdue.length} currently overdue.` : `${upcoming.length} upcoming Supabase record(s).`;
  }

  function renderDashboard() {
    const open = activities
      .filter(a => !['completed','cancelled'].includes(a.status))
      .sort((a,b) => dueDate(a)-dueDate(b));
    const queue = q('#dashboardActivityQueue');
    const timeline = q('#dashboardReminderTimeline');

    queue.innerHTML = open.slice(0,5).map(activity => {
      const overdue = dueDate(activity) < new Date();
      return `<article class="activity-priority-item ${overdue ? 'overdue' : ''}" data-activity-open="${activity.id}">
        <span class="activity-mini-icon">${typeIcon(activity.activity_type)}</span>
        <div><strong>${htmlSafe(activity.title)}</strong><span>${htmlSafe(activity.project_code || 'GENERAL')} • ${htmlSafe(formatDateTime(activity.scheduled_at))}</span></div>
        <time>${htmlSafe(dueLabel(activity))}</time>
      </article>`;
    }).join('') || '<div class="activity-loading-state">No open Supabase activities.</div>';

    timeline.innerHTML = open.slice(0,4).map(activity => {
      const due = dueDate(activity);
      return `<article class="compact-reminder" data-activity-open="${activity.id}">
        <span class="reminder-time">${due.toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit'})}</span>
        <span class="channel-logo follow">${typeIcon(activity.activity_type)}</span>
        <div><strong>${htmlSafe(activity.title)}</strong><small>${htmlSafe(activity.project_code || 'GENERAL')}</small></div>
        <span class="mini-status">${htmlSafe(dueLabel(activity))}</span>
      </article>`;
    }).join('') || '<div class="activity-loading-state">No upcoming activities.</div>';
  }

  function renderDrawer() {
    const list = q('#drawerList');
    const open = activities
      .filter(a => !['completed','cancelled'].includes(a.status))
      .sort((a,b) => dueDate(a)-dueDate(b))
      .slice(0,8);
    q('#drawerActivityStatus').textContent = user ? `${open.length} open activity item(s) loaded from Supabase.` : 'Sign in through Staff Drive.';
    list.innerHTML = open.map(activity => `<article class="drawer-activity-item" data-activity-open="${activity.id}">
      <span>${typeIcon(activity.activity_type)}</span>
      <div><b>${htmlSafe(activity.title)}</b><small>${htmlSafe(activity.project_code || 'GENERAL')} • ${htmlSafe(dueLabel(activity))}</small></div>
      <time>${new Date(activity.scheduled_at).toLocaleDateString('ms-MY',{day:'numeric',month:'short'})}</time>
    </article>`).join('') || '<div class="activity-loading-state">No open activities.</div>';
  }

  function renderScheduleCount() {
    const count = activities.filter(item => item.source === 'ceo_schedule' && item.source_ref?.startsWith('ceo-2026-07-30-')).length;
    q('#ceoScheduleSyncedCount').textContent = count;
  }

  function renderAllActivities() {
    renderProjectFilter();
    renderActivityList();
    renderStats();
    renderDashboard();
    renderDrawer();
    renderScheduleCount();
  }

  function toLocalInput(value) {
    const date = new Date(value);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0,16);
  }

  function openModal(activity = null, scheduleItem = null) {
    q('#supabaseActivityModalTitle').textContent = activity ? 'Edit activity' : 'Add activity';
    q('#supabaseActivityId').value = activity?.id || '';
    q('#supabaseActivitySourceRef').value = activity?.source_ref || scheduleItem?.sourceRef || '';
    q('#supabaseActivityTitle').value = activity?.title || scheduleItem?.title || '';
    q('#supabaseActivityProject').value = activity?.project_code || scheduleItem?.project || 'GENERAL';
    q('#supabaseActivityType').value = activity?.activity_type || scheduleItem?.type || 'operations';
    const defaultDate = new Date(Date.now() + 60 * 60 * 1000);
    q('#supabaseActivityScheduledAt').value = activity ? toLocalInput(activity.scheduled_at) : scheduleItem?.scheduledLocal || toLocalInput(defaultDate);
    q('#supabaseActivityPriority').value = activity?.priority || scheduleItem?.priority || 'normal';
    q('#supabaseActivitySource').value = activity?.source || scheduleItem?.source || 'manual';
    q('#supabaseActivityStatus').value = activity?.status || 'scheduled';
    q('#supabaseActivityDescription').value = activity?.description || scheduleItem?.description || '';
    const offsets = activity?.reminder_offsets || scheduleItem?.offsets || [30,10,0];
    qa('.activity-offsets input').forEach(input => input.checked = offsets.includes(Number(input.value)));
    q('#supabaseActivityModal').classList.add('open');
    q('#supabaseActivityModal').setAttribute('aria-hidden','false');
  }

  function closeModal() {
    q('#supabaseActivityModal').classList.remove('open');
    q('#supabaseActivityModal').setAttribute('aria-hidden','true');
    q('#supabaseActivityForm').reset();
  }

  async function saveActivity(event) {
    event.preventDefault();
    if (!await loadSession()) return;
    const id = q('#supabaseActivityId').value;
    const status = q('#supabaseActivityStatus').value;
    const payload = {
      owner_id: user.id,
      title: q('#supabaseActivityTitle').value.trim(),
      description: q('#supabaseActivityDescription').value.trim() || null,
      activity_type: q('#supabaseActivityType').value,
      project_code: q('#supabaseActivityProject').value,
      source: q('#supabaseActivitySource').value,
      source_ref: q('#supabaseActivitySourceRef').value || null,
      scheduled_at: new Date(q('#supabaseActivityScheduledAt').value).toISOString(),
      reminder_offsets: qa('.activity-offsets input:checked').map(input => Number(input.value)),
      priority: q('#supabaseActivityPriority').value,
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null
    };
    if (!payload.title || !payload.scheduled_at) return;

    let result;
    if (id) result = await client.from(ACTIVITY_TABLE).update(payload).eq('id',id).eq('owner_id',user.id);
    else result = await client.from(ACTIVITY_TABLE).insert(payload);
    if (result.error) return toast('Activity save failed', result.error.message);
    closeModal();
    toast(id ? 'Activity updated' : 'Activity created', payload.title);
    await loadActivities();
  }

  async function updateActivity(id, patch, successTitle) {
    if (!await loadSession()) return;
    const {error} = await client.from(ACTIVITY_TABLE).update(patch).eq('id',id).eq('owner_id',user.id);
    if (error) return toast('Activity update failed', error.message);
    toast(successTitle, activities.find(a => a.id === id)?.title || 'Activity');
    await loadActivities();
  }

  async function handleActivityAction(event) {
    const button = event.target.closest('[data-activity-action]');
    if (!button) return;
    const card = button.closest('[data-activity-id]');
    const activity = activities.find(item => item.id === card?.dataset.activityId);
    if (!activity) return;
    const action = button.dataset.activityAction;
    if (action === 'complete') return updateActivity(activity.id, {status:'completed',completed_at:new Date().toISOString()}, 'Activity completed');
    if (action === 'snooze') {
      const next = new Date(Math.max(Date.now(),dueDate(activity).getTime()) + 60*60*1000);
      return updateActivity(activity.id, {scheduled_at:next.toISOString(),status:'scheduled',completed_at:null}, 'Activity snoozed');
    }
    if (action === 'edit') return openModal(activity);
    if (action === 'cancel') {
      if (!confirm(`Cancel activity “${activity.title}”?`)) return;
      return updateActivity(activity.id, {status:'cancelled',completed_at:null}, 'Activity cancelled');
    }
  }

  function scheduleData(item) {
    const local = `${item.dataset.reminderDate}T${item.dataset.reminderTime}`;
    const type = item.classList.contains('social') ? 'social' :
      item.classList.contains('break') ? 'break' :
      item.classList.contains('deep-work') ? 'project' :
      item.classList.contains('executive') ? 'review' : 'operations';
    const project = item.dataset.agendaId === 'tomorrow-1400' ? 'WORKSHEET-STUDIO' :
      item.dataset.agendaId === 'tomorrow-1550' ? 'EKH-OS' :
      item.dataset.agendaId === 'tomorrow-1020' || item.dataset.agendaId === 'tomorrow-0830' ? 'SA-QB7000' :
      item.classList.contains('social') ? 'CONTENT-OS' : 'GENERAL';
    return {
      sourceRef:`ceo-2026-07-30-${item.dataset.agendaId}`,
      title:item.dataset.reminderTitle,
      scheduledLocal:local,
      type,
      project,
      source:'ceo_schedule',
      priority:item.classList.contains('deep-work') || item.classList.contains('executive') ? 'high' : 'normal',
      description:item.querySelector('p')?.textContent.trim() || '',
      offsets:[30,10,0]
    };
  }

  async function upsertScheduleItem(item, silent = false) {
    if (!await loadSession()) return false;
    const data = scheduleData(item);
    const payload = {
      owner_id:user.id,title:data.title,description:data.description,activity_type:data.type,
      project_code:data.project,source:data.source,source_ref:data.sourceRef,
      scheduled_at:new Date(data.scheduledLocal).toISOString(),reminder_offsets:data.offsets,
      priority:data.priority,status:'scheduled',completed_at:null
    };
    const {error} = await client.from(ACTIVITY_TABLE).upsert(payload,{onConflict:'owner_id,source_ref'});
    if (error) {
      if (!silent) toast('Schedule sync failed', error.message);
      return false;
    }
    if (!silent) toast('Schedule activity synced', payload.title);
    return true;
  }

  async function syncFullSchedule() {
    const items = qa('[data-agenda-id]');
    let synced = 0;
    for (const item of items) if (await upsertScheduleItem(item,true)) synced += 1;
    toast('CEO schedule synced to Supabase', `${synced} activity item(s) inserted or updated.`);
    await loadActivities();
  }

  function syncScheduleButtons() {
    qa('[data-agenda-id]').forEach(item => {
      const ref = `ceo-2026-07-30-${item.dataset.agendaId}`;
      item.querySelector('.agenda-reminder-button')?.classList.toggle('active',activities.some(a => a.source_ref === ref && a.status !== 'cancelled'));
    });
  }

  async function claimReminder(activity, offset) {
    const key = `${activity.id}:${offset}`;
    if (claimingEvents.has(key)) return false;
    claimingEvents.add(key);
    const {error} = await client.from(EVENT_TABLE).insert({
      activity_id:activity.id,user_id:user.id,offset_minutes:offset
    });
    claimingEvents.delete(key);
    if (error) {
      if (error.code === '23505') return false;
      console.warn('Reminder event claim failed', error);
      return false;
    }
    return true;
  }

  async function checkDueActivities() {
    if (!user || !client || !activities.length) return;
    const now = new Date();
    for (const activity of activities) {
      if (['completed','cancelled'].includes(activity.status)) continue;
      const due = dueDate(activity);
      const offsets = Array.isArray(activity.reminder_offsets) && activity.reminder_offsets.length ? activity.reminder_offsets : [0];
      for (const offset of offsets) {
        const target = new Date(due.getTime() - Number(offset)*60000);
        const withinWindow = offset > 0
          ? now >= target && now < due
          : now >= due && now - due < 48*60*60*1000;
        if (!withinWindow) continue;
        if (!await claimReminder(activity,Number(offset))) continue;
        const message = offset > 0 ? `${activity.title} is due in ${offset} minutes.` : `${activity.title} is due now.`;
        toast('Supabase activity reminder', message);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('EKH OS activity reminder',{body:message,tag:`activity-${activity.id}-${offset}`});
        }
      }
    }
  }

  function subscribeRealtime() {
    if (!client || !user) return;
    if (realtimeChannel) client.removeChannel(realtimeChannel);
    realtimeChannel = client.channel(`ekh-activities-${user.id}`)
      .on('postgres_changes',{
        event:'*',schema:'public',table:ACTIVITY_TABLE,filter:`owner_id=eq.${user.id}`
      },() => loadActivities())
      .subscribe(status => {
        const connected = status === 'SUBSCRIBED';
        q('#activityRealtimeState').textContent = connected ? 'Connected' : status;
        q('#activitySettingsRealtime').textContent = connected ? 'Connected' : 'Polling';
      });
  }

  async function exportActivities() {
    if (!activities.length) return toast('Nothing to export','No Supabase activities are loaded.');
    const blob = new Blob([JSON.stringify({exported_at:new Date().toISOString(),owner_id:user?.id,activities},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EKH_OS_My_Activities_${localDateKey()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  }

  async function initialize() {
    updatePermissionState();
    const ready = await loadSession();
    if (ready) {
      subscribeRealtime();
      await loadActivities();
      checkDueActivities();
    } else {
      renderAllActivities();
    }
  }

  // Capture schedule reminder clicks before the old local reminder listener.
  document.addEventListener('click', event => {
    const scheduleButton = event.target.closest('.agenda-reminder-button');
    if (scheduleButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const item = scheduleButton.closest('[data-agenda-id]');
      if (item) upsertScheduleItem(item).then(loadActivities);
      return;
    }
    const addAll = event.target.closest('#addAllScheduleReminders');
    if (addAll) {
      event.preventDefault(); event.stopImmediatePropagation(); syncFullSchedule(); return;
    }
    const enableSchedule = event.target.closest('#enableScheduleNotifications');
    if (enableSchedule) {
      event.preventDefault(); event.stopImmediatePropagation(); enableBrowserNotifications(); return;
    }
  },true);

  q('#activityStatusTabs')?.addEventListener('click',event => {
    const button = event.target.closest('[data-activity-status]');
    if (!button) return;
    currentStatusFilter = button.dataset.activityStatus;
    qa('#activityStatusTabs button').forEach(item => item.classList.toggle('active',item === button));
    renderActivityList();
  });
  q('#activityProjectFilter')?.addEventListener('change',renderActivityList);
  q('#activityPriorityFilter')?.addEventListener('change',renderActivityList);
  q('#activitySearch')?.addEventListener('input',renderActivityList);
  q('#supabaseActivityList')?.addEventListener('click',handleActivityAction);
  q('#addSupabaseActivityButton')?.addEventListener('click',() => openModal());
  q('#dashboardAddActivity')?.addEventListener('click',() => openModal());
  q('#closeSupabaseActivityModal')?.addEventListener('click',closeModal);
  q('#cancelSupabaseActivity')?.addEventListener('click',closeModal);
  q('#supabaseActivityModal')?.addEventListener('click',event => {if(event.target === q('#supabaseActivityModal')) closeModal();});
  q('#supabaseActivityForm')?.addEventListener('submit',saveActivity);
  q('#refreshSupabaseActivities')?.addEventListener('click',() => loadActivities(true));
  q('#enableActivityBrowserAlerts')?.addEventListener('click',enableBrowserNotifications);
  q('#settingsBrowserAlert')?.addEventListener('change',event => {
    if (event.target.checked) enableBrowserNotifications();
    else toast('Browser permission unchanged','Disable notifications from the browser site settings.');
  });
  q('#syncCeoScheduleToSupabase')?.addEventListener('click',syncFullSchedule);
  q('#exportSupabaseActivities')?.addEventListener('click',exportActivities);

  document.addEventListener('click',event => {
    const item = event.target.closest('[data-activity-open]');
    if (!item) return;
    if (typeof showView === 'function') showView('notifications');
    setTimeout(() => document.querySelector(`[data-activity-id="${item.dataset.activityOpen}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),120);
  });

  q('#profileReminderShortcut')?.addEventListener('click',() => {
    if (typeof showView === 'function') showView('settings');
    setTimeout(() => q('#supabaseActivitySettings')?.scrollIntoView({behavior:'smooth',block:'center'}),100);
  });

  client?.auth?.onAuthStateChange?.((_event,session) => {
    user = session?.user || null;
    if (user) { subscribeRealtime(); loadActivities(); }
    else { activities=[]; renderAllActivities(); }
  });

  initialize();
  setInterval(() => loadActivities(),60000);
  setInterval(checkDueActivities,30000);
  window.addEventListener('focus',() => {loadActivities();checkDueActivities();});
  document.addEventListener('visibilitychange',() => {if(!document.hidden){loadActivities();checkDueActivities();}});
})();


;

/* ---- ekh-v16-mia-controller ---- */

(() => {
  'use strict';
  const byId = (id) => document.getElementById(id);
  const splitLines = (value) => value.split(/\n+/).map((item) => item.trim()).filter(Boolean);
  const today = new Date();
  const isoLocal = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function setDefaultDate() {
    const field = byId('miaReportDate');
    if (field && !field.value) field.value = isoLocal;
  }

  function buildPayload() {
    const form = byId('miaProgressForm');
    if (!form) return null;
    const data = new FormData(form);
    return {
      schema_version: 'mia-progress-v1',
      publication_status: byId('miaOwnerApproved')?.checked ? 'approved_for_upload' : 'draft_not_approved',
      project: String(data.get('project') || '').trim(),
      report_owner: String(data.get('report_owner') || '').trim(),
      report_date: String(data.get('report_date') || '').trim(),
      status: String(data.get('status') || '').trim(),
      executive_summary: String(data.get('summary') || '').trim(),
      completed_progress: splitLines(String(data.get('completed') || '')),
      blocker_or_risk: String(data.get('blocker') || '').trim() || 'None recorded',
      next_action: String(data.get('next_action') || '').trim(),
      evidence_references: splitLines(String(data.get('evidence') || '')),
      owner_approval: Boolean(byId('miaOwnerApproved')?.checked),
      publication_rules: {
        overwrite_current_snapshot_only_when_newer_and_approved: true,
        append_evidence_to_history: true,
        preserve_previous_git_commit_for_rollback: true,
        require_kyo_regression_check: true,
        require_cloudflare_production_verification: true
      },
      generated_at: new Date().toISOString()
    };
  }

  function validatePayload(payload) {
    const missing = [];
    if (!payload.project) missing.push('Project');
    if (!payload.report_owner) missing.push('Report owner');
    if (!payload.report_date) missing.push('Report date');
    if (!payload.status) missing.push('Status');
    if (!payload.executive_summary) missing.push('Executive summary');
    if (!payload.completed_progress.length) missing.push('Progress completed');
    if (!payload.next_action) missing.push('Next action');
    if (!payload.evidence_references.length) missing.push('Evidence references');
    return missing;
  }

  document.addEventListener('DOMContentLoaded', () => {
    setDefaultDate();
    const form = byId('miaProgressForm');
    const preview = byId('miaPayloadPreview');
    const validation = byId('miaValidation');
    const copyButton = byId('copyMiaPayload');
    const resetButton = byId('resetMiaPayload');
    if (!form || !preview || !validation) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = buildPayload();
      const missing = validatePayload(payload);
      preview.textContent = JSON.stringify(payload, null, 2);
      validation.className = 'mia-validation';
      if (missing.length) {
        validation.classList.add('error');
        validation.textContent = `Validation blocked. Complete: ${missing.join(', ')}.`;
        return;
      }
      if (!payload.owner_approval) {
        validation.classList.add('error');
        validation.textContent = 'Payload structure is valid, but publication is blocked because owner approval is not recorded.';
        return;
      }
      validation.classList.add('ok');
      validation.textContent = 'Approved payload is structurally valid. Next gate: Kyo regression check, GitHub commit, Cloudflare deployment and production verification.';
    });

    copyButton?.addEventListener('click', async () => {
      const payload = buildPayload();
      const missing = validatePayload(payload);
      if (missing.length || !payload.owner_approval) {
        validation.className = 'mia-validation error';
        validation.textContent = 'Copy blocked. Complete all required fields and record owner approval first.';
        return;
      }
      const value = JSON.stringify(payload, null, 2);
      preview.textContent = value;
      try {
        await navigator.clipboard.writeText(value);
        validation.className = 'mia-validation ok';
        validation.textContent = 'Approved payload copied. It is ready for controlled validation and publication.';
      } catch (error) {
        validation.className = 'mia-validation error';
        validation.textContent = 'Clipboard access was blocked. Copy the JSON manually from the preview.';
      }
    });

    resetButton?.addEventListener('click', () => {
      form.reset();
      setDefaultDate();
      preview.textContent = 'No payload generated.';
      validation.className = 'mia-validation';
      validation.textContent = 'Complete the required fields. Publication remains blocked until owner approval is recorded.';
    });
  });
})();

;

/* ---- ekh-v114-mia-workflow-controller ---- */

(() => {
  'use strict';

  const STORAGE_KEY = 'ekh_mia_queue_v114';
  const STAGES = ['inbox','review','decision','published','rejected'];
  const stageLabels = {
    inbox:'Inbox',
    review:'Review',
    decision:'Decision',
    published:'Published',
    rejected:'Returned'
  };

  const state = {
    items: [],
    stage: 'all',
    search: '',
    selectedId: null
  };

  const byId = id => document.getElementById(id);
  const safe = value => String(value ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;");

  function splitLines(value){
    return String(value || '').split(/\n+/).map(item => item.trim()).filter(Boolean);
  }

  function nowIso(){
    return new Date().toISOString();
  }

  function generateId(){
    const date = new Date();
    const stamp = [
      date.getFullYear(),
      String(date.getMonth()+1).padStart(2,'0'),
      String(date.getDate()).padStart(2,'0'),
      String(date.getHours()).padStart(2,'0'),
      String(date.getMinutes()).padStart(2,'0'),
      String(date.getSeconds()).padStart(2,'0')
    ].join('');
    return `MIA-${stamp}`;
  }

  function loadItems(){
    try{
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      state.items = Array.isArray(parsed)
        ? parsed.filter(item => item && STAGES.includes(item.stage))
        : [];
    }catch{
      state.items = [];
    }
  }

  function saveItems(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }

  function showToast(message){
    let toast = byId('mia114Toast');
    if(!toast){
      toast = document.createElement('div');
      toast.id = 'mia114Toast';
      toast.className = 'mia114-toast';
      toast.setAttribute('role','status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function openView(view){
    const target =
      document.querySelector(`[data-view="${CSS.escape(view)}"]`) ||
      document.querySelector(`[data-view-target="${CSS.escape(view)}"]`);
    if(target){
      target.click();
      return;
    }
    if(typeof window.showView === 'function') window.showView(view);
  }

  function intakePayload(){
    const form = byId('miaProgressForm');
    if(!form) return null;
    const data = new FormData(form);
    return {
      project: String(data.get('project') || '').trim(),
      report_owner: String(data.get('report_owner') || '').trim(),
      report_date: String(data.get('report_date') || '').trim(),
      status: String(data.get('status') || '').trim(),
      executive_summary: String(data.get('summary') || '').trim(),
      completed_progress: splitLines(data.get('completed')),
      blocker_or_risk: String(data.get('blocker') || '').trim() || 'None recorded',
      next_action: String(data.get('next_action') || '').trim(),
      evidence_references: splitLines(data.get('evidence')),
      owner_approval: Boolean(byId('miaOwnerApproved')?.checked)
    };
  }

  function requiredMissing(item){
    const missing = [];
    if(!item.project) missing.push('Project');
    if(!item.report_owner) missing.push('Report owner');
    if(!item.report_date) missing.push('Report date');
    if(!item.status) missing.push('Status');
    if(!item.executive_summary) missing.push('Executive summary');
    if(!Array.isArray(item.completed_progress) || !item.completed_progress.length) missing.push('Completed work');
    if(!item.next_action) missing.push('Next action');
    if(!Array.isArray(item.evidence_references) || !item.evidence_references.length) missing.push('Evidence references');
    return missing;
  }

  function releaseMissing(item){
    const missing = [];
    if(!item.owner_approval) missing.push('Owner approval');
    if(!item.kyo_validated) missing.push('Kyo validation');
    if(!item.release_commit) missing.push('Git commit');
    if(!item.deployment_evidence) missing.push('Deployment evidence');
    if(!item.rollback_reference) missing.push('Rollback reference');
    return missing;
  }

  function counts(){
    const result = {all:state.items.length,inbox:0,review:0,decision:0,published:0,rejected:0};
    state.items.forEach(item => { if(result[item.stage] !== undefined) result[item.stage] += 1; });
    return result;
  }

  function syncSummary(){
    const c = counts();
    const values = {
      mia114MetricTotal:c.all,
      mia114MetricReview:c.review,
      mia114MetricDecision:c.decision,
      mia114MetricPublished:c.published,
      mia114CountAll:c.all,
      mia114CountInbox:c.inbox,
      mia114CountReview:c.review,
      mia114CountDecision:c.decision,
      mia114CountPublished:c.published,
      mia114CountRejected:c.rejected,
      mia114NavCount:c.all,
      mia114OwnerDecisionSummary:c.decision,
      mia114ReturnedSummary:c.rejected,
      mia114ReadyKyoSummary:state.items.filter(item => item.stage === 'decision' && item.owner_approval).length
    };
    Object.entries(values).forEach(([id,value]) => {
      const node = byId(id);
      if(node) node.textContent = String(value);
    });
  }

  function filteredItems(){
    const query = state.search.trim().toLowerCase();
    return state.items
      .filter(item => state.stage === 'all' || item.stage === state.stage)
      .filter(item => {
        if(!query) return true;
        return [
          item.id,
          item.project,
          item.report_owner,
          item.status,
          item.executive_summary,
          stageLabels[item.stage]
        ].join(' ').toLowerCase().includes(query);
      })
      .sort((a,b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')));
  }

  function recordTemplate(item){
    const missing = requiredMissing(item).length;
    const evidenceLabel = missing ? `${missing} required field${missing === 1 ? '' : 's'} missing` : `${item.evidence_references?.length || 0} evidence reference${(item.evidence_references?.length || 0) === 1 ? '' : 's'}`;
    return `
      <button class="mia114-record ${state.selectedId === item.id ? 'selected' : ''}" type="button" data-mia114-record="${safe(item.id)}" data-stage="${safe(item.stage)}">
        <span class="mia114-record-dot" aria-hidden="true"></span>
        <span class="mia114-record-copy">
          <strong>${safe(item.project || 'Untitled report')}</strong>
          <small>${safe(item.report_owner || 'No owner')} · ${safe(item.status || 'Status not set')} · ${safe(evidenceLabel)}</small>
        </span>
        <span class="mia114-record-meta">
          <span class="mia114-stage-chip">${safe(stageLabels[item.stage])}</span>
          <span class="mia114-record-open">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7"></path><path d="M9 7h8v8"></path></svg>
          </span>
        </span>
      </button>`;
  }

  function renderQueue(){
    const list = byId('mia114QueueList');
    const empty = byId('mia114Empty');
    if(!list || !empty) return;

    const items = filteredItems();
    list.innerHTML = items.map(recordTemplate).join('');
    empty.hidden = items.length > 0;

    if(state.selectedId && !state.items.some(item => item.id === state.selectedId)){
      state.selectedId = null;
    }
    renderInspector();
    syncSummary();
  }

  function gateTemplate(index,title,detail,pass){
    return `
      <article class="mia114-gate ${pass ? 'pass' : 'fail'}">
        <span>${String(index).padStart(2,'0')}</span>
        <div><strong>${safe(title)}</strong><small>${safe(detail)}</small></div>
        <b>${pass ? 'PASS' : 'BLOCKED'}</b>
      </article>`;
  }

  function inspectorTemplate(item){
    const missing = requiredMissing(item);
    const release = releaseMissing(item);
    const intakePass = missing.length === 0;
    const ownerPass = Boolean(item.owner_approval);
    const kyoPass = Boolean(item.kyo_validated);
    const proofPass = Boolean(item.release_commit && item.deployment_evidence && item.rollback_reference);

    const primaryAction =
      item.stage === 'inbox'
        ? `<button class="mia114-inspector-action primary" type="button" data-mia114-action="review"><span>Move to review</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 7l5 5-5 5"></path></svg></button>`
        : item.stage === 'review'
          ? `<button class="mia114-inspector-action primary" type="button" data-mia114-action="decision"><span>Request decision</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 7l5 5-5 5"></path></svg></button>`
          : item.stage === 'decision'
            ? `<button class="mia114-inspector-action primary" type="button" data-mia114-action="published"><span>Record verified publish</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M8 12.2l2.6 2.6L16.5 9"></path><circle cx="12" cy="12" r="8.5"></circle></svg></button>`
            : item.stage === 'rejected'
              ? `<button class="mia114-inspector-action primary" type="button" data-mia114-action="restore"><span>Restore to inbox</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M8 8H4V4"></path><path d="M4.5 8a8 8 0 1 1-.1 7.8"></path></svg></button>`
              : '';

    return `
      <div class="mia114-inspector-head">
        <div>
          <span class="section-kicker">${safe(stageLabels[item.stage].toUpperCase())} / LOCAL RECORD</span>
          <h3>${safe(item.project || 'Untitled report')}</h3>
          <p>${safe(item.executive_summary || 'No executive summary has been recorded.')}</p>
        </div>
        <span class="mia114-inspector-code">${safe(item.id)}</span>
      </div>

      <div class="mia114-inspector-facts">
        <article><span>REPORT OWNER</span><strong>${safe(item.report_owner || 'Not set')}</strong></article>
        <article><span>REPORT DATE</span><strong>${safe(item.report_date || 'Not set')}</strong></article>
        <article><span>PROJECT STATUS</span><strong>${safe(item.status || 'Not set')}</strong></article>
        <article><span>QUEUE STAGE</span><strong>${safe(stageLabels[item.stage])}</strong></article>
      </div>

      <div class="mia114-gates">
        ${gateTemplate(1,'Payload integrity',intakePass ? 'All required fields and evidence are present.' : `Missing: ${missing.join(', ')}`,intakePass)}
        ${gateTemplate(2,'Owner approval',ownerPass ? 'Approval is recorded for this local payload.' : 'Exact payload approval has not been recorded.',ownerPass)}
        ${gateTemplate(3,'Kyo validation',kyoPass ? 'Technical validation is recorded locally.' : 'Kyo validation remains required.',kyoPass)}
        ${gateTemplate(4,'Release proof',proofPass ? 'Commit, deployment and rollback references are present.' : `Missing: ${release.filter(value => !['Owner approval','Kyo validation'].includes(value)).join(', ') || 'release evidence'}`,proofPass)}
      </div>

      <div class="mia114-evidence-form">
        <h4>Controlled release evidence</h4>
        <label class="mia114-check"><input id="mia114OwnerApproval" type="checkbox" ${ownerPass ? 'checked' : ''}><span>Owner approval recorded for this exact report</span></label>
        <label class="mia114-check"><input id="mia114KyoValidated" type="checkbox" ${kyoPass ? 'checked' : ''}><span>Kyo validation recorded</span></label>
        <label><span>Git commit</span><input id="mia114ReleaseCommit" type="text" value="${safe(item.release_commit || '')}" placeholder="Commit SHA or approved reference"></label>
        <label><span>Deployment evidence</span><input id="mia114DeploymentEvidence" type="text" value="${safe(item.deployment_evidence || '')}" placeholder="Cloudflare deployment ID or verified URL"></label>
        <label><span>Rollback reference</span><input id="mia114RollbackReference" type="text" value="${safe(item.rollback_reference || '')}" placeholder="Previous verified commit or package"></label>
        <label><span>Return / rejection reason</span><textarea id="mia114ReturnReason" placeholder="Required when returning the report">${safe(item.return_reason || '')}</textarea></label>
      </div>

      <div class="mia114-inspector-actions">
        <button class="mia114-inspector-action" type="button" data-mia114-action="save-evidence"><span>Save local gates</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 5h12l2 2v12H5z"></path><path d="M8 5v5h8V5M8 19v-5h8v5"></path></svg></button>
        <button class="mia114-inspector-action" type="button" data-mia114-action="edit"><span>Open intake</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M4.5 19.5l4-.8L18 9.2 14.8 6 5.3 15.5z"></path><path d="M13.8 7l3.2 3.2"></path></svg></button>
        ${primaryAction}
        ${item.stage !== 'rejected' && item.stage !== 'published' ? `<button class="mia114-inspector-action danger" type="button" data-mia114-action="reject"><span>Return report</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7L7 17"></path></svg></button>` : ''}
        <button class="mia114-inspector-action danger" type="button" data-mia114-action="delete"><span>Delete local record</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V4.5h6V7M8 10v7M12 10v7M16 10v7M6.5 7l1 13h9l1-13"></path></svg></button>
      </div>

      <p class="mia114-inspector-note">This inspector records local workflow evidence only. “Published” is permitted only when all four gates pass, but it still does not update production systems.</p>`;
  }

  function renderInspector(){
    const inspector = byId('mia114Inspector');
    if(!inspector) return;
    const item = state.items.find(record => record.id === state.selectedId);
    if(!item){
      inspector.innerHTML = `
        <div class="mia114-inspector-empty">
          <span class="mia114-empty-icon"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 4.5h14v15H5z"></path><path d="M8.5 9h7M8.5 13h7M8.5 17h4"></path></svg></span>
          <strong>Select one queue record</strong>
          <p>The inspector will show evidence completeness, owner approval, Kyo validation and permitted next actions.</p>
        </div>`;
      return;
    }
    inspector.innerHTML = inspectorTemplate(item);
  }

  function selectedItem(){
    return state.items.find(item => item.id === state.selectedId) || null;
  }

  function updateSelected(updates){
    const item = selectedItem();
    if(!item) return null;
    Object.assign(item, updates, {updated_at:nowIso()});
    saveItems();
    renderQueue();
    return item;
  }

  function saveEvidence(){
    const item = selectedItem();
    if(!item) return;
    updateSelected({
      owner_approval:Boolean(byId('mia114OwnerApproval')?.checked),
      kyo_validated:Boolean(byId('mia114KyoValidated')?.checked),
      release_commit:String(byId('mia114ReleaseCommit')?.value || '').trim(),
      deployment_evidence:String(byId('mia114DeploymentEvidence')?.value || '').trim(),
      rollback_reference:String(byId('mia114RollbackReference')?.value || '').trim(),
      return_reason:String(byId('mia114ReturnReason')?.value || '').trim()
    });
    showToast('Local gates and evidence saved.');
  }

  function moveStage(target){
    const item = selectedItem();
    if(!item) return;

    if(target === 'review'){
      const missing = requiredMissing(item);
      if(missing.length){
        showToast(`Review blocked. Complete: ${missing.join(', ')}.`);
        return;
      }
    }

    if(target === 'decision'){
      const missing = requiredMissing(item);
      if(missing.length){
        showToast(`Decision gate blocked. Complete: ${missing.join(', ')}.`);
        return;
      }
    }

    if(target === 'published'){
      saveEvidence();
      const refreshed = selectedItem();
      const missing = [...requiredMissing(refreshed), ...releaseMissing(refreshed)];
      if(missing.length){
        showToast(`Publish record blocked. Complete: ${missing.join(', ')}.`);
        return;
      }
      updateSelected({stage:'published',published_at:nowIso(),return_reason:''});
      showToast('Verified publication recorded locally. Production remains unchanged.');
      return;
    }

    updateSelected({stage:target,return_reason:target === 'rejected' ? item.return_reason : ''});
    showToast(`Record moved to ${stageLabels[target]}.`);
  }

  function rejectSelected(){
    const reason = String(byId('mia114ReturnReason')?.value || '').trim();
    if(!reason){
      showToast('A return reason is required.');
      byId('mia114ReturnReason')?.focus();
      return;
    }
    updateSelected({stage:'rejected',return_reason:reason});
    showToast('Report returned with a recorded reason.');
  }

  function populateIntake(item){
    const mappings = {
      miaProject:item.project,
      miaReportOwner:item.report_owner,
      miaStatus:item.status,
      miaReportDate:item.report_date,
      miaSummary:item.executive_summary,
      miaCompleted:(item.completed_progress || []).join('\n'),
      miaBlocker:item.blocker_or_risk === 'None recorded' ? '' : item.blocker_or_risk,
      miaNextAction:item.next_action,
      miaEvidence:(item.evidence_references || []).join('\n')
    };
    Object.entries(mappings).forEach(([id,value]) => {
      const field = byId(id);
      if(field) field.value = value || '';
    });
    const approval = byId('miaOwnerApproved');
    if(approval) approval.checked = Boolean(item.owner_approval);
    const form = byId('miaProgressForm');
    if(form) form.dataset.miaQueueId = item.id;
  }

  function openSelectedInIntake(){
    const item = selectedItem();
    if(!item) return;
    openView('mia-structured-intake');
    setTimeout(() => {
      populateIntake(item);
      byId('miaProject')?.focus();
    }, 80);
  }

  function deleteSelected(){
    const item = selectedItem();
    if(!item) return;
    const accepted = window.confirm(`Delete local Mia record "${item.project || item.id}"? This does not affect production data.`);
    if(!accepted) return;
    state.items = state.items.filter(record => record.id !== item.id);
    state.selectedId = null;
    saveItems();
    renderQueue();
    showToast('Local queue record deleted.');
  }

  function saveDraftFromIntake(){
    const payload = intakePayload();
    const form = byId('miaProgressForm');
    if(!payload || !form) return;

    const existingId = form.dataset.miaQueueId || '';
    const existing = state.items.find(item => item.id === existingId);
    const timestamp = nowIso();

    if(existing){
      Object.assign(existing,payload,{updated_at:timestamp});
      state.selectedId = existing.id;
    }else{
      const record = {
        id:generateId(),
        stage:'inbox',
        created_at:timestamp,
        updated_at:timestamp,
        kyo_validated:false,
        release_commit:'',
        deployment_evidence:'',
        rollback_reference:'',
        return_reason:'',
        ...payload
      };
      state.items.push(record);
      state.selectedId = record.id;
      form.dataset.miaQueueId = record.id;
    }

    saveItems();
    renderQueue();
    showToast('Local Mia queue draft saved. Production remains unchanged.');
    openView('handoffs');
  }

  function resetIntakeLink(){
    const form = byId('miaProgressForm');
    if(form) delete form.dataset.miaQueueId;
  }

  document.addEventListener('click', event => {
    const stageButton = event.target.closest('[data-mia114-stage]');
    if(stageButton){
      state.stage = stageButton.dataset.mia114Stage || 'all';
      document.querySelectorAll('[data-mia114-stage]').forEach(button => {
        button.classList.toggle('active',button === stageButton);
      });
      renderQueue();
      return;
    }

    const record = event.target.closest('[data-mia114-record]');
    if(record){
      state.selectedId = record.dataset.mia114Record || null;
      renderQueue();
      return;
    }

    const action = event.target.closest('[data-mia114-action]')?.dataset.mia114Action;
    if(!action) return;

    if(action === 'save-evidence') saveEvidence();
    if(action === 'edit') openSelectedInIntake();
    if(action === 'review') moveStage('review');
    if(action === 'decision') moveStage('decision');
    if(action === 'published') moveStage('published');
    if(action === 'restore') moveStage('inbox');
    if(action === 'reject') rejectSelected();
    if(action === 'delete') deleteSelected();
  });

  document.addEventListener('DOMContentLoaded', () => {
    loadItems();

    byId('mia114Search')?.addEventListener('input', event => {
      state.search = event.target.value || '';
      renderQueue();
    });

    byId('saveMiaQueueDraft')?.addEventListener('click', saveDraftFromIntake);
    byId('resetMiaPayload')?.addEventListener('click', resetIntakeLink);

    renderQueue();
  });

  window.addEventListener('storage', event => {
    if(event.key !== STORAGE_KEY) return;
    loadItems();
    renderQueue();
  });
})();

;

/* ---- inline-script-10 ---- */

(()=>{
  document.addEventListener('click',event=>{
    const summary=event.target.closest('.v172-project-summary');
    if(summary){
      const card=summary.closest('.v172-project-card');
      const open=card.classList.toggle('open');
      summary.setAttribute('aria-expanded',String(open));
    }
  });

  const search=document.getElementById('v172ProjectSearch');
  const filters=document.getElementById('v172ProjectFilters');
  let activeStage='all';

  function applyProjectFilters(){
    const query=(search?.value||'').trim().toLowerCase();
    document.querySelectorAll('[data-project-card]').forEach(card=>{
      const stage=card.dataset.projectStage||'';
      const stageMatch=activeStage==='all'||stage===activeStage;
      const searchMatch=!query||card.textContent.toLowerCase().includes(query);
      card.hidden=!(stageMatch&&searchMatch);
    });
  }

  filters?.addEventListener('click',event=>{
    const button=event.target.closest('[data-project-filter]');
    if(!button)return;
    activeStage=button.dataset.projectFilter||'all';
    filters.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));
    applyProjectFilters();
  });
  search?.addEventListener('input',applyProjectFilters);

  document.getElementById('v172AddActivity')?.addEventListener('click',()=>document.getElementById('addSupabaseActivity')?.click());
  document.getElementById('openSupabaseActivityModalFromCalendar')?.addEventListener('click',()=>document.getElementById('addSupabaseActivity')?.click());
})();

;

/* ---- ekh-v115-login-experience-controller ---- */

(() => {
  'use strict';

  const CONFIG_KEY = 'ekh_os_v13_supabase_config';
  const byId = id => document.getElementById(id);

  function readPublicConfig(){
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'); } catch {}
    const injected = window.EKH_OS_PUBLIC_CONFIG || {};
    return {
      url: injected.url || saved.url || '',
      key: injected.key || saved.key || '',
      turnstileSiteKey: injected.turnstileSiteKey || saved.turnstileSiteKey || ''
    };
  }

  function unsafeKey(key){
    if(!key) return false;
    if(/^sb_secret_/i.test(key) || /service[_-]?role/i.test(key)) return true;
    const parts = String(key).split('.');
    if(parts.length === 3){
      try{
        const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
        return payload.role === 'service_role';
      }catch{}
    }
    return false;
  }

  function validConfig(config){
    return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url || '')
      && Boolean(config.key)
      && !unsafeKey(config.key);
  }

  function updateConnectionState(){
    const node = byId('ekhLoginConnectionState');
    if(!node) return;
    const config = readPublicConfig();
    const ready = validConfig(config);
    node.dataset.state = ready ? 'ready' : 'warning';
    node.innerHTML = ready
      ? '<span class="login115-connection-dot"></span><div><strong>Public connection ready</strong><small>This device can request Supabase authentication</small></div>'
      : '<span class="login115-connection-dot"></span><div><strong>Device setup required</strong><small>Open First-device system connection below</small></div>';
  }

  function updateClock(){
    const node = byId('ekhLoginClock');
    if(!node) return;
    node.textContent = new Intl.DateTimeFormat(undefined,{
      hour:'2-digit',
      minute:'2-digit',
      second:'2-digit',
      hour12:false
    }).format(new Date());
  }

  function setPasswordVisibility(show){
    const password = byId('ekhLoginPassword');
    const toggle = byId('ekhPasswordToggle');
    if(!password || !toggle) return;
    password.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed',String(show));
    toggle.setAttribute('aria-label',show ? 'Hide password' : 'Show password');
  }

  function updateCapsLock(event){
    const warning = byId('ekhCapsLockWarning');
    if(!warning || typeof event.getModifierState !== 'function') return;
    warning.hidden = !event.getModifierState('CapsLock');
  }

  document.addEventListener('DOMContentLoaded',() => {
    updateClock();
    updateConnectionState();
    setInterval(updateClock,1000);

    const password = byId('ekhLoginPassword');
    const toggle = byId('ekhPasswordToggle');

    toggle?.addEventListener('click',() => {
      setPasswordVisibility(toggle.getAttribute('aria-pressed') !== 'true');
      password?.focus();
    });

    password?.addEventListener('keydown',updateCapsLock);
    password?.addEventListener('keyup',updateCapsLock);
    password?.addEventListener('blur',() => {
      const warning = byId('ekhCapsLockWarning');
      if(warning) warning.hidden = true;
    });

    byId('ekhSaveConfig')?.addEventListener('click',() => {
      setTimeout(updateConnectionState,100);
    });

    window.addEventListener('storage',event => {
      if(event.key === CONFIG_KEY) updateConnectionState();
    });
  });
})();

;

/* ---- inline-script-12 ---- */

(() => {
  'use strict';
  const CONFIG_KEY = 'ekh_os_v13_supabase_config';
  const OWNER_UUID = 'c0b363c4-0033-4418-9813-679a5c6dec35';
  const STAFF_BUCKET = 'ekh-staff-files';
  const MASTER_STAFF_DIRECTORY = [{"staff_name":"Azuar Fahmi","staff_slug":"azuar-fahmi","staff_role":"Founder / CEO","department":"Executive","team_code":"executive"},{"staff_name":"Mia","staff_slug":"mia","staff_role":"Chief Operations Officer (COO)","department":"Operations","team_code":"operations"},{"staff_name":"Candice","staff_slug":"candice","staff_role":"Technology Director","department":"Technology, Software, Web & Systems","team_code":"technology"},{"staff_name":"Kamal","staff_slug":"kamal","staff_role":"Creative Director","department":"Creative, Graphics & Visual Identity","team_code":"creative"},{"staff_name":"Reo","staff_slug":"reo","staff_role":"Education Director","department":"Child Education & Assessment","team_code":"education"},{"staff_name":"Mario","staff_slug":"mario","staff_role":"Marketing Director","department":"Marketing, Content & Market Intelligence","team_code":"marketing"},{"staff_name":"Wahid","staff_slug":"wahid","staff_role":"Political Director","department":"Politics","team_code":"political"},{"staff_name":"Arian","staff_slug":"arian","staff_role":"Multimedia Director","department":"Multimedia, Video & Audio","team_code":"multimedia"},{"staff_name":"Alya","staff_slug":"alya","staff_role":"Question Bank QA & Data Manager","department":"Technical QA, Release & Automation","team_code":"technical-qa"},{"staff_name":"Ilica","staff_slug":"ilica","staff_role":"English Curriculum Specialist","department":"English Language & Language Education","team_code":"english-education"},{"staff_name":"Guy","staff_slug":"guy","staff_role":"Early Childhood Education Specialist","department":"Child Education & Assessment","team_code":"education"},{"staff_name":"Nene","staff_slug":"nene","staff_role":"Malay Language Education Specialist","department":"Malay Language","team_code":"malay-language"},{"staff_name":"Haikal","staff_slug":"haikal","staff_role":"Translator & Language QA","department":"English Language & Language Education","team_code":"language"},{"staff_name":"Jeff","staff_slug":"jeff","staff_role":"Application Lead — Smart Adventure","department":"Technology, Software, Web & Systems","team_code":"technology"},{"staff_name":"Kyo","staff_slug":"kyo","staff_role":"Debugging & Independent Technical Verifier","department":"Technical QA, Release & Automation","team_code":"technical-qa"},{"staff_name":"Baran","staff_slug":"baran","staff_role":"Database Administrator / DevOps Engineer","department":"Technology, Software, Web & Systems","team_code":"technology"},{"staff_name":"Xion","staff_slug":"xion","staff_role":"Web Design & Development Lead","department":"Technology, Software, Web & Systems","team_code":"technology"},{"staff_name":"Oliver","staff_slug":"oliver","staff_role":"Application Lead","department":"Technology, Software, Web & Systems","team_code":"technology"},{"staff_name":"Blanc","staff_slug":"blanc","staff_role":"Worksheet Studio Lead Developer","department":"Technology, Software, Web & Systems","team_code":"technology"},{"staff_name":"Farah","staff_slug":"farah","staff_role":"Visual Illustration Lead & Character Identity Guardian","department":"Creative, Graphics & Visual Identity","team_code":"creative"},{"staff_name":"Zenon","staff_slug":"zenon","staff_role":"Digital Asset Designer & Identity Guardian","department":"Creative, Graphics & Visual Identity","team_code":"creative"},{"staff_name":"Clara","staff_slug":"clara","staff_role":"Political Design Specialist","department":"Creative, Graphics & Visual Identity","team_code":"creative"},{"staff_name":"Lei","staff_slug":"lei","staff_role":"Product Video & Storyboard Specialist","department":"Multimedia, Video & Audio","team_code":"multimedia"},{"staff_name":"Paula","staff_slug":"paula","staff_role":"International Digital Product Market Researcher","department":"Marketing, Content & Market Intelligence","team_code":"marketing"},{"staff_name":"Zack","staff_slug":"zack","staff_role":"Threads Strategist & Content OS Lead","department":"Marketing, Content & Market Intelligence","team_code":"marketing"},{"staff_name":"Syakila","staff_slug":"syakila","staff_role":"Malaysian Social Language Analyst","department":"Marketing, Content & Market Intelligence","team_code":"marketing"},{"staff_name":"Tabby","staff_slug":"tabby","staff_role":"Devil’s Advocate & Claims Auditor","department":"Marketing, Content & Market Intelligence","team_code":"marketing"},{"staff_name":"Love","staff_slug":"love","staff_role":"E-book Writer","department":"E-book & Publishing","team_code":"publishing"},{"staff_name":"Torrie","staff_slug":"torrie","staff_role":"E-book QA Specialist","department":"E-book & Publishing","team_code":"publishing"},{"staff_name":"Azizan","staff_slug":"azizan","staff_role":"Short-form Political Video Script Specialist","department":"Politics","team_code":"political"},{"staff_name":"Nara","staff_slug":"nara","staff_role":"Translator 2 / First-pass Language QA","department":"English Language & Language Education","team_code":"english-education"},{"staff_name":"Elio","staff_slug":"elio","staff_role":"Curriculum Source & Evidence Librarian","department":"English Language & Language Education","team_code":"english-education"},{"staff_name":"Luna","staff_slug":"luna","staff_role":"Curriculum Researcher 3","department":"English Language & Language Education","team_code":"english-education"},{"staff_name":"Arden","staff_slug":"arden","staff_role":"Technical QA & Release Lead","department":"Technical QA, Release & Automation","team_code":"technical-qa"},{"staff_name":"Vera","staff_slug":"vera","staff_role":"Test Automation Engineer","department":"Technical QA, Release & Automation","team_code":"technical-qa"}];
  const SESSION_STAFF_KEY = 'ekh_os_v173_selected_staff';
  const ATTEMPT_KEY = 'ekh_os_v173_login_attempts';
  const INACTIVITY_MS = Math.max(15, Number(window.EKH_OS_PUBLIC_CONFIG?.sessionIdleMinutes) || 30) * 60 * 1000;
  const state = { client:null, session:null, user:null, profile:null, grants:[], staff:[], selected:null, files:[], filter:'all', turnstileId:null, captchaToken:'', authorised:false, lastActivity:Date.now(), authSubscription:null };
  const el = id => document.getElementById(id);
  const safe = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const initials = name => String(name || '').split(/\s+/).filter(Boolean).map(part => part[0]).join('').slice(0,2).toUpperCase() || '—';
  const formatBytes = bytes => { if (!Number.isFinite(Number(bytes))) return '—'; const units=['B','KB','MB','GB']; let n=Number(bytes),i=0; while(n>=1024&&i<units.length-1){n/=1024;i++;} return `${n.toFixed(i?1:0)} ${units[i]}`; };
  const roleLabel = role => ({owner:'Owner',admin:'Admin',manager:'Manager',member:'Member',reviewer:'Reviewer',viewer:'Viewer'}[role] || 'Unauthorised');
  const configFields = () => ({url:el('ekhConfigUrl'),key:el('ekhConfigKey'),turnstile:el('ekhConfigTurnstile')});

  function toast(title, detail){ if(typeof showToast === 'function') showToast(title, detail); }
  function readConfig(){
    let saved={}; try{saved=JSON.parse(localStorage.getItem(CONFIG_KEY)||'{}')}catch{}
    const injected=window.EKH_OS_PUBLIC_CONFIG||{};
    return {url:injected.url||saved.url||'',key:injected.key||saved.key||'',turnstileSiteKey:injected.turnstileSiteKey||saved.turnstileSiteKey||''};
  }
  function unsafeKey(key){
    if(!key) return false;
    if(/^sb_secret_/i.test(key)||/service[_-]?role/i.test(key)) return true;
    const parts=key.split('.');
    if(parts.length===3){ try{ const payload=JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/'))); return payload.role==='service_role'; }catch{} }
    return false;
  }
  function validConfig(config){ return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url||'') && Boolean(config.key) && !unsafeKey(config.key); }
  function setMessage(message,type=''){ const node=el('ekhLoginMessage'); node.textContent=message; node.className=`v173-login-message${type?' '+type:''}`; }
  function setBusy(busy,label='Sign in securely'){ const button=el('ekhLoginSubmit'); const labelNode=el('ekhLoginSubmitLabel'); button.disabled=busy; button.classList.toggle('is-busy',busy); if(labelNode) labelNode.textContent=busy?'Verifying…':label; else button.textContent=busy?'Verifying…':label; }
  function showGate(message='Sign in to continue.',type=''){
    state.authorised=false; document.body.classList.remove('auth-ready'); document.body.classList.add('auth-locked');
    el('ekhAppShell')?.setAttribute('aria-hidden','true'); el('ekhAuthGate')?.removeAttribute('aria-hidden');
    setMessage(message,type); setBusy(false);
  }
  function showApp(){
    state.authorised=true; document.body.classList.remove('auth-pending','auth-locked'); document.body.classList.add('auth-ready');
    el('ekhAppShell')?.setAttribute('aria-hidden','false'); el('ekhAuthGate')?.setAttribute('aria-hidden','true');
    state.lastActivity=Date.now(); updateProfileUI(); renderStaffSelector(); loadDrive();
    window.dispatchEvent(new CustomEvent('ekh-auth-ready',{detail:{user:state.user,profile:state.profile}}));
  }
  function saveConfig(){
    const fields=configFields(); const config={url:fields.url.value.trim(),key:fields.key.value.trim(),turnstileSiteKey:fields.turnstile.value.trim()};
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url)) return setMessage('Enter a valid Supabase project URL.','warning');
    if(!config.key) return setMessage('Enter the Supabase publishable or anon key.','warning');
    if(unsafeKey(config.key)) return setMessage('Secret and service-role keys are forbidden in frontend code.','error');
    localStorage.setItem(CONFIG_KEY,JSON.stringify(config));
    setMessage('Public connection saved. Checking Supabase…','success');
    state.client=null; if(state.authSubscription){state.authSubscription.unsubscribe();state.authSubscription=null;}
    renderTurnstile(config); bootstrap();
  }
  function fillConfig(){ const c=readConfig(),f=configFields(); f.url.value=c.url||'';f.key.value=c.key||'';f.turnstile.value=c.turnstileSiteKey||''; if(!validConfig(c)) el('ekhSystemSetup').open=true; }
  function ensureClient(){
    if(state.client) return state.client;
    const config=readConfig();
    if(!validConfig(config)){showGate('This device needs the public Supabase connection before sign-in.','warning');el('ekhSystemSetup').open=true;return null;}
    if(!window.supabase?.createClient){showGate('Supabase client library did not load. Check the network connection.','error');return null;}
    state.client=window.supabase.createClient(config.url,config.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    window.ekhSupabase=state.client;
    const {data}=state.client.auth.onAuthStateChange((event,session)=>queueMicrotask(()=>handleAuthEvent(event,session)));
    state.authSubscription=data.subscription;
    return state.client;
  }
  function renderTurnstile(config=readConfig()){
    const host=el('ekhTurnstile'); if(!host) return;
    state.captchaToken=''; host.innerHTML='';
    if(!config.turnstileSiteKey) return;
    const attempt=()=>{
      if(!window.turnstile){setTimeout(attempt,250);return;}
      try{state.turnstileId=window.turnstile.render(host,{sitekey:config.turnstileSiteKey,theme:'light',size:'flexible',action:'ekh_login',callback:token=>{state.captchaToken=token;},'expired-callback':()=>{state.captchaToken='';},'error-callback':()=>{state.captchaToken='';setMessage('Security verification could not load. Refresh and try again.','warning');}});}catch(error){setMessage('Turnstile configuration could not be rendered.','warning');}
    }; attempt();
  }
  function resetTurnstile(){state.captchaToken=''; if(window.turnstile&&state.turnstileId!==null){try{window.turnstile.reset(state.turnstileId)}catch{}}}
  function attempts(){try{return JSON.parse(sessionStorage.getItem(ATTEMPT_KEY)||'{"count":0,"until":0}')}catch{return {count:0,until:0}}}
  function recordFailure(){const a=attempts();a.count+=1;const seconds=Math.min(30,Math.max(0,2**Math.max(0,a.count-2)));a.until=Date.now()+seconds*1000;sessionStorage.setItem(ATTEMPT_KEY,JSON.stringify(a));return seconds;}
  function clearFailures(){sessionStorage.removeItem(ATTEMPT_KEY)}
  async function bootstrap(){
    fillConfig(); renderTurnstile(); const client=ensureClient(); if(!client) return;
    setMessage('Checking the current Supabase session…'); setBusy(true);
    try{const {data,error}=await client.auth.getSession();if(error)throw error;if(!data.session)return showGate('Sign in with an authorised EKH account.');await authorise(data.session);}
    catch(error){showGate('The saved session could not be verified. Sign in again.','warning');}
  }
  async function loadProfile(user){
    const query=await state.client.from('ekh_staff_profiles').select('user_id,staff_slug,display_name,department,job_title,app_role,team_code,is_active').eq('user_id',user.id).maybeSingle();
    if(!query.error&&query.data?.is_active) return query.data;
    if(user.id===OWNER_UUID) return {user_id:user.id,staff_slug:'azuar-fahmi',display_name:'Azuar Fahmi',department:'Executive & Operations',job_title:'Owner',app_role:'owner',team_code:'executive-operations',is_active:true,bootstrap_fallback:true};
    return null;
  }
  async function authorise(session){
    const client=ensureClient(); if(!client)return;
    setBusy(true); setMessage('Validating session and role…');
    const {data:{user},error}=await client.auth.getUser();
    if(error||!user){await client.auth.signOut();return showGate('Your session expired. Sign in again.','warning');}
    const profile=await loadProfile(user);
    if(!profile){el('ekhAccessDeniedState').textContent='This authenticated account has no active EKH OS role. Ask the owner/admin to create an ekh_staff_profiles record.';el('ekhAccessDeniedState').classList.add('show');await client.auth.signOut();return showGate('Access denied: no active EKH OS role.','error');}
    state.session=session;state.user=user;state.profile=profile;
    const grantsResult=await client.from('ekh_staff_file_access').select('staff_slug,access_level').eq('user_id',user.id);
    state.grants=grantsResult.data||[];
    const staffResult=await client.from('ekh_staff_folders').select('staff_name,staff_slug,department,staff_role,team_code,is_active').eq('is_active',true).order('staff_name');
    if(staffResult.error){return showGate(`Role verified, but authorised staff directory failed: ${staffResult.error.message}`,'error');}
    let rows=staffResult.data||[];
    const wildcard=profile.app_role==='owner'||profile.app_role==='admin'||state.grants.some(g=>g.staff_slug==='*');
    const allowed=new Set(state.grants.map(g=>g.staff_slug));allowed.add(profile.staff_slug);
    if(!wildcard&&!['manager'].includes(profile.app_role)) rows=rows.filter(row=>allowed.has(row.staff_slug));
    if(!rows.some(row=>row.staff_slug===profile.staff_slug)) rows.unshift({staff_name:profile.display_name||user.email,staff_slug:profile.staff_slug,department:profile.department||'—',staff_role:profile.job_title||roleLabel(profile.app_role),team_code:profile.team_code,is_active:true});
    const serverRows=rows.map(row=>({...row,_directory_source:'supabase'}));const masterRows=MASTER_STAFF_DIRECTORY.map(row=>({...row,is_active:true,_directory_source:'master'}));state.staff=[...serverRows,...masterRows].filter((row,index,array)=>array.findIndex(item=>item.staff_slug===row.staff_slug)===index).sort((a,b)=>a.staff_name.localeCompare(b.staff_name));
    const remembered=sessionStorage.getItem(SESSION_STAFF_KEY);state.selected=state.staff.find(s=>s.staff_slug===remembered)||state.staff[0]||null;
    el('ekhAccessDeniedState').classList.remove('show');clearFailures();setMessage('Access verified. Opening EKH OS…','success');setBusy(false);showApp();
    logAudit('sign_in',profile.staff_slug,'success',{role:profile.app_role});
  }
  async function signIn(event){
    event?.preventDefault(); const a=attempts(); if(a.until>Date.now()){return setMessage(`Too many attempts on this device. Try again in ${Math.ceil((a.until-Date.now())/1000)} seconds.`,'warning');}
    const client=ensureClient();if(!client)return; const email=el('ekhLoginEmail').value.trim(),password=el('ekhLoginPassword').value;
    if(!email||!password)return setMessage('Enter the authorised email and password.','warning');
    const config=readConfig();if(config.turnstileSiteKey&&!state.captchaToken)return setMessage('Complete the security verification first.','warning');
    setBusy(true);setMessage('Verifying credentials…');
    const credentials={email,password};if(state.captchaToken)credentials.options={captchaToken:state.captchaToken};
    try{const {data,error}=await client.auth.signInWithPassword(credentials);if(error)throw error;await authorise(data.session);el('ekhLoginPassword').value='';resetTurnstile();}
    catch(error){const delay=recordFailure();resetTurnstile();setBusy(false);setMessage(`Sign-in failed. Check the credentials${delay?` and wait ${delay} seconds before retrying`:''}.`,'error');}
  }
  async function forgotPassword(){
    const client=ensureClient();if(!client)return;const email=el('ekhLoginEmail').value.trim();if(!email)return setMessage('Enter the account email first.','warning');
    const config=readConfig();if(config.turnstileSiteKey&&!state.captchaToken)return setMessage('Complete the security verification first.','warning');
    const options={redirectTo:location.origin};if(state.captchaToken)options.captchaToken=state.captchaToken;
    const {error}=await client.auth.resetPasswordForEmail(email,options);resetTurnstile();setMessage(error?'Password-reset request failed.':'Password-reset email requested. Check the authorised inbox.',error?'error':'success');
  }
  async function signOut(reason='Signed out securely.'){
    if(state.client&&state.user)await logAudit('sign_out',state.profile?.staff_slug,'success',{reason});
    try{await state.client?.auth.signOut()}catch{}
    state.session=null;state.user=null;state.profile=null;state.staff=[];state.selected=null;state.files=[];sessionStorage.removeItem(SESSION_STAFF_KEY);renderFiles([]);showGate(reason);
  }
  async function handleAuthEvent(event,session){
    if(event==='SIGNED_OUT'){if(state.authorised)showGate('The active session ended. Sign in again.','warning');return;}
    if(event==='TOKEN_REFRESHED'&&session){state.session=session;return;}
    if((event==='SIGNED_IN'||event==='INITIAL_SESSION')&&session&&!state.authorised)await authorise(session);
  }
  function updateProfileUI(){
    const display=state.profile.display_name||state.user.email;document.querySelectorAll('.profile-text strong').forEach(n=>n.textContent=display);document.querySelectorAll('.profile-text small').forEach(n=>n.textContent=roleLabel(state.profile.app_role));document.querySelectorAll('.profile-button .avatar').forEach(n=>n.textContent=initials(display));
    el('secureSessionLabel').textContent=`${roleLabel(state.profile.app_role)} session`;el('secureSessionDetail').textContent=state.user.email||state.user.id;const footer=q=>document.querySelector(q);const footerStatus=footer('#footerActivityStatus');if(footerStatus)footerStatus.innerHTML='<i></i> Supabase session verified';
  }
  function renderStaffSelector(query=''){
    const select=el('secureStaffSelect'),needle=query.trim().toLowerCase();const current=state.selected?.staff_slug;const rows=state.staff.filter(s=>!needle||`${s.staff_name} ${s.staff_role} ${s.department}`.toLowerCase().includes(needle));
    select.innerHTML=rows.map(s=>`<option value="${safe(s.staff_slug)}"${s.staff_slug===current?' selected':''}>${safe(s.staff_name)} — ${safe(s.staff_role)}</option>`).join('')||'<option value="">No authorised staff found</option>';
  }
  function currentGrant(slug){return state.grants.find(g=>g.staff_slug===slug)||state.grants.find(g=>g.staff_slug==='*')||null;}
  function canWrite(slug){const role=state.profile?.app_role;if(['owner','admin'].includes(role))return true;if(['reviewer','viewer'].includes(role))return false;const grant=currentGrant(slug);if(grant&&['owner','admin','editor'].includes(grant.access_level))return true;return slug===state.profile?.staff_slug&&['manager','member'].includes(role);}
  function updateSelectedUI(){
    const s=state.selected;if(!s)return;el('secureSelectedInitials').textContent=initials(s.staff_name);el('secureSelectedName').textContent=s.staff_name;el('secureSelectedRole').textContent=s.staff_role;el('secureSelectedDepartment').textContent=s.department;const write=canWrite(s.staff_slug);el('securePermissionChip').textContent=write?'Upload & archive':'Read only';el('secureUploadButton').disabled=!write;el('secureEmptyUpload').hidden=!write;sessionStorage.setItem(SESSION_STAFF_KEY,s.staff_slug);
  }
  async function selectStaff(slug){const match=state.staff.find(s=>s.staff_slug===slug);if(!match)return;state.selected=match;updateSelectedUI();await loadDrive();}
  function setLoading(loading){el('secureDriveLoading').hidden=!loading;if(loading){el('secureDriveEmpty').hidden=true;el('secureDriveDenied').hidden=true;el('secureFileRows').innerHTML='';}}
  function inferVersion(name){const m=String(name).match(/(?:^|[_\s-])v?(\d+(?:\.\d+){0,2})(?:[_\s.-]|$)/i);return m?`v${m[1]}`:'Not tagged';}
  function cleanDisplayName(name){return String(name).replace(/^\d{13,}-/,'');}
  function extension(name){const p=String(name).split('.');return p.length>1?p.pop().slice(0,4).toUpperCase():'FILE';}
  function fileDate(file){return file.updated_at||file.created_at||file.last_accessed_at||null;}
  function renderFiles(files){
    const rows=el('secureFileRows'),empty=el('secureDriveEmpty');state.files=files;el('secureFileCount').textContent=files.length;rows.innerHTML='';
    if(!files.length){empty.hidden=false;empty.querySelector('h3').textContent=state.filter==='archived'?'No archived files':'This drive is empty';empty.querySelector('p').textContent=state.filter==='shared'?'Select another authorised staff drive to view shared files.':'No matching files were returned by the protected Storage request.';return;}empty.hidden=true;
    rows.innerHTML=files.map((file,index)=>{const display=cleanDisplayName(file.name),date=fileDate(file),status=file._status||'active',permission=canWrite(state.selected.staff_slug)?'Read / write':'Read only';return `<article class="v173-file-row" data-index="${index}"><div class="v173-file-row-main"><div class="v173-file-identity"><span class="v173-file-icon">${safe(extension(display))}</span><div class="v173-file-name"><strong title="${safe(display)}">${safe(display)}</strong><small>${safe(formatBytes(file.metadata?.size))}</small></div></div><span class="v173-file-cell">${safe(state.selected.staff_name)}</span><span class="v173-file-cell">${date?safe(new Date(date).toLocaleString('en-MY',{dateStyle:'medium',timeStyle:'short'})):'—'}</span><span class="v173-file-status ${safe(status)}">${safe(status==='archived'?'Archived':status==='shared'?'Shared':'Available')}</span><div class="v173-file-actions"><button data-file-action="details" type="button">Details</button><button data-file-action="download" type="button">Download</button>${canWrite(state.selected.staff_slug)?`<button class="danger" data-file-action="${status==='archived'?'restore':'archive'}" type="button">${status==='archived'?'Restore':'Archive'}</button>`:''}</div></div><div class="v173-file-detail"><div><b>Version</b><span>${safe(inferVersion(display))}</span></div><div><b>Size</b><span>${safe(formatBytes(file.metadata?.size))}</span></div><div><b>Handoff</b><span>${/handoff/i.test(display)?'Filename reference':'Not linked'}</span></div><div><b>Permissions</b><span>${safe(permission)}</span></div><div><b>Audit</b><span>${date?`Storage record ${safe(new Date(date).toISOString())}`:'Storage metadata unavailable'}</span></div></div></article>`;}).join('');
  }
  async function loadDrive(){
    if(!state.authorised||!state.selected)return;updateSelectedUI();setLoading(true);el('secureDriveDenied').hidden=true;
    const archived=state.filter==='archived',base=archived?'archive':'staff',path=`${base}/${state.selected.staff_slug}`;
    const {data,error}=await state.client.storage.from(STAFF_BUCKET).list(path,{limit:200,sortBy:{column:'updated_at',order:'desc'}});setLoading(false);
    if(error){el('secureDriveDenied').hidden=false;el('secureDriveDeniedMessage').textContent='Supabase RLS rejected this folder or the Storage migration is incomplete.';el('secureDriveEmpty').hidden=true;renderFiles([]);await logAudit('access_denied',state.selected.staff_slug,'denied',{path,code:error.statusCode||error.name});return;}
    let files=(data||[]).filter(f=>f.name!=='.keep').map(f=>({...f,_path:`${path}/${f.name}`,_status:archived?'archived':(state.selected.staff_slug!==state.profile.staff_slug?'shared':'active')}));
    if(state.filter==='recent'){const threshold=Date.now()-7*86400000;files=files.filter(f=>{const d=fileDate(f);return d&&new Date(d).getTime()>=threshold;});}
    if(state.filter==='shared'&&state.selected.staff_slug===state.profile.staff_slug)files=[];
    renderFiles(files);el('secureDriveLastSync').textContent=`Synced ${new Date().toLocaleTimeString('en-MY',{hour:'2-digit',minute:'2-digit'})}`;
  }
  async function revalidateSensitive(){const {data:{user},error}=await state.client.auth.getUser();if(error||!user||user.id!==state.user.id){await signOut('Session validation failed. Sign in again.');return false;}const profile=await loadProfile(user);if(!profile||profile.app_role!==state.profile.app_role){await signOut('Role changed. Sign in again to refresh access.');return false;}return true;}
  async function uploadFiles(fileList){
    if(!state.selected||!canWrite(state.selected.staff_slug))return toast('Upload blocked','This role does not have write access to the selected drive.');if(!await revalidateSensitive())return;
    const files=[...fileList];if(!files.length)return;el('secureUploadButton').disabled=true;
    for(const file of files){const name=file.name.replace(/[^a-zA-Z0-9._() -]/g,'_');const path=`staff/${state.selected.staff_slug}/${Date.now()}-${name}`;const {error}=await state.client.storage.from(STAFF_BUCKET).upload(path,file,{upsert:false,contentType:file.type||undefined,cacheControl:'3600'});if(error){toast('Upload failed',error.message);await logAudit('upload',state.selected.staff_slug,'failed',{path,code:error.statusCode||error.name});continue;}await logAudit('upload',state.selected.staff_slug,'success',{path,size:file.size});}
    el('secureFileInput').value='';el('secureUploadButton').disabled=!canWrite(state.selected.staff_slug);toast('Upload complete',`${files.length} file(s) processed.`);await loadDrive();
  }
  async function fileAction(event){
    const button=event.target.closest('[data-file-action]');if(!button)return;const row=button.closest('.v173-file-row'),file=state.files[Number(row?.dataset.index)];if(!file)return;const action=button.dataset.fileAction;
    if(action==='details'){row.classList.toggle('open');button.textContent=row.classList.contains('open')?'Close':'Details';return;}
    if(action==='download'){const {data,error}=await state.client.storage.from(STAFF_BUCKET).download(file._path);if(error){toast('Download failed',error.message);return logAudit('download',state.selected.staff_slug,'failed',{path:file._path});}const url=URL.createObjectURL(data),a=document.createElement('a');a.href=url;a.download=cleanDisplayName(file.name);document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Download started',cleanDisplayName(file.name));return logAudit('download',state.selected.staff_slug,'success',{path:file._path});}
    if(!canWrite(state.selected.staff_slug)||!await revalidateSensitive())return;
    if(action==='archive'){if(!confirm(`Archive ${cleanDisplayName(file.name)}?`))return;const target=`archive/${state.selected.staff_slug}/${Date.now()}-${cleanDisplayName(file.name)}`;const {error}=await state.client.storage.from(STAFF_BUCKET).move(file._path,target);if(error)return toast('Archive failed',error.message);await logAudit('archive',state.selected.staff_slug,'success',{from:file._path,to:target});toast('File archived',cleanDisplayName(file.name));}
    if(action==='restore'){const target=`staff/${state.selected.staff_slug}/${Date.now()}-${cleanDisplayName(file.name)}`;const {error}=await state.client.storage.from(STAFF_BUCKET).move(file._path,target);if(error)return toast('Restore failed',error.message);await logAudit('restore',state.selected.staff_slug,'success',{from:file._path,to:target});toast('File restored',cleanDisplayName(file.name));}
    await loadDrive();
  }
  async function logAudit(eventType,target,outcome='success',details={}){try{await state.client?.rpc('ekh_log_security_event',{p_event_type:eventType,p_target_staff_slug:target||null,p_object_path:details.path||details.to||null,p_outcome:outcome,p_details:details});}catch{}}
  function bind(){
    el('ekhLoginForm').addEventListener('submit',signIn);el('ekhForgotPassword').addEventListener('click',forgotPassword);el('ekhSaveConfig').addEventListener('click',saveConfig);el('ekhClearSession').addEventListener('click',()=>signOut('Local session cleared.'));
    el('secureDriveSignOut').addEventListener('click',()=>signOut());document.querySelector('.profile-signout-demo')?.addEventListener('click',()=>signOut());
    el('secureStaffSelect').addEventListener('change',e=>selectStaff(e.target.value));el('secureStaffSearch').addEventListener('input',e=>renderStaffSelector(e.target.value));el('secureRefreshButton').addEventListener('click',loadDrive);
    el('secureUploadButton').addEventListener('click',()=>el('secureFileInput').click());el('secureEmptyUpload').addEventListener('click',()=>el('secureFileInput').click());el('secureFileInput').addEventListener('change',e=>uploadFiles(e.target.files));el('secureFileRows').addEventListener('click',fileAction);
    el('secureDriveFilters').addEventListener('click',e=>{const b=e.target.closest('[data-drive-filter]');if(!b)return;state.filter=b.dataset.driveFilter;el('secureDriveFilters').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));loadDrive();});
    ['pointerdown','keydown','touchstart','scroll'].forEach(type=>document.addEventListener(type,()=>{state.lastActivity=Date.now();},{passive:true}));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.authorised&&Date.now()-state.lastActivity>INACTIVITY_MS)signOut('Session ended after inactivity.');});
    setInterval(()=>{if(state.authorised&&Date.now()-state.lastActivity>INACTIVITY_MS)signOut('Session ended after inactivity.');},60000);
  }
  bind();bootstrap();
  window.EKH_AUTH={signOut,refreshAccess:()=>authorise(state.session),getState:()=>({user:state.user,profile:state.profile,authorised:state.authorised})};
})();

;

/* ---- ekh-v1231-command-bridge ---- */

(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded',() => {
    document.getElementById('cc231ActivityProxy')?.addEventListener('click',() => {
      document.getElementById('dashboardAddActivity')?.click();
    });
  });
})();

;

/* ---- ekh-v1230-editorial-page-renewal-runtime ---- */

(() => {
  'use strict';

  const labels = {
    'command-centre':['Command Center','Owner Edition / Command Journal'],
    projects:['Projects','Portfolio Index / Selected Feature'],
    handoffs:['Mia Queue','Editorial Desk / Controlled Publication']
  };

  function updateRenewedTitle(){
    const active = document.querySelector('.page-content > .view.active');
    if(!active || !labels[active.id]) return;
    const [title,eyebrow] = labels[active.id];
    const titleNode = document.getElementById('pageTitle');
    const eyebrowNode = document.getElementById('pageEyebrow');
    if(titleNode) titleNode.textContent = title;
    if(eyebrowNode) eyebrowNode.textContent = eyebrow;
  }

  document.addEventListener('click',event => {
    if(event.target.closest('[data-view],[data-view-target],[data-mc112-nav],[data-pw113-nav]')){
      setTimeout(updateRenewedTitle,0);
    }
  },true);

  document.addEventListener('DOMContentLoaded',updateRenewedTitle);
})();

;

/* ---- ekh-v1220-production-readiness-runtime ---- */

(() => {
  'use strict';

  const EVIDENCE_KEY = 'ekh_prg122_evidence';
  const REPORT_KEY = 'ekh_prg122_last_report';
  let latestReport = null;

  const requiredViews = [
    'command-centre','notifications','projects','organisation','handoffs',
    'files','system-overview','tasks','decision-rooms'
  ];

  const requiredControllerIds = [
    'dashboardActivityQueue','dashboardAddActivity','dashboardOwnerDecisionCount',
    'mc112ProjectGrid','v172AddActivity','v190MonthGrid','v190AgendaList',
    'supabaseActivityList','settingsBrowserAlert','activitySettingsSyncState',
    'activityCloudTotal','exportSupabaseActivities','secureFileList'
  ];

  const statusPriority = {fail:4,blocked:3,warn:2,pass:1};

  function result(id,title,status,summary,evidence,nextStep){
    return {id,title,status,summary,evidence,nextStep};
  }

  function uniqueIds(){
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
    const duplicates = ids.filter((id,index) => ids.indexOf(id) !== index);
    return [...new Set(duplicates)];
  }

  function topLevelActiveViews(){
    return [...document.querySelectorAll('.page-content > .view.active')]
      .map(node => node.id || '(unnamed)');
  }

  function routeIntegrity(){
    const aliases = new Set(['activity','reports','settings','production-readiness']);
    const missing = [];
    document.querySelectorAll('[data-view],[data-view-target]').forEach(node => {
      const target = node.dataset.view || node.dataset.viewTarget;
      if(!target || aliases.has(target)) return;
      if(!document.getElementById(target)) missing.push(target);
    });
    return [...new Set(missing)];
  }

  function localStorageCheck(){
    const key = `ekh_prg122_test_${Date.now()}`;
    try{
      localStorage.setItem(key,'ok');
      const value = localStorage.getItem(key);
      localStorage.removeItem(key);
      return value === 'ok';
    }catch(error){
      return false;
    }
  }

  function publicConfig(){
    const config = window.EKH_OS_PUBLIC_CONFIG;
    return {
      available:Boolean(config),
      url:Boolean(config?.url && /^https:\/\/.+\.supabase\.co$/i.test(config.url)),
      key:Boolean(config?.key && config.key.startsWith('sb_publishable_')),
      secretLeak:Boolean(config?.serviceRoleKey || config?.secret)
    };
  }

  function authState(){
    try{
      return window.EKH_AUTH?.getState?.() || null;
    }catch(error){
      return null;
    }
  }

  function runDiagnostics(){
    const duplicateIds = uniqueIds();
    const activeViews = topLevelActiveViews();
    const missingRoutes = routeIntegrity();
    const missingViews = requiredViews.filter(id => !document.getElementById(id));
    const missingControllers = requiredControllerIds.filter(id => !document.getElementById(id));
    const config = publicConfig();
    const auth = authState();
    const isPreview = Boolean(auth?.preview || document.body.classList.contains('ekh-preview-mode'));
    const targetHost = location.hostname === 'os.englishkidshub.com';

    const checks = [
      result(
        'dom-ids',
        'DOM identifier integrity',
        duplicateIds.length ? 'fail' : 'pass',
        duplicateIds.length ? `${duplicateIds.length} duplicate IDs detected.` : 'Every current DOM ID is unique.',
        duplicateIds.length ? duplicateIds.join(', ') : 'No duplicate IDs.',
        duplicateIds.length ? 'Resolve duplicate IDs before any runtime test.' : 'No action required.'
      ),
      result(
        'view-isolation',
        'Active-page isolation',
        activeViews.length === 1 ? 'pass' : 'fail',
        activeViews.length === 1 ? `Exactly one top-level view is active: ${activeViews[0]}.` : `${activeViews.length} top-level views are active.`,
        activeViews.join(', ') || 'No active top-level view.',
        activeViews.length === 1 ? 'Repeat after several navigation changes during live QA.' : 'Stop release and correct page visibility.'
      ),
      result(
        'routes',
        'Navigation target integrity',
        missingRoutes.length ? 'fail' : 'pass',
        missingRoutes.length ? `${missingRoutes.length} route targets are missing.` : 'All inspected navigation targets resolve.',
        missingRoutes.length ? missingRoutes.join(', ') : 'No unresolved route targets.',
        missingRoutes.length ? 'Correct broken route targets before deployment.' : 'Verify browser back/forward manually.'
      ),
      result(
        'required-views',
        'Primary workspace presence',
        missingViews.length ? 'fail' : 'pass',
        missingViews.length ? `${missingViews.length} primary workspaces are missing.` : 'All required primary workspaces are present.',
        missingViews.length ? missingViews.join(', ') : requiredViews.join(', '),
        missingViews.length ? 'Restore missing workspaces.' : 'No action required.'
      ),
      result(
        'controllers',
        'Critical controller nodes',
        missingControllers.length ? 'warn' : 'pass',
        missingControllers.length ? `${missingControllers.length} expected controller nodes are absent.` : 'All listed controller nodes are present.',
        missingControllers.length ? missingControllers.join(', ') : `${requiredControllerIds.length} nodes checked.`,
        missingControllers.length ? 'Confirm whether each absent node was intentionally retired.' : 'Exercise the controllers with authorised data.'
      ),
      result(
        'storage',
        'Browser local-storage write',
        localStorageCheck() ? 'pass' : 'fail',
        localStorageCheck() ? 'Local preference storage is writable.' : 'Local preference storage is unavailable.',
        'Temporary write, read and delete cycle.',
        'Repeat in supported browsers and private mode as applicable.'
      ),
      result(
        'config',
        'Public Supabase configuration',
        config.available && config.url && config.key && !config.secretLeak ? 'pass' : 'fail',
        config.available && config.url && config.key && !config.secretLeak
          ? 'Publishable browser configuration has the expected shape.'
          : 'Public configuration is missing, malformed or contains a prohibited secret.',
        JSON.stringify(config),
        'A valid public config does not prove authentication, RLS or database access.'
      ),
      result(
        'supabase-library',
        'Supabase browser client',
        window.supabase ? 'pass' : 'warn',
        window.supabase ? 'The Supabase browser library is available.' : 'The Supabase browser library is not currently available.',
        window.supabase ? 'window.supabase detected.' : 'External script may be unavailable in this preview or browser.',
        'Verify the library and client creation on the deployed domain.'
      ),
      result(
        'auth-session',
        'Authorised authentication state',
        auth?.authorised ? 'pass' : 'blocked',
        auth?.authorised ? `Authorised session detected for ${auth?.user?.email || 'current user'}.` : 'No authorised live session is proven.',
        isPreview ? 'No-login preview mode.' : JSON.stringify({
          user:Boolean(auth?.user),
          profile:Boolean(auth?.profile),
          authorised:Boolean(auth?.authorised)
        }),
        auth?.authorised ? 'Continue role and session-lifecycle testing.' : 'Sign in using an approved account in the full build.'
      ),
      result(
        'network',
        'Browser network state',
        navigator.onLine ? 'warn' : 'blocked',
        navigator.onLine ? 'Browser reports an online connection; service reachability is unverified.' : 'Browser reports offline.',
        `navigator.onLine = ${navigator.onLine}`,
        'Confirm Supabase and the live domain through authorised functional tests.'
      ),
      result(
        'domain',
        'Production-domain context',
        targetHost ? 'warn' : 'blocked',
        targetHost ? 'Running on the intended hostname; deployment identity remains to be recorded.' : 'This is not the production hostname.',
        location.href,
        targetHost ? 'Record the Cloudflare deployment and execute the smoke test.' : 'Deploy through the approved workflow before live-domain verification.'
      ),
      result(
        'reduced-motion',
        'Reduced-motion compatibility',
        document.getElementById('ekh-v1214-editorial-magazine-os') ? 'pass' : 'warn',
        document.getElementById('ekh-v1214-editorial-magazine-os')
          ? 'The editorial motion layer includes reduced-motion handling.'
          : 'The expected editorial motion stylesheet was not detected.',
        'Stylesheet marker check.',
        'Confirm visually with the operating-system reduced-motion setting.'
      )
    ];

    const report = {
      generated_at:new Date().toISOString(),
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      location:location.href,
      user_agent:navigator.userAgent,
      preview:isPreview,
      checks,
      summary:checks.reduce((acc,item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },{})
    };

    latestReport = report;
    try{localStorage.setItem(REPORT_KEY,JSON.stringify(report));}catch(error){}
    renderDiagnostics(report);
    updateGate();
    return report;
  }

  function renderDiagnostics(report){
    const list = document.getElementById('prg122DiagnosticList');
    if(!list) return;
    list.innerHTML = report.checks.map((item,index) => `
      <button class="prg122-result ${index === 0 ? 'active' : ''}"
        data-prg122-result="${item.id}" data-status="${item.status}" type="button">
        <span class="prg122-result-status">${item.status.toUpperCase()}</span>
        <span><strong>${item.title}</strong><small>${item.summary}</small></span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6"></path>
        </svg>
      </button>
    `).join('');

    const passed = report.checks.filter(item => item.status === 'pass').length;
    document.getElementById('prg122LocalScore').textContent =
      `${passed} / ${report.checks.length}`;
    document.getElementById('readinessNavCount').textContent =
      String(report.checks.filter(item => item.status !== 'pass').length);

    selectDiagnostic(report.checks[0]?.id);
  }

  function selectDiagnostic(id){
    if(!latestReport) return;
    const item = latestReport.checks.find(check => check.id === id);
    if(!item) return;

    document.querySelectorAll('.prg122-result').forEach(button => {
      button.classList.toggle('active',button.dataset.prg122Result === id);
    });

    const inspector = document.getElementById('prg122DiagnosticInspector');
    inspector.innerHTML = `
      <span class="section-kicker">${item.status.toUpperCase()} / ${item.id}</span>
      <h4>${item.title}</h4>
      <p>${item.summary}</p>
      <dl>
        <div><dt>Evidence</dt><dd>${escapeHtml(item.evidence)}</dd></div>
        <div><dt>Next step</dt><dd>${escapeHtml(item.nextStep)}</dd></div>
        <div><dt>Classification</dt><dd>${item.status.toUpperCase()}</dd></div>
      </dl>
    `;
  }

  function escapeHtml(value){
    return String(value)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function evidenceState(){
    const state = {};
    document.querySelectorAll('[data-evidence-id]').forEach(label => {
      state[label.dataset.evidenceId] = label.querySelector('input').checked;
    });
    return state;
  }

  function loadEvidence(){
    let stored = {};
    try{stored = JSON.parse(localStorage.getItem(EVIDENCE_KEY) || '{}');}catch(error){}
    document.querySelectorAll('[data-evidence-id]').forEach(label => {
      label.querySelector('input').checked = Boolean(stored[label.dataset.evidenceId]);
    });
    updateGate();
  }

  function saveEvidence(){
    try{localStorage.setItem(EVIDENCE_KEY,JSON.stringify(evidenceState()));}catch(error){}
    updateGate();
  }

  function updateGate(){
    const evidence = Object.values(evidenceState());
    const complete = evidence.filter(Boolean).length;
    const total = evidence.length || 9;
    const localChecks = latestReport?.checks || [];
    const localPass = localChecks.length > 0 &&
      localChecks.every(item => item.status !== 'fail');
    const criticalBlocks = localChecks.some(item => item.status === 'fail');
    const ready = localPass && complete === total && !criticalBlocks;
    const conditional = localPass && complete > 0 && !ready;

    document.getElementById('prg122ManualScore').textContent = `${complete} / ${total}`;

    const status = document.getElementById('prg122GateStatus');
    const decision = document.getElementById('prg122Decision');
    const note = document.getElementById('prg122DecisionNote');

    status.dataset.state = ready ? 'ready' : conditional ? 'conditional' : 'blocked';
    status.querySelector('strong').textContent = ready ? 'READY' : conditional ? 'CONDITIONAL' : 'BLOCKED';
    status.querySelector('span').textContent = ready
      ? 'Evidence complete; named approval still required'
      : conditional
        ? 'Partial evidence recorded'
        : 'Live evidence incomplete';

    decision.textContent = ready ? 'GO REVIEW' : 'HOLD';
    note.textContent = ready
      ? 'Proceed to named owner go/no-go decision'
      : criticalBlocks
        ? 'Resolve local diagnostic failures'
        : complete
          ? 'Complete all live-evidence items'
          : latestReport
            ? 'Authorised runtime evidence required'
            : 'Run local diagnostics first';

    const unresolved = localChecks.filter(item => item.status !== 'pass').length +
      (total - complete);
    document.getElementById('readinessNavCount').textContent = String(unresolved);
  }

  function exportReport(){
    const report = latestReport || runDiagnostics();
    const payload = {
      ...report,
      manual_evidence:evidenceState(),
      gate:{
        local_score:document.getElementById('prg122LocalScore').textContent,
        manual_score:document.getElementById('prg122ManualScore').textContent,
        decision:document.getElementById('prg122Decision').textContent,
        note:document.getElementById('prg122DecisionNote').textContent
      }
    };
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `EKH_OS_v1.30.2_Readiness_${new Date().toISOString().replaceAll(':','-')}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),0);
  }

  document.addEventListener('DOMContentLoaded',() => {
    try{
      const stored = JSON.parse(localStorage.getItem(REPORT_KEY) || 'null');
      if(stored?.checks){
        latestReport = stored;
        renderDiagnostics(stored);
      }
    }catch(error){}

    loadEvidence();

    document.getElementById('prg122RunDiagnostics')
      ?.addEventListener('click',runDiagnostics);
    document.getElementById('prg122ExportReport')
      ?.addEventListener('click',exportReport);
    document.getElementById('prg122ResetEvidence')
      ?.addEventListener('click',() => {
        document.querySelectorAll('[data-evidence-id] input').forEach(input => {
          input.checked = false;
        });
        try{localStorage.removeItem(EVIDENCE_KEY);}catch(error){}
        updateGate();
      });

    document.getElementById('prg122EvidenceList')
      ?.addEventListener('change',saveEvidence);

    document.getElementById('prg122DiagnosticList')
      ?.addEventListener('click',event => {
        const item = event.target.closest('[data-prg122-result]');
        if(item) selectDiagnostic(item.dataset.prg122Result);
      });

    document.getElementById('prg122Index')
      ?.addEventListener('click',event => {
        const tab = event.target.closest('[data-prg122-view]');
        if(!tab) return;
        const target = tab.dataset.prg122View;
        document.querySelectorAll('[data-prg122-view]').forEach(button => {
          button.classList.toggle('active',button === tab);
        });
        document.querySelectorAll('[data-prg122-panel]').forEach(panel => {
          panel.hidden = panel.dataset.prg122Panel !== target;
          panel.classList.toggle('active',panel.dataset.prg122Panel === target);
        });
      });

    if(document.getElementById('sys121PanelReadiness')?.closest('.sys121-panel:not([hidden])')){
      setTimeout(runDiagnostics,50);
    }
  });
})();

;

/* ---- ekh-v1214-editorial-runtime ---- */

(() => {
  'use strict';

  function closeOtherTeams(current){
    document.querySelectorAll('.ed124-team-toggle[aria-expanded="true"]')
      .forEach(toggle => {
        if(toggle === current) return;
        toggle.setAttribute('aria-expanded','false');
        const panel = toggle.nextElementSibling;
        if(panel) panel.hidden = true;
      });
  }

  document.addEventListener('click',event => {
    const toggle = event.target.closest('.ed124-team-toggle');
    if(!toggle) return;

    const panel = toggle.nextElementSibling;
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    closeOtherTeams(toggle);
    toggle.setAttribute('aria-expanded',String(!expanded));
    if(panel) panel.hidden = expanded;
  });

  function replayActiveView(){
    const active = document.querySelector('.page-content > .view.active');
    if(!active) return;
    active.style.animation = 'none';
    void active.offsetWidth;
    active.style.animation = '';
  }

  document.addEventListener('click',event => {
    if(event.target.closest('[data-view],[data-view-target]')){
      setTimeout(replayActiveView,0);
    }
  },true);

  document.addEventListener('DOMContentLoaded',() => {
    document.querySelectorAll('.ed124-team-toggle').forEach(toggle => {
      toggle.setAttribute('aria-expanded','false');
      const panel = toggle.nextElementSibling;
      if(panel) panel.hidden = true;
    });
  });
})();

;

/* ---- ekh-v1213-staff-card-runtime ---- */

(() => {
  'use strict';

  function openDepartmentMember(name, departmentId){
    const department = departmentId
      ? document.getElementById(departmentId)
      : null;

    let row = null;
    if(department){
      row = [...department.querySelectorAll('.org-member-row')]
        .find(item => item.querySelector('strong')?.textContent.trim() === name);
    }

    if(!row){
      row = [...document.querySelectorAll('.v192-department-page .org-member-row')]
        .find(item => item.querySelector('strong')?.textContent.trim() === name);
    }

    row?.click();
  }

  document.addEventListener('click',event => {
    const staff = event.target.closest('[data-org123-person]');
    if(!staff) return;
    event.preventDefault();
    event.stopPropagation();
    openDepartmentMember(
      staff.dataset.org123Person,
      staff.dataset.org123Department
    );
  });

  document.addEventListener('keydown',event => {
    const row = event.target.closest('.org123-department-member');
    if(!row) return;
    if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault();
      row.click();
    }
  });
})();

;

/* ---- ekh-v1232-daily-office-dossier-runtime ---- */
(() => {
  'use strict';

  const TAB_KEY = 'ekh_command_center_dossier_page_v1232';
  const HERO_KEY = 'ekh_command_center_hero_v119';
  const REVIEW_KEY = 'ekh_command_center_review_v1232';
  const APPROVAL_KEY = 'ekh_command_center_approval_v1232';
  const CLOSING_KEY = 'ekh_command_center_closing_v1232';
  const HINT_KEY = 'ekh_command_center_swipe_hint_v1232';

  const tabs = ['briefing','decisions','critical','projects','activity'];
  const summaries = {
    briefing:'Morning brief',
    decisions:'Owner approval sheet',
    critical:'Critical-path routing slip',
    projects:'Portfolio file index',
    activity:'Daily closing record'
  };

  const byId = id => document.getElementById(id);
  const root = () => byId('command-centre');
  const viewport = () => byId('cc232Viewport');
  const sheets = () => [...document.querySelectorAll('#command-centre [data-cc232-sheet]')];
  let currentIndex = 0;
  let scrollFrame = 0;

  function safeRead(key, fallback){
    try{
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    }catch(error){
      return fallback;
    }
  }

  function safeWrite(key, value){
    try{
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }catch(error){
      return false;
    }
  }

  function toast(title, detail){
    if(typeof window.showToast === 'function') window.showToast(title, detail);
  }

  function setHeroCollapsed(collapsed){
    const command = root();
    const toggle = byId('cc119HeroToggle');
    if(!command || !toggle) return;
    command.classList.toggle('cc119-hero-collapsed', collapsed);
    toggle.setAttribute('aria-pressed', String(collapsed));
    toggle.title = collapsed ? 'Expand introduction' : 'Collapse introduction';
    toggle.setAttribute('aria-label', collapsed ? 'Expand Command Center introduction' : 'Collapse Command Center introduction');
    try{localStorage.setItem(HERO_KEY, collapsed ? '1' : '0');}catch(error){}
  }

  function updatePageState(index, {focus=false}={}){
    const next = Math.max(0, Math.min(tabs.length - 1, index));
    currentIndex = next;
    const tabName = tabs[next];
    const command = root();
    if(command) command.dataset.cc119Tab = tabName;

    document.querySelectorAll('#command-centre [data-cc119-tab][role="tab"]').forEach(button => {
      const active = Number(button.dataset.cc232Page) === next;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if(active && focus) button.focus();
    });

    sheets().forEach((sheet, sheetIndex) => {
      const active = sheetIndex === next;
      sheet.hidden = false;
      sheet.classList.toggle('active', active);
      sheet.setAttribute('aria-hidden', String(!active));
    });

    if(byId('cc119TabSummary')) byId('cc119TabSummary').textContent = summaries[tabName];
    if(byId('cc232PageCount')) byId('cc232PageCount').textContent = String(next + 1);
    if(byId('cc232Prev')) byId('cc232Prev').disabled = next === 0;
    if(byId('cc232Next')) byId('cc232Next').disabled = next === tabs.length - 1;
    try{localStorage.setItem(TAB_KEY, tabName);}catch(error){}
  }

  function goTo(index, {smooth=true, focus=false}={}){
    const page = sheets()[index];
    const scroller = viewport();
    if(!page || !scroller) return;
    updatePageState(index, {focus});
    scroller.scrollTo({left:page.offsetLeft, behavior:smooth ? 'smooth' : 'auto'});
  }

  function syncFromScroll(){
    const scroller = viewport();
    if(!scroller) return;
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const pages = sheets();
      if(!pages.length) return;
      let nearest = 0;
      let distance = Infinity;
      pages.forEach((page,index) => {
        const value = Math.abs(page.offsetLeft - scroller.scrollLeft);
        if(value < distance){distance = value;nearest = index;}
      });
      if(nearest !== currentIndex) updatePageState(nearest);
    });
  }

  function loadReviews(){
    const state = safeRead(REVIEW_KEY, {});
    document.querySelectorAll('[data-cc232-review]').forEach(input => {
      input.checked = Boolean(state[input.dataset.cc232Review]);
    });
    updateReviewProgress();
  }

  function updateReviewProgress(){
    const inputs = [...document.querySelectorAll('[data-cc232-review]')];
    const state = {};
    inputs.forEach(input => state[input.dataset.cc232Review] = input.checked);
    safeWrite(REVIEW_KEY, state);
    const reviewed = inputs.filter(input => input.checked).length;
    if(byId('cc232ReviewedCount')) byId('cc232ReviewedCount').textContent = `${reviewed} of ${inputs.length} reviewed`;
    if(byId('cc232ReviewBar')) byId('cc232ReviewBar').style.width = `${inputs.length ? reviewed / inputs.length * 100 : 0}%`;
  }

  function signaturePreview(){
    const name = byId('cc232SignatureName')?.value.trim() || '';
    const preview = byId('cc232SignaturePreview');
    if(!preview) return;
    preview.textContent = name || 'Sign here';
    preview.classList.toggle('has-signature', Boolean(name));
  }

  function approvalRecordFromForm(){
    return {
      record_id:'EKH-APP-2026-0731-01',
      subject:'Question-bank audit closure and formal Reo → Jeff handoff',
      decision:byId('cc232Decision')?.value || '',
      owner_name:byId('cc232SignatureName')?.value.trim() || '',
      note:byId('cc232ApprovalNote')?.value.trim() || '',
      evidence_confirmed:Boolean(byId('cc232EvidenceConfirm')?.checked),
      authority_confirmed:Boolean(byId('cc232AuthorityConfirm')?.checked),
      signed_at:new Date().toISOString(),
      storage:'browser-local-draft',
      production_written:false
    };
  }

  function renderApproval(record){
    if(!record) return;
    if(byId('cc232Decision')) byId('cc232Decision').value = record.decision || '';
    if(byId('cc232SignatureName')) byId('cc232SignatureName').value = record.owner_name || '';
    if(byId('cc232ApprovalNote')) byId('cc232ApprovalNote').value = record.note || '';
    if(byId('cc232EvidenceConfirm')) byId('cc232EvidenceConfirm').checked = Boolean(record.evidence_confirmed);
    if(byId('cc232AuthorityConfirm')) byId('cc232AuthorityConfirm').checked = Boolean(record.authority_confirmed);
    signaturePreview();

    const result = byId('cc232SignResult');
    const status = byId('cc232ApprovalStatus');
    if(result) result.hidden = false;
    if(status){status.textContent = 'SIGNED LOCALLY';status.classList.add('signed');}
    if(byId('cc232SignedMeta')){
      const date = record.signed_at ? new Date(record.signed_at) : new Date();
      byId('cc232SignedMeta').textContent = `${record.owner_name || 'Owner'} · ${record.decision || 'decision not stated'} · ${date.toLocaleString('en-MY',{dateStyle:'medium',timeStyle:'short'})}`;
    }
  }

  function clearApproval(){
    try{localStorage.removeItem(APPROVAL_KEY);}catch(error){}
    byId('cc232ApprovalForm')?.reset();
    signaturePreview();
    if(byId('cc232SignResult')) byId('cc232SignResult').hidden = true;
    if(byId('cc232ApprovalStatus')){
      byId('cc232ApprovalStatus').textContent = 'AWAITING SIGNATURE';
      byId('cc232ApprovalStatus').classList.remove('signed');
    }
    toast('Local approval cleared','No production record was changed.');
  }

  function downloadJson(filename, payload){
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function exportApproval(){
    const record = safeRead(APPROVAL_KEY, null) || approvalRecordFromForm();
    downloadJson(`EKH_Approval_${new Date().toISOString().replaceAll(':','-')}.json`, record);
  }

  function saveClosingNote(){
    const note = byId('cc232ClosingNote')?.value.trim() || '';
    const record = {note, saved_at:new Date().toISOString(), storage:'browser-local-draft'};
    safeWrite(CLOSING_KEY, record);
    if(byId('cc232ClosingStatus')) byId('cc232ClosingStatus').textContent = note ? `Saved locally · ${new Date(record.saved_at).toLocaleString('en-MY',{dateStyle:'medium',timeStyle:'short'})}` : 'Empty note saved locally.';
    toast('Closing note saved','The note remains in this browser only.');
  }

  function exportDossier(){
    const reviews = safeRead(REVIEW_KEY, {});
    const approval = safeRead(APPROVAL_KEY, null);
    const closing = safeRead(CLOSING_KEY, null);
    const payload = {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      generated_at:new Date().toISOString(),
      dossier_date:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),
      review_items:reviews,
      approval,
      closing_note:closing,
      note:'Export contains browser-local draft records only. It is not proof of a production database write.'
    };
    downloadJson(`EKH_Daily_Dossier_${new Date().toISOString().replaceAll(':','-')}.json`, payload);
  }

  function initialiseDate(){
    const node = byId('todayLabel');
    if(node) node.textContent = new Date().toLocaleDateString('en-MY',{timeZone:'Asia/Kuala_Lumpur',weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }

  function bind(){
    byId('cc232Prev')?.addEventListener('click',() => goTo(currentIndex - 1));
    byId('cc232Next')?.addEventListener('click',() => goTo(currentIndex + 1));
    byId('cc232Viewport')?.addEventListener('scroll', syncFromScroll, {passive:true});

    byId('cc119CommandTabs')?.addEventListener('click',event => {
      const tab = event.target.closest('[data-cc232-page]');
      if(tab) goTo(Number(tab.dataset.cc232Page), {focus:true});
      if(event.target.closest('#cc119HeroToggle')) setHeroCollapsed(!root()?.classList.contains('cc119-hero-collapsed'));
    });

    byId('cc232Viewport')?.addEventListener('keydown',event => {
      if(event.target.matches('input,textarea,select,button')) return;
      if(event.key === 'ArrowRight' || event.key === 'PageDown'){
        event.preventDefault();goTo(currentIndex + 1);
      }
      if(event.key === 'ArrowLeft' || event.key === 'PageUp'){
        event.preventDefault();goTo(currentIndex - 1);
      }
      if(event.key === 'Home'){event.preventDefault();goTo(0);}
      if(event.key === 'End'){event.preventDefault();goTo(tabs.length - 1);}
    });

    document.querySelectorAll('[data-cc232-review]').forEach(input => input.addEventListener('change', updateReviewProgress));
    byId('cc232SignatureName')?.addEventListener('input', signaturePreview);

    byId('cc232ApprovalForm')?.addEventListener('submit',event => {
      event.preventDefault();
      const record = approvalRecordFromForm();
      if(!record.decision || !record.owner_name){
        toast('Approval incomplete','Select a decision and type the owner name.');
        return;
      }
      if(!record.evidence_confirmed || !record.authority_confirmed){
        toast('Confirmation required','Check both confirmation statements before signing.');
        return;
      }
      safeWrite(APPROVAL_KEY, record);
      renderApproval(record);
      toast('Approval signed locally','Export the record or write it through an authorised production workflow later.');
    });

    byId('cc232ExportApproval')?.addEventListener('click', exportApproval);
    byId('cc232ClearApproval')?.addEventListener('click', clearApproval);
    byId('cc232SaveClosingNote')?.addEventListener('click', saveClosingNote);
    byId('cc232ExportDossier')?.addEventListener('click', exportDossier);
    byId('cc232ActivityProxy')?.addEventListener('click',() => byId('dashboardAddActivity')?.click());
    byId('cc119AddActivity')?.addEventListener('click',() => byId('dashboardAddActivity')?.click());

    byId('cc232DismissHint')?.addEventListener('click',() => {
      try{localStorage.setItem(HINT_KEY,'1');}catch(error){}
      if(byId('cc232SwipeHint')) byId('cc232SwipeHint').hidden = true;
    });
  }

  document.addEventListener('DOMContentLoaded',() => {
    sheets().forEach(sheet => sheet.hidden = false);
    initialiseDate();
    bind();
    loadReviews();
    signaturePreview();

    const approval = safeRead(APPROVAL_KEY, null);
    if(approval) renderApproval(approval);

    const closing = safeRead(CLOSING_KEY, null);
    if(closing){
      if(byId('cc232ClosingNote')) byId('cc232ClosingNote').value = closing.note || '';
      if(byId('cc232ClosingStatus')) byId('cc232ClosingStatus').textContent = `Saved locally · ${new Date(closing.saved_at).toLocaleString('en-MY',{dateStyle:'medium',timeStyle:'short'})}`;
    }

    try{
      if(localStorage.getItem(HINT_KEY) === '1' && byId('cc232SwipeHint')) byId('cc232SwipeHint').hidden = true;
    }catch(error){}

    setHeroCollapsed(localStorage.getItem(HERO_KEY) === '1');
    const savedTab = localStorage.getItem(TAB_KEY);
    const index = Math.max(0, tabs.indexOf(savedTab));
    requestAnimationFrame(() => goTo(index, {smooth:false}));
  });
})();

;

/* ---- ekh-v118-staff-drive-compact-preview-runtime ---- */

(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const host = () => byId('secureFileRows');
  let selectedRow = null;
  let observer = null;
  let scheduled = false;

  function rowData(row){
    const cells = row.querySelectorAll('.v173-file-row-main > .v173-file-cell');
    const details = [...row.querySelectorAll('.v173-file-detail > div')].map(node => ({
      key:node.querySelector('b')?.textContent.trim() || '',
      value:node.querySelector('span')?.textContent.trim() || '—'
    }));
    const detail = key => details.find(item => item.key.toLowerCase() === key.toLowerCase())?.value || '—';
    const name = row.querySelector('.v173-file-name strong')?.textContent.trim() || 'Unnamed file';
    const type = row.querySelector('.v173-file-icon')?.textContent.trim() || 'FILE';
    return {
      name,
      type,
      size:detail('Size') !== '—' ? detail('Size') : row.querySelector('.v173-file-name small')?.textContent.trim() || '—',
      owner:cells[0]?.textContent.trim() || byId('secureSelectedName')?.textContent.trim() || '—',
      modified:cells[1]?.textContent.trim() || '—',
      status:row.querySelector('.v173-file-status')?.textContent.trim() || '—',
      version:detail('Version'),
      handoff:detail('Handoff'),
      permission:detail('Permissions'),
      audit:detail('Audit')
    };
  }

  function parseSize(value){
    const match = String(value || '').match(/([\d.]+)\s*(B|KB|MB|GB)/i);
    if(!match) return 0;
    const factor = {B:1,KB:1024,MB:1048576,GB:1073741824}[match[2].toUpperCase()] || 1;
    return Number(match[1]) * factor;
  }

  function parseDate(value){
    const timestamp = Date.parse(String(value || ''));
    return Number.isFinite(timestamp) ? timestamp : 0;
  }

  function updateVisibleCount(){
    const rows = [...host().querySelectorAll('.v173-file-row')];
    const visible = rows.filter(row => !row.hidden).length;
    const node = byId('secureVisibleCount');
    if(node) node.textContent = String(visible);
  }

  function applySearchAndSort(){
    if(!host()) return;
    const query = String(byId('secureFileSearch')?.value || '').trim().toLowerCase();
    const sort = byId('secureFileSort')?.value || 'updated_desc';
    const rows = [...host().querySelectorAll('.v173-file-row')];

    rows.forEach(row => {
      const data = rowData(row);
      row.hidden = Boolean(query) && ![
        data.name,data.type,data.owner,data.modified,data.status,
        data.version,data.handoff,data.permission
      ].join(' ').toLowerCase().includes(query);
    });

    rows.sort((a,b) => {
      const first = rowData(a), second = rowData(b);
      if(sort === 'updated_asc') return parseDate(first.modified) - parseDate(second.modified);
      if(sort === 'name_asc') return first.name.localeCompare(second.name);
      if(sort === 'name_desc') return second.name.localeCompare(first.name);
      if(sort === 'size_desc') return parseSize(second.size) - parseSize(first.size);
      return parseDate(second.modified) - parseDate(first.modified);
    });

    observer?.disconnect();
    rows.forEach(row => host().appendChild(row));
    observer?.observe(host(),{childList:true});
    updateVisibleCount();
  }

  function enhanceRows(){
    if(!host()) return;
    host().querySelectorAll('.v173-file-row').forEach(row => {
      const details = row.querySelector('[data-file-action="details"]');
      if(details){
        details.textContent = 'Preview';
        details.setAttribute('aria-label',`Preview ${rowData(row).name}`);
      }
    });
    applySearchAndSort();

    if(selectedRow && !document.documentElement.contains(selectedRow)){
      closePreview();
    }
  }

  function scheduleEnhance(){
    if(scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enhanceRows();
    });
  }

  function openPreview(row){
    if(!row) return;
    selectedRow?.classList.remove('drive118-selected');
    selectedRow = row;
    selectedRow.classList.add('drive118-selected');

    const data = rowData(row);
    byId('securePreviewEmpty').hidden = true;
    byId('securePreviewContent').hidden = false;
    byId('securePreviewPanel').classList.add('open');
    byId('securePreviewBackdrop').hidden = false;

    byId('securePreviewName').textContent = data.name;
    byId('securePreviewDisplayName').textContent = data.name;
    byId('securePreviewOwner').textContent = `${data.owner} · ${byId('secureSelectedDepartment')?.textContent || '—'}`;
    byId('securePreviewIcon').textContent = data.type;
    byId('securePreviewStatus').textContent = data.status;
    byId('securePreviewModified').textContent = data.modified;
    byId('securePreviewSize').textContent = data.size;
    byId('securePreviewVersion').textContent = data.version;
    byId('securePreviewPermission').textContent = data.permission;
    byId('securePreviewHandoff').textContent = data.handoff;
    byId('securePreviewAudit').textContent = data.audit;

    const archiveSource = row.querySelector('[data-file-action="archive"],[data-file-action="restore"]');
    const archive = byId('securePreviewArchive');
    archive.hidden = !archiveSource;
    archive.dataset.proxyAction = archiveSource?.dataset.fileAction || '';
    archive.querySelector('span').textContent = archiveSource?.dataset.fileAction === 'restore' ? 'Restore' : 'Archive';
  }

  function closePreview(){
    selectedRow?.classList.remove('drive118-selected');
    selectedRow = null;
    byId('securePreviewPanel')?.classList.remove('open');
    if(byId('securePreviewBackdrop')) byId('securePreviewBackdrop').hidden = true;
    if(byId('securePreviewEmpty')) byId('securePreviewEmpty').hidden = false;
    if(byId('securePreviewContent')) byId('securePreviewContent').hidden = true;
  }

  function proxyAction(action){
    if(!selectedRow) return;
    const button = selectedRow.querySelector(`[data-file-action="${CSS.escape(action)}"]`);
    button?.click();
    if(action === 'archive' || action === 'restore') closePreview();
  }

  document.addEventListener('DOMContentLoaded',() => {
    if(!host()) return;

    observer = new MutationObserver(scheduleEnhance);
    observer.observe(host(),{childList:true});
    enhanceRows();

    host().addEventListener('click',event => {
      const details = event.target.closest('[data-file-action="details"]');
      if(details){
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        openPreview(details.closest('.v173-file-row'));
        return;
      }

      if(!event.target.closest('.v173-file-actions')){
        const row = event.target.closest('.v173-file-row');
        if(row) openPreview(row);
      }
    },true);

    byId('secureFileSearch')?.addEventListener('input',applySearchAndSort);
    byId('secureFileSort')?.addEventListener('change',applySearchAndSort);
    byId('securePreviewClose')?.addEventListener('click',closePreview);
    byId('securePreviewBackdrop')?.addEventListener('click',closePreview);
    byId('securePreviewDownload')?.addEventListener('click',() => proxyAction('download'));
    byId('securePreviewArchive')?.addEventListener('click',event => proxyAction(event.currentTarget.dataset.proxyAction));

    byId('secureStaffSelect')?.addEventListener('change',closePreview);
    byId('secureRefreshButton')?.addEventListener('click',closePreview);
    byId('secureDriveFilters')?.addEventListener('click',() => {
      closePreview();
      const search = byId('secureFileSearch');
      if(search) search.value = '';
    });

    document.addEventListener('keydown',event => {
      if(event.key === 'Escape' && selectedRow) closePreview();
      if(event.key === '/' &&
        !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName) &&
        byId('files')?.classList.contains('active')){
        event.preventDefault();
        byId('secureFileSearch')?.focus();
      }
    });
  });
})();

;

/* ---- ekh-v1731-controls ---- */

(() => {
  'use strict';
  const root = document.documentElement;
  const prefs = {
    theme: localStorage.getItem('ekh_theme') || 'aurora',
    font: 'mission',
    mode: localStorage.getItem('ekh_appearance') || 'light'
  };
  const labels = {
    theme:{aurora:'Aurora Violet Cyan',lavender:'Lavender Slate',ocean:'Ocean Teal Navy'},
    font:{mission:'Mission Control Typography'},
    mode:{light:'Light mode',dark:'Dark mode'}
  };
  function applyPrefs(){
    root.dataset.theme=prefs.theme;root.dataset.font='mission';root.dataset.mode=prefs.mode;localStorage.removeItem('ekh_font');
    localStorage.setItem('ekh_theme',prefs.theme);localStorage.setItem('ekh_appearance',prefs.mode);
    document.querySelectorAll('[data-pref]').forEach(btn=>{
      const selected=prefs[btn.dataset.pref]===btn.dataset.value;
      btn.classList.toggle('selected',selected);btn.setAttribute('aria-checked',selected?'true':'false');
    });
    const fontValue=document.querySelector('#ekhFontCurrent');if(fontValue)fontValue.textContent=labels.font[prefs.font];
    const themeValue=document.querySelector('#ekhThemeCurrent');if(themeValue)themeValue.textContent=labels.theme[prefs.theme];
    const modeValue=document.querySelector('#ekhModeCurrent');if(modeValue)modeValue.textContent=labels.mode[prefs.mode];
  }
  function menuMarkup(){return `
    <div class="profile-popover-head"><span class="avatar owner">AF</span><div><strong>Azuar Fahmi</strong><small>Founder / Owner</small></div></div>
    <div class="ekh-menu-label">APPEARANCE</div>
    <div class="ekh-menu-group">
      <button class="ekh-menu-row ekh-font-system-row" type="button" disabled aria-disabled="true"><span class="ekh-menu-icon">Aa</span><span class="ekh-menu-copy"><strong>Typography</strong><small>Space Grotesk · Source Sans 3 · IBM Plex Mono</small></span><span class="ekh-font-lock">LOCKED</span></button>
      <button class="ekh-menu-row" type="button" data-submenu-toggle="theme"><span class="ekh-menu-icon">✦</span><span class="ekh-menu-copy"><strong>Colour theme</strong><small id="ekhThemeCurrent"></small></span><span>›</span></button>
      <div class="ekh-submenu" data-submenu="theme" role="radiogroup" aria-label="Colour theme selection">
        <button class="ekh-option" type="button" data-pref="theme" data-value="aurora" role="radio"><span class="check">✓</span><span>Aurora Violet Cyan</span><span class="ekh-swatch aurora"><i></i><i></i><i></i></span></button>
        <button class="ekh-option" type="button" data-pref="theme" data-value="lavender" role="radio"><span class="check">✓</span><span>Lavender Slate</span><span class="ekh-swatch lavender"><i></i><i></i><i></i></span></button>
        <button class="ekh-option" type="button" data-pref="theme" data-value="ocean" role="radio"><span class="check">✓</span><span>Ocean Teal Navy</span><span class="ekh-swatch ocean"><i></i><i></i><i></i></span></button>
      </div>
      <button class="ekh-menu-row" type="button" data-submenu-toggle="mode"><span class="ekh-menu-icon">◐</span><span class="ekh-menu-copy"><strong>Appearance</strong><small id="ekhModeCurrent"></small></span><span>›</span></button>
      <div class="ekh-submenu" data-submenu="mode" role="radiogroup" aria-label="Appearance mode selection">
        <button class="ekh-option" type="button" data-pref="mode" data-value="light" role="radio"><span class="check">✓</span><span>Light mode</span><span>☀</span></button>
        <button class="ekh-option" type="button" data-pref="mode" data-value="dark" role="radio"><span class="check">✓</span><span>Dark mode</span><span>☾</span></button>
      </div>
    </div>
    <div class="ekh-menu-separator"></div>
    <button class="ekh-menu-row" type="button" data-view-target="settings"><span class="ekh-menu-icon">⚙</span><span class="ekh-menu-copy"><strong>Settings</strong><small>Workspace, reminders and local data</small></span><span>›</span></button>
    <button class="ekh-menu-row ekh-signout profile-signout-demo" type="button"><span class="ekh-menu-icon">↗</span><span class="ekh-menu-copy"><strong>Sign Out</strong><small>End the secure Supabase session</small></span><span></span></button>`}
  function init(){
    applyPrefs();
    const pop=document.querySelector('#profilePopover');
    if(!pop)return;
    pop.classList.add('ekh-control-menu');pop.innerHTML=menuMarkup();applyPrefs();
    pop.addEventListener('click',e=>{
      const toggle=e.target.closest('[data-submenu-toggle]');
      if(toggle){e.stopPropagation();const key=toggle.dataset.submenuToggle;const panel=pop.querySelector(`[data-submenu="${key}"]`);const open=!panel.classList.contains('open');pop.querySelectorAll('.ekh-submenu').forEach(n=>n.classList.remove('open'));pop.querySelectorAll('[data-submenu-toggle]').forEach(n=>n.setAttribute('aria-expanded','false'));panel.classList.toggle('open',open);toggle.setAttribute('aria-expanded',open?'true':'false');return;}
      const option=e.target.closest('[data-pref]');
      if(option){e.stopPropagation();prefs[option.dataset.pref]=option.dataset.value;applyPrefs();return;}
      const settings=e.target.closest('[data-view-target="settings"]');
      if(settings){document.querySelector('[data-view="settings"]')?.click();pop.setAttribute('aria-hidden','true');document.querySelector('#profileMenuButton')?.setAttribute('aria-expanded','false');}
      const out=e.target.closest('.profile-signout-demo');if(out){window.EKH_AUTH?.signOut?.();}
    });
    document.querySelector('#paletteButton')?.addEventListener('click',e=>{e.preventDefault();document.querySelector('#profileMenuButton')?.click();setTimeout(()=>pop.querySelector('[data-submenu-toggle="theme"]')?.click(),0)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

;

/* ---- ekh-v182-activity-empty-actions ---- */

(()=>{
  const openActivityModal=()=>{
    const existing=document.getElementById('v172AddActivity');
    if(existing){
      existing.click();
      return;
    }
    const modal=document.getElementById('supabaseActivityModal');
    if(modal){
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
    }
  };
  document.getElementById('v182EmptyStateAdd')?.addEventListener('click',openActivityModal);
  document.getElementById('v182EmptyStateAddTop')?.addEventListener('click',openActivityModal);
})();

;

/* ---- ekh-v117-compact-workspace-runtime ---- */

(() => {
  'use strict';

  const FOCUS_KEY = 'ekh_compact_workspace_v117';
  const ORG_HERO_KEY = 'ekh_org_hero_collapsed_v117';
  const byId = id => document.getElementById(id);
  const orgPage = () => document.querySelector('.org116-page');

  function showToast(message){
    let toast = byId('compact117Toast');
    if(!toast){
      toast = document.createElement('div');
      toast.id = 'compact117Toast';
      toast.className = 'compact117-toast';
      toast.setAttribute('role','status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'),2200);
  }

  function setFocusMode(enabled,{announce=false}={}){
    document.body.classList.toggle('compact117-mode',enabled);
    const toggle = byId('compact117Toggle');
    if(toggle){
      toggle.setAttribute('aria-pressed',String(enabled));
      toggle.title = enabled ? 'Exit focus view' : 'Focus view';
      toggle.setAttribute('aria-label',enabled ? 'Exit focus view' : 'Toggle focus view');
    }
    localStorage.setItem(FOCUS_KEY,enabled ? '1' : '0');
    if(announce){
      showToast(enabled
        ? 'Focus view enabled. Introductions and secondary panels are hidden.'
        : 'Full workspace view restored.');
    }
  }

  function setOrgHeroCollapsed(collapsed){
    const page = orgPage();
    const toggle = byId('compact117OrgHeroToggle');
    if(!page || !toggle) return;
    page.classList.toggle('compact117-hero-collapsed',collapsed);
    toggle.setAttribute('aria-pressed',String(collapsed));
    toggle.title = collapsed ? 'Expand introduction' : 'Collapse introduction';
    localStorage.setItem(ORG_HERO_KEY,collapsed ? '1' : '0');
  }

  function setOrgTab(tab,{scroll=false,crossFunctional=false}={}){
    const page = orgPage();
    if(!page) return;
    const allowed = ['leadership','departments','people'];
    const target = allowed.includes(tab) ? tab : 'leadership';
    page.dataset.compact117OrgTab = target;

    document.querySelectorAll('[data-compact117-org-tab]').forEach(button => {
      button.classList.toggle('active',button.dataset.compact117OrgTab === target);
    });

    const summary = byId('compact117OrgSummary');
    if(summary){
      summary.textContent = {
        leadership:'Leadership map',
        departments:'Department directory',
        people:'People directory'
      }[target];
    }

    const modeButton = document.querySelector(`[data-org116-mode="${target === 'people' ? 'people' : 'departments'}"]`);
    if(target !== 'leadership' && modeButton){
      modeButton.click();
    }

    if(crossFunctional){
      const search = byId('org116Search');
      if(search){
        search.value = 'cross-functional';
        search.dispatchEvent(new Event('input',{bubbles:true}));
      }
    }else if(target !== 'leadership'){
      const search = byId('org116Search');
      if(search && search.value === 'cross-functional'){
        search.value = '';
        search.dispatchEvent(new Event('input',{bubbles:true}));
      }
    }

    if(scroll){
      byId('compact117OrgTabs')?.scrollIntoView({
        behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'start'
      });
    }
  }

  document.addEventListener('DOMContentLoaded',() => {
    setFocusMode(localStorage.getItem(FOCUS_KEY) === '1');
    setOrgHeroCollapsed(localStorage.getItem(ORG_HERO_KEY) === '1');
    setOrgTab(orgPage()?.dataset.compact117OrgTab || 'leadership');

    byId('compact117Toggle')?.addEventListener('click',() => {
      setFocusMode(!document.body.classList.contains('compact117-mode'),{announce:true});
    });

    byId('compact117OrgTabs')?.addEventListener('click',event => {
      const tab = event.target.closest('[data-compact117-org-tab]');
      if(tab){
        setOrgTab(tab.dataset.compact117OrgTab,{scroll:false});
        return;
      }
      if(event.target.closest('#compact117OrgHeroToggle')){
        setOrgHeroCollapsed(!orgPage()?.classList.contains('compact117-hero-collapsed'));
      }
    });

    document.querySelectorAll('[data-compact117-org-open]').forEach(button => {
      button.addEventListener('click',() => {
        setOrgTab(button.dataset.compact117OrgOpen,{
          scroll:true,
          crossFunctional:button.dataset.compact117CrossFunctional === 'true'
        });
      });
    });

    byId('org116ViewDepartments')?.addEventListener('click',() => setOrgTab('departments',{scroll:true}));
    byId('orgOpenRegister')?.addEventListener('click',() => setOrgTab('people',{scroll:true}));

    document.addEventListener('keydown',event => {
      if((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'f'){
        event.preventDefault();
        setFocusMode(!document.body.classList.contains('compact117-mode'),{announce:true});
      }
    });
  });
})();

;

/* ---- ekh-v116-interactive-team-network-runtime ---- */

(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const safe = value => String(value ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;");

  const colours = ['#7457c8','#218d9b','#bd721c','#287a59','#b95168','#4477b8','#8b65b8','#2f8f74','#9b6b2c','#5968a8'];
  const state = {mode:'departments',department:'all',query:''};
  let departments = [];
  let people = [];

  function initials(name){
    return String(name || '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0,2)
      .map(part => part[0])
      .join('')
      .toUpperCase() || '—';
  }

  function collectStructure(){
    departments = [...document.querySelectorAll('.v192-department-page')].map((page,index) => {
      const card = page.querySelector('[data-org-department]');
      const slug = card?.dataset.orgDepartment || page.id.replace(/^org-/,'');
      const title = card?.querySelector('h3')?.textContent.trim() || page.querySelector('h2')?.textContent.trim() || slug;
      const lead = card?.querySelector('.org-lead-chip')?.textContent.trim() || 'Lead not recorded';
      const members = [...(card?.querySelectorAll('.org-member-row') || [])].map(row => ({
        name:row.querySelector('strong')?.textContent.trim() || 'Unnamed member',
        role:row.querySelector('b')?.textContent.trim() || 'Role not recorded',
        focus:row.querySelector('small')?.textContent.trim() || 'Focus not recorded',
        department:title,
        slug
      }));
      return {
        slug,
        title,
        lead,
        members,
        viewId:page.id,
        colour:colours[index % colours.length]
      };
    });

    const peopleMap = new Map();
    departments.forEach(department => {
      department.members.forEach(member => {
        const key = member.name.toLowerCase();
        if(!peopleMap.has(key)){
          peopleMap.set(key,{
            name:member.name,
            roles:[],
            focuses:[],
            departments:[],
            slugs:[]
          });
        }
        const person = peopleMap.get(key);
        if(!person.roles.includes(member.role)) person.roles.push(member.role);
        if(!person.focuses.includes(member.focus)) person.focuses.push(member.focus);
        if(!person.departments.includes(member.department)) person.departments.push(member.department);
        if(!person.slugs.includes(member.slug)) person.slugs.push(member.slug);
      });
    });

    document.querySelectorAll('.org240-executive-record').forEach(record => {
      const name = record.dataset.org116Name || '';
      if(!name) return;
      const key = name.toLowerCase();
      if(!peopleMap.has(key)){
        peopleMap.set(key,{
          name,
          roles:[],
          focuses:[],
          departments:[],
          slugs:[]
        });
      }
      const person = peopleMap.get(key);
      const role = record.dataset.org116Role || 'Role not recorded';
      const focus = record.dataset.org116Focus || 'Focus not recorded';
      const department = record.dataset.org116Department || 'Executive';
      if(!person.roles.includes(role)) person.roles.push(role);
      if(!person.focuses.includes(focus)) person.focuses.push(focus);
      if(!person.departments.includes(department)) person.departments.push(department);
      if(!person.slugs.includes('executive')) person.slugs.push('executive');
    });

    people = [...peopleMap.values()].sort((a,b) => a.name.localeCompare(b.name));

    const peopleMetric = byId('org116MetricPeople');
    const departmentMetric = byId('org116MetricDepartments');
    const crossMetric = byId('org116MetricCross');
    if(peopleMetric) peopleMetric.textContent = String(people.length);
    if(departmentMetric) departmentMetric.textContent = String(departments.length);
    if(crossMetric) crossMetric.textContent = String(people.filter(person => person.departments.length > 1).length);
  }

  function departmentRail(){
    const rail = byId('org116DepartmentRail');
    if(!rail) return;
    const buttons = [
      {slug:'all',title:'All departments'},
      ...departments.map(department => ({slug:department.slug,title:department.title}))
    ];
    rail.innerHTML = buttons.map(item => `
      <button class="${state.department === item.slug ? 'active' : ''}" type="button" data-org116-department="${safe(item.slug)}">
        ${safe(item.title)}
      </button>
    `).join('');
  }

  function matchesQuery(values){
    const query = state.query.trim().toLowerCase();
    if(!query) return true;
    return values.join(' ').toLowerCase().includes(query);
  }

  function filteredDepartments(){
    return departments.filter(department => {
      const departmentMatch = state.department === 'all' || department.slug === state.department;
      const queryMatch = matchesQuery([
        department.title,
        department.lead,
        ...department.members.flatMap(member => [member.name,member.role,member.focus])
      ]);
      return departmentMatch && queryMatch;
    });
  }

  function filteredPeople(){
    return people.filter(person => {
      const departmentMatch = state.department === 'all' || person.slugs.includes(state.department);
      const queryMatch = matchesQuery([
        person.name,
        ...person.roles,
        ...person.focuses,
        ...person.departments
      ]);
      return departmentMatch && queryMatch;
    });
  }

  function departmentCard(department,index){
    const avatars = department.members.slice(0,4).map(member => `<span title="${safe(member.name)}">${safe(initials(member.name))}</span>`).join('');
    const extra = Math.max(0,department.members.length - 4);
    return `
      <button class="org116-department-card" type="button" data-org116-open-department="${safe(department.slug)}" style="--org116-colour:${safe(department.colour)}">
        <header>
          <span class="org116-department-code">DEPT-${String(index + 1).padStart(2,'0')}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7"></path><path d="M9 7h8v8"></path></svg>
        </header>
        <div>
          <h4>${safe(department.title)}</h4>
          <p>${safe(department.lead)} · ${department.members.length} member${department.members.length === 1 ? '' : 's'}</p>
        </div>
        <footer class="org116-department-team">
          <span class="org116-avatar-stack">${avatars}${extra ? `<span>+${extra}</span>` : ''}</span>
          <b>Open department <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 7l5 5-5 5"></path></svg></b>
        </footer>
      </button>`;
  }

  function personCard(person){
    const primaryRole = person.roles[0] || 'Role not recorded';
    const primaryFocus = person.focuses[0] || 'Focus not recorded';
    const departmentTags = person.departments.slice(0,2).map(department => `<span>${safe(department)}</span>`).join('');
    const extra = Math.max(0,person.departments.length - 2);
    const cross = person.departments.length > 1
      ? `<span class="cross">CROSS-FUNCTIONAL ${person.departments.length}</span>`
      : '';
    return `
      <button class="org116-person-card" type="button"
        data-org116-person-name="${safe(person.name)}"
        data-org116-person-role="${safe(primaryRole)}"
        data-org116-person-department="${safe(person.departments.join(' · '))}"
        data-org116-person-focus="${safe(person.focuses.join(' '))}">
        <header>
          <span class="org116-person-avatar">${safe(initials(person.name))}</span>
          <span><strong>${safe(person.name)}</strong><small>${safe(primaryRole)}</small></span>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7"></path><path d="M9 7h8v8"></path></svg>
        </header>
        <p>${safe(primaryFocus)}</p>
        <footer>${departmentTags}${extra ? `<span>+${extra} functions</span>` : ''}${cross}</footer>
      </button>`;
  }

  function render(){
    const departmentGrid = byId('org116DepartmentGrid');
    const peopleGrid = byId('org116PeopleGrid');
    const empty = byId('org116Empty');
    const resultCount = byId('org116ResultCount');
    const clear = byId('org116ClearSearch');
    if(!departmentGrid || !peopleGrid || !empty) return;

    const departmentItems = filteredDepartments();
    const peopleItems = filteredPeople();
    const isDepartmentMode = state.mode === 'departments';
    const activeCount = isDepartmentMode ? departmentItems.length : peopleItems.length;

    departmentGrid.hidden = !isDepartmentMode;
    peopleGrid.hidden = isDepartmentMode;
    departmentGrid.innerHTML = departmentItems.map(departmentCard).join('');
    peopleGrid.innerHTML = peopleItems.map(personCard).join('');
    empty.hidden = activeCount > 0;

    if(resultCount){
      resultCount.textContent = isDepartmentMode
        ? `${activeCount} of ${departments.length} departments`
        : `${activeCount} of ${people.length} people`;
    }
    if(clear) clear.hidden = !state.query;

    document.querySelectorAll('[data-org116-mode]').forEach(button => {
      button.classList.toggle('active',button.dataset.org116Mode === state.mode);
    });
    departmentRail();
  }

  function switchMode(mode){
    state.mode = mode === 'people' ? 'people' : 'departments';
    render();
  }

  function resetDirectory(){
    state.mode = 'departments';
    state.department = 'all';
    state.query = '';
    const input = byId('org116Search');
    if(input) input.value = '';
    render();
  }

  function navigateDepartment(slug){
    const view = `org-${slug}`;
    if(typeof window.showView === 'function'){
      window.showView(view);
      return;
    }
    const target = document.querySelector(`[data-view="${CSS.escape(view)}"]`) || document.querySelector(`[data-view-target="${CSS.escape(view)}"]`);
    target?.click();
  }

  function openPersonDrawer(data){
    const set = (id,value) => {
      const node = byId(id);
      if(node) node.textContent = value || '—';
    };
    set('v190OrgDrawerDept',String(data.department || 'TEAM MEMBER').toUpperCase());
    set('v190OrgDrawerTitle',data.name || 'Member details');
    set('v190OrgDrawerRole',data.role || '');
    set('v190OrgDrawerInitials',initials(data.name));
    set('v190OrgDrawerName',data.name || '—');
    set('v190OrgDrawerDepartment',data.department || '—');
    set('v190OrgDrawerFocus',data.focus || 'No focus recorded.');

    const drawer = byId('v190OrgDrawer');
    const backdrop = byId('v190OrgBackdrop');
    drawer?.classList.add('open');
    drawer?.setAttribute('aria-hidden','false');
    if(backdrop) backdrop.hidden = false;
  }

  document.addEventListener('DOMContentLoaded',() => {
    collectStructure();
    render();

    byId('org116ModeToggle')?.addEventListener('click',event => {
      const button = event.target.closest('[data-org116-mode]');
      if(button) switchMode(button.dataset.org116Mode);
    });

    byId('org116DepartmentRail')?.addEventListener('click',event => {
      const button = event.target.closest('[data-org116-department]');
      if(!button) return;
      state.department = button.dataset.org116Department || 'all';
      render();
    });

    byId('org116Search')?.addEventListener('input',event => {
      state.query = event.target.value || '';
      render();
    });

    byId('org116ClearSearch')?.addEventListener('click',() => {
      state.query = '';
      const input = byId('org116Search');
      if(input){
        input.value = '';
        input.focus();
      }
      render();
    });

    byId('org116Reset')?.addEventListener('click',resetDirectory);
    byId('org116ViewDepartments')?.addEventListener('click',() => switchMode('departments'));
    byId('orgOpenRegister')?.addEventListener('click',() => {
      switchMode('people');
      byId('org116Search')?.focus();
      byId('org116Search')?.scrollIntoView({behavior:'smooth',block:'center'});
    });

    byId('org116DepartmentGrid')?.addEventListener('click',event => {
      const card = event.target.closest('[data-org116-open-department]');
      if(card) navigateDepartment(card.dataset.org116OpenDepartment);
    });

    byId('org116PeopleGrid')?.addEventListener('click',event => {
      const card = event.target.closest('[data-org116-person-name]');
      if(!card) return;
      openPersonDrawer({
        name:card.dataset.org116PersonName,
        role:card.dataset.org116PersonRole,
        department:card.dataset.org116PersonDepartment,
        focus:card.dataset.org116PersonFocus
      });
    });

    document.querySelector('.org116-leadership-map')?.addEventListener('click',event => {
      const node = event.target.closest('[data-org116-name]');
      if(!node) return;
      openPersonDrawer({
        name:node.dataset.org116Name,
        role:node.dataset.org116Role,
        department:node.dataset.org116Department,
        focus:node.dataset.org116Focus
      });
    });
  });
})();

;

/* ---- ekh-v190-interactive-overview-runtime ---- */

(()=>{
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

  function switchView(view){
    const checkpoint=$('.coo-progress-checkpoint');
    const kanban=$('#v190LegacyKanban');
    if(view==='checkpoint'){
      checkpoint?.classList.remove('v190-condensed');
      checkpoint?.scrollIntoView({behavior:'smooth',block:'start'});
    }else if(view==='kanban'){
      if(kanban){kanban.open=true;kanban.scrollIntoView({behavior:'smooth',block:'start'});}
    }else{
      $('.v190-project-hub')?.scrollIntoView({behavior:'smooth',block:'start'});
    }
    $$('#v190ProjectViewToggle button').forEach(button=>button.classList.toggle('active',button.dataset.v190View===view));
  }

  $('#v190ProjectViewToggle')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-v190-view]');
    if(button)switchView(button.dataset.v190View);
  });

  const checkpoint=$('.coo-progress-checkpoint');
  $('#v190CheckpointToggle')?.addEventListener('click',event=>{
    checkpoint?.classList.toggle('v190-condensed');
    event.currentTarget.textContent=checkpoint?.classList.contains('v190-condensed')?'Open full checkpoint':'Collapse checkpoint';
  });
  $$('[data-v190-checkpoint-open]').forEach(button=>button.addEventListener('click',()=>switchView('checkpoint')));

  let projectStage='all';
  const projectSearch=$('#v190ProjectSearch');
  function filterSlides(){
    const query=(projectSearch?.value||'').trim().toLowerCase();
    $$('.v190-project-slide').forEach(card=>{
      const stageMatch=projectStage==='all'||card.dataset.v190ProjectStage===projectStage;
      const queryMatch=!query||(card.dataset.v190ProjectSearch||'').includes(query);
      card.hidden=!(stageMatch&&queryMatch);
    });
  }
  $('#v190ProjectLegend')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-v190-stage]');
    if(!button)return;
    projectStage=button.dataset.v190Stage;
    $$('#v190ProjectLegend button').forEach(item=>item.classList.toggle('active',item===button));
    filterSlides();
  });
  projectSearch?.addEventListener('input',filterSlides);
  $('#v190ProjectPrev')?.addEventListener('click',()=>$('#v190ProjectCarousel')?.scrollBy({left:-320,behavior:'smooth'}));
  $('#v190ProjectNext')?.addEventListener('click',()=>$('#v190ProjectCarousel')?.scrollBy({left:320,behavior:'smooth'}));

  const projectDrawer=$('#v190ProjectDrawer');
  const projectBackdrop=$('#v190ProjectBackdrop');
  function closeProjectDrawer(){
    projectDrawer?.classList.remove('open');
    projectDrawer?.setAttribute('aria-hidden','true');
    if(projectBackdrop)projectBackdrop.hidden=true;
  }
  function openProjectDrawer(data){
    $('#v190ProjectDrawerCode').textContent=data.code||'PROJECT';
    $('#v190ProjectDrawerTitle').textContent=data.name||'Project details';
    $('#v190ProjectDrawerLabel').textContent=data.label||'';
    $('#v190ProjectDrawerProgressText').textContent=`${data.progress||0}%`;
    $('#v190ProjectDrawerProgress').style.width=`${data.progress||0}%`;
    $('#v190ProjectDrawerOwner').textContent=data.owner||'—';
    $('#v190ProjectDrawerStage').textContent=(data.stage||'').replace('-',' ');
    $('#v190ProjectDrawerTeam').textContent=data.team||'—';
    $('#v190ProjectDrawerEvidence').textContent=data.evidence||'—';
    $('#v190ProjectDrawerSummary').textContent=data.summary||'No summary recorded.';
    $('#v190ProjectDrawerNext').textContent=data.next||'No next action recorded.';
    $('#v190ProjectDrawerRisk').textContent=data.risk||'No active dependency recorded.';
    const list=$('#v190ProjectDrawerCompleted');
    list.innerHTML='';
    (data.completed||[]).forEach(item=>{const li=document.createElement('li');li.textContent=item;list.appendChild(li);});
    if(!(data.completed||[]).length){const li=document.createElement('li');li.textContent='No completed-work entry recorded.';list.appendChild(li);}
    projectDrawer?.classList.add('open');
    projectDrawer?.setAttribute('aria-hidden','false');
    if(projectBackdrop)projectBackdrop.hidden=false;
  }
  $('#v190ProjectCarousel')?.addEventListener('click',event=>{
    const card=event.target.closest('[data-v190-project]');
    if(!card)return;
    try{openProjectDrawer(JSON.parse(card.dataset.v190Project));}catch{}
  });
  $('#v190ProjectDrawerClose')?.addEventListener('click',closeProjectDrawer);
  projectBackdrop?.addEventListener('click',closeProjectDrawer);

  $$('[data-v190-command-stage]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelector('[data-view="projects"]')?.click();
    setTimeout(()=>{
      const target=$(`#v190ProjectLegend [data-v190-stage="${button.dataset.v190CommandStage}"]`);
      target?.click();
      $('.v190-project-hub')?.scrollIntoView({behavior:'smooth',block:'start'});
    },80);
  }));

  const activityEvents={
    '2026-07-27':[{time:'09:00',title:'Review launch messaging',project:'Cuddle Paws'}],
    '2026-07-28':[{time:'14:00',title:'Validate handoff evidence',project:'Smart Adventure'}],
    '2026-07-29':[{time:'10:00',title:'EKH OS design council',project:'EKH OS'},{time:'15:00',title:'Calendar and Kanban build',project:'EKH OS'}],
    '2026-07-30':[{time:'09:30',title:'Year 1 isolated intake',project:'Worksheet Studio'},{time:'14:00',title:'Owner approval checkpoint',project:'Mia Queue'}],
    '2026-07-31':[{time:'11:00',title:'Kyo regression review',project:'EKH OS'},{time:'16:00',title:'Publish approved update',project:'EKH OS'}]
  };
  const monthGrid=$('#v190MonthGrid');
  function dateKey(year,month,day){return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;}
  function showSelectedDate(key){
    $$('.v190-month-day').forEach(day=>day.classList.toggle('active',day.dataset.date===key));
    const date=new Date(`${key}T12:00:00`);
    $('#v190SelectedDate').textContent=date.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
    const holder=$('#v190SelectedActivities');
    holder.innerHTML='';
    const events=activityEvents[key]||[];
    if(!events.length){holder.innerHTML='<div class="v172-empty-column">No scheduled activity for this date.</div>';return;}
    events.forEach(item=>{
      const article=document.createElement('article');
      article.innerHTML=`<time>${item.time}</time><strong>${item.title}</strong><small>${item.project}</small>`;
      holder.appendChild(article);
    });
  }
  function renderMonth(){
    if(!monthGrid)return;
    const cells=[];
    for(let day=29;day<=30;day++)cells.push({year:2026,month:6,day,outside:true});
    for(let day=1;day<=31;day++)cells.push({year:2026,month:7,day,outside:false});
    for(let day=1;cells.length<35;day++)cells.push({year:2026,month:8,day,outside:true});
    monthGrid.innerHTML='';
    cells.forEach(cell=>{
      const key=dateKey(cell.year,cell.month,cell.day);
      const button=document.createElement('button');
      button.type='button';
      button.className='v190-month-day'+(cell.outside?' outside':'');
      button.dataset.date=key;
      const dots=(activityEvents[key]||[]).map(()=>'<b></b>').join('');
      button.innerHTML=`<span>${cell.day}</span>${dots?`<i>${dots}</i>`:''}`;
      button.addEventListener('click',()=>showSelectedDate(key));
      monthGrid.appendChild(button);
    });
    showSelectedDate('2026-07-30');
  }
  renderMonth();

  const agendaList=$('#v190AgendaList');
  if(agendaList){
    Object.entries(activityEvents).forEach(([key,events])=>{
      events.forEach(item=>{
        const article=document.createElement('article');
        const date=new Date(`${key}T12:00:00`).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
        article.innerHTML=`<time>${date}<br>${item.time}</time><div><strong>${item.title}</strong><small>${item.project}</small></div>`;
        agendaList.appendChild(article);
      });
    });
  }
  $$('.v172-activity-tabs [data-v190-activity-view]').forEach(button=>button.addEventListener('click',()=>{
    const view=button.dataset.v190ActivityView;
    $$('.v172-activity-tabs button').forEach(item=>item.classList.toggle('active',item===button));
    $$('[data-v190-activity-panel]').forEach(panel=>panel.hidden=panel.dataset.v190ActivityPanel!==view);
  }));
  $('#v190AgendaAdd')?.addEventListener('click',()=>$('#v172AddActivity')?.click());

  const orgCards=$$('[data-org-department]');
  const orgTabs=$('#v190OrgTabs');
  const orgSearch=$('#orgSearch');
  let activeDept='technology';
  function showDepartment(slug,query=''){
    activeDept=slug;
    orgCards.forEach(card=>{
      const cardMatch=card.dataset.orgDepartment===slug;
      card.hidden=!cardMatch;
      $$('.org-member-row',card).forEach(row=>row.hidden=Boolean(query)&&!row.textContent.toLowerCase().includes(query));
    });
    $$('#v190OrgTabs button').forEach(button=>button.classList.toggle('active',button.dataset.v190OrgDept===slug));
  }
  orgTabs?.addEventListener('click',event=>{
    const button=event.target.closest('[data-v190-org-dept]');
    if(!button)return;
    if(orgSearch)orgSearch.value='';
    showDepartment(button.dataset.v190OrgDept);
  });
  orgSearch?.addEventListener('input',()=>{
    const query=orgSearch.value.trim().toLowerCase();
    if(!query){showDepartment(activeDept);return;}
    const match=orgCards.find(card=>card.textContent.toLowerCase().includes(query));
    if(match)showDepartment(match.dataset.orgDepartment,query);
    else orgCards.forEach(card=>card.hidden=true);
  });
  showDepartment(activeDept);

  const orgDrawer=$('#v190OrgDrawer');
  const orgBackdrop=$('#v190OrgBackdrop');
  function closeOrgDrawer(){
    orgDrawer?.classList.remove('open');
    orgDrawer?.setAttribute('aria-hidden','true');
    if(orgBackdrop)orgBackdrop.hidden=true;
  }
  $('.org-department-grid')?.addEventListener('click',event=>{
    const row=event.target.closest('.org-member-row');
    if(!row)return;
    const card=row.closest('[data-org-department]');
    const name=$('strong',row)?.textContent||'Team member';
    const role=$('b',row)?.textContent||'';
    const focus=$('small',row)?.textContent||'';
    const dept=$('h3',card)?.textContent||'Department';
    $('#v190OrgDrawerDept').textContent=(card.dataset.orgDepartment||'TEAM').toUpperCase();
    $('#v190OrgDrawerTitle').textContent=name;
    $('#v190OrgDrawerRole').textContent=role;
    $('#v190OrgDrawerInitials').textContent=name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase();
    $('#v190OrgDrawerName').textContent=name;
    $('#v190OrgDrawerDepartment').textContent=dept;
    $('#v190OrgDrawerFocus').textContent=focus;
    orgDrawer?.classList.add('open');
    orgDrawer?.setAttribute('aria-hidden','false');
    if(orgBackdrop)orgBackdrop.hidden=false;
  });
  $('#v190OrgDrawerClose')?.addEventListener('click',closeOrgDrawer);
  orgBackdrop?.addEventListener('click',closeOrgDrawer);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){closeProjectDrawer();closeOrgDrawer();}
  });
})();

;

/* ---- ekh-v1100-dropdown-page-runtime ---- */

(()=>{
  const pageNameAdditions={"command-owner-decisions": ["Owner Decisions", "Command Center / Owner Control"], "command-critical-path": ["Current Critical Path", "Command Center / Project Priority"], "command-published-updates": ["Recently Published Updates", "Command Center / Release History"], "supabase-activities": ["Supabase Activities", "My Activities / Authenticated Records"], "coo-progress-board": ["COO Progress Board", "Work / Operational Checkpoint"], "kanban-board": ["Open Kanban Board", "Work / Detailed Workflow"], "org-operational-principles": ["Operational Principles", "Organisation Chart / Governance"], "org-master-register": ["Master Staff Register", "Organisation Chart / Master Record"], "mia-workflow-help": ["Workflow Help", "Mia Queue / Publication Process"], "mia-structured-intake": ["Structured Intake", "Mia Queue / Report Preparation"], "mia-publication-controls": ["Publication Controls", "Mia Queue / Governance"], "mia-publication-audits": ["Publication Audits", "Mia Queue / Release History"], "mia-kyo-release-gate": ["Kyo Release Gate", "Mia Queue / Technical Validation"], "system-overview": ["System Overview", "EKH OS / Administration & Control"], "org-bm": ["Malay Language", "Organisation Chart / Department"], "org-english": ["English Language & Language Education", "Organisation Chart / Department"], "org-technology": ["Technology, Software, Web & Systems", "Organisation Chart / Department"], "org-qa": ["Technical QA, Release & Automation", "Organisation Chart / Department"], "org-creative": ["Creative, Graphics & Visual Identity", "Organisation Chart / Department"], "org-marketing": ["Marketing, Content & Market Intelligence", "Organisation Chart / Department"], "org-assessment": ["Child Education & Assessment", "Organisation Chart / Department"], "org-multimedia": ["Multimedia, Video & Audio", "Organisation Chart / Department"], "org-political": ["Politics", "Organisation Chart / Department"], "org-publishing": ["E-book & Publishing", "Organisation Chart / Department"]};
  if(typeof pageNames!=='undefined') Object.assign(pageNames,pageNameAdditions);

  const updateDropdownState=(viewId)=>{
    document.querySelectorAll('.nav-dropdown').forEach(group=>{
      const contains=Boolean(group.querySelector(`[data-view="${viewId}"]`));
      if(contains){
        group.classList.add('open');
        group.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','true');
      }
      group.classList.toggle('has-active-view',contains);
    });
  };

  document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle=>{
    toggle.addEventListener('click',()=>{
      const group=toggle.closest('.nav-dropdown');
      const open=group.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
    });
  });

  if(typeof showView==='function'){
    const originalShowView=showView;
    showView=function(id){
      originalShowView(id);
      if(id==='supabase-activities'&&typeof renderAll==='function') renderAll();
      updateDropdownState(id);
      const department=document.querySelector(`#${CSS.escape(id)} .org-department-card`);
      if(department) department.hidden=false;
    };
  }

  document.querySelectorAll('[data-view]').forEach(button=>{
    button.addEventListener('click',()=>updateDropdownState(button.dataset.view));
  });
  document.querySelectorAll('[data-view-target]').forEach(button=>{
    button.addEventListener('click',()=>updateDropdownState(button.dataset.viewTarget));
  });

  // The v1.9 department script hid non-active cards. Each department now owns a separate page.
  document.querySelectorAll('.v192-department-page .org-department-card').forEach(card=>card.hidden=false);

  // Team-member drawer remains available on every new department page.
  document.querySelectorAll('.v192-department-page-grid').forEach(grid=>{
    grid.addEventListener('click',event=>{
      const row=event.target.closest('.org-member-row');
      if(!row) return;
      const card=row.closest('[data-org-department]');
      const name=row.querySelector('strong')?.textContent||'Team member';
      const role=row.querySelector('b')?.textContent||'';
      const focus=row.querySelector('small')?.textContent||'';
      const dept=card?.querySelector('h3')?.textContent||'Department';
      const initials=name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase();

      const set=(id,value)=>{const node=document.getElementById(id);if(node)node.textContent=value;};
      set('v190OrgDrawerDept',(card?.dataset.orgDepartment||'TEAM').toUpperCase());
      set('v190OrgDrawerTitle',name);
      set('v190OrgDrawerRole',role);
      set('v190OrgDrawerInitials',initials);
      set('v190OrgDrawerName',name);
      set('v190OrgDrawerDepartment',dept);
      set('v190OrgDrawerFocus',focus);

      const drawer=document.getElementById('v190OrgDrawer');
      const backdrop=document.getElementById('v190OrgBackdrop');
      drawer?.classList.add('open');
      drawer?.setAttribute('aria-hidden','false');
      if(backdrop)backdrop.hidden=false;
    });
  });


  document.querySelector('.system-health-card[data-view-target]')?.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      showView(event.currentTarget.dataset.viewTarget);
    }
  });

  updateDropdownState('command-centre');
})();

;

/* ---- ekh-v1120-command-center-runtime ---- */

(() => {
  const commands = [
    {label:'Command Center', detail:'Return to the operational overview', view:'command-centre', code:'CMD'},
    {label:'Owner Decisions', detail:'Named approvals and decision controls', view:'command-owner-decisions', code:'DEC'},
    {label:'Current Critical Path', detail:'Dependencies and next evidence gates', view:'command-critical-path', code:'PATH'},
    {label:'Projects', detail:'Portfolio, filters and evidence drawers', view:'projects', code:'WORK'},
    {label:'COO Progress Board', detail:'Verified completed, active and hold records', view:'coo-progress-board', code:'COO'},
    {label:'Mia Queue', detail:'Structured review and publication gate', view:'handoffs', code:'MIA'},
    {label:'Organisation Chart', detail:'People, roles and functional groups', view:'organisation', code:'ORG'},
    {label:'Staff Drive', detail:'Secure files and project evidence', view:'files', code:'DRIVE'},
    {label:'Supabase Activities', detail:'Authenticated live activity records', view:'supabase-activities', code:'LIVE'},
    {label:'System Overview', detail:'Runtime, deployment and environment', view:'system-overview', code:'SYS'},
    {label:'Settings', detail:'Appearance, security and integrations', view:'settings', code:'SET'},
    {label:'Add Activity', detail:'Create a new owner activity record', action:'add-activity', code:'NEW'}
  ];

  let filteredCommands = [...commands];
  let activeCommandIndex = 0;
  const palette = document.getElementById('v112CommandPalette');
  const input = document.getElementById('v112CommandSearch');
  const results = document.getElementById('v112CommandResults');

  function navigate(view) {
    const target = document.querySelector(`[data-view="${view}"]`) || document.querySelector(`[data-view-target="${view}"]`);
    if (target) target.click();
  }

  function openProject(code) {
    navigate('projects');
    window.setTimeout(() => {
      const cards = [...document.querySelectorAll('[data-v190-project]')];
      const card = cards.find((node) => {
        try { return JSON.parse(node.dataset.v190Project || '{}').code === code; }
        catch { return false; }
      });
      card?.click();
    }, 130);
  }

  function runCommand(command) {
    if (!command) return;
    closePalette();
    if (command.action === 'add-activity') {
      document.getElementById('dashboardAddActivity')?.click();
      return;
    }
    if (command.view) navigate(command.view);
  }

  function renderCommands(query = '') {
    if (!results) return;
    const clean = query.trim().toLowerCase();
    filteredCommands = commands.filter((item) => `${item.label} ${item.detail} ${item.code}`.toLowerCase().includes(clean));
    activeCommandIndex = Math.min(activeCommandIndex, Math.max(0, filteredCommands.length - 1));
    if (!filteredCommands.length) {
      results.innerHTML = '<div class="mc112-command-results-empty">No command matches this search.</div>';
      return;
    }
    results.innerHTML = filteredCommands.map((item, index) => `
      <button class="mc112-command-result${index === activeCommandIndex ? ' active' : ''}" type="button" data-mc112-command-index="${index}">
        <span><svg class="mc112-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7"></path><path d="M9 7h8v8"></path></svg></span>
        <span><b>${item.label}</b><small>${item.detail}</small></span>
        <em>${item.code}</em>
      </button>`).join('');
    results.querySelectorAll('[data-mc112-command-index]').forEach((button) => {
      button.addEventListener('mouseenter', () => {
        activeCommandIndex = Number(button.dataset.mc112CommandIndex || 0);
        renderCommands(input?.value || '');
      });
      button.addEventListener('click', () => runCommand(filteredCommands[Number(button.dataset.mc112CommandIndex || 0)]));
    });
  }

  function openPalette() {
    if (!palette) return;
    palette.hidden = false;
    palette.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mc112-palette-open');
    if (input) input.value = '';
    activeCommandIndex = 0;
    renderCommands();
    window.setTimeout(() => input?.focus(), 10);
  }

  function closePalette() {
    if (!palette) return;
    palette.hidden = true;
    palette.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mc112-palette-open');
  }

  window.openEKHCommandPalette = openPalette;
  window.closeEKHCommandPalette = closePalette;

  document.getElementById('v112CommandPaletteOpen')?.addEventListener('click', openPalette);
  palette?.addEventListener('click', (event) => { if (event.target === palette) closePalette(); });
  input?.addEventListener('input', () => { activeCommandIndex = 0; renderCommands(input.value); });
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeCommandIndex = Math.min(activeCommandIndex + 1, filteredCommands.length - 1);
      renderCommands(input.value);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeCommandIndex = Math.max(activeCommandIndex - 1, 0);
      renderCommands(input.value);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      runCommand(filteredCommands[activeCommandIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closePalette();
    }
  });

  document.querySelectorAll('[data-mc112-nav]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.mc112Nav)));
  document.querySelectorAll('[data-mc112-project]').forEach((button) => button.addEventListener('click', () => openProject(button.dataset.mc112Project)));

  const filterButtons = [...document.querySelectorAll('[data-mc112-filter]')];
  const projectCards = [...document.querySelectorAll('#mc112ProjectGrid [data-mc112-stage]')];
  const empty = document.getElementById('mc112ProjectEmpty');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.mc112Filter || 'all';
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    let visible = 0;
    projectCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.mc112Stage === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
  }));

  renderCommands();
})();

;

/* ---- ekh-v1130-portfolio-workbench-script ---- */

(() => {
  const page = document.querySelector('#projects');
  const workbench = document.querySelector('#pw113Workbench');
  if (!page || !workbench) return;

  const sourceCards = [...document.querySelectorAll('#v190ProjectCarousel [data-v190-project]')];
  const parseCard = card => {
    try {
      const data = JSON.parse(card.dataset.v190Project || '{}');
      data.sourceCard = card;
      data.searchText = `${data.code || ''} ${data.name || ''} ${data.owner || ''} ${data.team || ''}`.toLowerCase();
      return data;
    } catch {
      return null;
    }
  };

  const projects = sourceCards.map(parseCard).filter(Boolean);
  const stageCopy = {
    'in-progress': 'Active',
    review: 'Review',
    blocked: 'Hold',
    completed: 'Completed'
  };

  const dependencyTemplates = {
    SA: [
      ['01', 'Question-bank audit', 'Complete remaining review and preserve Question_ID integrity.', 'current'],
      ['02', 'Formal handoff', 'Set the official final-content handoff date and package evidence for Jeff.', 'gate'],
      ['03', 'Runtime integration', 'Validate question binding, scoring, routing and persistence.', ''],
      ['04', 'Release evidence', 'Close only against defined technical criteria and verified proof.', 'gate']
    ],
    WS: [
      ['01', 'Source repack', 'Repackage located curriculum records into a controlled source set.', 'current'],
      ['02', 'Normalisation', 'Migrate and normalise row-level structure without losing provenance.', ''],
      ['03', 'Ten-pass verification', 'Complete controlled row-level verification before runtime claims.', 'gate'],
      ['04', 'Runtime pilot', 'Open a genuine pilot only after source and verification gates pass.', 'gate']
    ],
    OS: [
      ['01', 'Mission Control', 'Readable typography and Interactive Command Center established.', 'current'],
      ['02', 'Portfolio Workbench', 'Project exploration is moved into a focused interactive workbench.', 'current'],
      ['03', 'Workflow consoles', 'Redesign Mia Queue and organisation surfaces as page-specific tools.', ''],
      ['04', 'Production evidence', 'Verify GitHub, Cloudflare, Supabase and live-domain behaviour.', 'gate']
    ],
    CP: [
      ['01', 'Product completed', 'Three colouring-book volumes are complete.', 'current'],
      ['02', 'Promotion assets', 'Maintain complete and consistent promotional evidence.', ''],
      ['03', 'First-50 quota', 'Monitor the RM10.90 promotion for the first 50 buyers.', 'gate'],
      ['04', 'Price transition', 'Activate the next price only after owner approval.', 'gate']
    ],
    WEB: [
      ['01', 'Page baseline', 'Cuddle Paws promotional landing page remains the current baseline.', 'current'],
      ['02', 'Remaining pages', 'Confirm status and scope for other product pages.', ''],
      ['03', 'Infrastructure', 'Record hosting, DNS, SSL and integration evidence.', 'gate'],
      ['04', 'Live verification', 'Do not close without deployment and domain smoke-test proof.', 'gate']
    ]
  };

  const defaultDependency = project => [
    ['01', 'Current position', project.summary || 'Current status is recorded.', 'current'],
    ['02', 'Next evidence', project.next || 'Next evidence must be defined.', ''],
    ['03', 'Control gate', project.risk || 'Control condition remains active.', 'gate'],
    ['04', 'Owner confirmation', 'Status changes require traceable evidence or an explicit owner decision.', 'gate']
  ];

  const elements = {
    list: document.querySelector('#pw113ProjectList'),
    empty: document.querySelector('#pw113Empty'),
    search: document.querySelector('#pw113Search'),
    filters: document.querySelector('#pw113Filters'),
    count: document.querySelector('#pw113ResultCount'),
    code: document.querySelector('#pw113SelectedCode'),
    name: document.querySelector('#pw113SelectedName'),
    label: document.querySelector('#pw113SelectedLabel'),
    stage: document.querySelector('#pw113SelectedStage'),
    progressText: document.querySelector('#pw113SelectedProgressText'),
    progress: document.querySelector('#pw113SelectedProgress'),
    owner: document.querySelector('#pw113SelectedOwner'),
    team: document.querySelector('#pw113SelectedTeam'),
    evidence: document.querySelector('#pw113SelectedEvidence'),
    summary: document.querySelector('#pw113SelectedSummary'),
    next: document.querySelector('#pw113SelectedNext'),
    risk: document.querySelector('#pw113SelectedRisk'),
    completed: document.querySelector('#pw113SelectedCompleted'),
    mapTitle: document.querySelector('#pw113MapTitle'),
    map: document.querySelector('#pw113DependencyMap'),
    tabs: document.querySelector('#pw113InspectorTabs'),
    evidenceButton: document.querySelector('#pw113OpenEvidence'),
    kanbanButton: document.querySelector('#pw113OpenKanban'),
    exportButton: document.querySelector('#pw113ExportSnapshot')
  };

  let activeFilter = 'all';
  let selectedProject = projects.find(item => item.stage === 'review') || projects[0] || null;

  function navigate(view) {
    const trigger =
      document.querySelector(`[data-view="${CSS.escape(view)}"]`) ||
      document.querySelector(`[data-view-target="${CSS.escape(view)}"]`);
    trigger?.click();
  }

  function projectStageLabel(stage) {
    return stageCopy[stage] || 'Recorded';
  }

  function renderList() {
    const query = (elements.search?.value || '').trim().toLowerCase();
    const visible = projects.filter(project => {
      const stageMatch = activeFilter === 'all' || project.stage === activeFilter;
      const searchMatch = !query || project.searchText.includes(query);
      return stageMatch && searchMatch;
    });

    if (elements.count) elements.count.textContent = `${visible.length} shown`;
    if (elements.empty) elements.empty.hidden = visible.length > 0;

    if (!elements.list) return;
    elements.list.innerHTML = visible.map(project => `
      <button
        class="pw113-project-item${selectedProject?.code === project.code ? ' selected' : ''}"
        type="button"
        role="option"
        aria-selected="${selectedProject?.code === project.code}"
        data-pw113-project-code="${project.code}">
        <span class="pw113-project-badge">${project.code}</span>
        <span class="pw113-project-copy">
          <strong>${project.name}</strong>
          <span>${project.owner || 'Owner not recorded'}</span>
        </span>
        <span class="pw113-project-meta">
          <b>${Number(project.progress || 0)}%</b>
          <em class="pw113-mini-stage ${project.stage}">${projectStageLabel(project.stage)}</em>
        </span>
      </button>
    `).join('');
  }

  function renderDependencyMap(project) {
    if (!elements.map || !project) return;
    const nodes = dependencyTemplates[project.code] || defaultDependency(project);
    elements.mapTitle.textContent = `${project.code} dependency path`;
    elements.map.innerHTML = nodes.map(([code, title, text, state]) => `
      <article class="pw113-map-node ${state || ''}">
        <b>STEP ${code}</b>
        <strong>${title}</strong>
        <span>${text}</span>
      </article>
    `).join('');
  }

  function renderInspector(project) {
    if (!project) return;
    selectedProject = project;

    elements.code.textContent = project.code || 'PROJECT';
    elements.name.textContent = project.name || 'Project details';
    elements.label.textContent = project.label || '';
    elements.stage.textContent = projectStageLabel(project.stage);
    elements.stage.className = `pw113-stage ${project.stage || ''}`;
    elements.progressText.textContent = `${Number(project.progress || 0)}%`;
    elements.progress.style.width = `${Math.max(0, Math.min(100, Number(project.progress || 0)))}%`;
    elements.owner.textContent = project.owner || '—';
    elements.team.textContent = project.team || '—';
    elements.evidence.textContent = project.evidence || '—';
    elements.summary.textContent = project.summary || 'No summary recorded.';
    elements.next.textContent = project.next || 'No next action recorded.';
    elements.risk.textContent = project.risk || 'No dependency recorded.';
    elements.completed.innerHTML = (project.completed || []).length
      ? project.completed.map(item => `<li>${item}</li>`).join('')
      : '<li>No completed work has been recorded.</li>';

    renderDependencyMap(project);
    renderList();
  }

  elements.list?.addEventListener('click', event => {
    const button = event.target.closest('[data-pw113-project-code]');
    if (!button) return;
    const project = projects.find(item => item.code === button.dataset.pw113ProjectCode);
    if (project) renderInspector(project);
  });

  elements.list?.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const buttons = [...elements.list.querySelectorAll('.pw113-project-item')];
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    buttons[(current + delta + buttons.length) % buttons.length]?.focus();
  });

  elements.filters?.addEventListener('click', event => {
    const button = event.target.closest('[data-pw113-filter]');
    if (!button) return;
    activeFilter = button.dataset.pw113Filter;
    elements.filters.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
    renderList();
  });

  elements.search?.addEventListener('input', renderList);

  elements.tabs?.addEventListener('click', event => {
    const button = event.target.closest('[data-pw113-tab]');
    if (!button) return;
    const tab = button.dataset.pw113Tab;
    elements.tabs.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
    workbench.querySelectorAll('[data-pw113-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.pw113Panel === tab));
  });

  elements.evidenceButton?.addEventListener('click', () => {
    selectedProject?.sourceCard?.click();
  });

  elements.kanbanButton?.addEventListener('click', () => navigate('kanban-board'));
  workbench.querySelectorAll('[data-pw113-nav]').forEach(button => {
    button.addEventListener('click', () => navigate(button.dataset.pw113Nav));
  });

  elements.exportButton?.addEventListener('click', () => {
    const original = document.querySelector('#exportProjectSnapshot');
    if (original) original.click();
  });

  const counts = projects.reduce((acc, project) => {
    acc[project.stage] = (acc[project.stage] || 0) + 1;
    return acc;
  }, {});

  document.querySelector('#pw113MetricTotal').textContent = projects.length;
  document.querySelector('#pw113MetricActive').textContent = counts['in-progress'] || 0;
  document.querySelector('#pw113MetricReview').textContent = counts.review || 0;
  document.querySelector('#pw113MetricHold').textContent = counts.blocked || 0;

  const filterCounts = {
    all: projects.length,
    'in-progress': counts['in-progress'] || 0,
    review: counts.review || 0,
    blocked: counts.blocked || 0,
    completed: counts.completed || 0
  };

  elements.filters?.querySelectorAll('[data-pw113-filter]').forEach(button => {
    const count = button.querySelector('b');
    if (count) count.textContent = filterCounts[button.dataset.pw113Filter] || 0;
  });

  renderInspector(selectedProject);
  page.classList.add('pw113-ready');
})();

;

/* ---- ekh-v1234-mia-queue-dossier-runtime ---- */

(()=>{'use strict';
const page=document.getElementById('handoffs');if(!page)return;
const track=document.getElementById('mq234Track'),viewport=document.getElementById('mq234Viewport');
const tabs=[...page.querySelectorAll('[data-mq234-page]')],sheets=[...page.querySelectorAll('[data-mq234-sheet]')];
const summaries=['Queue index','Selected report','Evidence and release gates','Owner approval','Publication record'];
const queueKey='ekh_mia_queue_v114',approvalKey='ekh_mq234_approvals',noteKey='ekh_mq234_closing_notes';
let current=0,startX=0,startY=0,dragging=false;
const byId=id=>document.getElementById(id);const safe=v=>String(v??'');
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function selectedId(){return page.querySelector('.mia114-record.selected')?.dataset.mia114Record||null}
function items(){const data=read(queueKey,[]);return Array.isArray(data)?data:[]}
function selected(){const id=selectedId();return items().find(item=>item.id===id)||null}
function requiredMissing(item){const m=[];if(!item)return['Record selection'];if(!item.project)m.push('Project');if(!item.report_owner)m.push('Report owner');if(!item.report_date)m.push('Report date');if(!item.status)m.push('Status');if(!item.executive_summary)m.push('Executive summary');if(!Array.isArray(item.completed_progress)||!item.completed_progress.length)m.push('Completed work');if(!item.next_action)m.push('Next action');if(!Array.isArray(item.evidence_references)||!item.evidence_references.length)m.push('Evidence references');return m}
function releaseMissing(item){const m=[];if(!item)return['Record selection'];if(!item.owner_approval)m.push('Owner approval');if(!item.kyo_validated)m.push('Kyo validation');if(!item.release_commit)m.push('Git commit');if(!item.deployment_evidence)m.push('Deployment evidence');if(!item.rollback_reference)m.push('Rollback reference');return m}
function show(i){current=Math.max(0,Math.min(sheets.length-1,i));if(track)track.style.transform=`translateX(-${current*100}%)`;tabs.forEach((b,n)=>{b.classList.toggle('active',n===current);b.setAttribute('aria-selected',String(n===current))});sheets.forEach((s,n)=>{s.classList.toggle('active',n===current);s.setAttribute('aria-hidden',String(n!==current))});byId('mq234PageCount').textContent=String(current+1);byId('mq234PageSummary').textContent=summaries[current];byId('mq234Prev').disabled=current===0;byId('mq234Next').disabled=current===sheets.length-1;viewport?.focus({preventScroll:true})}
function setGate(id,pass,note){const el=byId(id);if(!el)return;el.dataset.state=pass?'pass':'blocked';el.querySelector('b').textContent=pass?'PASS':'BLOCKED';const noteNode=byId(`${id}Note`);if(noteNode)noteNode.textContent=note}
function decisionLabel(v){return({approved:'Approve next workflow stage',conditional:'Approve with conditions',changes:'Return for changes',hold:'Hold report'})[v]||'Not signed'}
function approvalId(item){return item?.id||'UNSELECTED'}
function approvalFor(item){return read(approvalKey,{})[approvalId(item)]||null}
function noteFor(item){return read(noteKey,{})[approvalId(item)]||''}
function sync(){const item=selected(),approval=approvalFor(item),req=requiredMissing(item),rel=releaseMissing(item);const project=item?.project||'No report selected';byId('mq234HeaderRecord').textContent=item?.id||'No selection';byId('mq234HeaderState').textContent=approval?'Local decision recorded':item?`${String(item.stage||'open').toUpperCase()} / review`:'Open for review';byId('mq234SelectedProject').textContent=project;byId('mq234SelectedSummary').textContent=item?.executive_summary||'Choose a record from Page 01 to open its full workflow file.';byId('mq234SelectedStage').textContent=item?String(item.stage||'open').toUpperCase():'NO SELECTION';byId('mq234SelectedId').textContent=item?.id||'—';byId('mq234SelectedOwner').textContent=item?.report_owner||'—';byId('mq234SelectedStatus').textContent=item?.status||'—';byId('mq234SelectedDate').textContent=item?.report_date||'—';byId('mq234SelectedNext').textContent=item?.next_action||'—';
const intakePass=Boolean(item)&&req.length===0,ownerPass=Boolean(item?.owner_approval||approval),kyoPass=Boolean(item?.kyo_validated),proofPass=Boolean(item?.release_commit&&item?.deployment_evidence&&item?.rollback_reference);setGate('mq234GateIntake',intakePass,intakePass?'All required intake fields are recorded.':req.join(', '));setGate('mq234GateOwner',ownerPass,ownerPass?'Owner approval is recorded locally.':'Signed owner approval required.');setGate('mq234GateKyo',kyoPass,kyoPass?'Kyo validation is recorded.':'Kyo validation not recorded.');setGate('mq234GateProof',proofPass,proofPass?'Commit, deployment and rollback references are recorded.':'Commit, deployment and rollback references required.');const allPass=intakePass&&ownerPass&&kyoPass&&proofPass;byId('mq234GateOverall').textContent=!item?'SELECT RECORD':allPass?'ALL GATES PASS':'GATES BLOCKED';
const evidence=item?.evidence_references||[];byId('mq234EvidenceList').innerHTML=evidence.length?evidence.map(v=>`<li>${escapeHtml(v)}</li>`).join(''):'<li>No evidence references recorded.</li>';const missing=[...req,...rel];byId('mq234MissingList').innerHTML=missing.length?missing.map(v=>`<li>${escapeHtml(v)}</li>`).join(''):'<li>No missing gate requirement detected.</li>';
byId('mq234ApprovalProject').textContent=project;byId('mq234MemoRecord').textContent=item?.id||'—';byId('mq234MemoProject').textContent=project;byId('mq234MemoStage').textContent=item?.stage||'—';byId('mq234MemoEvidence').textContent=!item?'Select a queue record and review its evidence before signing.':evidence.length?`${evidence.length} evidence reference(s) are recorded. Intake missing: ${req.length}. Release-gate missing: ${rel.length}.`:'No evidence references are recorded for this report.';loadApproval(item);loadRecord(item,allPass)}
function escapeHtml(value){return safe(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
function loadApproval(item){const rec=approvalFor(item);byId('mq234Decision').value=rec?.decision||'';byId('mq234SignatureName').value=rec?.signer||'';byId('mq234ApprovalNote').value=rec?.note||'';byId('mq234SignaturePreview').textContent=rec?.signer||'Sign here';byId('mq234ApprovalStatus').textContent=!item?'SELECT RECORD':rec?'SIGNED LOCALLY':'AWAITING SIGNATURE';byId('mq234SignResult').hidden=!rec;byId('mq234SignedMeta').textContent=rec?`${decisionLabel(rec.decision)} · ${rec.signed_at}`:'—'}
function loadRecord(item,allPass){const rec=approvalFor(item),note=noteFor(item);byId('mq234RecordProject').textContent=item?.project||'—';byId('mq234RecordDecision').textContent=rec?decisionLabel(rec.decision):'Not signed';byId('mq234RecordSigner').textContent=rec?.signer||'—';byId('mq234RecordTime').textContent=rec?.signed_at||'—';byId('mq234RecordGate').textContent=allPass?'All gates pass':'Blocked';byId('mq234RecordStatus').textContent=rec?'RECORDED LOCALLY':'OPEN';byId('mq234ClosingNote').value=note;byId('mq234RecordMessage').textContent=note?'Closing instruction saved locally.':'No closing instruction saved.'}
function payload(item){return{release:'v1.30.2',record_type:'mia_owner_approval_local_draft',record:item?{id:item.id,project:item.project,stage:item.stage,status:item.status,report_owner:item.report_owner}:null,decision:byId('mq234Decision').value,signer:byId('mq234SignatureName').value.trim(),note:byId('mq234ApprovalNote').value.trim(),signed_at:new Date().toISOString(),local_draft:true}}
function download(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),0)}
function syncOwnerGate(){const checkbox=byId('mia114OwnerApproval');if(checkbox){checkbox.checked=true;page.querySelector('[data-mia114-action="save-evidence"]')?.click();return}const item=selected();if(!item)return;const data=items(),target=data.find(r=>r.id===item.id);if(target){target.owner_approval=true;target.updated_at=new Date().toISOString();write(queueKey,data)}}
tabs.forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.mq234Page))));byId('mq234Prev')?.addEventListener('click',()=>show(current-1));byId('mq234Next')?.addEventListener('click',()=>show(current+1));byId('mq234GoGates')?.addEventListener('click',()=>show(2));byId('mq234BackToReport')?.addEventListener('click',()=>show(1));byId('mq234GoApproval')?.addEventListener('click',()=>show(3));byId('mq234DismissHint')?.addEventListener('click',()=>byId('mq234SwipeHint')?.remove());
viewport?.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;dragging=true});viewport?.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)){dx<0?show(current+1):show(current-1)}});viewport?.addEventListener('pointercancel',()=>dragging=false);
document.addEventListener('keydown',e=>{if(!page.classList.contains('active'))return;if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();show(current+1)}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();show(current-1)}else if(e.key==='Home')show(0);else if(e.key==='End')show(sheets.length-1)});
byId('mq234SignatureName')?.addEventListener('input',e=>byId('mq234SignaturePreview').textContent=e.target.value.trim()||'Sign here');
byId('mq234ApprovalForm')?.addEventListener('submit',e=>{e.preventDefault();const item=selected(),decision=byId('mq234Decision').value,signer=byId('mq234SignatureName').value.trim();if(!item){byId('mq234ApprovalStatus').textContent='SELECT RECORD';return}if(!decision||!signer||!byId('mq234EvidenceConfirm').checked||!byId('mq234AuthorityConfirm').checked){byId('mq234ApprovalStatus').textContent='COMPLETE REQUIRED FIELDS';return}const map=read(approvalKey,{});map[approvalId(item)]=payload(item);write(approvalKey,map);syncOwnerGate();setTimeout(sync,40)});
byId('mq234ExportApproval')?.addEventListener('click',()=>{const item=selected(),rec=approvalFor(item)||payload(item);download(`EKH_${approvalId(item)}_Mia_Approval.json`,rec)});
byId('mq234ClearApproval')?.addEventListener('click',()=>{const item=selected(),map=read(approvalKey,{});delete map[approvalId(item)];write(approvalKey,map);byId('mq234ApprovalForm').reset();byId('mq234SignaturePreview').textContent='Sign here';sync()});
byId('mq234SaveRecord')?.addEventListener('click',()=>{const item=selected();if(!item)return;const map=read(noteKey,{});map[approvalId(item)]=byId('mq234ClosingNote').value.trim();write(noteKey,map);sync()});
byId('mq234ExportDossier')?.addEventListener('click',()=>{const item=selected(),id=approvalId(item);download(`EKH_${id}_Mia_Workflow_Dossier.json`,{release:'v1.30.2',record_type:'mia_workflow_dossier_local_export',record:item,approval:approvalFor(item),closing_note:noteFor(item),exported_at:new Date().toISOString(),local_draft:true})});
page.addEventListener('click',e=>{const row=e.target.closest('[data-mia114-record]');if(row)setTimeout(()=>{sync();show(1)},0);const action=e.target.closest('[data-mia114-action]');if(action)setTimeout(sync,35)});
const observer=new MutationObserver(()=>sync());observer.observe(byId('mia114QueueList'),{childList:true,subtree:true});observer.observe(byId('mia114Inspector'),{childList:true,subtree:true});window.addEventListener('storage',e=>{if([queueKey,approvalKey,noteKey].includes(e.key))sync()});setTimeout(()=>{sync();show(0)},80);
})();

;

/* ---- ekh-v1233-projects-dossier-runtime ---- */

(()=>{'use strict';
const page=document.getElementById('projects');if(!page)return;
const track=document.getElementById('pw233Track'),viewport=document.getElementById('pw233Viewport');
const tabs=[...page.querySelectorAll('[data-pw233-page]')],sheets=[...page.querySelectorAll('[data-pw233-sheet]')];
const summaries=['Portfolio index','Selected project brief','Evidence file','Owner approval','Decision record'];
let current=0,startX=0,startY=0,dragging=false;
const approvalKey='ekh_pw233_project_approvals',noteKey='ekh_pw233_project_notes';
function text(id){return document.getElementById(id)?.textContent?.trim()||''}
function selected(){return{code:text('pw113SelectedCode'),name:text('pw113SelectedName'),owner:text('pw113SelectedOwner'),stage:text('pw113SelectedStage'),evidence:text('pw113SelectedEvidence'),next:text('pw113SelectedNext'),risk:text('pw113SelectedRisk')}}
function show(i){current=Math.max(0,Math.min(sheets.length-1,i));if(track)track.style.transform=`translateX(-${current*100}%)`;tabs.forEach((b,n)=>{b.classList.toggle('active',n===current);b.setAttribute('aria-selected',String(n===current))});sheets.forEach((s,n)=>s.classList.toggle('active',n===current));document.getElementById('pw233PageCount').textContent=String(current+1);document.getElementById('pw233PageSummary').textContent=summaries[current];document.getElementById('pw233Prev').disabled=current===0;document.getElementById('pw233Next').disabled=current===sheets.length-1;viewport?.focus({preventScroll:true});}
tabs.forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.pw233Page))));document.getElementById('pw233Prev')?.addEventListener('click',()=>show(current-1));document.getElementById('pw233Next')?.addEventListener('click',()=>show(current+1));
document.getElementById('pw233GoEvidence')?.addEventListener('click',()=>show(2));document.getElementById('pw233GoApproval')?.addEventListener('click',()=>show(3));
viewport?.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;dragging=true});viewport?.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)){dx<0?show(current+1):show(current-1)}});viewport?.addEventListener('pointercancel',()=>dragging=false);
document.addEventListener('keydown',e=>{if(!page.classList.contains('active'))return;if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();show(current+1)}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();show(current-1)}else if(e.key==='Home')show(0);else if(e.key==='End')show(sheets.length-1)});
document.getElementById('pw233DismissHint')?.addEventListener('click',()=>document.getElementById('pw233SwipeHint')?.remove());
function readMap(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}function saveMap(key,obj){try{localStorage.setItem(key,JSON.stringify(obj))}catch{}}
function decisionLabel(v){return({approved:'Approve next stage',conditional:'Approve with conditions',changes:'Return for changes',hold:'Hold project'})[v]||'Not signed'}
function sync(){const p=selected();document.getElementById('pw233HeaderProject').textContent=p.name||'No selection';document.getElementById('pw233MemoTitle').textContent=p.name||'Awaiting selection';document.getElementById('pw233ApprovalProject').textContent=p.name||'Selected project';document.getElementById('pw233MemoProject').textContent=`${p.code||'—'} / ${p.name||'—'}`;document.getElementById('pw233MemoOwner').textContent=p.owner||'—';document.getElementById('pw233MemoStage').textContent=p.stage||'—';document.getElementById('pw233MemoEvidence').textContent=p.evidence&&p.evidence!=='—'?`Recorded evidence state: ${p.evidence}. Review the full evidence file before signing.`:'No evidence state has been recorded for this project.';document.getElementById('pw233RecordProject').textContent=p.name||'—';loadApproval();loadNote();}
function approvalId(){const p=selected();return p.code&&p.code!=='PROJECT'?p.code:'UNSELECTED'}
function loadApproval(){const rec=readMap(approvalKey)[approvalId()]||null;const name=document.getElementById('pw233SignatureName'),decision=document.getElementById('pw233Decision'),note=document.getElementById('pw233ApprovalNote');if(name)name.value=rec?.signer||'';if(decision)decision.value=rec?.decision||'';if(note)note.value=rec?.note||'';document.getElementById('pw233SignaturePreview').textContent=rec?.signer||'Sign here';document.getElementById('pw233ApprovalStatus').textContent=rec?'SIGNED LOCALLY':'AWAITING SIGNATURE';document.getElementById('pw233HeaderState').textContent=rec?'Local decision recorded':'Open for review';document.getElementById('pw233SignResult').hidden=!rec;document.getElementById('pw233SignedMeta').textContent=rec?`${decisionLabel(rec.decision)} · ${rec.signed_at}`:'—';document.getElementById('pw233RecordDecision').textContent=rec?decisionLabel(rec.decision):'Not signed';document.getElementById('pw233RecordSigner').textContent=rec?.signer||'—';document.getElementById('pw233RecordTime').textContent=rec?.signed_at||'—';document.getElementById('pw233RecordStatus').textContent=rec?'RECORDED LOCALLY':'OPEN';}
function loadNote(){const note=readMap(noteKey)[approvalId()]||'';document.getElementById('pw233ClosingNote').value=note;document.getElementById('pw233RecordMessage').textContent=note?'Closing instruction saved locally.':'No closing instruction saved.'}
function approvalPayload(){const p=selected();return{release:'v1.30.2',record_type:'project_owner_approval_local_draft',project:p,decision:document.getElementById('pw233Decision').value,signer:document.getElementById('pw233SignatureName').value.trim(),note:document.getElementById('pw233ApprovalNote').value.trim(),signed_at:new Date().toISOString(),local_draft:true}}
function download(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),0)}
document.getElementById('pw233SignatureName')?.addEventListener('input',e=>document.getElementById('pw233SignaturePreview').textContent=e.target.value.trim()||'Sign here');
document.getElementById('pw233ApprovalForm')?.addEventListener('submit',e=>{e.preventDefault();const decision=document.getElementById('pw233Decision').value,signer=document.getElementById('pw233SignatureName').value.trim(),evidence=document.getElementById('pw233EvidenceConfirm').checked,authority=document.getElementById('pw233AuthorityConfirm').checked;if(!decision||!signer||!evidence||!authority){document.getElementById('pw233ApprovalStatus').textContent='COMPLETE REQUIRED FIELDS';return}const payload=approvalPayload(),map=readMap(approvalKey);map[approvalId()]=payload;saveMap(approvalKey,map);loadApproval();});
document.getElementById('pw233ExportApproval')?.addEventListener('click',()=>{const rec=readMap(approvalKey)[approvalId()]||approvalPayload();download(`EKH_${approvalId()}_Project_Approval.json`,rec)});
document.getElementById('pw233ClearApproval')?.addEventListener('click',()=>{const map=readMap(approvalKey);delete map[approvalId()];saveMap(approvalKey,map);document.getElementById('pw233ApprovalForm').reset();document.getElementById('pw233SignaturePreview').textContent='Sign here';loadApproval()});
document.getElementById('pw233SaveRecord')?.addEventListener('click',()=>{const map=readMap(noteKey);map[approvalId()]=document.getElementById('pw233ClosingNote').value.trim();saveMap(noteKey,map);loadNote()});
document.getElementById('pw233ExportDossier')?.addEventListener('click',()=>{const id=approvalId(),payload={release:'v1.30.2',record_type:'project_dossier_local_export',project:selected(),approval:readMap(approvalKey)[id]||null,closing_note:readMap(noteKey)[id]||'',exported_at:new Date().toISOString(),local_draft:true};download(`EKH_${id}_Project_Dossier.json`,payload)});
page.addEventListener('click',e=>{const row=e.target.closest('[data-pw113-project-code]');if(row)setTimeout(()=>{sync();show(1)},0)});
const observer=new MutationObserver(sync),nameNode=document.getElementById('pw113SelectedName');if(nameNode)observer.observe(nameNode,{childList:true,subtree:true,characterData:true});
setTimeout(()=>{sync();show(0)},60);
})();

;

/* ---- ekh-v1240-organisation-dossier-runtime ---- */

(() => {
  'use strict';

  const UNITS = [{"slug":"org-technology","route":"org-technology","code":"TEC","type":"Core Directorate","title":"Technology, Software, Web & Systems","mandate":"Architecture, applications, data integrity, DevOps and runtime verification.","lead_name":"Candice","lead_role":"Technology Director","lead_department":"Technology, Software, Web & Systems","lead_focus":"System architecture, access, infrastructure, runtime ownership and technical command.","members":[{"name":"Candice","role":"Technology Director","department":"org-technology","initials":"C"},{"name":"Jeff","role":"Application Owner / Front-End Engineer","department":"org-technology","initials":"J"},{"name":"Xion","role":"Lead Web Developer","department":"org-technology","initials":"X"},{"name":"Blanc","role":"Worksheet Studio Lead","department":"org-bm","initials":"B"},{"name":"Kyo","role":"Debugging & Technical Verification Specialist","department":"org-technology","initials":"K"},{"name":"Alya","role":"Data Integrity & Question Bank Quality Assurance","department":"org-technology","initials":"A"},{"name":"Baran","role":"Database & DevOps Operator","department":"org-technology","initials":"B"},{"name":"Oliver","role":"Application Lead","department":"org-technology","initials":"O"}]},{"slug":"org-creative","route":"org-creative","code":"CRE","type":"Core Directorate","title":"Creative, Graphics & Visual Identity","mandate":"Visual direction, character integrity, political graphics and digital assets.","lead_name":"Kamal","lead_role":"Creative Director","lead_department":"Creative, Graphics & Visual Identity","lead_focus":"Creative direction, visual identity, production assets and design governance.","members":[{"name":"Kamal","role":"Creative Director","department":"org-creative","initials":"K"},{"name":"Farah","role":"Visual Illustration Lead & Character Identity Guardian","department":"org-creative","initials":"F"},{"name":"Zenon","role":"Digital Asset Designer","department":"org-creative","initials":"Z"},{"name":"Clara","role":"Political Graphic Designer","department":"org-creative","initials":"C"}]},{"slug":"org-assessment","route":"org-assessment","code":"EDU","type":"Core Directorate","title":"Child Education & Assessment","mandate":"Curriculum evidence, progression, assessment quality and education release authority.","lead_name":"Reo","lead_role":"Education Director","lead_department":"Child Education & Assessment","lead_focus":"Curriculum direction, assessment, educational release gates and final education authority.","members":[{"name":"Reo","role":"Education Director","department":"org-english","initials":"R"},{"name":"Guy","role":"Early Childhood Education Specialist","department":"org-english","initials":"G"},{"name":"Ilica","role":"Curriculum Validator","department":"org-english","initials":"I"},{"name":"Elio","role":"Curriculum Researcher — Standards Mapping","department":"org-english","initials":"E"},{"name":"Luna","role":"Curriculum Researcher — Progression & Assessment","department":"org-english","initials":"L"},{"name":"Nene","role":"Malay Language Curriculum Specialist","department":"org-bm","initials":"N"}]},{"slug":"org-marketing","route":"org-marketing","code":"MKT","type":"Core Directorate","title":"Marketing, Content & Market Intelligence","mandate":"Positioning, sales communication, content systems and market research.","lead_name":"Mario","lead_role":"Marketing Director","lead_department":"Marketing, Content & Market Intelligence","lead_focus":"Marketing direction, sales communication, positioning and campaign coordination.","members":[{"name":"Mario","role":"Marketing Director","department":"org-marketing","initials":"M"},{"name":"Zack","role":"Content Strategy / Threads Lead","department":"org-marketing","initials":"Z"},{"name":"Tabby","role":"Devil’s Advocate","department":"org-marketing","initials":"T"},{"name":"Syakila","role":"Malaysian Malay Social Language Analyst","department":"org-bm","initials":"S"},{"name":"Paula","role":"International Digital Product Market Researcher","department":"org-marketing","initials":"P"}]},{"slug":"org-political","route":"org-political","code":"POL","type":"Core Directorate","title":"Politics","mandate":"Political analysis, criticism, political graphics and video-script support.","lead_name":"Wahid","lead_role":"Political Director","lead_department":"Politics","lead_focus":"Malaysian political analysis, criticism, research direction and political content control.","members":[{"name":"Wahid","role":"Political Director","department":"org-political","initials":"W"},{"name":"Clara","role":"Political Graphic Designer","department":"org-creative","initials":"C"},{"name":"Azizan","role":"Political Video Script Specialist","department":"org-multimedia","initials":"A"}]},{"slug":"org-multimedia","route":"org-multimedia","code":"MMD","type":"Core Directorate","title":"Multimedia, Video & Audio","mandate":"Sound quality, product video, UGC direction and political video scripting.","lead_name":"Arian","lead_role":"Multimedia Director","lead_department":"Multimedia, Video & Audio","lead_focus":"Audio, sound, multimedia coordination and application audio quality.","members":[{"name":"Arian","role":"Multimedia Director","department":"org-multimedia","initials":"A"},{"name":"Lei","role":"UGC & Product Video Specialist","department":"org-multimedia","initials":"L"},{"name":"Azizan","role":"Political Video Script Specialist","department":"org-multimedia","initials":"A"}]},{"slug":"org-bm","route":"org-bm","code":"BM","type":"Specialised Unit","title":"Malay Language","mandate":"Malay language curriculum, translation quality, worksheet language and local-language review.","lead_name":"Shared function","lead_role":"Cross-directorate assignment","lead_department":"Malay Language","lead_focus":"Responsibility is shared by the assigned specialists and reviewed through the relevant operating directorates.","members":[{"name":"Nene","role":"Malay Language Curriculum Specialist","department":"org-bm","initials":"N"},{"name":"Haikal","role":"Translator / Language QA","department":"org-bm","initials":"H"},{"name":"Blanc","role":"Worksheet Studio Lead","department":"org-bm","initials":"B"}]},{"slug":"org-english","route":"org-english","code":"EN","type":"Specialised Unit","title":"English Language & Education","mandate":"English curriculum validation, education evidence, progression review and translation quality.","lead_name":"Shared function","lead_role":"Cross-directorate assignment","lead_department":"English Language & Education","lead_focus":"Responsibility is shared by the assigned specialists and reviewed through the relevant operating directorates.","members":[{"name":"Reo","role":"Education Director","department":"org-english","initials":"R"},{"name":"Ilica","role":"Curriculum Validator","department":"org-english","initials":"I"},{"name":"Haikal","role":"Translator / Language QA","department":"org-bm","initials":"H"},{"name":"Nara","role":"Translator 2 / First-pass Language QA","department":"org-english","initials":"N"}]},{"slug":"org-qa","route":"org-qa","code":"QA","type":"Specialised Unit","title":"Technical QA & Release","mandate":"Technical QA, data integrity, education release evidence and controlled release gates.","lead_name":"Shared function","lead_role":"Cross-directorate assignment","lead_department":"Technical QA & Release","lead_focus":"Responsibility is shared by the assigned specialists and reviewed through the relevant operating directorates.","members":[{"name":"Candice","role":"Technology Director","department":"org-technology","initials":"C"},{"name":"Reo","role":"Education Director","department":"org-english","initials":"R"},{"name":"Alya","role":"Data Integrity & Question Bank Quality Assurance","department":"org-technology","initials":"A"},{"name":"Arden","role":"Technical QA & Release Lead","department":"org-qa","initials":"A"},{"name":"Vera","role":"Test Automation Engineer","department":"org-qa","initials":"V"}]},{"slug":"org-publishing","route":"org-publishing","code":"PUB","type":"Specialised Unit","title":"E-book & Publishing","mandate":"E-book writing, editorial QA, production quality and publication control.","lead_name":"Shared function","lead_role":"Cross-directorate assignment","lead_department":"E-book & Publishing","lead_focus":"Responsibility is shared by the assigned specialists and reviewed through the relevant operating directorates.","members":[{"name":"Love","role":"E-book Writer","department":"org-publishing","initials":"L"},{"name":"Torrie","role":"E-book QA Editor","department":"org-publishing","initials":"T"}]}];
  const PAGES = [
    ['cover','Executive Brief'],
    ['index','Directorate Index'],
    ['department','Department File'],
    ['register','Staff Register'],
    ['review','Responsibility Review'],
    ['approval','Owner Approval']
  ];
  const APPROVAL_KEY = 'ekh_org240_approval_v1240';
  const REVIEW_KEY = 'ekh_org240_review_v1240';

  let pageIndex = 0;
  let selectedSlug = UNITS[0]?.slug || '';
  let touchStartX = null;

  const byId = id => document.getElementById(id);
  const currentUnit = () => UNITS.find(unit => unit.slug === selectedSlug) || UNITS[0];

  function safe(value){
    return String(value ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function initials(name){
    return String(name || '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0,2)
      .map(part => part[0])
      .join('')
      .toUpperCase() || '—';
  }

  function approvalStore(){
    try{
      return JSON.parse(localStorage.getItem(APPROVAL_KEY) || '{}');
    }catch(error){
      return {};
    }
  }

  function saveApprovalStore(store){
    try{
      localStorage.setItem(APPROVAL_KEY,JSON.stringify(store));
    }catch(error){}
  }

  function reviewStore(){
    try{
      return JSON.parse(localStorage.getItem(REVIEW_KEY) || '{}');
    }catch(error){
      return {};
    }
  }

  function saveReview(){
    const unit = currentUnit();
    if(!unit) return;
    const store = reviewStore();
    store[unit.slug] = {
      mandate:byId('org240CheckMandate')?.checked || false,
      authority:byId('org240CheckAuthority')?.checked || false,
      staff:byId('org240CheckStaff')?.checked || false,
      cross:byId('org240CheckCross')?.checked || false,
      note:byId('org240ReviewNote')?.value || ''
    };
    try{
      localStorage.setItem(REVIEW_KEY,JSON.stringify(store));
    }catch(error){}
  }

  function loadReview(){
    const unit = currentUnit();
    const record = reviewStore()[unit?.slug] || {};
    if(byId('org240CheckMandate')) byId('org240CheckMandate').checked = Boolean(record.mandate);
    if(byId('org240CheckAuthority')) byId('org240CheckAuthority').checked = Boolean(record.authority);
    if(byId('org240CheckStaff')) byId('org240CheckStaff').checked = Boolean(record.staff);
    if(byId('org240CheckCross')) byId('org240CheckCross').checked = Boolean(record.cross);
    if(byId('org240ReviewNote')) byId('org240ReviewNote').value = record.note || '';
  }

  function renderDots(){
    const dots = byId('org240PageDots');
    if(!dots) return;
    dots.innerHTML = PAGES.map(([key,title],index) => `
      <button class="${index === pageIndex ? 'active' : ''}"
        data-org240-dot="${key}" type="button" aria-label="Open ${safe(title)}"></button>
    `).join('');
  }

  function openPage(page,{focus=false}={}){
    const targetIndex = PAGES.findIndex(([key]) => key === page);
    pageIndex = targetIndex >= 0 ? targetIndex : 0;
    const [key,title] = PAGES[pageIndex];

    document.querySelectorAll('[data-org240-panel]').forEach(panel => {
      const active = panel.dataset.org240Panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
      panel.setAttribute('aria-hidden',String(!active));
    });

    document.querySelectorAll('[data-org240-page]').forEach(button => {
      button.classList.toggle('active',button.dataset.org240Page === key);
      button.setAttribute('aria-selected',String(button.dataset.org240Page === key));
    });

    if(byId('org240PageCounter')) byId('org240PageCounter').textContent = `Page ${pageIndex + 1} of ${PAGES.length}`;
    if(byId('org240PageTitle')) byId('org240PageTitle').textContent = title;
    if(byId('org240PrevPage')) byId('org240PrevPage').disabled = pageIndex === 0;
    if(byId('org240NextPage')) byId('org240NextPage').disabled = pageIndex === PAGES.length - 1;
    renderDots();

    if(key === 'register'){
      setTimeout(() => {
        const button = document.querySelector(`[data-org116-department="${CSS.escape(selectedSlug)}"]`);
        button?.click();
      },0);
    }

    if(focus){
      byId('org240DossierViewport')?.scrollIntoView({
        behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'start'
      });
    }
  }

  function selectedStaffMarkup(unit){
    if(!unit.members.length){
      return '<p class="org240-directory-empty">No staff assignment is recorded for this file.</p>';
    }
    return unit.members.map(member => `
      <button class="org123-staff-card compact"
        data-org123-department="${safe(member.department || unit.route)}"
        data-org123-person="${safe(member.name)}" type="button">
        <span class="org123-staff-avatar">${safe(member.initials || initials(member.name))}</span>
        <span class="org123-staff-copy"><strong>${safe(member.name)}</strong><small>${safe(member.role)}</small></span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7"></path><path d="M9 7h8v8"></path></svg>
      </button>
    `).join('');
  }

  function renderSelected(){
    const unit = currentUnit();
    if(!unit) return;

    document.querySelectorAll('[data-org240-unit-entry]').forEach(entry => {
      entry.classList.toggle('selected',entry.dataset.org240UnitEntry === unit.slug);
    });

    const setText = (id,value) => {
      const node = byId(id);
      if(node) node.textContent = value;
    };

    setText('org240SelectedTitle',unit.title);
    setText('org240SelectedMandate',unit.mandate);
    setText('org240SelectedCode',unit.code);
    setText('org240SelectedType',unit.type);
    setText('org240SelectedLeadName',unit.lead_name);
    setText('org240SelectedLeadRole',unit.lead_role);
    setText('org240SelectedCount',String(unit.members.length));
    setText('org240SelectedRoute',unit.route);
    setText('org240SelectedLeadInitials',initials(unit.lead_name));
    setText('org240SelectedLeadDisplay',unit.lead_name);
    setText('org240SelectedLeadDisplayRole',unit.lead_role);
    setText('org240SelectedLeadFocus',unit.lead_focus || unit.mandate);
    setText('org240StaffHeading',`${unit.members.length} ${unit.members.length === 1 ? 'person' : 'people'} in this file`);
    setText('org240ReviewTitle',`Review ${unit.title}.`);
    setText('org240ReviewMandate',unit.mandate);
    setText('org240ReviewAuthority',`${unit.lead_name} · ${unit.lead_role}`);
    setText('org240ReviewStaff',`${unit.members.length} assigned staff records remain linked to department pages.`);
    setText('org240ApprovalTitle',`Approve ${unit.title}.`);
    setText('org240SignDepartment',unit.title);

    const lead = byId('org240SelectedLead');
    if(lead){
      lead.dataset.org116Name = unit.lead_name;
      lead.dataset.org116Role = unit.lead_role;
      lead.dataset.org116Department = unit.lead_department || unit.title;
      lead.dataset.org116Focus = unit.lead_focus || unit.mandate;
    }

    const staff = byId('org240SelectedStaff');
    if(staff) staff.innerHTML = selectedStaffMarkup(unit);

    loadReview();
    loadApproval();
  }

  function selectUnit(slug,{open=true}={}){
    if(!UNITS.some(unit => unit.slug === slug)) return;
    selectedSlug = slug;
    renderSelected();
    if(open) openPage('department',{focus:true});
  }

  function navigateDepartment(){
    const unit = currentUnit();
    if(!unit?.route) return;
    if(typeof window.showView === 'function'){
      window.showView(unit.route);
      return;
    }
    const trigger = document.querySelector(`[data-view-target="${CSS.escape(unit.route)}"],[data-view="${CSS.escape(unit.route)}"]`);
    trigger?.click();
  }

  function decisionValue(){
    return document.querySelector('input[name="org240Decision"]:checked')?.value || '';
  }

  function loadApproval(){
    const unit = currentUnit();
    if(!unit) return;
    const record = approvalStore()[unit.slug];

    document.querySelectorAll('input[name="org240Decision"]').forEach(input => {
      input.checked = Boolean(record && input.value === record.decision);
    });

    if(byId('org240ApprovalNote')) byId('org240ApprovalNote').value = record?.note || '';
    if(byId('org240ConfirmEvidence')) byId('org240ConfirmEvidence').checked = Boolean(record?.confirmed_evidence);
    if(byId('org240ConfirmAuthority')) byId('org240ConfirmAuthority').checked = Boolean(record?.confirmed_authority);
    if(byId('org240SignName')) byId('org240SignName').value = record?.signer || '';
    if(byId('org240SignaturePreview')) byId('org240SignaturePreview').textContent = record?.signer || 'Owner signature';
    if(byId('org240SignTime')) byId('org240SignTime').textContent = record?.signed_at
      ? new Date(record.signed_at).toLocaleString('en-MY')
      : 'Not signed';

    renderApprovalRecord(record);
  }

  function renderApprovalRecord(record){
    const container = byId('org240ApprovalRecord');
    if(!container) return;

    container.classList.remove('approved','returned','hold');
    if(!record){
      container.innerHTML = `
        <span class="section-kicker">CURRENT LOCAL RECORD</span>
        <strong>No approval has been recorded for this department.</strong>
        <p>Select a decision, confirm the review and sign the dossier.</p>`;
      if(byId('org240ApprovalPosture')) byId('org240ApprovalPosture').textContent = 'PENDING';
      return;
    }

    const classification = record.decision.startsWith('APPROVED')
      ? 'approved'
      : record.decision === 'RETURN_FOR_CORRECTION'
        ? 'returned'
        : 'hold';
    container.classList.add(classification);
    container.innerHTML = `
      <span class="section-kicker">CURRENT LOCAL RECORD</span>
      <strong>${safe(record.decision.replaceAll('_',' '))} · ${safe(record.signer)}</strong>
      <p>${safe(record.unit_title)} · ${safe(new Date(record.signed_at).toLocaleString('en-MY'))}${record.note ? ` · ${safe(record.note)}` : ''}</p>`;

    if(byId('org240ApprovalPosture')){
      byId('org240ApprovalPosture').textContent = record.decision.startsWith('APPROVED')
        ? 'APPROVED'
        : record.decision === 'RETURN_FOR_CORRECTION'
          ? 'RETURN'
          : 'HOLD';
    }
  }

  function recordSignature(){
    const unit = currentUnit();
    const decision = decisionValue();
    const signer = byId('org240SignName')?.value.trim() || '';
    const note = byId('org240ApprovalNote')?.value.trim() || '';
    const confirmedEvidence = byId('org240ConfirmEvidence')?.checked || false;
    const confirmedAuthority = byId('org240ConfirmAuthority')?.checked || false;
    const error = byId('org240SignError');

    const problems = [];
    if(!decision) problems.push('Select an approval decision.');
    if(!signer) problems.push('Type the owner or approver name.');
    if(!confirmedEvidence) problems.push('Confirm the evidence review.');
    if(!confirmedAuthority) problems.push('Confirm approval authority.');

    if(problems.length){
      if(error) error.textContent = problems.join(' ');
      return;
    }
    if(error) error.textContent = '';

    const record = {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      unit_slug:unit.slug,
      unit_title:unit.title,
      unit_type:unit.type,
      decision,
      note,
      signer,
      confirmed_evidence:confirmedEvidence,
      confirmed_authority:confirmedAuthority,
      signed_at:new Date().toISOString(),
      storage:'local-browser-draft',
      production_write:false
    };

    const store = approvalStore();
    store[unit.slug] = record;
    saveApprovalStore(store);
    loadApproval();
  }

  function clearApproval(){
    const unit = currentUnit();
    const store = approvalStore();
    delete store[unit.slug];
    saveApprovalStore(store);
    if(byId('org240ApprovalNote')) byId('org240ApprovalNote').value = '';
    if(byId('org240ConfirmEvidence')) byId('org240ConfirmEvidence').checked = false;
    if(byId('org240ConfirmAuthority')) byId('org240ConfirmAuthority').checked = false;
    if(byId('org240SignName')) byId('org240SignName').value = '';
    document.querySelectorAll('input[name="org240Decision"]').forEach(input => input.checked = false);
    loadApproval();
  }

  function exportApproval(){
    const unit = currentUnit();
    const record = approvalStore()[unit.slug] || {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      unit_slug:unit.slug,
      unit_title:unit.title,
      decision:'NOT_RECORDED',
      production_write:false
    };
    const blob = new Blob([JSON.stringify(record,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `EKH_OS_Organisation_${unit.code}_${new Date().toISOString().replaceAll(':','-')}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),0);
  }

  function move(delta){
    openPage(PAGES[Math.max(0,Math.min(PAGES.length - 1,pageIndex + delta))][0],{focus:true});
  }

  document.addEventListener('DOMContentLoaded',() => {
    renderSelected();
    openPage('cover');

    byId('org240PageTabs')?.addEventListener('click',event => {
      const button = event.target.closest('[data-org240-page]');
      if(button) openPage(button.dataset.org240Page,{focus:true});
    });

    document.addEventListener('click',event => {
      const open = event.target.closest('[data-org240-open-page]');
      if(open) openPage(open.dataset.org240OpenPage,{focus:true});

      const select = event.target.closest('[data-org240-select]');
      if(select) selectUnit(select.dataset.org240Select);

      const dot = event.target.closest('[data-org240-dot]');
      if(dot) openPage(dot.dataset.org240Dot,{focus:true});
    });

    byId('org116ViewDepartments')?.addEventListener('click',() => openPage('index',{focus:true}));
    byId('orgOpenRegister')?.addEventListener('click',() => openPage('register',{focus:true}));
    byId('org240OpenDepartment')?.addEventListener('click',navigateDepartment);
    byId('org240PrevPage')?.addEventListener('click',() => move(-1));
    byId('org240NextPage')?.addEventListener('click',() => move(1));

    byId('org240SignName')?.addEventListener('input',event => {
      if(byId('org240SignaturePreview')){
        byId('org240SignaturePreview').textContent = event.target.value.trim() || 'Owner signature';
      }
    });

    ['org240CheckMandate','org240CheckAuthority','org240CheckStaff','org240CheckCross','org240ReviewNote']
      .forEach(id => byId(id)?.addEventListener('change',saveReview));
    byId('org240ReviewNote')?.addEventListener('input',saveReview);

    byId('org240SignButton')?.addEventListener('click',recordSignature);
    byId('org240ClearSignature')?.addEventListener('click',clearApproval);
    byId('org240ExportApproval')?.addEventListener('click',exportApproval);

    const viewport = byId('org240DossierViewport');
    viewport?.addEventListener('touchstart',event => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    },{passive:true});
    viewport?.addEventListener('touchend',event => {
      if(touchStartX === null) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartX;
      const distance = endX - touchStartX;
      touchStartX = null;
      if(Math.abs(distance) < 52) return;
      move(distance < 0 ? 1 : -1);
    },{passive:true});

    document.addEventListener('keydown',event => {
      const activeView = document.querySelector('.page-content > .view.active');
      if(activeView?.id !== 'organisation') return;
      if(event.target.matches('input,textarea,select,[contenteditable="true"]')) return;
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
        openPage('cover',{focus:true});
      }
      if(event.key === 'End'){
        event.preventDefault();
        openPage('approval',{focus:true});
      }
    });
  });
})();

;

/* ---- ekh-v1243-clean-signature-runtime ---- */

(() => {
  'use strict';

  const ITEMS = [
    {preview:'cc232SignaturePreview',input:'cc232SignatureName'},
    {preview:'pw233SignaturePreview',input:'pw233SignatureName'},
    {preview:'mq234SignaturePreview',input:'mq234SignatureName'},
    {preview:'org240SignaturePreview',input:'org240SignName'}
  ];

  const placeholders = new Set(['','sign here','owner signature','type full name']);
  const normalise = value => String(value || '').replace(/\s+/g,' ').trim();

  function render(item){
    const preview = document.getElementById(item.preview);
    const input = document.getElementById(item.input);
    if(!preview) return;

    const current = normalise(input?.value || preview.textContent);
    const empty = placeholders.has(current.toLowerCase());

    preview.innerHTML = '';
    preview.classList.remove('sig242-mark','sig242-inked','sig242-placeholder');
    preview.classList.toggle('sig243-placeholder',empty);
    preview.textContent = empty
      ? (preview.id === 'org240SignaturePreview' ? 'Owner signature' : 'Sign here')
      : current;

    if(empty){
      preview.removeAttribute('aria-label');
    }else{
      preview.setAttribute('aria-label',`Signature: ${current}`);
    }
  }

  function init(){
    ITEMS.forEach(item => {
      const preview = document.getElementById(item.preview);
      const input = document.getElementById(item.input);
      if(!preview) return;

      preview.parentElement?.querySelectorAll('.sig242-caption').forEach(node => node.remove());
      preview.querySelectorAll('.sig242-flourish').forEach(node => node.remove());
      render(item);
      input?.addEventListener('input',() => render(item));
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();

;

/* ---- ekh-v1250-staff-drive-dossier-runtime ---- */

(() => {
  'use strict';

  const PAGES = [
    ['brief','Archive Brief'],
    ['drives','Drive Index'],
    ['register','File Register'],
    ['selected','Selected File'],
    ['review','Evidence Review'],
    ['approval','Owner Approval']
  ];
  const REVIEW_KEY = 'ekh_sd250_review_v1250';
  const APPROVAL_KEY = 'ekh_sd250_approval_v1250';

  let pageIndex = 0;
  let touchStartX = null;
  let selectedFileKey = '';

  const byId = id => document.getElementById(id);
  const normalise = value => String(value || '').replace(/\s+/g,' ').trim();

  function safe(value){
    return String(value ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function renderDots(){
    const dots = byId('sd250PageDots');
    if(!dots) return;
    dots.innerHTML = PAGES.map(([key,title],index) => `
      <button class="${index === pageIndex ? 'active' : ''}" data-sd250-dot="${key}"
        type="button" aria-label="Open ${safe(title)}"></button>`).join('');
  }

  function openPage(page,{focus=false}={}){
    const index = PAGES.findIndex(([key]) => key === page);
    pageIndex = index >= 0 ? index : 0;
    const [key,title] = PAGES[pageIndex];

    document.querySelectorAll('[data-sd250-panel]').forEach(panel => {
      const active = panel.dataset.sd250Panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
      panel.setAttribute('aria-hidden',String(!active));
    });

    document.querySelectorAll('[data-sd250-page]').forEach(button => {
      const active = button.dataset.sd250Page === key;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });

    if(byId('sd250PageCounter')) byId('sd250PageCounter').textContent = `Page ${pageIndex + 1} of ${PAGES.length}`;
    if(byId('sd250PageTitle')) byId('sd250PageTitle').textContent = title;
    if(byId('sd250PrevPage')) byId('sd250PrevPage').disabled = pageIndex === 0;
    if(byId('sd250NextPage')) byId('sd250NextPage').disabled = pageIndex === PAGES.length - 1;
    renderDots();

    if(focus){
      byId('sd250DossierViewport')?.scrollIntoView({
        behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'start'
      });
    }
  }

  function move(delta){
    const next = Math.max(0,Math.min(PAGES.length - 1,pageIndex + delta));
    openPage(PAGES[next][0],{focus:true});
  }

  function readSelectedMetadata(){
    const display = normalise(byId('securePreviewDisplayName')?.textContent);
    const name = display && display !== '—' ? display : normalise(byId('securePreviewName')?.textContent);
    const owner = normalise(byId('securePreviewOwner')?.textContent);
    const version = normalise(byId('securePreviewVersion')?.textContent);
    const permission = normalise(byId('securePreviewPermission')?.textContent);
    const handoff = normalise(byId('securePreviewHandoff')?.textContent);
    const status = normalise(byId('securePreviewStatus')?.textContent);
    const modified = normalise(byId('securePreviewModified')?.textContent);
    const size = normalise(byId('securePreviewSize')?.textContent);
    const audit = normalise(byId('securePreviewAudit')?.textContent);

    const validName = name && !['FILE','—','Select one file'].includes(name);
    const key = validName ? `${owner || 'drive'}::${name}` : '';

    return {key,name:validName ? name : '',owner,version,permission,handoff,status,modified,size,audit};
  }

  function reviewStore(){
    try{return JSON.parse(localStorage.getItem(REVIEW_KEY) || '{}')}catch(error){return {}}
  }

  function approvalStore(){
    try{return JSON.parse(localStorage.getItem(APPROVAL_KEY) || '{}')}catch(error){return {}}
  }

  function updateSelectedContext(){
    const data = readSelectedMetadata();
    if(!data.key) return;
    selectedFileKey = data.key;

    if(byId('sd250SelectedPageTitle')) byId('sd250SelectedPageTitle').textContent = data.name;
    if(byId('sd250SelectedPageStamp')) byId('sd250SelectedPageStamp').textContent = data.status || 'FILE';
    if(byId('sd250ReviewTitle')) byId('sd250ReviewTitle').textContent = `Review ${data.name}.`;
    if(byId('sd250ReviewOwner')) byId('sd250ReviewOwner').textContent = data.owner || 'Owner metadata not available.';
    if(byId('sd250ReviewVersion')) byId('sd250ReviewVersion').textContent = data.version || 'Version metadata not available.';
    if(byId('sd250ReviewAccess')) byId('sd250ReviewAccess').textContent = data.permission || 'Permission metadata not available.';
    if(byId('sd250ReviewHandoff')) byId('sd250ReviewHandoff').textContent = data.handoff || 'Handoff metadata not available.';
    if(byId('sd250ApprovalTitle')) byId('sd250ApprovalTitle').textContent = `Approve ${data.name}.`;
    if(byId('sd250SignFile')) byId('sd250SignFile').textContent = data.name;

    loadReview();
    loadApproval();
  }

  function currentReview(){
    return reviewStore()[selectedFileKey] || {};
  }

  function saveReview(){
    if(!selectedFileKey) return;
    const store = reviewStore();
    store[selectedFileKey] = {
      owner:byId('sd250CheckOwner')?.checked || false,
      version:byId('sd250CheckVersion')?.checked || false,
      access:byId('sd250CheckAccess')?.checked || false,
      handoff:byId('sd250CheckHandoff')?.checked || false,
      note:byId('sd250ReviewNote')?.value || ''
    };
    try{localStorage.setItem(REVIEW_KEY,JSON.stringify(store))}catch(error){}
  }

  function loadReview(){
    const record = currentReview();
    if(byId('sd250CheckOwner')) byId('sd250CheckOwner').checked = Boolean(record.owner);
    if(byId('sd250CheckVersion')) byId('sd250CheckVersion').checked = Boolean(record.version);
    if(byId('sd250CheckAccess')) byId('sd250CheckAccess').checked = Boolean(record.access);
    if(byId('sd250CheckHandoff')) byId('sd250CheckHandoff').checked = Boolean(record.handoff);
    if(byId('sd250ReviewNote')) byId('sd250ReviewNote').value = record.note || '';
  }

  function decisionValue(){
    return document.querySelector('input[name="sd250Decision"]:checked')?.value || '';
  }

  function renderSignature(name){
    const preview = byId('sd250SignaturePreview');
    if(!preview) return;
    const clean = normalise(name);
    preview.textContent = clean || 'Owner signature';
    preview.classList.toggle('sig243-placeholder',!clean);
    if(clean) preview.setAttribute('aria-label',`Signature: ${clean}`);
    else preview.removeAttribute('aria-label');
  }

  function loadApproval(){
    const record = selectedFileKey ? approvalStore()[selectedFileKey] : null;

    document.querySelectorAll('input[name="sd250Decision"]').forEach(input => {
      input.checked = Boolean(record && input.value === record.decision);
    });

    if(byId('sd250ApprovalNote')) byId('sd250ApprovalNote').value = record?.note || '';
    if(byId('sd250ConfirmEvidence')) byId('sd250ConfirmEvidence').checked = Boolean(record?.confirmed_evidence);
    if(byId('sd250ConfirmAuthority')) byId('sd250ConfirmAuthority').checked = Boolean(record?.confirmed_authority);
    if(byId('sd250SignName')) byId('sd250SignName').value = record?.signer || '';
    renderSignature(record?.signer || '');
    if(byId('sd250SignTime')) byId('sd250SignTime').textContent = record?.signed_at
      ? new Date(record.signed_at).toLocaleString('en-MY')
      : 'Not signed';

    renderApprovalRecord(record);
  }

  function renderApprovalRecord(record){
    const container = byId('sd250ApprovalRecord');
    if(!container) return;
    container.classList.remove('approved','returned','hold');

    if(!record){
      container.innerHTML = `
        <span class="section-kicker">CURRENT LOCAL RECORD</span>
        <strong>No file approval has been recorded.</strong>
        <p>Select a protected file, complete the evidence review and sign the dossier.</p>`;
      if(byId('sd250ApprovalPosture')) byId('sd250ApprovalPosture').textContent = 'PENDING';
      return;
    }

    const className = record.decision.startsWith('APPROVED')
      ? 'approved'
      : record.decision === 'RETURN_FOR_CORRECTION'
        ? 'returned'
        : 'hold';
    container.classList.add(className);
    container.innerHTML = `
      <span class="section-kicker">CURRENT LOCAL RECORD</span>
      <strong>${safe(record.decision.replaceAll('_',' '))} · ${safe(record.signer)}</strong>
      <p>${safe(record.file_name)} · ${safe(new Date(record.signed_at).toLocaleString('en-MY'))}${record.note ? ` · ${safe(record.note)}` : ''}</p>`;

    if(byId('sd250ApprovalPosture')){
      byId('sd250ApprovalPosture').textContent = record.decision.startsWith('APPROVED')
        ? 'APPROVED'
        : record.decision === 'RETURN_FOR_CORRECTION'
          ? 'RETURN'
          : 'HOLD';
    }
  }

  function recordSignature(){
    const data = readSelectedMetadata();
    const decision = decisionValue();
    const signer = normalise(byId('sd250SignName')?.value);
    const note = normalise(byId('sd250ApprovalNote')?.value);
    const confirmedEvidence = byId('sd250ConfirmEvidence')?.checked || false;
    const confirmedAuthority = byId('sd250ConfirmAuthority')?.checked || false;
    const error = byId('sd250SignError');

    const problems = [];
    if(!data.key) problems.push('Select one Staff Drive file.');
    if(!decision) problems.push('Select an approval decision.');
    if(!signer) problems.push('Type the owner or approver name.');
    if(!confirmedEvidence) problems.push('Confirm the evidence review.');
    if(!confirmedAuthority) problems.push('Confirm approval authority.');

    if(problems.length){
      if(error) error.textContent = problems.join(' ');
      return;
    }
    if(error) error.textContent = '';

    selectedFileKey = data.key;
    const record = {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      file_key:data.key,
      file_name:data.name,
      owner:data.owner,
      status:data.status,
      version:data.version,
      permission:data.permission,
      handoff:data.handoff,
      decision,
      note,
      signer,
      confirmed_evidence:confirmedEvidence,
      confirmed_authority:confirmedAuthority,
      signed_at:new Date().toISOString(),
      storage:'local-browser-draft',
      production_write:false
    };

    const store = approvalStore();
    store[selectedFileKey] = record;
    try{localStorage.setItem(APPROVAL_KEY,JSON.stringify(store))}catch(error){}
    loadApproval();
  }

  function clearApproval(){
    if(selectedFileKey){
      const store = approvalStore();
      delete store[selectedFileKey];
      try{localStorage.setItem(APPROVAL_KEY,JSON.stringify(store))}catch(error){}
    }

    document.querySelectorAll('input[name="sd250Decision"]').forEach(input => input.checked = false);
    if(byId('sd250ApprovalNote')) byId('sd250ApprovalNote').value = '';
    if(byId('sd250ConfirmEvidence')) byId('sd250ConfirmEvidence').checked = false;
    if(byId('sd250ConfirmAuthority')) byId('sd250ConfirmAuthority').checked = false;
    if(byId('sd250SignName')) byId('sd250SignName').value = '';
    renderSignature('');
    if(byId('sd250SignTime')) byId('sd250SignTime').textContent = 'Not signed';
    renderApprovalRecord(null);
  }

  function exportApproval(){
    const data = readSelectedMetadata();
    const record = data.key ? approvalStore()[data.key] : null;
    const output = record || {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      file_name:data.name || 'NO_FILE_SELECTED',
      decision:'NOT_RECORDED',
      production_write:false
    };
    const blob = new Blob([JSON.stringify(output,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `EKH_OS_Staff_Drive_Approval_${new Date().toISOString().replaceAll(':','-')}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),0);
  }

  function syncDriveSummary(){
    const name = normalise(byId('secureSelectedName')?.textContent);
    if(byId('sd250SummaryDrive')) byId('sd250SummaryDrive').textContent =
      name && name !== 'No authorised drive' ? name : 'NONE';
    const role = normalise(byId('secureSelectedRole')?.textContent);
    const department = normalise(byId('secureSelectedDepartment')?.textContent);
    if(byId('sd250SummaryDriveDetail')){
      byId('sd250SummaryDriveDetail').textContent = [role,department]
        .filter(value => value && value !== '—').join(' · ') || 'authorised staff archive';
    }

    const visible = normalise(byId('secureVisibleCount')?.textContent) || '0';
    if(byId('sd250RegisterStamp')) byId('sd250RegisterStamp').textContent = `${visible} FILE${visible === '1' ? '' : 'S'}`;
  }

  function selectedFileWasOpened(){
    window.setTimeout(() => {
      updateSelectedContext();
      openPage('selected',{focus:true});
    },40);
  }

  document.addEventListener('DOMContentLoaded',() => {
    openPage('brief');

    byId('sd250PageTabs')?.addEventListener('click',event => {
      const button = event.target.closest('[data-sd250-page]');
      if(button) openPage(button.dataset.sd250Page,{focus:true});
    });

    document.addEventListener('click',event => {
      const open = event.target.closest('[data-sd250-open-page]');
      if(open) openPage(open.dataset.sd250OpenPage,{focus:true});

      const dot = event.target.closest('[data-sd250-dot]');
      if(dot) openPage(dot.dataset.sd250Dot,{focus:true});
    });

    byId('sd250PrevPage')?.addEventListener('click',() => move(-1));
    byId('sd250NextPage')?.addEventListener('click',() => move(1));

    byId('secureFileRows')?.addEventListener('click',event => {
      const row = event.target.closest('.v173-file-row');
      if(!row) return;
      if(event.target.closest('[data-file-action="download"],[data-file-action="archive"],[data-file-action="restore"]')) return;
      selectedFileWasOpened();
    });

    byId('securePreviewClose')?.addEventListener('click',() => openPage('register',{focus:true}));

    ['sd250CheckOwner','sd250CheckVersion','sd250CheckAccess','sd250CheckHandoff']
      .forEach(id => byId(id)?.addEventListener('change',saveReview));
    byId('sd250ReviewNote')?.addEventListener('input',saveReview);

    byId('sd250SignName')?.addEventListener('input',event => renderSignature(event.target.value));
    byId('sd250SignButton')?.addEventListener('click',recordSignature);
    byId('sd250ClearSignature')?.addEventListener('click',clearApproval);
    byId('sd250ExportApproval')?.addEventListener('click',exportApproval);

    const summaryObserver = new MutationObserver(syncDriveSummary);
    ['secureSelectedName','secureSelectedRole','secureSelectedDepartment','secureVisibleCount']
      .forEach(id => {
        const node = byId(id);
        if(node) summaryObserver.observe(node,{childList:true,characterData:true,subtree:true});
      });
    syncDriveSummary();

    const previewObserver = new MutationObserver(() => {
      if(!byId('securePreviewContent')?.hidden) updateSelectedContext();
    });
    if(byId('securePreviewContent')){
      previewObserver.observe(byId('securePreviewContent'),{attributes:true,attributeFilter:['hidden']});
    }

    const viewport = byId('sd250DossierViewport');
    viewport?.addEventListener('touchstart',event => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    },{passive:true});
    viewport?.addEventListener('touchend',event => {
      if(touchStartX === null) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartX;
      const distance = endX - touchStartX;
      touchStartX = null;
      if(Math.abs(distance) < 52) return;
      move(distance < 0 ? 1 : -1);
    },{passive:true});

    document.addEventListener('keydown',event => {
      const activeView = document.querySelector('.page-content > .view.active');
      if(activeView?.id !== 'files') return;
      if(event.target.matches('input,textarea,select,[contenteditable="true"]')) return;

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
        openPage('approval',{focus:true});
      }
    });
  });
})();

;

/* ---- ekh-v1260-my-activities-dossier-runtime ---- */

(() => {
  'use strict';

  const PAGES = [
    ['brief','Today Brief'],
    ['queue','Activity Queue'],
    ['selected','Selected Activity'],
    ['schedule','Schedule & Progress'],
    ['review','Daily Review'],
    ['approval','Owner Approval']
  ];
  const REVIEW_KEY = 'ekh_ma260_review_v1260';
  const APPROVAL_KEY = 'ekh_ma260_approval_v1260';
  const SELECTED_NOTE_KEY = 'ekh_ma260_selected_note_v1260';

  let pageIndex = 0;
  let selectedActivityId = '';
  let touchStartX = null;
  let activeScheduleView = 'week';

  const byId = id => document.getElementById(id);
  const all = selector => [...document.querySelectorAll(selector)];
  const normalise = value => String(value || '').replace(/\s+/g,' ').trim();

  function safe(value){
    return String(value ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function localDateKey(date = new Date()){
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }

  function renderDots(){
    const dots = byId('ma260PageDots');
    if(!dots) return;
    dots.innerHTML = PAGES.map(([key,title],index) => `
      <button class="${index === pageIndex ? 'active' : ''}" data-ma260-dot="${key}"
        type="button" aria-label="Open ${safe(title)}"></button>`).join('');
  }

  function openPage(page,{focus=false}={}){
    const index = PAGES.findIndex(([key]) => key === page);
    pageIndex = index >= 0 ? index : 0;
    const [key,title] = PAGES[pageIndex];

    all('[data-ma260-panel]').forEach(panel => {
      const active = panel.dataset.ma260Panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
      panel.setAttribute('aria-hidden',String(!active));
    });

    all('[data-ma260-page]').forEach(button => {
      const active = button.dataset.ma260Page === key;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });

    if(byId('ma260PageCounter')) byId('ma260PageCounter').textContent = `Page ${pageIndex + 1} of ${PAGES.length}`;
    if(byId('ma260PageTitle')) byId('ma260PageTitle').textContent = title;
    if(byId('ma260PrevPage')) byId('ma260PrevPage').disabled = pageIndex === 0;
    if(byId('ma260NextPage')) byId('ma260NextPage').disabled = pageIndex === PAGES.length - 1;
    renderDots();

    if(focus){
      byId('ma260DossierViewport')?.scrollIntoView({
        behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'start'
      });
    }
  }

  function move(delta){
    const next = Math.max(0,Math.min(PAGES.length - 1,pageIndex + delta));
    openPage(PAGES[next][0],{focus:true});
  }

  function copyText(sourceId,targetId){
    const source = byId(sourceId);
    const target = byId(targetId);
    if(source && target) target.textContent = source.textContent || '0';
  }

  function syncSelect(sourceId,targetId){
    const source = byId(sourceId);
    const target = byId(targetId);
    if(!source || !target) return;
    const current = target.value;
    target.innerHTML = [...source.options].map(option =>
      `<option value="${safe(option.value)}">${safe(option.textContent)}</option>`
    ).join('');
    if([...target.options].some(option => option.value === current)) target.value = current;
    else target.value = source.value;
  }

  function syncConnection(){
    const source = byId('activityConnectionState');
    const target = byId('act120Connection');
    if(!source || !target) return;

    const strong = normalise(source.querySelector('strong')?.textContent) || 'Checking';
    const detail = normalise(source.querySelector('small')?.textContent) || 'Waiting for Supabase';
    const combined = `${source.className} ${strong} ${detail}`;
    const state = /connected/i.test(combined)
      ? 'connected'
      : /error|unavailable|required|not configured/i.test(combined)
        ? 'error'
        : 'checking';

    target.dataset.state = state;
    target.querySelector('strong').textContent = strong;
    target.querySelector('p').textContent = detail;
  }

  function syncFacts(){
    copyText('activityTodayStat','act120TodayMetric');
    copyText('activityOverdueStat','act120OverdueMetric');
    copyText('activityUpcomingStat','act120UpcomingMetric');
    copyText('activityCompletedStat','act120CompletedMetric');
    copyText('activityOwnerLabel','act120Owner');
    copyText('activityRealtimeState','act120Realtime');
    copyText('activityLastSync','act120LastSync');
    copyText('activityBrowserPermission','act120Permission');
    copyText('activityLastSync','ma260BriefLastSync');
    copyText('activityTodayStat','ma260ReviewToday');
    copyText('activityCompletedStat','ma260ReviewCompleted');
    copyText('activityOverdueStat','ma260ReviewOverdue');
    syncConnection();
  }

  const actionIcons = {
    complete:'<span aria-hidden="true">✓</span>',
    snooze:'<span aria-hidden="true">◷</span>',
    edit:'<span aria-hidden="true">Edit</span>',
    cancel:'<span aria-hidden="true">×</span>'
  };

  function decorateClone(target){
    target.querySelectorAll('.activity-type-icon').forEach(icon => {
      icon.textContent = 'ACT';
    });
    target.querySelectorAll('[data-activity-action]').forEach(button => {
      const action = button.dataset.activityAction;
      button.innerHTML = actionIcons[action] || actionIcons.edit;
      button.setAttribute('aria-label',button.title || action);
    });
  }

  function firstQueueCard(){
    return byId('act120LiveList')?.querySelector('[data-activity-id]') || null;
  }

  function syncBriefHeadline(){
    const cards = [...(byId('act120LiveList')?.querySelectorAll('[data-activity-id]') || [])];
    const first = cards[0];
    const title = first?.querySelector('h4')?.textContent.trim();
    const due = first?.querySelector('.activity-due-block small')?.textContent.trim();
    if(byId('ma260TodayHeadline')) byId('ma260TodayHeadline').textContent = title || 'No authenticated activity loaded';
    if(byId('ma260TodaySummary')) byId('ma260TodaySummary').textContent = title
      ? `${due || 'Open record'} · ${cards.length} record${cards.length === 1 ? '' : 's'} in the current queue view.`
      : 'Sign in through Staff Drive to read the owner queue.';
    if(byId('ma260QueueStamp')) byId('ma260QueueStamp').textContent = `${cards.length} RECORD${cards.length === 1 ? '' : 'S'}`;
  }

  function syncLiveView(){
    const source = byId('supabaseActivityList');
    const target = byId('act120LiveList');
    const empty = byId('act120LiveEmpty');
    if(!source || !target || !empty) return;

    target.innerHTML = source.innerHTML;
    decorateClone(target);

    const sourceEmpty = byId('supabaseActivityEmpty');
    const cards = target.querySelectorAll('[data-activity-id]');
    const noRecords = sourceEmpty
      ? !sourceEmpty.hidden
      : cards.length === 0 && !target.querySelector('.activity-loading-state');

    empty.hidden = !noRecords;
    target.hidden = noRecords;

    if(selectedActivityId){
      target.querySelector(`[data-activity-id="${CSS.escape(selectedActivityId)}"]`)?.classList.add('ma260-selected');
    }

    syncSelect('activityProjectFilter','act120ProjectFilter');
    syncSelect('activityPriorityFilter','act120PriorityFilter');
    syncFacts();
    syncBriefHeadline();

    if(!selectedActivityId && firstQueueCard()){
      selectActivity(firstQueueCard(),{open:false});
    }
  }

  function proxyStatus(status){
    const hiddenButton = document.querySelector(`#activityStatusTabs [data-activity-status="${CSS.escape(status)}"]`);
    hiddenButton?.click();
    all('#act120StatusFilters [data-act120-status]').forEach(button => {
      button.classList.toggle('active',button.dataset.act120Status === status);
    });
    setTimeout(syncLiveView,0);
  }

  function cardData(card){
    const meta = [...card.querySelectorAll('.activity-card-meta span')].map(node => normalise(node.textContent));
    return {
      id:card.dataset.activityId || '',
      title:normalise(card.querySelector('h4')?.textContent) || 'Activity',
      description:normalise(card.querySelector('.activity-card-copy p')?.textContent) || 'No additional description.',
      project:meta[0] || 'GENERAL',
      priority:meta[1] || 'normal',
      source:meta[2] || 'manual',
      reminders:(meta[3] || '').replace(/^Alerts:\s*/i,'') || '0 min',
      due:normalise(card.querySelector('.activity-due-block time')?.textContent) || '—',
      dueState:normalise(card.querySelector('.activity-due-block small')?.textContent) || '—',
      status:[...card.classList].find(value => ['scheduled','pending','in_progress','completed','cancelled','overdue'].includes(value)) || (card.classList.contains('overdue') ? 'overdue' : 'open')
    };
  }

  function selectedNoteStore(){
    try{return JSON.parse(localStorage.getItem(SELECTED_NOTE_KEY) || '{}')}catch(error){return {}}
  }

  function saveSelectedNote(){
    if(!selectedActivityId) return;
    const store = selectedNoteStore();
    store[selectedActivityId] = byId('ma260SelectedNote')?.value || '';
    try{localStorage.setItem(SELECTED_NOTE_KEY,JSON.stringify(store))}catch(error){}
  }

  function selectActivity(card,{open=true}={}){
    if(!card) return;
    const data = cardData(card);
    selectedActivityId = data.id;

    all('#act120LiveList [data-activity-id]').forEach(item => {
      item.classList.toggle('ma260-selected',item.dataset.activityId === selectedActivityId);
    });

    const setText = (id,value) => {
      const node = byId(id);
      if(node) node.textContent = value;
    };

    setText('ma260SelectedTitle',data.title);
    setText('ma260SelectedDescription',data.description);
    setText('ma260SelectedStatus',data.status.replaceAll('_',' ').toUpperCase());
    setText('ma260SelectedProject',data.project);
    setText('ma260SelectedPriority',data.priority);
    setText('ma260SelectedSource',data.source);
    setText('ma260SelectedDue',data.due);
    setText('ma260SelectedDueState',data.dueState);
    setText('ma260SelectedReminders',data.reminders);
    setText('ma260ReviewSelected',data.title);
    if(byId('ma260SelectedNote')){
      byId('ma260SelectedNote').value = selectedNoteStore()[selectedActivityId] || '';
    }

    if(open) openPage('selected',{focus:true});
  }

  function proxySelectedAction(action){
    if(!selectedActivityId) return;
    const original = document.querySelector(
      `#supabaseActivityList [data-activity-id="${CSS.escape(selectedActivityId)}"] [data-activity-action="${CSS.escape(action)}"]`
    );
    original?.click();
    setTimeout(syncLiveView,40);
  }

  function selectReferenceDay(day){
    if(!day) return;
    all('.ma260-week-timeline .v172-timeline-day').forEach(item => {
      item.classList.toggle('act120-selected-day',item === day);
    });

    const title = day.dataset.act120Day || 'Selected day';
    const events = [...day.querySelectorAll('.v172-activity-block')];
    if(byId('act120SelectedDayTitle')) byId('act120SelectedDayTitle').textContent = title;
    if(byId('act120SelectedDaySummary')){
      byId('act120SelectedDaySummary').textContent = `${events.length} reference activit${events.length === 1 ? 'y' : 'ies'}`;
    }

    const holder = byId('act120SelectedDayList');
    if(!holder) return;
    if(!events.length){
      holder.innerHTML = '<div class="ma260-day-clear">No reference activity for this day.</div>';
      return;
    }

    holder.innerHTML = events.map(event => `
      <article>
        <time>${safe(normalise(event.querySelector('time')?.textContent) || '—')}</time>
        <div>
          <strong>${safe(normalise(event.querySelector('strong')?.textContent) || 'Activity')}</strong>
          <small>${safe(normalise(event.querySelector('small')?.textContent) || 'General')}</small>
        </div>
      </article>`).join('');
  }

  function setScheduleView(view){
    const allowed = ['week','month','agenda','live'];
    activeScheduleView = allowed.includes(view) ? view : 'week';

    all('#act120Tabs [data-v190-activity-view]').forEach(button => {
      const active = button.dataset.v190ActivityView === activeScheduleView;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });
    all('[data-v190-activity-panel]').forEach(panel => {
      panel.hidden = panel.dataset.v190ActivityPanel !== activeScheduleView;
      panel.classList.toggle('active',panel.dataset.v190ActivityPanel === activeScheduleView);
    });

    if(byId('act120TabSummary')){
      byId('act120TabSummary').textContent = {
        week:'Reference week',
        month:'Reference month',
        agenda:'Reference agenda',
        live:'Authenticated live queue'
      }[activeScheduleView];
    }
  }

  function reviewStore(){
    try{return JSON.parse(localStorage.getItem(REVIEW_KEY) || '{}')}catch(error){return {}}
  }

  function saveReview(){
    const key = localDateKey();
    const store = reviewStore();
    store[key] = {
      priority:byId('ma260CheckPriority')?.checked || false,
      evidence:byId('ma260CheckEvidence')?.checked || false,
      dependencies:byId('ma260CheckDependencies')?.checked || false,
      carry_forward:byId('ma260CheckCarryForward')?.checked || false,
      note:byId('ma260ReviewNote')?.value || '',
      selected_activity_id:selectedActivityId || null
    };
    try{localStorage.setItem(REVIEW_KEY,JSON.stringify(store))}catch(error){}
  }

  function loadReview(){
    const record = reviewStore()[localDateKey()] || {};
    if(byId('ma260CheckPriority')) byId('ma260CheckPriority').checked = Boolean(record.priority);
    if(byId('ma260CheckEvidence')) byId('ma260CheckEvidence').checked = Boolean(record.evidence);
    if(byId('ma260CheckDependencies')) byId('ma260CheckDependencies').checked = Boolean(record.dependencies);
    if(byId('ma260CheckCarryForward')) byId('ma260CheckCarryForward').checked = Boolean(record.carry_forward);
    if(byId('ma260ReviewNote')) byId('ma260ReviewNote').value = record.note || '';
  }

  function approvalStore(){
    try{return JSON.parse(localStorage.getItem(APPROVAL_KEY) || '{}')}catch(error){return {}}
  }

  function decisionValue(){
    return document.querySelector('input[name="ma260Decision"]:checked')?.value || '';
  }

  function renderSignature(name){
    const preview = byId('ma260SignaturePreview');
    if(!preview) return;
    const clean = normalise(name);
    preview.textContent = clean || 'Owner signature';
    preview.classList.toggle('sig243-placeholder',!clean);
    if(clean) preview.setAttribute('aria-label',`Signature: ${clean}`);
    else preview.removeAttribute('aria-label');
  }

  function renderApprovalRecord(record){
    const container = byId('ma260ApprovalRecord');
    if(!container) return;
    container.classList.remove('approved','returned','hold');

    if(!record){
      container.innerHTML = `
        <span class="section-kicker">CURRENT LOCAL RECORD</span>
        <strong>No daily approval has been recorded.</strong>
        <p>Complete the review, select a decision and sign the dossier.</p>`;
      return;
    }

    const className = record.decision.startsWith('APPROVED')
      ? 'approved'
      : record.decision === 'RETURN_FOR_REVIEW'
        ? 'returned'
        : 'hold';
    container.classList.add(className);
    container.innerHTML = `
      <span class="section-kicker">CURRENT LOCAL RECORD</span>
      <strong>${safe(record.decision.replaceAll('_',' '))} · ${safe(record.signer)}</strong>
      <p>${safe(record.date)} · ${safe(new Date(record.signed_at).toLocaleString('en-MY'))}${record.note ? ` · ${safe(record.note)}` : ''}</p>`;
  }

  function loadApproval(){
    const record = approvalStore()[localDateKey()] || null;
    all('input[name="ma260Decision"]').forEach(input => {
      input.checked = Boolean(record && input.value === record.decision);
    });
    if(byId('ma260ApprovalNote')) byId('ma260ApprovalNote').value = record?.note || '';
    if(byId('ma260ConfirmReview')) byId('ma260ConfirmReview').checked = Boolean(record?.confirmed_review);
    if(byId('ma260ConfirmAuthority')) byId('ma260ConfirmAuthority').checked = Boolean(record?.confirmed_authority);
    if(byId('ma260SignName')) byId('ma260SignName').value = record?.signer || '';
    renderSignature(record?.signer || '');
    if(byId('ma260SignTime')) byId('ma260SignTime').textContent = record?.signed_at
      ? new Date(record.signed_at).toLocaleString('en-MY')
      : 'Not signed';
    renderApprovalRecord(record);
  }

  function recordSignature(){
    const decision = decisionValue();
    const signer = normalise(byId('ma260SignName')?.value);
    const note = normalise(byId('ma260ApprovalNote')?.value);
    const confirmedReview = byId('ma260ConfirmReview')?.checked || false;
    const confirmedAuthority = byId('ma260ConfirmAuthority')?.checked || false;
    const error = byId('ma260SignError');

    const problems = [];
    if(!decision) problems.push('Select an approval decision.');
    if(!signer) problems.push('Type the owner or approver name.');
    if(!confirmedReview) problems.push('Confirm the daily activity review.');
    if(!confirmedAuthority) problems.push('Confirm approval authority.');

    if(problems.length){
      if(error) error.textContent = problems.join(' ');
      return;
    }
    if(error) error.textContent = '';

    const record = {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      date:localDateKey(),
      selected_activity_id:selectedActivityId || null,
      selected_activity_title:normalise(byId('ma260SelectedTitle')?.textContent) || null,
      due_today:normalise(byId('act120TodayMetric')?.textContent) || '0',
      overdue:normalise(byId('act120OverdueMetric')?.textContent) || '0',
      completed:normalise(byId('act120CompletedMetric')?.textContent) || '0',
      decision,
      note,
      signer,
      confirmed_review:confirmedReview,
      confirmed_authority:confirmedAuthority,
      signed_at:new Date().toISOString(),
      storage:'local-browser-draft',
      production_write:false
    };

    const store = approvalStore();
    store[record.date] = record;
    try{localStorage.setItem(APPROVAL_KEY,JSON.stringify(store))}catch(error){}
    loadApproval();
  }

  function clearApproval(){
    const store = approvalStore();
    delete store[localDateKey()];
    try{localStorage.setItem(APPROVAL_KEY,JSON.stringify(store))}catch(error){}

    all('input[name="ma260Decision"]').forEach(input => input.checked = false);
    if(byId('ma260ApprovalNote')) byId('ma260ApprovalNote').value = '';
    if(byId('ma260ConfirmReview')) byId('ma260ConfirmReview').checked = false;
    if(byId('ma260ConfirmAuthority')) byId('ma260ConfirmAuthority').checked = false;
    if(byId('ma260SignName')) byId('ma260SignName').value = '';
    renderSignature('');
    if(byId('ma260SignTime')) byId('ma260SignTime').textContent = 'Not signed';
    renderApprovalRecord(null);
  }

  function exportApproval(){
    const record = approvalStore()[localDateKey()] || {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      date:localDateKey(),
      decision:'NOT_RECORDED',
      production_write:false
    };
    const blob = new Blob([JSON.stringify(record,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `EKH_OS_Daily_Activity_Approval_${localDateKey()}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),0);
  }

  document.addEventListener('DOMContentLoaded',() => {
    openPage('brief');
    setScheduleView('week');
    loadReview();
    loadApproval();

    if(byId('ma260SignDate')){
      byId('ma260SignDate').textContent = new Date().toLocaleDateString('en-MY',{
        weekday:'long',day:'numeric',month:'long',year:'numeric'
      });
    }

    const defaultDay = document.querySelector('[data-act120-day="Friday, 31 July"]') ||
      document.querySelector('.ma260-week-timeline .v172-timeline-day');
    selectReferenceDay(defaultDay);

    const activitySource = byId('supabaseActivityList');
    const statusSource = byId('activityStatusTabs');
    const factSources = [
      'activityTodayStat','activityOverdueStat','activityUpcomingStat','activityCompletedStat',
      'activityOwnerLabel','activityRealtimeState','activityLastSync','activityBrowserPermission',
      'activityConnectionState','activityProjectFilter','activityPriorityFilter'
    ].map(byId).filter(Boolean);

    const observer = new MutationObserver(() => {
      syncFacts();
      syncLiveView();
    });
    if(activitySource) observer.observe(activitySource,{childList:true,subtree:true,characterData:true});
    if(statusSource) observer.observe(statusSource,{childList:true,subtree:true,attributes:true});
    factSources.forEach(node => observer.observe(node,{childList:true,subtree:true,characterData:true,attributes:true}));

    syncFacts();
    syncLiveView();

    byId('ma260PageTabs')?.addEventListener('click',event => {
      const button = event.target.closest('[data-ma260-page]');
      if(button) openPage(button.dataset.ma260Page,{focus:true});
    });

    document.addEventListener('click',event => {
      const open = event.target.closest('[data-ma260-open-page]');
      if(open) openPage(open.dataset.ma260OpenPage,{focus:true});

      const dot = event.target.closest('[data-ma260-dot]');
      if(dot) openPage(dot.dataset.ma260Dot,{focus:true});
    });

    byId('ma260PrevPage')?.addEventListener('click',() => move(-1));
    byId('ma260NextPage')?.addEventListener('click',() => move(1));

    document.querySelector('.ma260-summary-line')?.addEventListener('click',event => {
      const metric = event.target.closest('[data-act120-metric]');
      if(metric) proxyStatus(metric.dataset.act120Metric);
    });

    byId('act120StatusFilters')?.addEventListener('click',event => {
      const button = event.target.closest('[data-act120-status]');
      if(button) proxyStatus(button.dataset.act120Status);
    });

    byId('act120LiveSearch')?.addEventListener('input',event => {
      const hidden = byId('activitySearch');
      if(hidden){
        hidden.value = event.target.value || '';
        hidden.dispatchEvent(new Event('input',{bubbles:true}));
        setTimeout(syncLiveView,0);
      }
    });

    byId('act120ProjectFilter')?.addEventListener('change',event => {
      const hidden = byId('activityProjectFilter');
      if(hidden){
        hidden.value = event.target.value;
        hidden.dispatchEvent(new Event('change',{bubbles:true}));
        setTimeout(syncLiveView,0);
      }
    });

    byId('act120PriorityFilter')?.addEventListener('change',event => {
      const hidden = byId('activityPriorityFilter');
      if(hidden){
        hidden.value = event.target.value;
        hidden.dispatchEvent(new Event('change',{bubbles:true}));
        setTimeout(syncLiveView,0);
      }
    });

    byId('act120Refresh')?.addEventListener('click',() => byId('refreshSupabaseActivities')?.click());
    byId('ma260QueueRefresh')?.addEventListener('click',() => byId('refreshSupabaseActivities')?.click());
    byId('act120EnableAlerts')?.addEventListener('click',() => byId('enableActivityBrowserAlerts')?.click());

    byId('act120LiveList')?.addEventListener('click',event => {
      const action = event.target.closest('[data-activity-action]');
      if(action){
        const card = action.closest('[data-activity-id]');
        const original = document.querySelector(
          `#supabaseActivityList [data-activity-id="${CSS.escape(card?.dataset.activityId || '')}"] [data-activity-action="${CSS.escape(action.dataset.activityAction || '')}"]`
        );
        original?.click();
        return;
      }
      const card = event.target.closest('[data-activity-id]');
      if(card) selectActivity(card);
    });

    all('[data-ma260-activity-action]').forEach(button => {
      button.addEventListener('click',() => proxySelectedAction(button.dataset.ma260ActivityAction));
    });

    byId('ma260SelectedNote')?.addEventListener('input',saveSelectedNote);

    byId('act120Tabs')?.addEventListener('click',event => {
      const button = event.target.closest('[data-v190-activity-view]');
      if(button){
        setTimeout(() => setScheduleView(button.dataset.v190ActivityView),0);
      }
      if(event.target.closest('#act120HeroToggle')){
        byId('act120Tabs')?.classList.toggle('ma260-compact');
      }
    });

    document.querySelector('.ma260-week-timeline')?.addEventListener('click',event => {
      const day = event.target.closest('.v172-timeline-day');
      if(day) selectReferenceDay(day);
    });
    document.querySelector('.ma260-week-timeline')?.addEventListener('keydown',event => {
      const day = event.target.closest('.v172-timeline-day');
      if(day && ['Enter',' '].includes(event.key)){
        event.preventDefault();
        selectReferenceDay(day);
      }
    });
    byId('act120OpenLiveFromWeek')?.addEventListener('click',() => openPage('queue',{focus:true}));

    ['ma260CheckPriority','ma260CheckEvidence','ma260CheckDependencies','ma260CheckCarryForward']
      .forEach(id => byId(id)?.addEventListener('change',saveReview));
    byId('ma260ReviewNote')?.addEventListener('input',saveReview);

    byId('ma260SignName')?.addEventListener('input',event => renderSignature(event.target.value));
    byId('ma260SignButton')?.addEventListener('click',recordSignature);
    byId('ma260ClearSignature')?.addEventListener('click',clearApproval);
    byId('ma260ExportApproval')?.addEventListener('click',exportApproval);

    const viewport = byId('ma260DossierViewport');
    viewport?.addEventListener('touchstart',event => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    },{passive:true});
    viewport?.addEventListener('touchend',event => {
      if(touchStartX === null) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartX;
      const distance = endX - touchStartX;
      touchStartX = null;
      if(Math.abs(distance) < 52) return;
      move(distance < 0 ? 1 : -1);
    },{passive:true});

    document.addEventListener('keydown',event => {
      const activeView = document.querySelector('.page-content > .view.active');
      if(activeView?.id !== 'notifications') return;
      if(event.target.matches('input,textarea,select,[contenteditable="true"]')) return;

      if(event.key === '/'){
        event.preventDefault();
        openPage('queue',{focus:true});
        byId('act120LiveSearch')?.focus();
        return;
      }
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
        openPage('approval',{focus:true});
      }
    });
  });
})();

;

/* ---- ekh-v1270-system-control-readiness-dossier-runtime ---- */

(() => {
  'use strict';

  const PAGE_KEY = 'ekh_sys270_page_v1270';
  const DATA_KEY = 'ekh_sys270_data_v1270';
  const REPORT_KEY = 'ekh_system_report_tab_v121';
  const SETTINGS_KEY = 'ekh_system_settings_tab_v121';
  const APPROVAL_KEY = 'ekh_sys270_release_decision_v1270';

  const PAGES = [
    ['brief','System Brief'],
    ['runtime','Runtime Environment'],
    ['access','Access & Security'],
    ['data','Data & Storage'],
    ['readiness','Production Readiness'],
    ['approval','Release Decision']
  ];

  const aliases = {
    activity:{page:'access',legacy:'audit'},
    reports:{page:'data',legacy:'reports',data:'reports'},
    settings:{page:'data',legacy:'settings',data:'settings'},
    'production-readiness':{page:'readiness',legacy:'readiness'}
  };

  let pageIndex = 0;
  let dataMode = 'reports';
  let touchStartX = null;

  const byId = id => document.getElementById(id);
  const all = selector => [...document.querySelectorAll(selector)];
  const normalise = value => String(value || '').replace(/\s+/g,' ').trim();

  function safe(value){
    return String(value ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function updateTopbar(page){
    const values = {
      brief:['System','EKH OS / Control & Readiness Dossier'],
      runtime:['Runtime Environment','System / Services & Boundaries'],
      access:['Access & Security','System / Identity & Audit'],
      data:['Data & Storage','System / Reports & Configuration'],
      readiness:['Production Readiness','System / Runtime Regression Gate'],
      approval:['Release Decision','System / Owner Authority Record']
    }[page] || ['System','EKH OS'];
    if(byId('pageTitle')) byId('pageTitle').textContent = values[0];
    if(byId('pageEyebrow')) byId('pageEyebrow').textContent = values[1];
  }

  function updateSidebar(page,legacy){
    all('.nav-item[data-view]').forEach(item => {
      const view = item.dataset.view;
      const active =
        (page === 'brief' && view === 'system-overview') ||
        (page === 'runtime' && view === 'system-overview') ||
        (page === 'access' && view === 'activity') ||
        (page === 'data' && legacy === 'reports' && view === 'reports') ||
        (page === 'data' && legacy === 'settings' && view === 'settings') ||
        (page === 'readiness' && view === 'production-readiness') ||
        (page === 'approval' && view === 'system-overview');
      item.classList.toggle('active',active);
    });
  }

  function setLegacyPanel(mode){
    const allowed = ['overview','audit','reports','settings','readiness'];
    const target = allowed.includes(mode) ? mode : 'overview';

    all('[data-sys121-panel]').forEach(panel => {
      panel.hidden = panel.dataset.sys121Panel !== target;
      panel.classList.toggle('active',panel.dataset.sys121Panel === target);
    });
    all('[data-sys121-tab]').forEach(button => {
      const active = button.dataset.sys121Tab === target;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });

    if(byId('sys121TabSummary')){
      byId('sys121TabSummary').textContent = {
        overview:'Environment overview',
        audit:'Activity and audit trail',
        reports:'Operating intelligence',
        settings:'Workspace configuration',
        readiness:'Production readiness gate'
      }[target];
    }

    if(target === 'reports') setDataMode('reports');
    if(target === 'settings') setDataMode('settings');
    return target;
  }

  function currentLegacyForPage(page){
    if(page === 'runtime') return 'overview';
    if(page === 'access') return 'audit';
    if(page === 'readiness') return 'readiness';
    if(page === 'data') return dataMode;
    return 'overview';
  }

  function renderDots(){
    const dots = byId('sys270PageDots');
    if(!dots) return;
    dots.innerHTML = PAGES.map(([key,title],index) => `
      <button class="${index === pageIndex ? 'active' : ''}" data-sys270-dot="${key}"
        type="button" aria-label="Open ${safe(title)}"></button>`).join('');
  }

  function openPage(page,{focus=false,legacy=null}={}){
    const index = PAGES.findIndex(([key]) => key === page);
    pageIndex = index >= 0 ? index : 0;
    const [key,title] = PAGES[pageIndex];

    if(legacy) setLegacyPanel(legacy);
    else if(key === 'runtime') setLegacyPanel('overview');
    else if(key === 'access') setLegacyPanel('audit');
    else if(key === 'readiness') setLegacyPanel('readiness');
    else if(key === 'data') setLegacyPanel(dataMode);

    all('[data-sys270-panel]').forEach(panel => {
      const active = panel.dataset.sys270Panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
      panel.setAttribute('aria-hidden',String(!active));
    });

    all('[data-sys270-page]').forEach(button => {
      const active = button.dataset.sys270Page === key;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });

    if(byId('sys270PageCounter')) byId('sys270PageCounter').textContent = `Page ${pageIndex + 1} of ${PAGES.length}`;
    if(byId('sys270PageTitle')) byId('sys270PageTitle').textContent = title;
    if(byId('sys270PrevPage')) byId('sys270PrevPage').disabled = pageIndex === 0;
    if(byId('sys270NextPage')) byId('sys270NextPage').disabled = pageIndex === PAGES.length - 1;

    renderDots();
    updateTopbar(key);
    updateSidebar(key,currentLegacyForPage(key));
    try{localStorage.setItem(PAGE_KEY,key)}catch(error){}

    if(key === 'readiness') window.setTimeout(syncReadiness,30);

    if(focus){
      byId('sys270DossierViewport')?.scrollIntoView({
        behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'start'
      });
    }
  }

  function move(delta){
    const next = Math.max(0,Math.min(PAGES.length - 1,pageIndex + delta));
    openPage(PAGES[next][0],{focus:true});
  }

  function setDataMode(mode){
    dataMode = mode === 'settings' ? 'settings' : 'reports';
    all('[data-sys270-data]').forEach(button => {
      if(!button.dataset.sys270Data) return;
      button.classList.toggle('active',button.dataset.sys270Data === dataMode);
    });
    all('[data-sys270-data-panel]').forEach(panel => {
      panel.hidden = panel.dataset.sys270DataPanel !== dataMode;
    });
    try{localStorage.setItem(DATA_KEY,dataMode)}catch(error){}
  }

  function setReportTab(tab){
    const target = tab === 'intelligence' ? 'intelligence' : 'library';
    all('[data-sys121-report-tab]').forEach(button => {
      button.classList.toggle('active',button.dataset.sys121ReportTab === target);
    });
    all('[data-sys121-report-panel]').forEach(panel => {
      panel.hidden = panel.dataset.sys121ReportPanel !== target;
    });
    try{localStorage.setItem(REPORT_KEY,target)}catch(error){}
  }

  function setSettingsTab(tab){
    const allowed = ['appearance','notifications','activity-data'];
    const target = allowed.includes(tab) ? tab : 'appearance';
    all('[data-sys121-settings-tab]').forEach(button => {
      button.classList.toggle('active',button.dataset.sys121SettingsTab === target);
    });
    all('[data-sys121-settings-panel]').forEach(panel => {
      panel.hidden = panel.dataset.sys121SettingsPanel !== target;
    });
    try{localStorage.setItem(SETTINGS_KEY,target)}catch(error){}
  }

  function installShowViewRedirect(){
    if(typeof window.showView !== 'function') return;
    if(window.__EKH_SYS270_WRAPPED__) return;

    const original = window.showView;
    window.__EKH_SYS270_ORIGINAL_SHOW_VIEW__ = original;
    window.showView = function(id){
      const alias = aliases[id];
      if(alias){
        original('system-overview');
        if(alias.data) setDataMode(alias.data);
        openPage(alias.page,{legacy:alias.legacy});
        return;
      }
      original(id);
      if(id === 'system-overview'){
        openPage(localStorage.getItem(PAGE_KEY) || 'brief');
      }
    };
    window.__EKH_SYS270_WRAPPED__ = true;
  }

  function syncReadiness(){
    const gateStrong = byId('prg122GateStatus')?.querySelector('strong');
    const gateNote = byId('prg122GateStatus')?.querySelector('span');
    const localScore = normalise(byId('prg122LocalScore')?.textContent) || '0 / 12';
    const manualScore = normalise(byId('prg122ManualScore')?.textContent) || '0 / 9';
    const recommendation = normalise(byId('prg122Decision')?.textContent) || 'HOLD';
    const recommendationNote = normalise(byId('prg122DecisionNote')?.textContent) || 'Run diagnostics first';
    const gate = normalise(gateStrong?.textContent) || 'BLOCKED';
    const note = normalise(gateNote?.textContent) || 'Authorised evidence pending';

    if(byId('sys270SummaryGate')) byId('sys270SummaryGate').textContent = gate;
    if(byId('sys270SummaryGateNote')) byId('sys270SummaryGateNote').textContent = note;
    if(byId('sys270ApprovalGate')) byId('sys270ApprovalGate').textContent = gate;
    if(byId('sys270ApprovalGateNote')) byId('sys270ApprovalGateNote').textContent = note;
    if(byId('sys270ApprovalLocalScore')) byId('sys270ApprovalLocalScore').textContent = localScore;
    if(byId('sys270ApprovalManualScore')) byId('sys270ApprovalManualScore').textContent = manualScore;
    if(byId('sys270ApprovalRecommendation')) byId('sys270ApprovalRecommendation').textContent = recommendation;
    if(byId('sys270ApprovalRecommendationNote')) byId('sys270ApprovalRecommendationNote').textContent = recommendationNote;
  }

  function approvalStore(){
    try{return JSON.parse(localStorage.getItem(APPROVAL_KEY) || '{}')}catch(error){return {}}
  }

  function decisionValue(){
    return document.querySelector('input[name="sys270Decision"]:checked')?.value || '';
  }

  function renderSignature(name){
    const preview = byId('sys270SignaturePreview');
    if(!preview) return;
    const clean = normalise(name);
    preview.textContent = clean || 'Owner signature';
    preview.classList.toggle('sig243-placeholder',!clean);
    if(clean) preview.setAttribute('aria-label',`Signature: ${clean}`);
    else preview.removeAttribute('aria-label');
  }

  function renderApprovalRecord(record){
    const container = byId('sys270ApprovalRecord');
    if(!container) return;
    container.classList.remove('go','returned','hold');

    if(!record){
      container.innerHTML = `
        <span class="section-kicker">CURRENT LOCAL RECORD</span>
        <strong>No owner release decision has been recorded.</strong>
        <p>Review Page 05, select a decision and sign the dossier.</p>`;
      if(byId('sys270SummaryDecision')) byId('sys270SummaryDecision').textContent = 'HOLD';
      return;
    }

    const className = ['GO_REVIEW','CONDITIONAL_GO'].includes(record.decision)
      ? 'go'
      : record.decision === 'RETURN_FOR_REMEDIATION'
        ? 'returned'
        : 'hold';
    container.classList.add(className);
    container.innerHTML = `
      <span class="section-kicker">CURRENT LOCAL RECORD</span>
      <strong>${safe(record.decision.replaceAll('_',' '))} · ${safe(record.signer)}</strong>
      <p>${safe(new Date(record.signed_at).toLocaleString('en-MY'))} · Gate ${safe(record.readiness_gate)}${record.note ? ` · ${safe(record.note)}` : ''}</p>`;
    if(byId('sys270SummaryDecision')) byId('sys270SummaryDecision').textContent = record.decision.replaceAll('_',' ');
  }

  function loadApproval(){
    const record = approvalStore().current || null;
    all('input[name="sys270Decision"]').forEach(input => {
      input.checked = Boolean(record && input.value === record.decision);
    });
    if(byId('sys270ApprovalNote')) byId('sys270ApprovalNote').value = record?.note || '';
    if(byId('sys270ConfirmReadiness')) byId('sys270ConfirmReadiness').checked = Boolean(record?.confirmed_readiness);
    if(byId('sys270ConfirmNoDeploy')) byId('sys270ConfirmNoDeploy').checked = Boolean(record?.confirmed_no_deploy);
    if(byId('sys270ConfirmAuthority')) byId('sys270ConfirmAuthority').checked = Boolean(record?.confirmed_authority);
    if(byId('sys270SignName')) byId('sys270SignName').value = record?.signer || '';
    renderSignature(record?.signer || '');
    if(byId('sys270SignTime')) byId('sys270SignTime').textContent = record?.signed_at
      ? new Date(record.signed_at).toLocaleString('en-MY')
      : 'Not signed';
    renderApprovalRecord(record);
  }

  function recordDecision(){
    syncReadiness();
    const decision = decisionValue();
    const signer = normalise(byId('sys270SignName')?.value);
    const note = normalise(byId('sys270ApprovalNote')?.value);
    const confirmedReadiness = byId('sys270ConfirmReadiness')?.checked || false;
    const confirmedNoDeploy = byId('sys270ConfirmNoDeploy')?.checked || false;
    const confirmedAuthority = byId('sys270ConfirmAuthority')?.checked || false;
    const error = byId('sys270SignError');

    const problems = [];
    if(!decision) problems.push('Select an owner release decision.');
    if(!signer) problems.push('Type the owner or approver name.');
    if(!confirmedReadiness) problems.push('Confirm the readiness review.');
    if(!confirmedNoDeploy) problems.push('Confirm that this action does not deploy.');
    if(!confirmedAuthority) problems.push('Confirm release authority.');

    if(problems.length){
      if(error) error.textContent = problems.join(' ');
      return;
    }
    if(error) error.textContent = '';

    const record = {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      readiness_gate:normalise(byId('sys270ApprovalGate')?.textContent) || 'BLOCKED',
      local_score:normalise(byId('sys270ApprovalLocalScore')?.textContent) || '0 / 12',
      manual_score:normalise(byId('sys270ApprovalManualScore')?.textContent) || '0 / 9',
      system_recommendation:normalise(byId('sys270ApprovalRecommendation')?.textContent) || 'HOLD',
      decision,
      note,
      signer,
      confirmed_readiness:confirmedReadiness,
      confirmed_no_deploy:confirmedNoDeploy,
      confirmed_authority:confirmedAuthority,
      signed_at:new Date().toISOString(),
      storage:'local-browser-draft',
      deployment_executed:false,
      production_write:false
    };

    try{localStorage.setItem(APPROVAL_KEY,JSON.stringify({current:record}))}catch(error){}
    loadApproval();
  }

  function clearApproval(){
    try{localStorage.removeItem(APPROVAL_KEY)}catch(error){}
    all('input[name="sys270Decision"]').forEach(input => input.checked = false);
    if(byId('sys270ApprovalNote')) byId('sys270ApprovalNote').value = '';
    if(byId('sys270ConfirmReadiness')) byId('sys270ConfirmReadiness').checked = false;
    if(byId('sys270ConfirmNoDeploy')) byId('sys270ConfirmNoDeploy').checked = false;
    if(byId('sys270ConfirmAuthority')) byId('sys270ConfirmAuthority').checked = false;
    if(byId('sys270SignName')) byId('sys270SignName').value = '';
    renderSignature('');
    if(byId('sys270SignTime')) byId('sys270SignTime').textContent = 'Not signed';
    renderApprovalRecord(null);
  }

  function exportDecision(){
    const record = approvalStore().current || {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      decision:'NOT_RECORDED',
      deployment_executed:false,
      production_write:false
    };
    const blob = new Blob([JSON.stringify(record,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `EKH_OS_v1.30.2_Release_Decision_${new Date().toISOString().replaceAll(':','-')}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),0);
  }

  function redirectActiveAlias(){
    const active = all('.sys121-route-alias.active')[0];
    if(!active) return;
    const alias = aliases[active.id];
    if(!alias) return;
    const original = window.__EKH_SYS270_ORIGINAL_SHOW_VIEW__;
    if(typeof original === 'function') original('system-overview');
    if(alias.data) setDataMode(alias.data);
    openPage(alias.page,{legacy:alias.legacy});
  }

  function init(){
    installShowViewRedirect();
    dataMode = localStorage.getItem(DATA_KEY) === 'settings' ? 'settings' : 'reports';
    setDataMode(dataMode);
    setReportTab(localStorage.getItem(REPORT_KEY) || 'library');
    setSettingsTab(localStorage.getItem(SETTINGS_KEY) || 'appearance');
    setLegacyPanel('overview');
    openPage(byId('system-overview')?.classList.contains('active')
      ? (localStorage.getItem(PAGE_KEY) || 'brief')
      : 'brief');
    loadApproval();
    syncReadiness();

    byId('sys270PageTabs')?.addEventListener('click',event => {
      const button = event.target.closest('[data-sys270-page]');
      if(button) openPage(button.dataset.sys270Page,{focus:true});
    });

    document.addEventListener('click',event => {
      const open = event.target.closest('[data-sys270-open-page]');
      if(open) openPage(open.dataset.sys270OpenPage,{focus:true});
      const dot = event.target.closest('[data-sys270-dot]');
      if(dot) openPage(dot.dataset.sys270Dot,{focus:true});
    });

    byId('sys270PrevPage')?.addEventListener('click',() => move(-1));
    byId('sys270NextPage')?.addEventListener('click',() => move(1));

    byId('sys270DataIndex')?.addEventListener('click',event => {
      const button = event.target.closest('[data-sys270-data]');
      if(!button) return;
      setDataMode(button.dataset.sys270Data);
      setLegacyPanel(button.dataset.sys270Data);
    });

    byId('sys121ReportTabs')?.addEventListener('click',event => {
      const tab = event.target.closest('[data-sys121-report-tab]');
      if(tab) setReportTab(tab.dataset.sys121ReportTab);
    });

    byId('sys121SettingsTabs')?.addEventListener('click',event => {
      const tab = event.target.closest('[data-sys121-settings-tab]');
      if(tab) setSettingsTab(tab.dataset.sys121SettingsTab);
    });

    byId('sys270SignName')?.addEventListener('input',event => renderSignature(event.target.value));
    byId('sys270SignButton')?.addEventListener('click',recordDecision);
    byId('sys270ClearSignature')?.addEventListener('click',clearApproval);
    byId('sys270ExportDecision')?.addEventListener('click',exportDecision);

    const readinessTargets = [
      byId('prg122GateStatus'),byId('prg122LocalScore'),byId('prg122ManualScore'),
      byId('prg122Decision'),byId('prg122DecisionNote')
    ].filter(Boolean);
    const readinessObserver = new MutationObserver(syncReadiness);
    readinessTargets.forEach(node => readinessObserver.observe(node,{
      childList:true,subtree:true,characterData:true,attributes:true
    }));

    const aliasObserver = new MutationObserver(redirectActiveAlias);
    all('.sys121-route-alias').forEach(section => {
      aliasObserver.observe(section,{attributes:true,attributeFilter:['class']});
    });

    const viewport = byId('sys270DossierViewport');
    viewport?.addEventListener('touchstart',event => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    },{passive:true});
    viewport?.addEventListener('touchend',event => {
      if(touchStartX === null) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartX;
      const distance = endX - touchStartX;
      touchStartX = null;
      if(Math.abs(distance) < 52) return;
      move(distance < 0 ? 1 : -1);
    },{passive:true});

    document.addEventListener('keydown',event => {
      const activeView = document.querySelector('.page-content > .view.active');
      if(activeView?.id !== 'system-overview') return;
      if(event.target.matches('input,textarea,select,[contenteditable="true"]')) return;

      if(['ArrowRight','PageDown'].includes(event.key)){
        event.preventDefault();move(1);
      }
      if(['ArrowLeft','PageUp'].includes(event.key)){
        event.preventDefault();move(-1);
      }
      if(event.key === 'Home'){
        event.preventDefault();openPage('brief',{focus:true});
      }
      if(event.key === 'End'){
        event.preventDefault();openPage('approval',{focus:true});
      }
    });

    setTimeout(installShowViewRedirect,0);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

;

/* ---- ekh-v1282-task-detail-propagation-runtime ---- */

(() => {
  'use strict';

  const PAGES = [
    ['brief','Calendar Brief'],
    ['calendar','Weekly Calendar'],
    ['day','Selected Day'],
    ['task','Selected Task'],
    ['capacity','Capacity Review'],
    ['approval','Schedule Approval']
  ];

  const TASK_NOTE_KEY = 'ekh_tc282_task_notes_v1282';
  const CAPACITY_KEY = 'ekh_tc282_capacity_review_v1282';
  const APPROVAL_KEY = 'ekh_tc282_task_approval_v1282';
  const SELECTION_KEY = 'ekh_tc282_selected_task_v1282';

  let pageIndex = 0;
  let selectedDay = '2026-07-31';
  let selectedTaskId = 'tc280-07';
  let touchStartX = null;

  const byId = id => document.getElementById(id);
  const all = selector => [...document.querySelectorAll(selector)];
  const normalise = value => String(value || '').replace(/\s+/g,' ').trim();

  function safe(value){
    return String(value ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function taskElements(){
    return all('#tc280WeekCalendar .tc280-cal-event');
  }

  function dayElements(){
    return all('#tc280WeekCalendar .tc280-cal-day');
  }

  function taskData(task){
    return {
      id:task?.dataset.taskId || '',
      date:task?.dataset.taskDate || '',
      time:task?.dataset.taskTime || '',
      type:task?.dataset.taskType || '',
      title:task?.dataset.taskTitle || 'Task',
      project:task?.dataset.taskProject || 'General',
      status:task?.dataset.taskStatus || 'Planned',
      evidence:task?.dataset.taskEvidence || 'No evidence requirement recorded.',
      owner:task?.dataset.taskOwner || 'Owner not recorded'
    };
  }

  function selectedTaskElement(){
    return document.querySelector(
      `[data-task-id="${CSS.escape(selectedTaskId || '')}"]`
    );
  }

  function tasksForDay(date){
    return taskElements()
      .filter(task => task.dataset.taskDate === date)
      .sort((a,b) => (a.dataset.taskTime || '').localeCompare(b.dataset.taskTime || ''));
  }

  function dateLabel(date){
    return document.querySelector(
      `[data-tc280-day="${CSS.escape(date)}"]`
    )?.dataset.dayLabel || date;
  }

  function allMetrics(){
    const tasks = taskElements();
    const byDay = new Map();
    const exact = new Map();

    tasks.forEach(task => {
      const data = taskData(task);
      byDay.set(data.date,(byDay.get(data.date) || 0) + 1);
      const key = `${data.date}::${data.time}`;
      exact.set(key,(exact.get(key) || 0) + 1);
    });

    return {
      taskCount:tasks.length,
      highLoadDays:[...byDay.values()].filter(count => count >= 2).length,
      conflicts:[...exact.values()].reduce((sum,count) => sum + Math.max(0,count - 1),0),
      clearDays:dayElements().filter(day => tasksForDay(day.dataset.tc280Day).length === 0).length
    };
  }

  function selectedMetrics(data){
    const sameDayTasks = tasksForDay(data.date);
    const sameTimeTasks = sameDayTasks.filter(task => task.dataset.taskTime === data.time);
    return {
      sameDayCount:sameDayTasks.length,
      sameTimeOverlaps:Math.max(0,sameTimeTasks.length - 1),
      controlTasks:sameDayTasks.filter(task => ['review','approval'].includes(task.dataset.taskType)).length,
      posture:sameDayTasks.length >= 2 ? 'HIGH LOAD' : sameDayTasks.length === 1 ? 'CONTROLLED' : 'CLEAR'
    };
  }

  function renderDots(){
    const holder = byId('tc280PageDots');
    if(!holder) return;
    holder.innerHTML = PAGES.map(([key,title],index) => `
      <button class="${index === pageIndex ? 'active' : ''}"
        data-tc280-dot="${key}" type="button"
        aria-label="Open ${safe(title)}"></button>`).join('');
  }

  function openPage(page,{focus=false}={}){
    const index = PAGES.findIndex(([key]) => key === page);
    pageIndex = index >= 0 ? index : 0;
    const [key,title] = PAGES[pageIndex];

    all('[data-tc280-panel]').forEach(panel => {
      const active = panel.dataset.tc280Panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
      panel.setAttribute('aria-hidden',String(!active));
    });

    all('[data-tc280-page]').forEach(button => {
      const active = button.dataset.tc280Page === key;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });

    if(byId('tc280PageCounter')){
      byId('tc280PageCounter').textContent = `Page ${pageIndex + 1} of ${PAGES.length}`;
    }
    if(byId('tc280PageTitle')) byId('tc280PageTitle').textContent = title;
    if(byId('tc280PrevPage')) byId('tc280PrevPage').disabled = pageIndex === 0;
    if(byId('tc280NextPage')) byId('tc280NextPage').disabled = pageIndex === PAGES.length - 1;
    renderDots();

    if(focus){
      byId('tc280DossierViewport')?.scrollIntoView({
        behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'start'
      });
    }
  }

  function move(delta){
    const next = Math.max(0,Math.min(PAGES.length - 1,pageIndex + delta));
    openPage(PAGES[next][0],{focus:true});
  }

  function renderGlobalSummary(){
    const data = allMetrics();
    const mapping = {
      tc280SummaryTasks:data.taskCount,
      tc280SummaryLoadDays:data.highLoadDays,
      tc280SummaryConflicts:data.conflicts
    };
    Object.entries(mapping).forEach(([id,value]) => {
      if(byId(id)) byId(id).textContent = String(value);
    });
  }

  function taskNoteStore(){
    try{return JSON.parse(localStorage.getItem(TASK_NOTE_KEY) || '{}')}
    catch(error){return {}}
  }

  function saveTaskNote(){
    if(!selectedTaskId) return;
    const store = taskNoteStore();
    store[selectedTaskId] = byId('tc280TaskNote')?.value || '';
    try{localStorage.setItem(TASK_NOTE_KEY,JSON.stringify(store))}
    catch(error){}
  }

  function capacityStore(){
    try{return JSON.parse(localStorage.getItem(CAPACITY_KEY) || '{}')}
    catch(error){return {}}
  }

  function saveCapacity(){
    if(!selectedTaskId) return;
    const store = capacityStore();
    store[selectedTaskId] = {
      overlap:byId('tc280CheckOverlap')?.checked || false,
      load:byId('tc280CheckLoad')?.checked || false,
      evidence:byId('tc280CheckEvidence')?.checked || false,
      recovery:byId('tc280CheckRecovery')?.checked || false,
      note:byId('tc280CapacityNote')?.value || ''
    };
    try{localStorage.setItem(CAPACITY_KEY,JSON.stringify(store))}
    catch(error){}
  }

  function loadCapacity(){
    const record = selectedTaskId ? capacityStore()[selectedTaskId] || {} : {};
    if(byId('tc280CheckOverlap')) byId('tc280CheckOverlap').checked = Boolean(record.overlap);
    if(byId('tc280CheckLoad')) byId('tc280CheckLoad').checked = Boolean(record.load);
    if(byId('tc280CheckEvidence')) byId('tc280CheckEvidence').checked = Boolean(record.evidence);
    if(byId('tc280CheckRecovery')) byId('tc280CheckRecovery').checked = Boolean(record.recovery);
    if(byId('tc280CapacityNote')) byId('tc280CapacityNote').value = record.note || '';
  }

  function approvalStore(){
    try{return JSON.parse(localStorage.getItem(APPROVAL_KEY) || '{}')}
    catch(error){return {}}
  }

  function currentApproval(){
    const store = approvalStore();
    return selectedTaskId ? store.by_task?.[selectedTaskId] || null : null;
  }

  function decisionValue(){
    return document.querySelector('input[name="tc280Decision"]:checked')?.value || '';
  }

  function renderSignature(name){
    const preview = byId('tc280SignaturePreview');
    if(!preview) return;
    const clean = normalise(name);
    preview.textContent = clean || 'Owner signature';
    preview.classList.toggle('sig243-placeholder',!clean);
  }

  function renderApprovalRecord(record){
    const holder = byId('tc280ApprovalRecord');
    if(!holder) return;
    holder.classList.remove('approved','returned','hold');

    if(!record){
      holder.innerHTML = `
        <span class="section-kicker">CURRENT LOCAL RECORD</span>
        <strong>No approval has been recorded for this task.</strong>
        <p>Review the selected task, select a decision and sign the dossier.</p>`;
      if(byId('tc280SummaryDecision')) byId('tc280SummaryDecision').textContent = 'PENDING';
      return;
    }

    const className = record.decision.startsWith('APPROVED')
      ? 'approved'
      : record.decision === 'RETURN_FOR_RESCHEDULING'
        ? 'returned'
        : 'hold';

    holder.classList.add(className);
    holder.innerHTML = `
      <span class="section-kicker">CURRENT LOCAL RECORD</span>
      <strong>${safe(record.decision.replaceAll('_',' '))} · ${safe(record.signer)}</strong>
      <p>${safe(record.selected_task_title)} · ${safe(new Date(record.signed_at).toLocaleString('en-MY'))}${record.note ? ` · ${safe(record.note)}` : ''}</p>`;

    if(byId('tc280SummaryDecision')){
      byId('tc280SummaryDecision').textContent = record.decision.replaceAll('_',' ');
    }
  }

  function loadApproval(){
    const record = currentApproval();

    all('input[name="tc280Decision"]').forEach(input => {
      input.checked = Boolean(record && input.value === record.decision);
    });

    if(byId('tc280ApprovalNote')) byId('tc280ApprovalNote').value = record?.note || '';
    if(byId('tc280ConfirmCapacity')) byId('tc280ConfirmCapacity').checked = Boolean(record?.confirmed_capacity);
    if(byId('tc280ConfirmReference')) byId('tc280ConfirmReference').checked = Boolean(record?.confirmed_reference);
    if(byId('tc280ConfirmAuthority')) byId('tc280ConfirmAuthority').checked = Boolean(record?.confirmed_authority);
    if(byId('tc280SignName')) byId('tc280SignName').value = record?.signer || '';

    renderSignature(record?.signer || '');

    if(byId('tc280SignTime')){
      byId('tc280SignTime').textContent = record?.signed_at
        ? new Date(record.signed_at).toLocaleString('en-MY')
        : 'Not signed';
    }

    renderApprovalRecord(record);
  }

  function syncCapacityPage(data){
    const metrics = selectedMetrics(data);

    if(byId('tc282CapacityHeading')){
      byId('tc282CapacityHeading').textContent = `Review capacity for ${data.title}.`;
    }
    if(byId('tc282CapacitySummary')){
      byId('tc282CapacitySummary').textContent =
        `${dateLabel(data.date)} · ${data.time} · ${data.project}. This day contains ${metrics.sameDayCount} scheduled task${metrics.sameDayCount === 1 ? '' : 's'} and ${metrics.sameTimeOverlaps} exact same-time overlap${metrics.sameTimeOverlaps === 1 ? '' : 's'}. Evidence: ${data.evidence}.`;
    }
    if(byId('tc282CapacityStamp')){
      byId('tc282CapacityStamp').textContent = metrics.posture;
    }

    const values = {
      tc280CapacityTasks:data.title,
      tc280CapacityLoadDays:String(metrics.sameDayCount),
      tc280CapacityConflicts:String(metrics.sameTimeOverlaps),
      tc280CapacityClearDays:metrics.posture
    };
    Object.entries(values).forEach(([id,value]) => {
      if(byId(id)) byId(id).textContent = value;
    });

    if(byId('tc282CapacityCardOneLabel')) byId('tc282CapacityCardOneLabel').textContent = 'SELECTED TASK';
    if(byId('tc282CapacityCardOneNote')) byId('tc282CapacityCardOneNote').textContent = data.project;
    if(byId('tc282CapacityCardTwoLabel')) byId('tc282CapacityCardTwoLabel').textContent = 'SAME-DAY TASKS';
    if(byId('tc282CapacityCardTwoNote')) byId('tc282CapacityCardTwoNote').textContent = dateLabel(data.date);
    if(byId('tc282CapacityCardThreeLabel')) byId('tc282CapacityCardThreeLabel').textContent = 'SAME-TIME OVERLAPS';
    if(byId('tc282CapacityCardThreeNote')) byId('tc282CapacityCardThreeNote').textContent = data.time;
    if(byId('tc282CapacityCardFourLabel')) byId('tc282CapacityCardFourLabel').textContent = 'DAY POSTURE';
    if(byId('tc282CapacityCardFourNote')) byId('tc282CapacityCardFourNote').textContent = `${metrics.controlTasks} review / approval task${metrics.controlTasks === 1 ? '' : 's'}`;

    const overlapText = metrics.sameTimeOverlaps
      ? `${metrics.sameTimeOverlaps} exact overlap detected for ${data.time}.`
      : `No other task shares ${data.time} on ${dateLabel(data.date)}.`;

    if(byId('tc282OverlapHelp')) byId('tc282OverlapHelp').textContent = overlapText;
    if(byId('tc282LoadHelp')){
      byId('tc282LoadHelp').textContent =
        `${dateLabel(data.date)} contains ${metrics.sameDayCount} scheduled task${metrics.sameDayCount === 1 ? '' : 's'}.`;
    }
    if(byId('tc282EvidenceHelp')){
      byId('tc282EvidenceHelp').textContent = `Required evidence: ${data.evidence}.`;
    }
    if(byId('tc282RecoveryHelp')){
      byId('tc282RecoveryHelp').textContent =
        metrics.sameDayCount >= 2
          ? 'Confirm that the remaining day capacity is sufficient.'
          : 'The selected day retains scheduling space.';
    }
  }

  function syncApprovalPage(data){
    const metrics = selectedMetrics(data);

    if(byId('tc282ApprovalHeading')){
      byId('tc282ApprovalHeading').textContent = `Approve ${data.title} within the weekly schedule.`;
    }
    if(byId('tc282ApprovalSummary')){
      byId('tc282ApprovalSummary').textContent =
        `${dateLabel(data.date)} · ${data.time} · ${data.project} · ${data.status}. This local decision does not update Supabase Activities.`;
    }

    const values = {
      tc282ApprovalTask:data.title,
      tc280ApprovalTasks:`${dateLabel(data.date)} · ${data.time}`,
      tc280ApprovalLoadDays:data.owner,
      tc280ApprovalConflicts:String(metrics.sameTimeOverlaps)
    };
    Object.entries(values).forEach(([id,value]) => {
      if(byId(id)) byId(id).textContent = value;
    });

    if(byId('tc282ApprovalCardOneLabel')) byId('tc282ApprovalCardOneLabel').textContent = 'SELECTED TASK';
    if(byId('tc282ApprovalCardOneNote')) byId('tc282ApprovalCardOneNote').textContent = data.project;
    if(byId('tc282ApprovalCardTwoLabel')) byId('tc282ApprovalCardTwoLabel').textContent = 'DATE & TIME';
    if(byId('tc282ApprovalCardTwoNote')) byId('tc282ApprovalCardTwoNote').textContent = data.status;
    if(byId('tc282ApprovalCardThreeLabel')) byId('tc282ApprovalCardThreeLabel').textContent = 'OWNER / REVIEWER';
    if(byId('tc282ApprovalCardThreeNote')) byId('tc282ApprovalCardThreeNote').textContent = data.evidence;
    if(byId('tc282ApprovalCardFourLabel')) byId('tc282ApprovalCardFourLabel').textContent = 'SAME-TIME OVERLAPS';
    if(byId('tc282ApprovalCardFourNote')) byId('tc282ApprovalCardFourNote').textContent =
      metrics.sameTimeOverlaps ? 'Requires conflict review' : 'No detected overlap';
  }

  function syncSelectedTask(data){
    const values = {
      tc280SelectedTaskTitle:data.title,
      tc280SelectedTaskDescription:`${data.status} task for ${data.project}. Review the named evidence before the next action.`,
      tc280SelectedTaskStatus:data.status.toUpperCase(),
      tc280TaskDate:dateLabel(data.date),
      tc280TaskTime:data.time,
      tc280TaskProject:data.project,
      tc280TaskOwner:data.owner,
      tc280TaskType:data.status,
      tc280TaskEvidence:data.evidence
    };

    Object.entries(values).forEach(([id,value]) => {
      if(byId(id)) byId(id).textContent = value;
    });

    syncCapacityPage(data);
    syncApprovalPage(data);

    if(byId('tc280TaskNote')){
      byId('tc280TaskNote').value = taskNoteStore()[selectedTaskId] || '';
    }

    loadCapacity();
    loadApproval();

    try{localStorage.setItem(SELECTION_KEY,data.id)}
    catch(error){}
  }

  function selectTask(task){
    if(!task) return;
    const data = taskData(task);

    selectedTaskId = data.id;
    selectedDay = data.date;

    taskElements().forEach(item => {
      item.classList.toggle('tc280-selected-task',item === task);
    });

    syncSelectedTask(data);
    renderSelectedDay(data.date);
  }

  function renderSelectedDay(date,{open=false}={}){
    selectedDay = date;
    const tasks = tasksForDay(date);
    const selected = tasks.find(task => task.dataset.taskId === selectedTaskId);

    dayElements().forEach(day => {
      day.classList.toggle('tc280-selected-day',day.dataset.tc280Day === date);
    });

    if(byId('tc280SelectedDayTitle')) byId('tc280SelectedDayTitle').textContent = dateLabel(date);
    if(byId('tc280SelectedDaySummary')){
      byId('tc280SelectedDaySummary').textContent = tasks.length
        ? `${tasks.length} scheduled record${tasks.length === 1 ? '' : 's'}.${selected ? ` Selected: ${selected.dataset.taskTitle}.` : ''}`
        : 'No task is scheduled. This day remains available for recovery or delayed work.';
    }
    if(byId('tc280SelectedDayStamp')){
      byId('tc280SelectedDayStamp').textContent = `${tasks.length} TASK${tasks.length === 1 ? '' : 'S'}`;
    }

    const holder = byId('tc280SelectedDayList');
    if(holder){
      holder.innerHTML = !tasks.length
        ? `<div class="tc280-day-empty"><strong>No scheduled task</strong><p>Keep this day clear or add a task through the authenticated activity form.</p></div>`
        : tasks.map(task => {
            const data = taskData(task);
            const active = data.id === selectedTaskId;
            return `
              <button class="tc280-day-task ${active ? 'active' : ''}"
                data-task-id="${safe(data.id)}" type="button">
                <time>${safe(data.time)}</time>
                <span>
                  <small>${safe(data.status)} · ${safe(data.project)}</small>
                  <strong>${safe(data.title)}</strong>
                  <p>${safe(data.evidence)}</p>
                </span>
                <em>${active ? 'SELECTED' : 'OPEN'}</em>
              </button>`;
          }).join('');
    }

    const first = tasks[0] ? taskData(tasks[0]).time : 'CLEAR';
    const last = tasks.at(-1) ? taskData(tasks.at(-1)).time : 'CLEAR';
    const controlCount = tasks.filter(task => ['review','approval'].includes(task.dataset.taskType)).length;

    if(byId('tc280DayFirstTime')) byId('tc280DayFirstTime').textContent = first;
    if(byId('tc280DayLastTime')) byId('tc280DayLastTime').textContent = last;
    if(byId('tc280DayControlCount')) byId('tc280DayControlCount').textContent = String(controlCount);
    if(byId('tc280DayCapacity')){
      byId('tc280DayCapacity').textContent =
        tasks.length >= 2 ? 'HIGH LOAD' : tasks.length === 1 ? 'CONTROLLED' : 'CLEAR';
    }

    if(open) openPage('day',{focus:true});
  }

  function recordApproval(){
    const selected = taskData(selectedTaskElement());
    const taskMetrics = selectedMetrics(selected);
    const decision = decisionValue();
    const signer = normalise(byId('tc280SignName')?.value);
    const note = normalise(byId('tc280ApprovalNote')?.value);
    const confirmedCapacity = byId('tc280ConfirmCapacity')?.checked || false;
    const confirmedReference = byId('tc280ConfirmReference')?.checked || false;
    const confirmedAuthority = byId('tc280ConfirmAuthority')?.checked || false;
    const error = byId('tc280SignError');

    const problems = [];
    if(!selected.id) problems.push('Select one calendar task.');
    if(!decision) problems.push('Select an owner decision.');
    if(!signer) problems.push('Type the owner or approver name.');
    if(!confirmedCapacity) problems.push('Confirm the capacity review.');
    if(!confirmedReference) problems.push('Confirm the reference-schedule boundary.');
    if(!confirmedAuthority) problems.push('Confirm approval authority.');

    if(problems.length){
      if(error) error.textContent = problems.join(' ');
      return;
    }
    if(error) error.textContent = '';

    const record = {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      selected_task_id:selected.id,
      selected_task_title:selected.title,
      selected_task_date:selected.date,
      selected_task_date_label:dateLabel(selected.date),
      selected_task_time:selected.time,
      selected_task_project:selected.project,
      selected_task_status:selected.status,
      selected_task_owner:selected.owner,
      selected_task_evidence:selected.evidence,
      selected_day_task_count:taskMetrics.sameDayCount,
      selected_task_same_time_overlaps:taskMetrics.sameTimeOverlaps,
      decision,
      note,
      signer,
      confirmed_capacity:confirmedCapacity,
      confirmed_reference:confirmedReference,
      confirmed_authority:confirmedAuthority,
      signed_at:new Date().toISOString(),
      storage:'local-browser-draft',
      supabase_activity_write:false,
      production_write:false
    };

    const store = approvalStore();
    store.by_task = store.by_task || {};
    store.by_task[selected.id] = record;
    try{localStorage.setItem(APPROVAL_KEY,JSON.stringify(store))}
    catch(error){}

    loadApproval();
  }

  function clearApproval(){
    if(selectedTaskId){
      const store = approvalStore();
      if(store.by_task) delete store.by_task[selectedTaskId];
      try{localStorage.setItem(APPROVAL_KEY,JSON.stringify(store))}
      catch(error){}
    }

    all('input[name="tc280Decision"]').forEach(input => input.checked = false);
    if(byId('tc280ApprovalNote')) byId('tc280ApprovalNote').value = '';
    if(byId('tc280ConfirmCapacity')) byId('tc280ConfirmCapacity').checked = false;
    if(byId('tc280ConfirmReference')) byId('tc280ConfirmReference').checked = false;
    if(byId('tc280ConfirmAuthority')) byId('tc280ConfirmAuthority').checked = false;
    if(byId('tc280SignName')) byId('tc280SignName').value = '';
    renderSignature('');
    if(byId('tc280SignTime')) byId('tc280SignTime').textContent = 'Not signed';
    renderApprovalRecord(null);
  }

  function exportApproval(){
    const selected = taskData(selectedTaskElement());
    const record = currentApproval() || {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      selected_task_id:selected.id || null,
      selected_task_title:selected.title || null,
      decision:'NOT_RECORDED',
      supabase_activity_write:false,
      production_write:false
    };

    const blob = new Blob([JSON.stringify(record,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `EKH_OS_Task_Approval_${selected.id || 'NO_TASK'}_${new Date().toISOString().replaceAll(':','-')}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),0);
  }

  function periodUnavailable(direction){
    const note = byId('tc280PeriodNote');
    if(!note) return;
    note.textContent = `${direction} week is not loaded. This release contains only 27 July – 2 August 2026.`;
  }

  function init(){
    renderGlobalSummary();

    const storedSelection = localStorage.getItem(SELECTION_KEY);
    const initialTask =
      (storedSelection && document.querySelector(`[data-task-id="${CSS.escape(storedSelection)}"]`))
      || document.querySelector(`[data-task-id="${CSS.escape(selectedTaskId)}"]`)
      || taskElements()[0];

    if(initialTask){
      selectTask(initialTask);
    }

    openPage('brief');

    byId('tc280PageTabs')?.addEventListener('click',event => {
      const button = event.target.closest('[data-tc280-page]');
      if(button) openPage(button.dataset.tc280Page,{focus:true});
    });

    document.addEventListener('click',event => {
      const open = event.target.closest('[data-tc280-open-page]');
      if(open) openPage(open.dataset.tc280OpenPage,{focus:true});

      const dot = event.target.closest('[data-tc280-dot]');
      if(dot) openPage(dot.dataset.tc280Dot,{focus:true});
    });

    byId('tc280PrevPage')?.addEventListener('click',() => move(-1));
    byId('tc280NextPage')?.addEventListener('click',() => move(1));

    byId('tc280TodayButton')?.addEventListener('click',() => {
      const todayTask = document.querySelector('[data-task-date="2026-07-31"]');
      if(todayTask) selectTask(todayTask);
      renderSelectedDay('2026-07-31',{open:true});
    });

    byId('tc280PreviousWeek')?.addEventListener('click',() => periodUnavailable('Previous'));
    byId('tc280NextWeek')?.addEventListener('click',() => periodUnavailable('Next'));

    byId('tc280WeekCalendar')?.addEventListener('click',event => {
      const task = event.target.closest('.tc280-cal-event');
      if(task){
        selectTask(task);
        openPage('day',{focus:true});
        return;
      }

      const day = event.target.closest('.tc280-cal-day');
      if(day){
        const tasks = tasksForDay(day.dataset.tc280Day);
        if(tasks[0]) selectTask(tasks[0]);
        renderSelectedDay(day.dataset.tc280Day,{open:true});
      }
    });

    byId('tc280SelectedDayList')?.addEventListener('click',event => {
      const row = event.target.closest('[data-task-id]');
      if(!row) return;
      const task = document.querySelector(`[data-task-id="${CSS.escape(row.dataset.taskId)}"]`);
      if(task){
        selectTask(task);
        openPage('task',{focus:true});
      }
    });

    byId('tc280AddRelatedTask')?.addEventListener('click',() => {
      byId('openSupabaseActivityModalFromCalendar')?.click();
    });

    byId('tc280TaskNote')?.addEventListener('input',saveTaskNote);

    ['tc280CheckOverlap','tc280CheckLoad','tc280CheckEvidence','tc280CheckRecovery']
      .forEach(id => byId(id)?.addEventListener('change',saveCapacity));

    byId('tc280CapacityNote')?.addEventListener('input',saveCapacity);
    byId('tc280SignName')?.addEventListener('input',event => renderSignature(event.target.value));
    byId('tc280SignButton')?.addEventListener('click',recordApproval);
    byId('tc280ClearSignature')?.addEventListener('click',clearApproval);
    byId('tc280ExportApproval')?.addEventListener('click',exportApproval);

    const viewport = byId('tc280DossierViewport');
    viewport?.addEventListener('touchstart',event => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    },{passive:true});

    viewport?.addEventListener('touchend',event => {
      if(touchStartX === null) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartX;
      const distance = endX - touchStartX;
      touchStartX = null;
      if(Math.abs(distance) < 52) return;
      move(distance < 0 ? 1 : -1);
    },{passive:true});

    document.addEventListener('keydown',event => {
      const activeView = document.querySelector('.page-content > .view.active');
      if(activeView?.id !== 'tasks') return;
      if(event.target.matches('input,textarea,select,[contenteditable="true"]')) return;

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
        openPage('approval',{focus:true});
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();

;

/* ---- ekh-v1293-clean-advisory-magazine-runtime ---- */

(() => {
  'use strict';

  const PAGES = [
    ['brief','Decision Brief'],
    ['rooms','Room Index'],
    ['file','Decision File'],
    ['evidence','Evidence & Options'],
    ['authority','Authority Review'],
    ['approval','Owner Decision']
  ];

  const ROOM_KEY = 'ekh_dr290_selected_room_v1290';
  const FILE_NOTE_KEY = 'ekh_dr290_file_notes_v1290';
  const AUTHORITY_KEY = 'ekh_dr292_advisory_perspectives_v1292';
  const DECISION_KEY = 'ekh_dr292_owner_decisions_v1292';

  const ROOMS = {
    manpower:{
      key:'manpower',
      short:'MANPOWER',
      title:'Manpower Planning: Go / No-Go',
      question:'Should EKH proceed with a controlled parallel-track manpower plan subject to budget and role-count pre-gates?',
      status:'Decision reached',
      method:'RAPID Roles & Commitment',
      session:'Session 2',
      owner:'Azuar Fahmi',
      participants:5,
      recommendation:'GO — with pre-gate controls',
      recommendation_short:'GO',
      recommendation_condition:'With pre-gate controls',
      review:'31 July 2026',
      summary:'Budget validation and final role-count reconciliation remain mandatory before execution.',
      evidence:[
        ['EVIDENCE 01','Role-count reconciliation','The final headcount and accountable workstream owners must be confirmed.'],
        ['EVIDENCE 02','Budget waterfall','Contractor or staffing commitments require a named cost gate and approved funding range.'],
        ['EVIDENCE 03','Operational dependency map','Technical, education and operations staffing dependencies must be sequenced.']
      ],
      options:[
        ['OPTION A','GO — controlled parallel track','Proceed with planning while blocking commitment until the named pre-gates pass.','recommended'],
        ['OPTION B','HOLD — complete all gates first','Delay all staffing movement until cost and role count are fully reconciled.','hold'],
        ['OPTION C','NO-GO — freeze expansion','Retain the current structure and cancel the expansion pathway.','']
      ],
      conditions:[
        'Finance validation before contractor commitment.',
        'Final role-count reconciliation.',
        'Mandatory owner assignment for every workstream.'
      ],
      authority:[
        ['Recommend','Mia','COO','Frame the operating recommendation and coordinate the handoff.','recommend'],
        ['Agree','Paula','Market Research','Confirm that staffing demand is supported by product and market priorities.','agree'],
        ['Input','Candice','Technical Director','Provide technical capacity, dependency and staffing input.',''],
        ['Perform','Reo','Education Director','Execute the approved education staffing and audit allocation.',''],
        ['Decide','Azuar Fahmi','Founder / CEO','Record the final manpower decision and its conditions.','decide']
      ]
    },
    release:{
      key:'release',
      short:'SA RELEASE',
      title:'Smart Adventure Release Gate',
      question:'Does the current runtime, education and database evidence support a controlled production release review?',
      status:'In review',
      method:'Pre-mortem & Release Gate',
      session:'Session 1',
      owner:'Azuar Fahmi',
      participants:6,
      recommendation:'HOLD — authorised live evidence pending',
      recommendation_short:'HOLD',
      recommendation_condition:'Runtime and deployment evidence pending',
      review:'Next authorised runtime',
      summary:'Static packages exist, but authorised runtime, manifest, rollback and deployment evidence remain required.',
      evidence:[
        ['EVIDENCE 01','Education-approved question package','Reo and Alya must confirm the approved final bank and Question_ID integrity.'],
        ['EVIDENCE 02','Runtime regression package','Kyo must provide authenticated evidence for binding, scoring, persistence and routing.'],
        ['EVIDENCE 03','Database preflight and rollback','Baran must confirm manifest, backup, restore, permissions and transaction safety.']
      ],
      options:[
        ['OPTION A','HOLD — complete live evidence','Keep release blocked until every authorised runtime and database gate passes.','recommended'],
        ['OPTION B','CONDITIONAL REVIEW','Allow a controlled review only after named blockers are cleared; no production import.','hold'],
        ['OPTION C','GO NOW','Proceed despite incomplete evidence. This option is not supported by the current record.','']
      ],
      conditions:[
        'Approved final 7,000-question manifest.',
        'Authenticated runtime regression PASS evidence.',
        'Backup, restore, rollback and deployment verification.'
      ],
      authority:[
        ['Recommend','Reo','Education Director','Recommend release only after the education package is approved.','recommend'],
        ['Agree','Baran','DBA / DevOps','Agree only after database safety and rollback gates pass.','agree'],
        ['Input','Alya','Question Bank QA','Confirm Question_ID integrity and audit completion.',''],
        ['Perform','Jeff','Application Lead','Prepare and execute the controlled staging integration.',''],
        ['Input','Kyo','Runtime QA','Provide runtime regression and release-risk evidence.',''],
        ['Decide','Azuar Fahmi','Founder / CEO','Record HOLD or controlled release-review authority.','decide']
      ]
    },
    pricing:{
      key:'pricing',
      short:'CP PRICING',
      title:'Cuddle Paws Pricing Review',
      question:'Should the introductory RM10.90 price remain limited to the first 50 buyers before a staged increase?',
      status:'Open',
      method:'Decision Framing',
      session:'Session 1',
      owner:'Azuar Fahmi',
      participants:4,
      recommendation:'APPROVE — RM10.90 for first 50 buyers',
      recommendation_short:'APPROVE',
      recommendation_condition:'Then increase in controlled stages',
      review:'After first-50 quota',
      summary:'The introductory price is intended to attract early buyers while preserving a clear staged-increase rule.',
      evidence:[
        ['EVIDENCE 01','Introductory-offer boundary','RM10.90 is limited to the first 50 buyers, not positioned as the permanent price.'],
        ['EVIDENCE 02','Product completeness','Three digital volumes and 33 colouring illustrations are complete.'],
        ['EVIDENCE 03','Next-price sequence','The next controlled stage can move to RM13.90 before a later stable range.']
      ],
      options:[
        ['OPTION A','APPROVE staged pricing','Keep RM10.90 for the first 50 buyers, then move to the next declared stage.','recommended'],
        ['OPTION B','Keep RM10.90 indefinitely','Maximise affordability but remove urgency and reduce pricing flexibility.',''],
        ['OPTION C','Raise price immediately','Increase before the first-50 acquisition objective is completed.','hold']
      ],
      conditions:[
        'Display “digital product only” clearly.',
        'Track the first-50 quota accurately.',
        'Announce each increase before the next stage opens.'
      ],
      authority:[
        ['Recommend','Paula','Market Research','Recommend price sequence using market and buyer-response evidence.','recommend'],
        ['Input','Mario','Marketing Lead','Provide campaign, offer and conversion input.',''],
        ['Perform','Mia','COO','Track quota, publication control and the next pricing stage.',''],
        ['Decide','Azuar Fahmi','Founder / CEO','Approve the introductory price and staged increase rule.','decide']
      ]
    }
  };

  const PERSPECTIVE_STATUSES = [
    ['SUPPORT','Support'],
    ['SUPPORT_WITH_CONDITIONS','Support with conditions'],
    ['CONCERN','Concern'],
    ['BLOCKED','Blocked'],
    ['NO_INPUT','No input recorded'],
    ['NOT_APPLICABLE','Not applicable']
  ];

  function advisorKey(item){
    return String(item?.[1] || 'advisor')
      .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  function defaultPerspectiveStatus(item){
    if(item?.[0] === 'Recommend') return 'SUPPORT_WITH_CONDITIONS';
    if(item?.[0] === 'Agree') return 'CONCERN';
    if(item?.[0] === 'Perform') return 'SUPPORT_WITH_CONDITIONS';
    return 'NO_INPUT';
  }

  function defaultPerspective(item){
    return {
      name:item?.[1] || 'Advisor',
      advisory_function:item?.[0] || 'Input',
      domain:item?.[2] || 'Advisory role',
      status:defaultPerspectiveStatus(item),
      reasoning:item?.[3] || '',
      required_evidence:'',
      recommendation:'',
      source_reference:'',
      entered_by:'Azuar Fahmi',
      entry_type:'owner-recorded-advisory-perspective',
      live_staff_submission:false
    };
  }

  function perspectiveClass(status){
    if(status === 'SUPPORT') return 'support';
    if(status === 'SUPPORT_WITH_CONDITIONS' || status === 'CONCERN') return 'caution';
    if(status === 'BLOCKED') return 'blocked';
    return 'neutral';
  }

  let pageIndex = 0;
  let selectedRoom = 'manpower';
  let touchStartX = null;
  let advisoryIndex = 0;
  let advisoryTouchStartX = null;

  const byId = id => document.getElementById(id);
  const all = selector => [...document.querySelectorAll(selector)];
  const normalise = value => String(value || '').replace(/\s+/g,' ').trim();

  function safe(value){
    return String(value ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function room(){
    return ROOMS[selectedRoom] || ROOMS.manpower;
  }

  function renderDots(){
    const holder = byId('dr290PageDots');
    if(!holder) return;
    holder.innerHTML = PAGES.map(([key,title],index) => `
      <button class="${index === pageIndex ? 'active' : ''}"
        data-dr290-dot="${key}" type="button"
        aria-label="Open ${safe(title)}"></button>`).join('');
  }

  function openPage(page,{focus=false}={}){
    const index = PAGES.findIndex(([key]) => key === page);
    pageIndex = index >= 0 ? index : 0;
    const [key,title] = PAGES[pageIndex];

    all('[data-dr290-panel]').forEach(panel => {
      const active = panel.dataset.dr290Panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
      panel.setAttribute('aria-hidden',String(!active));
    });

    all('[data-dr290-page]').forEach(button => {
      const active = button.dataset.dr290Page === key;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });

    if(byId('dr290PageCounter')){
      byId('dr290PageCounter').textContent = `Page ${pageIndex + 1} of ${PAGES.length}`;
    }
    if(byId('dr290PageTitle')) byId('dr290PageTitle').textContent = title;
    if(byId('dr290PrevPage')) byId('dr290PrevPage').disabled = pageIndex === 0;
    if(byId('dr290NextPage')) byId('dr290NextPage').disabled = pageIndex === PAGES.length - 1;
    renderDots();

    if(focus){
      byId('dr290DossierViewport')?.scrollIntoView({
        behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'start'
      });
    }
  }

  function move(delta){
    const next = Math.max(0,Math.min(PAGES.length - 1,pageIndex + delta));
    openPage(PAGES[next][0],{focus:true});
  }

  function fileNotes(){
    try{return JSON.parse(localStorage.getItem(FILE_NOTE_KEY) || '{}')}
    catch(error){return {}}
  }

  function saveFileNote(){
    const store = fileNotes();
    store[selectedRoom] = byId('dr290FileNote')?.value || '';
    try{localStorage.setItem(FILE_NOTE_KEY,JSON.stringify(store))}
    catch(error){}
  }

  function authorityReviews(){
    try{return JSON.parse(localStorage.getItem(AUTHORITY_KEY) || '{}')}
    catch(error){return {}}
  }

  function saveAuthorityReview(){
    const store = authorityReviews();
    const current = store[selectedRoom] || {perspectives:{}};
    current.question = byId('dr290CheckQuestion')?.checked || false;
    current.evidence = byId('dr290CheckEvidence')?.checked || false;
    current.rights = byId('dr290CheckRights')?.checked || false;
    current.handoff = byId('dr290CheckHandoff')?.checked || false;
    current.note = byId('dr290AuthorityNote')?.value || '';
    current.owner = 'Azuar Fahmi';
    current.human_user_count = 1;
    current.live_staff_chat = false;
    current.perspectives = current.perspectives || {};
    store[selectedRoom] = current;
    try{localStorage.setItem(AUTHORITY_KEY,JSON.stringify(store))}
    catch(error){}
  }

  function loadAuthorityReview(){
    const record = authorityReviews()[selectedRoom] || {};
    if(byId('dr290CheckQuestion')) byId('dr290CheckQuestion').checked = Boolean(record.question);
    if(byId('dr290CheckEvidence')) byId('dr290CheckEvidence').checked = Boolean(record.evidence);
    if(byId('dr290CheckRights')) byId('dr290CheckRights').checked = Boolean(record.rights);
    if(byId('dr290CheckHandoff')) byId('dr290CheckHandoff').checked = Boolean(record.handoff);
    if(byId('dr290AuthorityNote')) byId('dr290AuthorityNote').value = record.note || '';
  }

  function savePerspectiveField(target){
    const card = target.closest('[data-dr291-advisor]');
    if(!card) return;
    const advisor = card.dataset.dr291Advisor;
    const field = target.dataset.dr291Field;
    if(!advisor || !field) return;

    const data = room();
    const item = data.authority.find(entry =>
      entry[0] !== 'Decide' && advisorKey(entry) === advisor
    );
    if(!item) return;

    const store = authorityReviews();
    const current = store[selectedRoom] || {perspectives:{}};
    current.perspectives = current.perspectives || {};
    const existing = current.perspectives[advisor] || defaultPerspective(item);
    existing[field] = target.value;
    existing.updated_at = new Date().toISOString();
    existing.entered_by = 'Azuar Fahmi';
    existing.live_staff_submission = false;
    current.perspectives[advisor] = existing;
    current.owner = 'Azuar Fahmi';
    current.human_user_count = 1;
    current.live_staff_chat = false;
    store[selectedRoom] = current;

    try{localStorage.setItem(AUTHORITY_KEY,JSON.stringify(store))}
    catch(error){}

    if(field === 'status'){
      card.classList.remove('support','caution','blocked','neutral');
      card.classList.add(perspectiveClass(existing.status));
    }
  }

  function decisionStore(){
    try{return JSON.parse(localStorage.getItem(DECISION_KEY) || '{}')}
    catch(error){return {}}
  }

  function currentDecision(){
    return decisionStore().by_room?.[selectedRoom] || null;
  }

  function decisionValue(){
    return document.querySelector('input[name="dr290Decision"]:checked')?.value || '';
  }

  function renderSignature(name){
    const preview = byId('dr290SignaturePreview');
    if(!preview) return;
    const clean = normalise(name);
    preview.textContent = clean || 'Owner signature';
    preview.classList.toggle('sig243-placeholder',!clean);
  }

  function renderDecisionRecord(record){
    const holder = byId('dr290ApprovalRecord');
    if(!holder) return;
    holder.classList.remove('approved','returned','hold');

    if(!record){
      holder.innerHTML = `
        <span class="section-kicker">CURRENT LOCAL RECORD</span>
        <strong>No owner decision has been recorded for this room.</strong>
        <p>Review the evidence and authority pages, select a decision and sign the dossier.</p>`;
      if(byId('dr290SummaryDecision')) byId('dr290SummaryDecision').textContent = 'PENDING';
      return;
    }

    const className = record.decision.startsWith('APPROVED')
      ? 'approved'
      : ['RETURN_FOR_EVIDENCE','REJECTED'].includes(record.decision)
        ? 'returned'
        : 'hold';

    holder.classList.add(className);
    holder.innerHTML = `
      <span class="section-kicker">CURRENT LOCAL RECORD</span>
      <strong>${safe(record.decision.replaceAll('_',' '))} · ${safe(record.signer)}</strong>
      <p>${safe(record.room_title)} · ${safe(new Date(record.signed_at).toLocaleString('en-MY'))}${record.note ? ` · ${safe(record.note)}` : ''}</p>`;

    if(byId('dr290SummaryDecision')){
      byId('dr290SummaryDecision').textContent = record.decision.replaceAll('_',' ');
    }
  }

  function loadDecision(){
    const record = currentDecision();

    all('input[name="dr290Decision"]').forEach(input => {
      input.checked = Boolean(record && input.value === record.decision);
    });

    if(byId('dr290ApprovalNote')) byId('dr290ApprovalNote').value = record?.note || '';
    if(byId('dr290ConfirmEvidence')) byId('dr290ConfirmEvidence').checked = Boolean(record?.confirmed_evidence);
    if(byId('dr290ConfirmRights')) byId('dr290ConfirmRights').checked = Boolean(record?.confirmed_rights);
    if(byId('dr290ConfirmAuthority')) byId('dr290ConfirmAuthority').checked = Boolean(record?.confirmed_authority);
    if(byId('dr290SignName')) byId('dr290SignName').value = record?.signer || '';

    renderSignature(record?.signer || '');

    if(byId('dr290SignTime')){
      byId('dr290SignTime').textContent = record?.signed_at
        ? new Date(record.signed_at).toLocaleString('en-MY')
        : 'Not signed';
    }

    renderDecisionRecord(record);
  }

  function renderEvidence(data){
    const evidence = byId('dr290EvidenceList');
    const options = byId('dr290OptionList');
    const conditions = byId('dr290ConditionList');

    if(evidence){
      evidence.innerHTML = data.evidence.map(item => `
        <article>
          <small>${safe(item[0])}</small>
          <strong>${safe(item[1])}</strong>
          <p>${safe(item[2])}</p>
        </article>`).join('');
    }

    if(options){
      options.innerHTML = data.options.map(item => `
        <article class="${safe(item[3] || '')}">
          <small>${safe(item[0])}</small>
          <strong>${safe(item[1])}</strong>
          <p>${safe(item[2])}</p>
        </article>`).join('');
    }

    if(conditions){
      conditions.innerHTML = data.conditions.map((condition,index) => `
        <article>
          <span>CONDITION ${String(index + 1).padStart(2,'0')}</span>
          <strong>${safe(condition)}</strong>
        </article>`).join('');
    }

    if(byId('dr290EvidenceCount')){
      byId('dr290EvidenceCount').textContent = `${data.evidence.length} items`;
    }
    if(byId('dr290OptionCount')){
      byId('dr290OptionCount').textContent = `${data.options.length} options`;
    }
  }

  function advisorItems(data){
    return data.authority.filter(item => item[0] !== 'Decide');
  }

  function renderAdvisorDots(advisors){
    const holder = byId('dr292AdvisorDots');
    if(!holder) return;
    holder.innerHTML = advisors.map((item,index) => `
      <button class="${index === advisoryIndex ? 'active' : ''}"
        data-dr292-advisor-index="${index}" type="button"
        aria-label="Open ${safe(item[1])} perspective"></button>`).join('');
  }

  function renderAuthority(data){
    const holder = byId('dr290AuthorityRegister');
    if(!holder) return;

    const saved = authorityReviews()[selectedRoom]?.perspectives || {};
    const advisors = advisorItems(data);
    if(!advisors.length){
      holder.innerHTML = '<p>No advisory perspective is assigned to this room.</p>';
      return;
    }

    advisoryIndex = Math.max(0,Math.min(advisors.length - 1,advisoryIndex));
    const item = advisors[advisoryIndex];
    const key = advisorKey(item);
    const record = {...defaultPerspective(item),...(saved[key] || {})};
    const options = PERSPECTIVE_STATUSES.map(status => `
      <option value="${safe(status[0])}" ${record.status === status[0] ? 'selected' : ''}>
        ${safe(status[1])}
      </option>`).join('');

    holder.innerHTML = `
      <article class="dr291-perspective-card ${safe(perspectiveClass(record.status))}"
        data-dr291-advisor="${safe(key)}">
        <header>
          <small>${safe(item[0])} PERSPECTIVE · ${String(advisoryIndex + 1).padStart(2,'0')}</small>
          <strong>${safe(item[1])}</strong>
          <span>${safe(item[2])}</span>
        </header>
        <div class="dr291-perspective-fields">
          <label class="dr291-perspective-field">
            <span>Position</span>
            <select data-dr291-field="status">${options}</select>
          </label>
          <label class="dr291-perspective-field">
            <span>Source reference</span>
            <input data-dr291-field="source_reference" type="text"
              value="${safe(record.source_reference)}"
              placeholder="Chat, handoff, audit or document"/>
          </label>
          <label class="dr291-perspective-field full">
            <span>Reasoning</span>
            <textarea data-dr291-field="reasoning"
              placeholder="Owner-entered summary of this advisory perspective…">${safe(record.reasoning)}</textarea>
          </label>
          <label class="dr291-perspective-field">
            <span>Required evidence</span>
            <input data-dr291-field="required_evidence" type="text"
              value="${safe(record.required_evidence)}"
              placeholder="Evidence needed before decision"/>
          </label>
          <label class="dr291-perspective-field">
            <span>Recommendation</span>
            <input data-dr291-field="recommendation" type="text"
              value="${safe(record.recommendation)}"
              placeholder="Advisory recommendation"/>
          </label>
        </div>
        <small class="dr291-entry-note">
          Entered by owner · AI advisory function · not a live staff submission
        </small>
      </article>`;

    if(byId('dr292AdvisorName')) byId('dr292AdvisorName').textContent = item[1];
    if(byId('dr292AdvisorRole')) byId('dr292AdvisorRole').textContent = item[2];
    if(byId('dr292AdvisorCounter')){
      byId('dr292AdvisorCounter').textContent =
        `Perspective ${advisoryIndex + 1} of ${advisors.length}`;
    }
    if(byId('dr292AdvisorStatus')){
      byId('dr292AdvisorStatus').textContent =
        record.status.replaceAll('_',' ');
    }
    if(byId('dr292PrevAdvisor')){
      byId('dr292PrevAdvisor').disabled = advisoryIndex === 0;
    }
    if(byId('dr292NextAdvisor')){
      byId('dr292NextAdvisor').disabled = advisoryIndex === advisors.length - 1;
    }
    renderAdvisorDots(advisors);
  }

  function moveAdvisor(delta){
    const advisors = advisorItems(room());
    if(!advisors.length) return;
    advisoryIndex = Math.max(
      0,
      Math.min(advisors.length - 1,advisoryIndex + delta)
    );
    renderAuthority(room());
  }

  function openAdvisor(index){
    const advisors = advisorItems(room());
    if(!advisors.length) return;
    advisoryIndex = Math.max(0,Math.min(advisors.length - 1,index));
    renderAuthority(room());
  }

  function renderSelectedRoom({open=false}={}){
    const data = room();
    advisoryIndex = 0;

    all('[data-dr290-room]').forEach(card => {
      card.classList.toggle('active',card.dataset.dr290Room === selectedRoom);
    });

    const values = {
      dr290SummarySelected:data.short,
      dr290SummarySelectedStatus:data.status.toLowerCase(),
      dr290FileTitle:data.title,
      dr290FileQuestion:data.question,
      dr290FileStatus:data.status.toUpperCase(),
      dr290FileMethod:data.method,
      dr290FileSession:data.session,
      dr290FileOwner:data.owner,
      dr290FileParticipants:String(data.authority.filter(item => item[0] !== 'Decide').length),
      dr290FileRecommendation:data.recommendation,
      dr290FileReview:data.review,
      dr290EvidenceTitle:`Evidence for ${data.title}`,
      dr290EvidenceSummary:data.summary,
      dr290AuthorityTitle:`Recorded advisory perspectives for ${data.title}`,
      dr290AuthoritySummary:`These are owner-entered summaries of AI advisory roles for ${data.title}. They are not live staff comments or user activity.`,
      dr290ApprovalTitle:`Record the owner decision for ${data.title}.`,
      dr290ApprovalSummary:`${data.question} This local record does not execute a project, database or deployment action.`,
      dr290ApprovalRoom:data.title.replace(/:.*$/,''),
      dr290ApprovalMethod:data.method,
      dr290ApprovalStatus:data.status,
      dr290ApprovalSession:data.session,
      dr290ApprovalOwner:data.owner,
      dr290ApprovalAuthority:'Decide',
      dr290ApprovalRecommendation:data.recommendation_short,
      dr290ApprovalCondition:data.recommendation_condition
    };

    Object.entries(values).forEach(([id,value]) => {
      if(byId(id)) byId(id).textContent = value;
    });

    if(byId('dr290FileNote')){
      byId('dr290FileNote').value = fileNotes()[selectedRoom] || '';
    }

    renderEvidence(data);
    renderAuthority(data);
    loadAuthorityReview();
    loadDecision();

    try{localStorage.setItem(ROOM_KEY,selectedRoom)}
    catch(error){}

    if(open) openPage('file',{focus:true});
  }

  async function copyBrief(){
    const data = room();
    const brief = [
      `Decision Room: ${data.title}`,
      `Question: ${data.question}`,
      `Status: ${data.status}`,
      `Method: ${data.method}`,
      `Owner: ${data.owner}`,
      `Recommendation: ${data.recommendation}`,
      `Conditions: ${data.conditions.join(' | ')}`
    ].join('\n');

    try{
      await navigator.clipboard.writeText(brief);
      if(typeof window.showToast === 'function'){
        window.showToast('Decision brief copied',data.title);
      }
    }catch(error){
      const area = document.createElement('textarea');
      area.value = brief;
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
  }

  function recordDecision(){
    const data = room();
    const decision = decisionValue();
    const signer = normalise(byId('dr290SignName')?.value);
    const note = normalise(byId('dr290ApprovalNote')?.value);
    const confirmedEvidence = byId('dr290ConfirmEvidence')?.checked || false;
    const confirmedRights = byId('dr290ConfirmRights')?.checked || false;
    const confirmedAuthority = byId('dr290ConfirmAuthority')?.checked || false;
    const error = byId('dr290SignError');

    const problems = [];
    if(!decision) problems.push('Select an owner decision.');
    if(!signer) problems.push('Type the owner or authorised decision-maker name.');
    if(!confirmedEvidence) problems.push('Confirm the evidence review.');
    if(!confirmedRights) problems.push('Confirm the decision-rights review.');
    if(!confirmedAuthority) problems.push('Confirm decision authority.');

    if(problems.length){
      if(error) error.textContent = problems.join(' ');
      return;
    }
    if(error) error.textContent = '';

    const record = {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      room_id:data.key,
      room_title:data.title,
      question:data.question,
      room_status:data.status,
      method:data.method,
      session:data.session,
      decision_owner:data.owner,
      recommendation:data.recommendation,
      evidence:data.evidence.map(item => ({label:item[0],title:item[1],detail:item[2]})),
      options:data.options.map(item => ({label:item[0],title:item[1],detail:item[2]})),
      conditions:data.conditions,
      advisory_perspectives:data.authority
        .filter(item => item[0] !== 'Decide')
        .map(item => {
          const key = advisorKey(item);
          const saved = authorityReviews()[selectedRoom]?.perspectives?.[key] || {};
          return {
            advisor_key:key,
            ...defaultPerspective(item),
            ...saved,
            entered_by:'Azuar Fahmi',
            live_staff_submission:false
          };
        }),
      owner_authority:{
        name:data.owner,
        role:'Founder / CEO',
        human_user_count:1,
        authority:'Decide',
        final_decision_exclusive:true
      },
      decision,
      note,
      signer,
      confirmed_evidence:confirmedEvidence,
      confirmed_rights:confirmedRights,
      confirmed_authority:confirmedAuthority,
      signed_at:new Date().toISOString(),
      storage:'local-browser-draft',
      execution_action:false,
      supabase_write:false,
      production_write:false
    };

    const store = decisionStore();
    store.by_room = store.by_room || {};
    store.by_room[selectedRoom] = record;

    try{localStorage.setItem(DECISION_KEY,JSON.stringify(store))}
    catch(error){}

    loadDecision();
  }

  function clearDecision(){
    const store = decisionStore();
    if(store.by_room) delete store.by_room[selectedRoom];

    try{localStorage.setItem(DECISION_KEY,JSON.stringify(store))}
    catch(error){}

    all('input[name="dr290Decision"]').forEach(input => input.checked = false);
    if(byId('dr290ApprovalNote')) byId('dr290ApprovalNote').value = '';
    if(byId('dr290ConfirmEvidence')) byId('dr290ConfirmEvidence').checked = false;
    if(byId('dr290ConfirmRights')) byId('dr290ConfirmRights').checked = false;
    if(byId('dr290ConfirmAuthority')) byId('dr290ConfirmAuthority').checked = false;
    if(byId('dr290SignName')) byId('dr290SignName').value = '';

    renderSignature('');
    if(byId('dr290SignTime')) byId('dr290SignTime').textContent = 'Not signed';
    renderDecisionRecord(null);
  }

  function exportDecision(){
    const data = room();
    const record = currentDecision() || {
      release:'v1.30.2',
      build_id:'EKH-OS-EPLD-20260731-001',
      room_id:data.key,
      room_title:data.title,
      question:data.question,
      decision:'NOT_RECORDED',
      execution_action:false,
      supabase_write:false,
      production_write:false
    };

    const blob = new Blob([JSON.stringify(record,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `EKH_OS_Decision_${data.key}_${new Date().toISOString().replaceAll(':','-')}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),0);
  }

  function init(){
    const stored = localStorage.getItem(ROOM_KEY);
    if(stored && ROOMS[stored]) selectedRoom = stored;

    renderSelectedRoom();
    openPage('brief');

    byId('dr290PageTabs')?.addEventListener('click',event => {
      const button = event.target.closest('[data-dr290-page]');
      if(button) openPage(button.dataset.dr290Page,{focus:true});
    });

    document.addEventListener('click',event => {
      const open = event.target.closest('[data-dr290-open-page]');
      if(open) openPage(open.dataset.dr290OpenPage,{focus:true});

      const dot = event.target.closest('[data-dr290-dot]');
      if(dot) openPage(dot.dataset.dr290Dot,{focus:true});
    });

    byId('dr290RoomIndex')?.addEventListener('click',event => {
      const card = event.target.closest('[data-dr290-room]');
      if(!card) return;
      selectedRoom = card.dataset.dr290Room;
      renderSelectedRoom({open:true});
    });

    byId('dr290PrevPage')?.addEventListener('click',() => move(-1));
    byId('dr290NextPage')?.addEventListener('click',() => move(1));
    byId('dr290FileNote')?.addEventListener('input',saveFileNote);
    byId('dr290CopyBrief')?.addEventListener('click',copyBrief);

    ['dr290CheckQuestion','dr290CheckEvidence','dr290CheckRights','dr290CheckHandoff']
      .forEach(id => byId(id)?.addEventListener('change',saveAuthorityReview));

    byId('dr290AuthorityNote')?.addEventListener('input',saveAuthorityReview);

    byId('dr290AuthorityRegister')?.addEventListener('input',event => {
      const target = event.target.closest('[data-dr291-field]');
      if(target) savePerspectiveField(target);
    });
    byId('dr290AuthorityRegister')?.addEventListener('change',event => {
      const target = event.target.closest('[data-dr291-field]');
      if(target) savePerspectiveField(target);
    });

    byId('dr292PrevAdvisor')?.addEventListener('click',() => moveAdvisor(-1));
    byId('dr292NextAdvisor')?.addEventListener('click',() => moveAdvisor(1));
    byId('dr292AdvisorDots')?.addEventListener('click',event => {
      const dot = event.target.closest('[data-dr292-advisor-index]');
      if(dot) openAdvisor(Number(dot.dataset.dr292AdvisorIndex));
    });

    const advisoryViewport = byId('dr292AdvisoryViewport');
    advisoryViewport?.addEventListener('touchstart',event => {
      event.stopPropagation();
      advisoryTouchStartX = event.changedTouches[0]?.clientX ?? null;
    },{passive:true});
    advisoryViewport?.addEventListener('touchend',event => {
      event.stopPropagation();
      if(advisoryTouchStartX === null) return;
      const endX = event.changedTouches[0]?.clientX ?? advisoryTouchStartX;
      const distance = endX - advisoryTouchStartX;
      advisoryTouchStartX = null;
      if(Math.abs(distance) < 48) return;
      moveAdvisor(distance < 0 ? 1 : -1);
    },{passive:true});
    byId('dr290SignName')?.addEventListener('input',event => renderSignature(event.target.value));
    byId('dr290SignButton')?.addEventListener('click',recordDecision);
    byId('dr290ClearDecision')?.addEventListener('click',clearDecision);
    byId('dr290ExportDecision')?.addEventListener('click',exportDecision);

    const viewport = byId('dr290DossierViewport');
    viewport?.addEventListener('touchstart',event => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    },{passive:true});

    viewport?.addEventListener('touchend',event => {
      if(touchStartX === null) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartX;
      const distance = endX - touchStartX;
      touchStartX = null;
      if(Math.abs(distance) < 52) return;
      move(distance < 0 ? 1 : -1);
    },{passive:true});

    document.addEventListener('keydown',event => {
      const activeView = document.querySelector('.page-content > .view.active');
      if(activeView?.id !== 'decision-rooms') return;
      if(event.target.matches('input,textarea,select,[contenteditable="true"]')) return;

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
        openPage('approval',{focus:true});
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();

;

/* ---- ekh-v1302-english-person-dependencies-runtime ---- */

(() => {
  'use strict';

  const DATA = {"org-bm": {"key": "org-bm", "folio": "15", "code": "BM", "type": "Specialised Unit", "title": "Malay Language", "short_title": "Malay Language", "lead": "Nene / Haikal / Blanc", "mandate": "Malay language curriculum, translation quality, worksheet language and natural Malaysian Malay review.", "principle": "Curriculum comes first. Natural language follows. Worksheets stay auditable.", "scope": [["Curriculum", "Map Malay language content to age, year and learning level."], ["Language QA", "Protect accuracy, natural Malaysian usage and translation consistency."], ["Worksheet Language", "Control KVKV, tracing, vocabulary and instruction wording."], ["Publication Support", "Review Malay copy before worksheet, product or social publication."]], "staff": [["Nene", "Malay Language Curriculum Specialist", "Malay language curriculum mapping, worksheet content, KVKV patterns and level suitability.", "Curriculum recommendation", "Escalate curriculum exceptions to Reo.", [["Haikal", "Language review"], ["Blanc", "Worksheet implementation"], ["Reo", "Education escalation"]]], ["Syakila", "Malaysian Malay Social Language Analyst", "Natural, conversational and accurate Malaysian Malay for social media communication.", "Language input", "Escalate formal-language or claim issues to Haikal and Mario.", [["Haikal", "Language approval"], ["Mario", "Campaign context"]]], ["Haikal", "Translator / Language QA", "Translation review, language accuracy and final language approval.", "Language approval", "Return unclear or unnatural wording for correction.", [["Nene", "Curriculum input"], ["Mario", "Publication context"]]], ["Blanc", "Worksheet Studio Lead", "Worksheet generator development, including Malay language, KVKV and letter-tracing modules.", "Technical implementation", "Provide generator output and regression evidence.", [["Nene", "Content rules"], ["Candice", "Technical architecture"], ["Kyo", "Regression evidence"]]]], "workstreams": [["BM-01", "Curriculum & Level Mapping", "Nene", "Map content, patterns and instructions to the intended level.", "Curriculum evidence"], ["BM-02", "Natural Malaysian Malay Review", "Syakila / Haikal", "Protect natural local usage without weakening accuracy.", "Language review record"], ["BM-03", "Worksheet Language Modules", "Blanc", "Implement and validate BM, KVKV and tracing modules.", "Generator regression"], ["BM-04", "Final Language Gate", "Haikal", "Approve translations and publication-ready wording.", "Approval note"]], "controls": ["No content is level-approved without curriculum evidence.", "Social Malay must remain natural and locally appropriate.", "Translation approval and generator implementation remain separate controls.", "Worksheet output requires regression evidence before release."]}, "org-english": {"key": "org-english", "folio": "16", "code": "EN", "type": "Specialised Unit", "title": "English Language & Language Education", "short_title": "English Language", "lead": "Reo / Ilica / Haikal", "mandate": "English curriculum validation, CEFR alignment, progression review, standards evidence and language quality.", "principle": "Every level, language choice and assessment claim must be supported by an education evidence chain.", "scope": [["Curriculum Direction", "Define the education gate and year-level expectations."], ["CEFR & Placement", "Validate language load, level and progression."], ["Standards Evidence", "Map source evidence and curriculum standards."], ["Language QA", "Review naturalness, translation and exception handoff."]], "staff": [["Reo", "Education Director", "Curriculum direction, assessment, final education gate and release authority.", "Education decision", "Own final education release recommendation.", [["Ilica", "Curriculum mapping"], ["Elio", "Standards evidence"], ["Luna", "Assessment validation"]]], ["Ilica", "Curriculum Validator", "Curriculum mapping, CEFR alignment, level placement and English question validation.", "Curriculum validation", "Escalate unresolved evidence to Reo.", [["Reo", "Education gate"], ["Elio", "Standards evidence"]]], ["Guy", "Early Childhood Education Specialist", "Age suitability, child development and Level 1–6 placement.", "Developmental input", "Flag tasks that exceed age or cognitive suitability.", [["Reo", "Education gate"], ["Luna", "Progression validation"]]], ["Haikal", "Translator / Language QA", "Final language review, translation and naturalness.", "Language approval", "Resolve language exceptions after first-pass QA.", [["Nara", "First-pass review"], ["Reo", "Education exceptions"]]], ["Nara", "English Education Translator & Language QA", "First-pass English language QA and exception handoff to Haikal.", "First-pass QA", "Document and hand off exceptions.", [["Haikal", "Exception review"], ["Ilica", "Curriculum context"]]], ["Elio", "Curriculum Researcher — Standards Mapping", "Standards mapping, source evidence and curriculum evidence-chain management.", "Evidence research", "Maintain source and standards traceability.", [["Ilica", "Curriculum mapping"], ["Reo", "Evidence gate"]]], ["Luna", "Curriculum Researcher — Progression & Assessment", "Progression, difficulty, language load and independent validation.", "Independent validation", "Flag progression, distractor or assessment-quality concerns.", [["Guy", "Development input"], ["Reo", "Assessment gate"]]]], "workstreams": [["EN-01", "Curriculum & CEFR Mapping", "Reo / Ilica", "Align Year 1–6 content, level and language load.", "Curriculum map"], ["EN-02", "Standards Evidence Chain", "Elio", "Maintain source evidence and standards traceability.", "Evidence register"], ["EN-03", "Progression & Assessment", "Luna / Guy", "Validate difficulty, development and progression.", "Independent validation"], ["EN-04", "Language QA & Exceptions", "Nara / Haikal", "Run first-pass QA and final language approval.", "Language QA log"]], "controls": ["Year and CEFR decisions require explicit evidence.", "Developmental suitability is reviewed separately from language correctness.", "First-pass QA must preserve an exception trail.", "Final education release authority remains with Reo."]}, "org-technology": {"key": "org-technology", "folio": "17", "code": "TECH", "type": "Core Directorate", "title": "Technology, Software, Web & Systems", "short_title": "Technology", "lead": "Candice", "mandate": "System architecture, applications, web development, generators, runtime verification, data integrity, databases and deployment controls.", "principle": "Architecture, implementation, verification and production authority must remain traceable and separated.", "scope": [["Architecture", "Own EKH OS, system boundaries, access and data flow."], ["Applications", "Develop and integrate Smart Adventure and other EKH applications."], ["Web & Generators", "Build websites, access pages and worksheet-generator modules."], ["Infrastructure", "Protect database, deployment, permissions and rollback controls."]], "staff": [["Candice", "Technology Director", "EKH OS, Command Center, system architecture, access, data flow and infrastructure.", "Technical authority", "Approve architecture and system boundaries.", [["Xion", "Web systems"], ["Jeff", "Applications"], ["Baran", "Infrastructure"]]], ["Jeff", "Application Owner / Front-End Engineer", "Smart Adventure, application integration, runtime and front-end implementation.", "Application implementation", "Provide build and integration evidence.", [["Reo", "Education approval"], ["Kyo", "Runtime regression"], ["Baran", "Database preflight"]]], ["Xion", "Lead Web Developer", "Website, landing pages, access pages, responsive design and domain management.", "Web implementation", "Maintain responsive UI, source and technical handoff.", [["Candice", "Architecture"], ["Zenon", "Digital assets"], ["Mia", "Operations"]]], ["Blanc", "Worksheet Studio Lead", "Worksheet generator modules, templates, coding and regression readiness.", "Generator implementation", "Provide generator build and regression package.", [["Nene", "Content rules"], ["Candice", "Architecture"], ["Kyo", "Regression evidence"]]], ["Kyo", "Debugging & Technical Verification Specialist", "Bug analysis, regression, performance, architecture and independent technical verification.", "Independent verification", "Reject unsupported technical PASS claims.", [["Jeff", "Test builds"], ["Baran", "Database preflight"], ["Alya", "Data integrity"]]], ["Alya", "Data Integrity & Question Bank Quality Assurance", "Question_ID control, audit trails, data integrity and question-pool quality assurance.", "Data-integrity control", "Stop changes that break ID or audit integrity.", [["Reo", "Curriculum approval"], ["Baran", "Database controls"], ["Kyo", "Runtime evidence"]]], ["Baran", "Database & DevOps Operator", "Database, deployment pipeline, permissions and DevOps.", "Database and deployment control", "Block production when backup, rollback or permission gates fail.", [["Alya", "Approved manifest"], ["Kyo", "Regression evidence"], ["Candice", "Architecture"]]], ["Oliver", "Application Lead", "Application development and application-level coordination.", "Application coordination", "Coordinate application scope and handoff.", [["Candice", "Architecture"], ["Kyo", "Technical verification"], ["Mia", "Operational handoff"]]]], "workstreams": [["TECH-01", "EKH OS Architecture", "Candice / Xion", "Maintain system structure, interface and access boundaries.", "Architecture decision record"], ["TECH-02", "Application Runtime", "Jeff / Oliver", "Build and integrate application flows.", "Build and runtime package"], ["TECH-03", "Independent Verification", "Kyo / Alya", "Verify runtime, data and regression claims.", "Regression and audit evidence"], ["TECH-04", "Database & Deployment", "Baran", "Control backup, permissions, rollback and release execution.", "Preflight and rollback record"]], "controls": ["No production write without authorised evidence.", "Independent verification cannot be replaced by developer self-attestation.", "Least-privilege access and rollback are mandatory.", "Private or service-role credentials must never enter front-end builds."]}, "org-qa": {"key": "org-qa", "folio": "18", "code": "QA", "type": "Specialised Unit", "title": "Technical QA, Release & Automation", "short_title": "Technical QA", "lead": "Candice / Reo / Alya", "mandate": "Independent technical verification, release closure, automation, evidence control and targeted re-audit.", "principle": "A PASS is valid only when the named evidence, scope and independent verification are present.", "scope": [["Release Closure", "Control blockers, gates and release-readiness evidence."], ["Automation", "Validate schema, IDs, scoring, duplicates and persistence."], ["Independent QA", "Verify runtime and technical claims independently."], ["Evidence Integrity", "Protect audit registers and targeted re-audit."]], "staff": [["Arden", "Technical QA & Release Lead", "Closure of Passes 8C, 9 and 10; blocker register, evidence gate and release closure.", "Release closure", "Maintain blocker and closure evidence.", [["Kyo", "Independent verification"], ["Vera", "Automation evidence"], ["Baran", "Release preflight"]]], ["Vera", "Test Automation Engineer", "Automated validation for schema, Question_ID, scoring, duplicates, persistence and runtime evidence.", "Automation evidence", "Provide reproducible automated results.", [["Kyo", "Test scope"], ["Alya", "Data integrity"]]], ["Kyo", "Independent Technical Verifier", "Independent verification of bugs, runtime, regression and technical PASS claims.", "Independent verification", "Reject unsupported or incomplete technical evidence.", [["Jeff", "Test builds"], ["Vera", "Automation evidence"], ["Baran", "Release preflight"]]], ["Alya", "Data Integrity Custodian", "Data integrity, uniqueness, evidence register and targeted re-audit.", "Data integrity", "Protect IDs, uniqueness and audit traceability.", [["Vera", "Automated validation"], ["Reo", "Education approval"], ["Baran", "Database controls"]]], ["Candice", "Technology Authority", "Technical ownership, architecture decisions and infrastructure.", "Technical authority", "Resolve architecture and infrastructure blockers.", [["Arden", "Release closure"], ["Baran", "Infrastructure controls"]]]], "workstreams": [["QA-01", "Release Closure", "Arden", "Close named passes and maintain the blocker register.", "Release closure file"], ["QA-02", "Automated Validation", "Vera", "Run repeatable checks for schema, scoring and persistence.", "Automation report"], ["QA-03", "Independent Runtime QA", "Kyo", "Verify runtime, regression and performance evidence.", "Independent QA record"], ["QA-04", "Data Integrity Re-audit", "Alya", "Target duplicates, missing evidence and integrity exceptions.", "Re-audit register"]], "controls": ["PASS, FAIL and BLOCKED must have named evidence.", "Automated checks must be reproducible.", "Release closure cannot ignore unresolved blockers.", "Audit logs and Question_ID records must remain traceable."]}, "org-creative": {"key": "org-creative", "folio": "19", "code": "CR", "type": "Core Directorate", "title": "Creative, Graphics & Visual Identity", "short_title": "Creative", "lead": "Kamal", "mandate": "Visual direction, branding, illustration identity, digital assets and political visual production.", "principle": "Identity lock, production specifications and approved visual direction take priority over redesign.", "scope": [["Creative Direction", "Define posters, branding and campaign visual systems."], ["Character Identity", "Protect character anatomy, features and production consistency."], ["Digital Assets", "Deliver transparent, technically correct web and app assets."], ["Political Visuals", "Translate political content into accurate visual communication."]], "staff": [["Kamal", "Creative Director", "Visual direction, posters, branding, Facebook Pages assets and visual QA.", "Creative approval", "Own visual direction and final creative review.", [["Mario", "Campaign brief"], ["Zenon", "Digital assets"], ["Farah", "Character identity"]]], ["Farah", "Visual Illustration Lead & Character Identity Guardian", "Cuddle Paws illustration, identity lock and production standards.", "Identity control", "Reject unapproved character changes.", [["Kamal", "Creative direction"], ["Zenon", "Production files"]]], ["Zenon", "Digital Asset Designer", "Digital assets, transparency, identity lock and technical visual files.", "Asset production", "Deliver true-alpha assets and technical variants.", [["Kamal", "Creative approval"], ["Xion", "Web integration"], ["Jeff", "Application integration"]]], ["Clara", "Political Graphic Designer", "Posters and visuals for political content.", "Political visual implementation", "Maintain factual and message consistency.", [["Wahid", "Approved content"], ["Kamal", "Visual approval"]]]], "workstreams": [["CR-01", "Creative Direction", "Kamal", "Define visual systems and approve final assets.", "Creative direction record"], ["CR-02", "Character Identity", "Farah", "Protect Cuddle Paws identity and illustration standards.", "Identity checklist"], ["CR-03", "Digital Asset Production", "Zenon", "Prepare transparent web, app and promotional assets.", "Asset manifest"], ["CR-04", "Political Visuals", "Clara", "Produce political posters aligned with approved content.", "Visual approval"]], "controls": ["Identity-locked characters cannot be redesigned without approval.", "Transparency must use a true alpha channel, not a fake background.", "Visual claims must match approved copy and evidence.", "Final creative approval remains with Kamal."]}, "org-marketing": {"key": "org-marketing", "folio": "20", "code": "MKT", "type": "Core Directorate", "title": "Marketing, Content & Market Intelligence", "short_title": "Marketing", "lead": "Mario", "mandate": "Positioning, funnel strategy, content systems, copy quality, pricing research and market intelligence.", "principle": "One message, one audience, one dominant action—supported by truthful product positioning.", "scope": [["Strategy & Funnel", "Connect traffic, lead and sale with a clear offer."], ["Content Systems", "Plan repeatable Threads, Facebook and campaign content."], ["Copy Audit", "Challenge weak hooks, claims and CTA."], ["Market Intelligence", "Research pricing, demand, competitors and opportunities."]], "staff": [["Mario", "Marketing Director", "Marketing strategy, positioning, funnel, pricing, campaigns and sales.", "Marketing decision", "Own campaign and offer direction.", [["Paula", "Market evidence"], ["Zack", "Content planning"], ["Kamal", "Visual assets"]]], ["Zack", "Content Strategy / Threads Lead", "Posting schedule, hooks, CTA, anti-repetition and personal branding.", "Content planning", "Maintain schedule, hook quality and content variety.", [["Mario", "Marketing strategy"], ["Syakila", "Language review"], ["Tabby", "Copy audit"]]], ["Tabby", "Devil’s Advocate", "Audit of copy, hooks, CTA, claims and strategic weaknesses.", "Challenge and audit", "Return weak or unsupported content.", [["Mario", "Campaign intent"], ["Syakila", "Language review"]]], ["Syakila", "Malaysian Malay Social Language Analyst", "Ensuring Malaysian Malay copy sounds natural, locally appropriate and not rigid.", "Local-language input", "Correct unnatural or overly formal social wording.", [["Mario", "Campaign context"], ["Haikal", "Language exceptions"]]], ["Paula", "International Digital Product Market Researcher", "Market research, pricing, positioning and digital-product opportunities.", "Market evidence", "Provide evidence for pricing and positioning.", [["Mario", "Positioning"], ["Mia", "Pricing control"]]]], "workstreams": [["MKT-01", "Offer & Funnel Strategy", "Mario", "Define positioning, audience, funnel and CTA.", "Campaign brief"], ["MKT-02", "Threads Content System", "Zack", "Plan hooks, posting rhythm and anti-repetition.", "Content calendar"], ["MKT-03", "Copy Challenge & Localisation", "Tabby / Syakila", "Audit claims and natural Malaysian Malay.", "Copy QA record"], ["MKT-04", "Market & Pricing Research", "Paula", "Research demand, price sequence and commercial opportunity.", "Market evidence"]], "controls": ["The user is positioned truthfully as a reseller where applicable.", "One post should carry one dominant idea.", "Claims require evidence or careful qualification.", "Promotional quotas and price stages must be recorded accurately."]}, "org-assessment": {"key": "org-assessment", "folio": "21", "code": "EDU", "type": "Core Directorate", "title": "Child Education & Assessment", "short_title": "Education", "lead": "Reo", "mandate": "Education direction, developmental suitability, curriculum mapping, standards evidence, progression and assessment quality.", "principle": "A learning item must be appropriate for the child, the curriculum, the level and the intended assessment purpose.", "scope": [["Education Gate", "Own education direction and release recommendation."], ["Child Suitability", "Review developmental fairness and age appropriateness."], ["Curriculum Evidence", "Map standards, language and source evidence."], ["Assessment Quality", "Validate progression, distractors and difficulty."]], "staff": [["Reo", "Education Director", "Owner of education direction and the release gate.", "Education decision", "Approve or hold education release.", [["Ilica", "Curriculum mapping"], ["Guy", "Development suitability"], ["Luna", "Assessment validation"]]], ["Guy", "Early Childhood Education Specialist", "Age suitability, developmental appropriateness and fairness.", "Developmental validation", "Flag unfair or unsuitable tasks.", [["Reo", "Education gate"], ["Luna", "Progression validation"]]], ["Ilica", "Curriculum Validator", "Curriculum mapping and level validation.", "Curriculum validation", "Document level and curriculum evidence.", [["Elio", "Standards evidence"], ["Reo", "Education approval"]]], ["Elio", "Standards Mapping Researcher", "Standards evidence, source evidence and curriculum mapping.", "Standards evidence", "Maintain the evidence chain.", [["Ilica", "Curriculum mapping"], ["Reo", "Evidence gate"]]], ["Luna", "Progression & Assessment Validator", "Difficulty, language load, distractor quality and independent validation.", "Assessment validation", "Flag progression and distractor concerns.", [["Guy", "Suitability input"], ["Reo", "Assessment gate"]]], ["Nene", "Malay Language Curriculum Specialist", "Malay curriculum and worksheets.", "BM curriculum input", "Validate Malay-language learning content.", [["Reo", "Education gate"], ["Blanc", "Worksheet implementation"]]]], "workstreams": [["EDU-01", "Education Release Gate", "Reo", "Control final education recommendation.", "Education approval"], ["EDU-02", "Developmental Suitability", "Guy", "Validate age, fairness and cognitive load.", "Suitability review"], ["EDU-03", "Curriculum & Standards", "Ilica / Elio / Nene", "Maintain curriculum and source evidence.", "Standards map"], ["EDU-04", "Progression & Assessment", "Luna", "Validate difficulty, distractors and progression.", "Assessment validation"]], "controls": ["Each item must map to the correct year and curriculum expectation.", "Language correctness does not replace developmental suitability.", "Difficulty and distractor quality require independent review.", "Release remains blocked when education evidence is incomplete."]}, "org-multimedia": {"key": "org-multimedia", "folio": "22", "code": "MM", "type": "Core Directorate", "title": "Multimedia, Video & Audio", "short_title": "Multimedia", "lead": "Arian", "mandate": "Application audio, product video concepts, storyboards, shot planning and political video scripts.", "principle": "Audio and video production must follow an approved message, timing plan and technical delivery format.", "scope": [["Audio Experience", "Control application sound and multimedia experience."], ["Product Video", "Build concepts, shot lists and storyboard flow."], ["Video Prompting", "Translate approved product messages into generation-ready prompts."], ["Political Scripts", "Prepare political video scripts only."]], "staff": [["Arian", "Multimedia Director", "Audio, application sound, entertainment and multimedia experience.", "Multimedia direction", "Own audio and multimedia quality.", [["Jeff", "Application integration"], ["Lei", "Production planning"]]], ["Lei", "UGC & Product Video Specialist", "Video concepts, storyboards, shot lists and product-video prompts.", "Video planning", "Provide complete shot and timing instructions.", [["Mario", "Approved message"], ["Kamal", "Visual direction"], ["Arian", "Audio direction"]]], ["Azizan", "Political Video Script Specialist", "Political video scriptwriting only.", "Political script input", "Keep scope limited to political video scripts.", [["Wahid", "Approved analysis"], ["Arian", "Production direction"]]]], "workstreams": [["MM-01", "Application Audio", "Arian", "Review sound, timing and multimedia experience.", "Audio QA record"], ["MM-02", "Product Video Storyboard", "Lei", "Define concept, shots, duration and visual flow.", "Storyboard"], ["MM-03", "Generation-Ready Video Prompt", "Lei", "Prepare consolidated prompts and voiceover boundaries.", "Prompt package"], ["MM-04", "Political Video Script", "Azizan", "Write political video scripts within approved scope.", "Script approval"]], "controls": ["Storyboard and timing must be approved before production.", "Character mouth movement must match the speaking requirement.", "Audio files require application-level integration testing.", "Political script scope must not drift into unrelated production authority."]}, "org-political": {"key": "org-political", "folio": "23", "code": "POL", "type": "Core Directorate", "title": "Politics", "short_title": "Politics", "lead": "Wahid", "mandate": "Malaysian political analysis, research, article strategy, political graphics and video scripts.", "principle": "Political content must distinguish evidence, analysis, opinion and visual framing.", "scope": [["Political Analysis", "Research developments, history and strategic implications."], ["Article Strategy", "Frame topics, arguments and publication direction."], ["Political Graphics", "Produce visuals aligned with verified content."], ["Political Video Scripts", "Translate approved analysis into video scripts."]], "staff": [["Wahid", "Political Director", "Malaysian political analysis, research, articles and topic strategy.", "Political direction", "Own analysis and topic framing.", [["Clara", "Political visuals"], ["Azizan", "Video scripts"], ["Mia", "Publication control"]]], ["Clara", "Political Graphic Designer", "Political poster and campaign visuals.", "Visual implementation", "Align graphics with approved factual content.", [["Wahid", "Approved content"], ["Kamal", "Visual QA"]]], ["Azizan", "Political Video Script Specialist", "Political video scripts.", "Script implementation", "Translate approved analysis into video scripts.", [["Wahid", "Approved analysis"], ["Arian", "Production direction"]]]], "workstreams": [["POL-01", "Research & Analysis", "Wahid", "Research facts, history and strategic context.", "Source register"], ["POL-02", "Article & Topic Strategy", "Wahid", "Define argument, angle and publication purpose.", "Editorial brief"], ["POL-03", "Political Graphics", "Clara", "Produce accurate political posters and campaign visuals.", "Visual approval"], ["POL-04", "Political Video Scripts", "Azizan", "Prepare scripts from approved analysis.", "Script review"]], "controls": ["Evidence, analysis and opinion must be clearly distinguished.", "Visuals cannot introduce unsupported claims.", "Scripts must remain consistent with the approved article or brief.", "Publication decisions require owner review."]}, "org-publishing": {"key": "org-publishing", "folio": "24", "code": "PUB", "type": "Specialised Unit", "title": "E-book & Publishing", "short_title": "Publishing", "lead": "Love / Torrie", "mandate": "E-book planning, manuscript writing, story and language QA, production QA and education-value review.", "principle": "A manuscript becomes publication-ready only after story, language, production and purpose checks are closed.", "scope": [["Manuscript", "Plan, write and structure Canva-friendly e-books."], ["Story & Language QA", "Review narrative, language and readability."], ["Production QA", "Verify layout, completeness and publication quality."], ["Educational Review", "Review learning value when educational elements are present."]], "staff": [["Love", "E-book Writer", "Planning, writing, structuring and Canva-friendly e-book manuscripts.", "Manuscript creation", "Provide complete manuscript and structure.", [["Torrie", "Editorial QA"], ["Kamal", "Cover direction"]]], ["Torrie", "E-book QA Editor", "Story QA, Language QA, Production QA and final publication decision.", "Publishing QA", "Approve, return or hold the publication package.", [["Love", "Manuscript"], ["Haikal", "Language review"], ["Mia", "Publication control"]]], ["Reo", "Education Support Specialist", "Educational-value review when an e-book contains learning elements.", "Education input", "Validate educational purpose and suitability.", [["Love", "Manuscript context"], ["Torrie", "Publishing QA"]]]], "workstreams": [["PUB-01", "Manuscript Planning & Writing", "Love", "Build structure, chapters and publication-ready copy.", "Manuscript"], ["PUB-02", "Story & Language QA", "Torrie", "Review narrative, language and consistency.", "QA report"], ["PUB-03", "Production QA", "Torrie", "Validate layout, completeness and final package.", "Production checklist"], ["PUB-04", "Educational-Value Review", "Reo", "Review learning value where applicable.", "Education note"]], "controls": ["Incomplete manuscripts cannot enter final production QA.", "Story, language and production QA remain separate checks.", "Educational claims require education review.", "Final publication status must be recorded explicitly."]}};
  const PAGES = [
    ['brief','Department Brief'],
    ['mandate','Mandate & Scope'],
    ['team','Team Register'],
    ['staff','Selected Staff File'],
    ['work','Workstreams & Controls'],
    ['review','Department Review']
  ];

  const safe = value => String(value ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');

  const normalise = value => String(value || '').replace(/\s+/g,' ').trim();

  function initialiseDepartment(page){
    const key = page.dataset.dept300Key;
    const data = DATA[key];
    if(!data) return;

    let pageIndex = 0;
    let staffIndex = Number(localStorage.getItem(`ekh_dept300_selected_staff_${key}`) || 0);
    let touchStartX = null;

    const one = selector => page.querySelector(selector);
    const all = selector => [...page.querySelectorAll(selector)];

    function openPage(name,{focus=false}={}){
      const index = PAGES.findIndex(item => item[0] === name);
      pageIndex = index >= 0 ? index : 0;
      const [activeKey,title] = PAGES[pageIndex];

      all('[data-dept300-panel]').forEach(panel => {
        const active = panel.dataset.dept300Panel === activeKey;
        panel.hidden = !active;
        panel.classList.toggle('active',active);
        panel.setAttribute('aria-hidden',String(!active));
      });

      all('[data-dept300-page]').forEach(button => {
        const active = button.dataset.dept300Page === activeKey;
        button.classList.toggle('active',active);
        button.setAttribute('aria-selected',String(active));
      });

      one('[data-dept300-counter]').textContent =
        `Page ${pageIndex + 1} of ${PAGES.length}`;
      one('[data-dept300-page-title]').textContent = title;
      one('[data-dept300-prev]').disabled = pageIndex === 0;
      one('[data-dept300-next]').disabled = pageIndex === PAGES.length - 1;
      renderDots();

      if(focus){
        one('.dept300-viewport')?.scrollIntoView({
          behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto' : 'smooth',
          block:'start'
        });
      }
    }

    function move(delta){
      const next = Math.max(0,Math.min(PAGES.length - 1,pageIndex + delta));
      openPage(PAGES[next][0],{focus:true});
    }

    function renderDots(){
      const holder = one('[data-dept300-dots]');
      holder.innerHTML = PAGES.map((item,index) => `
        <button class="${index === pageIndex ? 'active' : ''}"
          data-dept300-dot="${item[0]}" type="button"
          aria-label="Open ${safe(item[1])}"></button>`).join('');
    }

    function staffNotes(){
      try{
        return JSON.parse(
          localStorage.getItem(`ekh_dept300_staff_notes_${key}`) || '{}'
        );
      }catch(error){
        return {};
      }
    }

    function saveStaffNote(){
      const staff = data.staff[staffIndex];
      if(!staff) return;
      const store = staffNotes();
      store[staff[0]] = one('[data-dept300-staff-note]')?.value || '';
      localStorage.setItem(
        `ekh_dept300_staff_notes_${key}`,
        JSON.stringify(store)
      );
    }

    function dependencyMarkup(dependencies){
      return (dependencies || []).map(item => `
        <span class="dept302-dependency-chip">
          <b>${safe(item[0])}</b><small>${safe(item[1])}</small>
        </span>`).join('');
    }

    function renderStaff(index,{open=false}={}){
      staffIndex = Math.max(0,Math.min(data.staff.length - 1,index));
      const staff = data.staff[staffIndex];
      const [name,role,responsibility,authority,handoff,dependencies=[]] = staff;

      all('[data-dept300-staff-index]').forEach(button => {
        const active = Number(button.dataset.dept300StaffIndex) === staffIndex;
        button.classList.toggle('active',active);
        const label = button.querySelector('em');
        if(label) label.textContent = active ? 'SELECTED' : 'OPEN FILE';
      });

      const values = {
        '[data-dept300-summary-staff]':name,
        '[data-dept300-summary-role]':role,
        '[data-dept300-staff-name]':name,
        '[data-dept300-staff-role]':role,
        '[data-dept300-staff-index-label]':
          `RECORD ${String(staffIndex + 1).padStart(2,'0')}`,
        '[data-dept300-fact-name]':name,
        '[data-dept300-fact-role]':role,
        '[data-dept300-fact-responsibility]':responsibility,
        '[data-dept300-fact-authority]':authority,
        '[data-dept300-fact-handoff]':handoff
      };
      Object.entries(values).forEach(([selector,value]) => {
        const node = one(selector);
        if(node) node.textContent = value;
      });

      const dependencyHolder = one('[data-dept302-fact-dependencies]');
      if(dependencyHolder){
        dependencyHolder.innerHTML = dependencyMarkup(dependencies);
      }

      const note = one('[data-dept300-staff-note]');
      if(note) note.value = staffNotes()[name] || '';

      localStorage.setItem(
        `ekh_dept300_selected_staff_${key}`,
        String(staffIndex)
      );

      if(open) openPage('staff',{focus:true});
    }

    function reviewStore(){
      try{
        return JSON.parse(
          localStorage.getItem(`ekh_dept300_review_${key}`) || 'null'
        );
      }catch(error){
        return null;
      }
    }

    function renderSignature(name){
      const preview = one('[data-dept300-signature-preview]');
      const clean = normalise(name);
      preview.textContent = clean || 'Owner signature';
      preview.classList.toggle('sig243-placeholder',!clean);
    }

    function renderReviewRecord(record){
      const holder = one('[data-dept300-review-record]');
      holder.classList.remove('approved','returned','hold');

      if(!record){
        holder.innerHTML = `
          <span class="section-kicker">CURRENT LOCAL RECORD</span>
          <strong>No owner review has been recorded for this department.</strong>
          <p>Select an assessment, complete the confirmations and sign the dossier.</p>`;
        one('[data-dept300-summary-decision]').textContent = 'PENDING';
        return;
      }

      const className = record.assessment === 'OPERATING_AS_DEFINED'
        ? 'approved'
        : record.assessment === 'HOLD'
          ? 'hold'
          : 'returned';
      holder.classList.add(className);
      holder.innerHTML = `
        <span class="section-kicker">CURRENT LOCAL RECORD</span>
        <strong>${safe(record.assessment.replaceAll('_',' '))} · ${safe(record.signer)}</strong>
        <p>${safe(new Date(record.signed_at).toLocaleString('en-MY'))}${record.note ? ` · ${safe(record.note)}` : ''}</p>`;
      one('[data-dept300-summary-decision]').textContent =
        record.assessment.replaceAll('_',' ');
    }

    function loadReview(){
      const record = reviewStore();

      all(`input[name="dept300Decision-${key}"]`).forEach(input => {
        input.checked = Boolean(record && input.value === record.assessment);
      });

      one('[data-dept300-review-note]').value = record?.note || '';

      all('[data-dept300-confirm]').forEach(input => {
        input.checked = Boolean(record?.confirmations?.[input.dataset.dept300Confirm]);
      });

      one('[data-dept300-sign-name]').value = record?.signer || '';
      renderSignature(record?.signer || '');
      one('[data-dept300-sign-time]').textContent = record?.signed_at
        ? new Date(record.signed_at).toLocaleString('en-MY')
        : 'Not signed';
      renderReviewRecord(record);
    }

    function recordReview(){
      const assessment = one(
        `input[name="dept300Decision-${key}"]:checked`
      )?.value || '';
      const signer = normalise(one('[data-dept300-sign-name]').value);
      const note = normalise(one('[data-dept300-review-note]').value);
      const confirmations = {};

      all('[data-dept300-confirm]').forEach(input => {
        confirmations[input.dataset.dept300Confirm] = input.checked;
      });

      const problems = [];
      if(!assessment) problems.push('Select a department assessment.');
      if(!signer) problems.push('Type the owner name.');
      if(!Object.values(confirmations).every(Boolean)){
        problems.push('Complete all department confirmations.');
      }

      const error = one('[data-dept300-sign-error]');
      if(problems.length){
        error.textContent = problems.join(' ');
        return;
      }
      error.textContent = '';

      const record = {
        release:'v1.30.2',
        build_id:'EKH-OS-EPLD-20260731-001',
        department_id:key,
        department_code:data.code,
        department_title:data.title,
        department_type:data.type,
        lead:data.lead,
        staff_count:data.staff.length,
        workstream_count:data.workstreams.length,
        assessment,
        note,
        signer,
        confirmations,
        signed_at:new Date().toISOString(),
        storage:'local-browser-draft',
        staffing_write:false,
        access_write:false,
        supabase_write:false,
        production_write:false
      };

      localStorage.setItem(
        `ekh_dept300_review_${key}`,
        JSON.stringify(record)
      );
      loadReview();
    }

    function clearReview(){
      localStorage.removeItem(`ekh_dept300_review_${key}`);
      all(`input[name="dept300Decision-${key}"]`).forEach(input => {
        input.checked = false;
      });
      one('[data-dept300-review-note]').value = '';
      all('[data-dept300-confirm]').forEach(input => {
        input.checked = false;
      });
      one('[data-dept300-sign-name]').value = '';
      renderSignature('');
      one('[data-dept300-sign-time]').textContent = 'Not signed';
      renderReviewRecord(null);
    }

    function exportReview(){
      const record = reviewStore() || {
        release:'v1.30.2',
        build_id:'EKH-OS-EPLD-20260731-001',
        department_id:key,
        department_code:data.code,
        department_title:data.title,
        assessment:'NOT_RECORDED',
        staffing_write:false,
        access_write:false,
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
        `EKH_OS_Department_Review_${data.code}_${new Date().toISOString().replaceAll(':','-')}.json`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url),0);
    }

    page.addEventListener('click',event => {
      const tab = event.target.closest('[data-dept300-page]');
      if(tab) openPage(tab.dataset.dept300Page,{focus:true});

      const jump = event.target.closest('[data-dept300-open-page]');
      if(jump) openPage(jump.dataset.dept300OpenPage,{focus:true});

      const dot = event.target.closest('[data-dept300-dot]');
      if(dot) openPage(dot.dataset.dept300Dot,{focus:true});

      const staff = event.target.closest('[data-dept300-staff-index]');
      if(staff){
        renderStaff(Number(staff.dataset.dept300StaffIndex),{open:true});
      }
    });

    one('[data-dept300-prev]').addEventListener('click',() => move(-1));
    one('[data-dept300-next]').addEventListener('click',() => move(1));
    one('[data-dept300-staff-note]').addEventListener('input',saveStaffNote);
    one('[data-dept300-sign-name]').addEventListener(
      'input',
      event => renderSignature(event.target.value)
    );
    one('[data-dept300-record-review]').addEventListener('click',recordReview);
    one('[data-dept300-clear-review]').addEventListener('click',clearReview);
    one('[data-dept300-export-review]').addEventListener('click',exportReview);

    const viewport = one('.dept300-viewport');
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
      if(event.target.matches('input,textarea,select,[contenteditable="true"]')) return;

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
        openPage('review',{focus:true});
      }
    });

    renderStaff(staffIndex);
    loadReview();
    openPage('brief');
  }

  function init(){
    document.querySelectorAll('.dept300-page').forEach(initialiseDepartment);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();

;