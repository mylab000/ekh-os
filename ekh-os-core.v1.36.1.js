
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const STORAGE_KEY = 'ekh_os_v10_reminders';
function uid(){
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `ekh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
}
const SETTINGS_KEY = 'ekh_os_v10_notification_settings';

const channelMeta = {
  'fb-page': { label: 'Facebook Page', short: 'f', className: 'fb' },
  'fb-group': { label: 'Facebook Groups', short: 'G', className: 'group' },
  marketplace: { label: 'Facebook Marketplace', short: 'M', className: 'market' },
  general: { label: 'EKH OS', short: 'E', className: 'follow' }
};

const pageNames = {
  'command-centre': ['Command Center', 'English Kids Hub / Operations'],
  notifications: ['My Activities', 'English Kids Hub / Supabase Activity Reminders'],
  projects: ['Projects', 'English Kids Hub / Portfolio'],
  organisation: ['Team Organisation Chart', 'Azuar Fahmi / Team Structure'],
  tasks: ['Tasks', 'English Kids Hub / Execution'],
  'decision-rooms': ['Decision Rooms', 'English Kids Hub / Governance'],
  'room-detail': ['Decision Room', 'English Kids Hub / Governance'],
  handoffs: ['Mia Workflow Console', 'Mia Queue / Controlled Publication'],
  files: ['Files', 'English Kids Hub / Knowledge'],
  activity: ['Activity & Audit', 'English Kids Hub / Audit Trail'],
  reports: ['Reports', 'English Kids Hub / Intelligence'],
  settings: ['Settings', 'English Kids Hub / Administration']
};

let activeCategoryFilter = 'all';
let activeDateFilter = 'all';
let reminders = [];
let browserAlertsEnabled = ('Notification' in window && Notification.permission === 'granted');

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dateAtOffset(dayOffset, hour, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function toDateTimeParts(date) {
  return { date: localDateKey(date), time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` };
}

function defaultReminders() {
  const yesterday = toDateTimeParts(dateAtOffset(-1, 18, 0));
  const morning = toDateTimeParts(dateAtOffset(0, 9, 0));
  const group = toDateTimeParts(dateAtOffset(0, 12, 30));
  const market = toDateTimeParts(dateAtOffset(0, 16, 0));
  const page = toDateTimeParts(dateAtOffset(0, 20, 30));
  const tomorrow = toDateTimeParts(dateAtOffset(1, 10, 0));
  const friday = toDateTimeParts(dateAtOffset(3, 20, 30));
  const sunday = toDateTimeParts(dateAtOffset(5, 11, 0));

  return [
    {
      id: uid(), title: 'Reply to Marketplace enquiries', category: 'social', channel: 'marketplace',
      date: yesterday.date, time: yesterday.time, repeat: 'none', priority: 'high',
      notes: 'Check unanswered messages and update buyer follow-up status.', offsets: [30, 0], completed: false, read: false, triggered: false
    },
    {
      id: uid(), title: 'Publish morning post on Facebook Page', category: 'social', channel: 'fb-page',
      date: morning.date, time: morning.time, repeat: 'weekdays', priority: 'normal',
      notes: 'Use approved education/personal-branding content.', offsets: [30, 0], completed: true, read: true, completedAt: new Date().toISOString(), triggered: true
    },
    {
      id: uid(), title: 'Post in 3 selected Facebook Groups', category: 'social', channel: 'fb-group',
      date: group.date, time: group.time, repeat: 'weekly', priority: 'high',
      notes: 'Adapt the opening line for each group. Avoid posting the exact same caption at the same minute.', offsets: [30, 10, 0], completed: false, read: false, triggered: false
    },
    {
      id: uid(), title: 'Renew Cuddle Paws Marketplace listing', category: 'social', channel: 'marketplace',
      date: market.date, time: market.time, repeat: 'every-3-days', priority: 'high',
      notes: 'Refresh listing, verify price and reply to new enquiries.', offsets: [30, 0], completed: false, read: false, triggered: false
    },
    {
      id: uid(), title: 'Publish evening Facebook Page post', category: 'social', channel: 'fb-page',
      date: page.date, time: page.time, repeat: 'weekdays', priority: 'normal',
      notes: 'Use the approved evening post and check the visual before publishing.', offsets: [30, 0], completed: false, read: false, triggered: false
    },
    {
      id: uid(), title: 'Review FB Page post performance', category: 'follow-up', channel: 'fb-page',
      date: tomorrow.date, time: tomorrow.time, repeat: 'none', priority: 'normal',
      notes: 'Capture reach, engagement and comments that require a reply.', offsets: [30], completed: false, read: true, triggered: false
    },
    {
      id: uid(), title: 'Friday Facebook Page content slot', category: 'social', channel: 'fb-page',
      date: friday.date, time: friday.time, repeat: 'weekly', priority: 'normal',
      notes: 'Prepare the final caption and visual before the scheduled time.', offsets: [30, 0], completed: false, read: true, triggered: false
    },
    {
      id: uid(), title: 'Sunday Facebook Group posting round', category: 'social', channel: 'fb-group',
      date: sunday.date, time: sunday.time, repeat: 'weekly', priority: 'normal',
      notes: 'Select relevant parent and education groups only.', offsets: [30, 0], completed: false, read: true, triggered: false
    }
  ];
}

function loadReminders() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) && data.length ? data : defaultReminders();
  } catch {
    return defaultReminders();
  }
}

function saveReminders() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders)); } catch { /* local storage may be unavailable in preview mode */ }
}

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; }
}

function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ browserAlerts: browserAlertsEnabled })); } catch { /* local storage may be unavailable in preview mode */ }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function dueDate(reminder) {
  return new Date(`${reminder.date}T${reminder.time || '00:00'}:00`);
}

function formatTime(value) {
  const [hour, minute] = value.split(':').map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatDate(dateString, mode = 'short') {
  const date = new Date(`${dateString}T12:00:00`);
  if (mode === 'full') return date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

function relativeDue(reminder) {
  const diff = dueDate(reminder) - new Date();
  const mins = Math.round(diff / 60000);
  if (reminder.completed) return 'Completed';
  if (mins < -1440) return `${Math.abs(Math.round(mins / 1440))}d overdue`;
  if (mins < 0) return `${Math.abs(mins)}m overdue`;
  if (mins < 60) return `In ${mins}m`;
  if (mins < 1440) return `In ${Math.floor(mins / 60)}h ${mins % 60}m`;
  return formatDate(reminder.date);
}

function repeatLabel(value) {
  return ({ none: '', daily: 'Daily', weekdays: 'Weekdays', weekly: 'Weekly', 'every-3-days': 'Every 3 days' })[value] || '';
}

function showView(id) {
  $$('.view').forEach(view => view.classList.toggle('active', view.id === id));
  $$('.nav-item[data-view]').forEach(item => item.classList.toggle('active', item.dataset.view === id || (id === 'room-detail' && item.dataset.view === 'decision-rooms')));
  const [title, eyebrow] = pageNames[id] || ['EKH OS', 'English Kids Hub'];
  $('#pageTitle').textContent = title;
  $('#pageEyebrow').textContent = eyebrow;
  $('#sidebar').classList.remove('open');
  closeDrawer();
  closeCreatePopover();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'notifications') renderAll();
}

function reminderPassesFilter(reminder) {
  const categoryPass = activeCategoryFilter === 'all'
    || (activeCategoryFilter === 'completed' && reminder.completed)
    || (activeCategoryFilter === 'social' && reminder.category === 'social')
    || (activeCategoryFilter === 'operations' && reminder.category !== 'social' && !reminder.completed);
  if (!categoryPass) return false;

  const now = new Date();
  const today = localDateKey(now);
  const due = dueDate(reminder);
  const datePass = activeDateFilter === 'all'
    || (activeDateFilter === 'today' && reminder.date === today)
    || (activeDateFilter === 'upcoming' && due > now && reminder.date !== today)
    || (activeDateFilter === 'overdue' && due < now && !reminder.completed);
  return datePass;
}

function groupedReminders() {
  const now = new Date();
  const today = localDateKey(now);
  const visible = reminders.filter(reminderPassesFilter).sort((a, b) => dueDate(a) - dueDate(b));
  return {
    overdue: visible.filter(item => !item.completed && dueDate(item) < now && item.date !== today),
    today: visible.filter(item => item.date === today),
    upcoming: visible.filter(item => item.date !== today && (dueDate(item) >= now || item.completed))
  };
}

function reminderCard(reminder) {
  const channel = channelMeta[reminder.channel] || channelMeta.general;
  const overdue = !reminder.completed && dueDate(reminder) < new Date();
  const classes = ['reminder-card'];
  if (!reminder.read) classes.push('unread');
  if (overdue) classes.push('overdue');
  if (reminder.completed) classes.push('completed');
  const repeat = repeatLabel(reminder.repeat);
  return `
    <article class="${classes.join(' ')}" data-reminder-id="${reminder.id}" data-search="${escapeHtml(`${reminder.title} ${channel.label} ${reminder.notes}`)}">
      <span class="channel-logo ${channel.className}">${channel.short}</span>
      <div class="reminder-card-copy">
        <strong>${escapeHtml(reminder.title)}</strong>
        <span>${escapeHtml(channel.label)}${reminder.notes ? ` • ${escapeHtml(reminder.notes)}` : ''}</span>
        <div class="reminder-card-meta">
          <span class="meta-chip">${escapeHtml(reminder.category)}</span>
          ${repeat ? `<span class="meta-chip repeat">↻ ${repeat}</span>` : ''}
          ${reminder.priority !== 'normal' ? `<span class="meta-chip ${reminder.priority}">${reminder.priority}</span>` : ''}
        </div>
      </div>
      <div class="reminder-card-actions">
        <div class="reminder-time-block"><strong>${formatTime(reminder.time)}</strong><span>${relativeDue(reminder)}</span></div>
        <div class="reminder-action-menu">
          ${!reminder.completed ? `<button class="complete-button" data-action="complete" title="Mark complete">✓ Done</button><button data-action="snooze" title="Snooze one hour">◷</button>` : ''}
          <button data-action="edit" title="Edit reminder">✎</button>
          <button data-action="delete" title="Delete reminder">×</button>
        </div>
      </div>
    </article>`;
}

function renderNotificationLists() {
  const groups = groupedReminders();
  $('#overdueList').innerHTML = groups.overdue.map(reminderCard).join('');
  $('#todayList').innerHTML = groups.today.map(reminderCard).join('');
  $('#upcomingList').innerHTML = groups.upcoming.map(reminderCard).join('');
  $('#overdueCountLabel').textContent = `${groups.overdue.length} item${groups.overdue.length === 1 ? '' : 's'}`;
  $('#todayCountLabel').textContent = `${groups.today.length} item${groups.today.length === 1 ? '' : 's'}`;
  $('#upcomingCountLabel').textContent = `${groups.upcoming.length} item${groups.upcoming.length === 1 ? '' : 's'}`;
  $('#overdueSection').style.display = groups.overdue.length ? '' : 'none';
  const totalVisible = groups.overdue.length + groups.today.length + groups.upcoming.length;
  $('#notificationEmptyState').hidden = totalVisible !== 0;
}

function renderStats() {
  const now = new Date();
  const today = localDateKey(now);
  const overdue = reminders.filter(item => !item.completed && dueDate(item) < now).length;
  const dueToday = reminders.filter(item => !item.completed && item.date === today).length;
  const social = reminders.filter(item => !item.completed && item.category === 'social').length;
  const completedToday = reminders.filter(item => item.completed && item.completedAt && localDateKey(new Date(item.completedAt)) === today).length;
  $('#overdueStat').textContent = overdue;
  $('#todayStat').textContent = dueToday;
  $('#socialStat').textContent = social;
  $('#completedStat').textContent = completedToday;
  $('#dashboardReminderCount').textContent = reminders.filter(item => !item.completed).length;
}

function renderCounts() {
  const unread = reminders.filter(item => !item.read && !item.completed).length;
  $('#bellCount').textContent = unread;
  $('#navNotificationCount').textContent = unread;
  $('#bellCount').style.display = unread ? 'grid' : 'none';
  $('#navNotificationCount').style.display = unread ? 'grid' : 'none';
}

function renderDashboardTimeline() {
  const today = localDateKey();
  const next = reminders.filter(item => !item.completed && item.date === today).sort((a, b) => dueDate(a) - dueDate(b)).slice(0, 3);
  $('#dashboardReminderTimeline').innerHTML = next.length ? next.map(item => {
    const channel = channelMeta[item.channel] || channelMeta.general;
    return `<div class="compact-reminder" data-reminder-id="${item.id}"><span class="reminder-time">${formatTime(item.time)}</span><span class="channel-logo ${channel.className}">${channel.short}</span><div><strong>${escapeHtml(item.title)}</strong><small>${channel.label}</small></div><span class="mini-status">${relativeDue(item)}</span></div>`;
  }).join('') : '<div class="compact-reminder"><span>✓</span><div><strong>All reminders completed</strong><small>No more scheduled items today.</small></div></div>';
}

function renderDrawer() {
  const items = reminders.filter(item => !item.completed).sort((a, b) => dueDate(a) - dueDate(b)).slice(0, 8);
  $('#drawerList').innerHTML = items.map(item => {
    const channel = channelMeta[item.channel] || channelMeta.general;
    return `<article class="drawer-item" data-reminder-id="${item.id}"><span class="channel-logo ${channel.className}">${channel.short}</span><div class="drawer-item-copy"><strong>${escapeHtml(item.title)}</strong><span>${channel.label} • ${relativeDue(item)}</span></div><time>${formatDate(item.date)}</time></article>`;
  }).join('') || '<div class="empty-state"><div>✓</div><strong>Inbox clear</strong><span>No open reminders.</span></div>';
}

function renderCalendarStrip() {
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);
  $$('.week-row > span').forEach((cell, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    $('small', cell).textContent = weekdays[date.getDay()];
    $('b', cell).textContent = date.getDate();
    cell.classList.toggle('active', localDateKey(date) === localDateKey(now));
    const indicator = $('i', cell);
    const dateItems = reminders.filter(item => item.date === localDateKey(date));
    indicator.className = '';
    if (dateItems.some(item => !item.completed)) indicator.classList.add(localDateKey(date) === localDateKey(now) ? 'due' : 'scheduled');
    else if (dateItems.some(item => item.completed)) indicator.classList.add('done');
  });
}

function renderAll() {
  renderNotificationLists();
  renderStats();
  renderCounts();
  renderDashboardTimeline();
  renderDrawer();
  renderCalendarStrip();
  saveReminders();
}

function openDrawer() {
  $('#notificationDrawer').classList.add('open');
  $('#notificationDrawer').setAttribute('aria-hidden', 'false');
  $('#drawerOverlay').classList.add('open');
  closeCreatePopover();
}

function closeDrawer() {
  $('#notificationDrawer').classList.remove('open');
  $('#notificationDrawer').setAttribute('aria-hidden', 'true');
  $('#drawerOverlay').classList.remove('open');
}

function toggleCreatePopover() {
  $('#createPopover').classList.toggle('open');
  $('#createPopover').setAttribute('aria-hidden', $('#createPopover').classList.contains('open') ? 'false' : 'true');
}
function closeCreatePopover() { $('#createPopover').classList.remove('open'); $('#createPopover').setAttribute('aria-hidden', 'true'); }

function openReminderModal(reminder = null, template = null) {
  const modal = $('#reminderModal');
  $('#reminderModalTitle').textContent = reminder ? 'Edit reminder' : 'Add reminder';
  $('#reminderId').value = reminder?.id || '';
  const prefill = templatePrefill(template);
  const dateDefault = toDateTimeParts(dateAtOffset(0, 20, 30));
  $('#reminderTitle').value = reminder?.title || prefill.title || '';
  $('#reminderCategory').value = reminder?.category || prefill.category || 'social';
  $('#reminderChannel').value = reminder?.channel || prefill.channel || 'fb-page';
  $('#reminderDate').value = reminder?.date || dateDefault.date;
  $('#reminderTime').value = reminder?.time || prefill.time || dateDefault.time;
  $('#reminderRepeat').value = reminder?.repeat || prefill.repeat || 'none';
  $('#reminderPriority').value = reminder?.priority || 'normal';
  $('#reminderNotes').value = reminder?.notes || prefill.notes || '';
  $$('.reminder-offsets input').forEach(input => input.checked = (reminder?.offsets || [30, 0]).includes(Number(input.value)));
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => $('#reminderTitle').focus(), 80);
}

function closeReminderModal() {
  $('#reminderModal').classList.remove('open');
  $('#reminderModal').setAttribute('aria-hidden', 'true');
  $('#reminderForm').reset();
}

function templatePrefill(template) {
  return ({
    'fb-page': { title: 'Publish Facebook Page post', category: 'social', channel: 'fb-page', time: '20:30', repeat: 'weekdays', notes: 'Confirm caption, visual and CTA before publishing.' },
    'fb-group': { title: 'Post in selected Facebook Groups', category: 'social', channel: 'fb-group', time: '12:30', repeat: 'weekly', notes: 'Adapt the opening line to each group and record where it was posted.' },
    marketplace: { title: 'Renew Facebook Marketplace listing', category: 'social', channel: 'marketplace', time: '16:00', repeat: 'every-3-days', notes: 'Check listing price, images and unanswered enquiries.' },
    'follow-up': { title: 'Follow up on posting result', category: 'follow-up', channel: 'general', time: '10:00', repeat: 'none', notes: 'Record the outcome and next action.' }
  })[template] || {};
}

function saveReminderFromForm(event) {
  event.preventDefault();
  const id = $('#reminderId').value;
  const reminder = {
    id: id || uid(),
    title: $('#reminderTitle').value.trim(),
    category: $('#reminderCategory').value,
    channel: $('#reminderChannel').value,
    date: $('#reminderDate').value,
    time: $('#reminderTime').value,
    repeat: $('#reminderRepeat').value,
    priority: $('#reminderPriority').value,
    notes: $('#reminderNotes').value.trim(),
    offsets: $$('.reminder-offsets input:checked').map(input => Number(input.value)),
    completed: false,
    read: false,
    triggered: false,
    createdAt: new Date().toISOString()
  };
  if (!reminder.title || !reminder.date || !reminder.time) return;
  if (id) {
    const existing = reminders.find(item => item.id === id);
    Object.assign(existing, reminder, { completed: existing.completed, completedAt: existing.completedAt });
    showToast('Reminder updated', reminder.title);
  } else {
    reminders.push(reminder);
    showToast('Reminder created', reminder.title);
  }
  closeReminderModal();
  renderAll();
  showView('notifications');
}

function reminderAction(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const card = button.closest('[data-reminder-id]');
  const reminder = reminders.find(item => item.id === card?.dataset.reminderId);
  if (!reminder) return;
  const action = button.dataset.action;
  if (action === 'complete') {
    reminder.completed = true;
    reminder.read = true;
    reminder.completedAt = new Date().toISOString();
    showToast('Marked complete', reminder.title);
  }
  if (action === 'snooze') {
    const newDue = new Date(dueDate(reminder).getTime() + 60 * 60 * 1000);
    reminder.date = localDateKey(newDue);
    reminder.time = `${String(newDue.getHours()).padStart(2, '0')}:${String(newDue.getMinutes()).padStart(2, '0')}`;
    reminder.triggered = false;
    showToast('Snoozed for one hour', reminder.title);
  }
  if (action === 'edit') return openReminderModal(reminder);
  if (action === 'delete') {
    if (!confirm(`Delete reminder “${reminder.title}”?`)) return;
    reminders = reminders.filter(item => item.id !== reminder.id);
    showToast('Reminder deleted', reminder.title);
  }
  renderAll();
}

function showToast(title, message) {
  const toast = document.createElement('article');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">✓</span><div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span></div><button aria-label="Dismiss">×</button>`;
  $('button', toast).addEventListener('click', () => toast.remove());
  $('#toastStack').appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}

async function enableBrowserAlerts() {
  if (!('Notification' in window)) {
    showToast('Browser alerts unavailable', 'This browser does not support desktop notifications.');
    return;
  }
  const permission = await Notification.requestPermission();
  browserAlertsEnabled = permission === 'granted';
  $('#browserAlertToggle').checked = browserAlertsEnabled;
  saveSettings();
  showToast(browserAlertsEnabled ? 'Browser alerts enabled' : 'Permission not granted', browserAlertsEnabled ? 'Alerts can appear while this prototype is open.' : 'You can continue using in-app reminders.');
}

function checkDueReminders() {
  const now = new Date();
  reminders.forEach(reminder => {
    const difference = now - dueDate(reminder);
    if (!reminder.completed && !reminder.triggered && difference >= 0 && difference < 120000) {
      reminder.triggered = true;
      showToast('Reminder due now', reminder.title);
      if (browserAlertsEnabled && Notification.permission === 'granted') {
        new Notification('EKH OS reminder', { body: reminder.title, tag: reminder.id });
      }
    }
  });
  saveReminders();
}

function updateDateLabels() {
  const now = new Date();
  $('#todayLabel').textContent = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('#todayDateText').textContent = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
}

// Navigation
$$('.nav-item[data-view]').forEach(item => item.addEventListener('click', () => showView(item.dataset.view)));
$$('[data-view-target]').forEach(button => button.addEventListener('click', () => showView(button.dataset.viewTarget)));
$('#mobileMenu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

// Drawer
$('#notificationBell').addEventListener('click', openDrawer);
$('#closeDrawer').addEventListener('click', closeDrawer);
$('#drawerOverlay').addEventListener('click', closeDrawer);
$('#openNotificationCentre').addEventListener('click', () => showView('notifications'));
$('#drawerList').addEventListener('click', event => {
  const item = event.target.closest('[data-reminder-id]');
  if (!item) return;
  const reminder = reminders.find(entry => entry.id === item.dataset.reminderId);
  if (reminder) reminder.read = true;
  renderAll();
  showView('notifications');
  setTimeout(() => $(`[data-reminder-id="${item.dataset.reminderId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
});

// Create popover
$('#createButton').addEventListener('click', event => { event.stopPropagation(); toggleCreatePopover(); });
$$('#createPopover [data-create]').forEach(button => button.addEventListener('click', () => {
  const type = button.dataset.create;
  closeCreatePopover();
  if (type === 'activity') document.querySelector('#addSupabaseActivityButton')?.click();
  else if (type === 'room') showView('decision-rooms');
  else if (type === 'handoff') showView('handoffs');
  else showView('tasks');
}));
document.addEventListener('click', event => { if (!event.target.closest('#createPopover') && !event.target.closest('#createButton')) closeCreatePopover(); });

// Reminder UI
$('#addReminderButton').addEventListener('click', () => openReminderModal());
$('#dashboardAddReminder').addEventListener('click', () => openReminderModal());
$('#closeReminderModal').addEventListener('click', closeReminderModal);
$('#cancelReminder').addEventListener('click', closeReminderModal);
$('#reminderModal').addEventListener('click', event => { if (event.target === $('#reminderModal')) closeReminderModal(); });
$('#reminderForm').addEventListener('submit', saveReminderFromForm);
$$('.template-button').forEach(button => button.addEventListener('click', () => openReminderModal(null, button.dataset.template)));
$('#notifications').addEventListener('click', reminderAction);

// Filters
$$('.filter-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.filter-tab').forEach(item => item.classList.toggle('active', item === tab));
  activeCategoryFilter = tab.dataset.filter;
  renderNotificationLists();
}));
$('#notificationDateFilter').addEventListener('change', event => { activeDateFilter = event.target.value; renderNotificationLists(); });
$('#markAllRead').addEventListener('click', () => { reminders.forEach(item => item.read = true); renderAll(); showToast('Notifications updated', 'All reminders marked as read.'); });

// Notification settings
$('#notificationSettingsButton').addEventListener('click', () => $('#notificationSettingsModal').classList.add('open'));
$$('[data-close-settings]').forEach(button => button.addEventListener('click', () => $('#notificationSettingsModal').classList.remove('open')));
$('#notificationSettingsModal').addEventListener('click', event => { if (event.target === $('#notificationSettingsModal')) $('#notificationSettingsModal').classList.remove('open'); });
$('#enableBrowserAlerts').addEventListener('click', enableBrowserAlerts);
$('#browserAlertToggle').checked = browserAlertsEnabled;
$('#browserAlertToggle').addEventListener('change', event => {
  if (event.target.checked) enableBrowserAlerts();
  else { browserAlertsEnabled = false; saveSettings(); }
});
$('#editScheduleButton').addEventListener('click', () => showToast('Schedule editor', 'Recurring templates are represented in the reminder form for this prototype.'));

// Decision room
$$('[data-room]').forEach(card => card.addEventListener('click', () => showView('room-detail')));
$('#backToRooms').addEventListener('click', () => showView('decision-rooms'));
$('#newRoomButton').addEventListener('click', () => showToast('New Decision Room', 'Room creation form will be connected in the next backend phase.'));
$$('[data-room-mode]').forEach(button => button.addEventListener('click', () => {
  $$('[data-room-mode]').forEach(item => item.classList.toggle('active', item === button));
  $$('.room-mode').forEach(mode => mode.classList.remove('active'));
  const map = { room: 'roomCanvasMode', transcript: 'transcriptMode', memo: 'memoMode' };
  $(`#${map[button.dataset.roomMode]}`).classList.add('active');
}));
$$('.workspace-tab').forEach(tab => tab.addEventListener('click', () => { $$('.workspace-tab').forEach(item => item.classList.toggle('active', item === tab)); }));

// Search
$('#globalSearch').addEventListener('keydown', event => {
  if (event.key !== 'Enter' || !event.target.value.trim()) return;
  const query = event.target.value.trim().toLowerCase();
  const candidates = $$('[data-search]');
  const match = candidates.find(element => (element.dataset.search || element.textContent).toLowerCase().includes(query));
  if (!match) return showToast('No result found', event.target.value.trim());
  const parentView = match.closest('.view');
  if (parentView) showView(parentView.id);
  setTimeout(() => { match.classList.add('search-highlight'); match.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => match.classList.remove('search-highlight'), 1800); }, 120);
});

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (typeof window.openEKHCommandPalette === 'function') window.openEKHCommandPalette(); else $('#globalSearch').focus(); }
  if (event.key === 'Escape') { closeDrawer(); closeCreatePopover(); closeReminderModal(); $('#notificationSettingsModal').classList.remove('open'); $('#sidebar').classList.remove('open'); if (typeof window.closeEKHCommandPalette === 'function') window.closeEKHCommandPalette(); }
});

updateDateLabels();
// Local mock reminder rendering is disabled in v1.5.
// Supabase activity rendering is initialized by the v1.5 activity module.

