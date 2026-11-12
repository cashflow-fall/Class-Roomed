const STORAGE = {
  rooms: 'classroomedRoomsV3',
  reservations: 'classroomedReservationsV3',
  user: 'classroomedCurrentUserV3',
  accounts: 'classroomedAccountsV3',
  notifications: 'classroomedNotificationsV3'
};

const seedRooms = [
  { id: 1, name: 'GCA 101', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 45, equipment: ['Projector', 'Audio system', 'Accessible seating'], status: 'Available' },
  { id: 2, name: 'GCA 201', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 35, equipment: ['Computers', 'Projector', 'Audio system'], status: 'Available' },
  { id: 3, name: 'GCA 301', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 28, equipment: ['Lab equipment', 'Projector'], status: 'Available' },
  { id: 4, name: 'GCA 306', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 40, equipment: ['Projector', 'Audio system'], status: 'Available' },
  { id: 5, name: 'Computer Laboratory 3', building: 'Gusaling Villegas', type: 'Computer Lab', capacity: 35, equipment: ['Computers', 'Projector', 'Audio system'], status: 'Available' },
  { id: 6, name: 'Computer Laboratory 1', building: 'Gusaling Villegas', type: 'Computer Lab', capacity: 30, equipment: ['Computers', 'Projector'], status: 'Maintenance' },
  { id: 7, name: 'GCA 102', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 50, equipment: ['Projector', 'Audio system', 'Accessible seating'], status: 'Available' },
  { id: 8, name: 'GCA 104', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 42, equipment: ['Projector', 'Audio system'], status: 'Available' },
  { id: 9, name: 'GCA 202', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 38, equipment: ['Projector', 'Audio system'], status: 'Available' },
  { id: 10, name: 'GCA 205', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 30, equipment: ['Projector'], status: 'Available' },
  { id: 11, name: 'GCA 302', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 36, equipment: ['Projector', 'Audio system'], status: 'Available' },
  { id: 12, name: 'GCA 304', building: 'Gusaling Corazon Aquino', type: 'Lecture Room', capacity: 25, equipment: ['Projector'], status: 'Available' }
];

const localDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dateOffset = (days) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
};
const seedReservations = [
  { id: 'CR-1001', title: 'CS 101 Lecture', requestor: 'Maria Santos', role: 'Faculty', roomId: 1, date: dateOffset(1), start: '09:00', end: '10:30', attendees: 38, type: 'Class', equipment: ['Projector'], status: 'Approved', submittedAt: new Date().toISOString(), conflict: '' },
  { id: 'CR-1002', title: 'Faculty Curriculum Meeting', requestor: 'Daniel Reyes', role: 'Faculty', roomId: 4, date: dateOffset(1), start: '13:00', end: '14:00', attendees: 12, type: 'Meeting', equipment: ['Projector', 'Audio system'], status: 'Approved', submittedAt: new Date().toISOString(), conflict: '' },
  { id: 'CR-1003', title: 'Programming Laboratory', requestor: 'Alex Dela Cruz', role: 'Faculty', roomId: 2, date: dateOffset(2), start: '10:00', end: '12:00', attendees: 32, type: 'Laboratory', equipment: ['Computers', 'Projector'], status: 'Approved', submittedAt: new Date().toISOString(), conflict: '' },
  { id: 'CR-1004', title: 'Department Research Forum', requestor: 'Andrea Lim', role: 'Faculty', roomId: 5, date: dateOffset(3), start: '14:00', end: '16:00', attendees: 130, type: 'Event', equipment: ['Projector', 'Audio system'], status: 'Approved', submittedAt: new Date().toISOString(), conflict: '' }
];

let rooms = JSON.parse(localStorage.getItem(STORAGE.rooms) || 'null') || seedRooms;
if (!localStorage.getItem('classroomedRoomsSeedV4')) { // one-time: add the new example rooms to data saved by an earlier version
  seedRooms.filter(seed => !rooms.some(room => room.name === seed.name)).forEach(seed => rooms.push({ ...seed, id: rooms.some(room => Number(room.id) === seed.id) ? Math.max(...rooms.map(room => Number(room.id))) + 1 : seed.id }));
  localStorage.setItem(STORAGE.rooms, JSON.stringify(rooms)); localStorage.setItem('classroomedRoomsSeedV4', '1');
}
let reservations = JSON.parse(localStorage.getItem(STORAGE.reservations) || 'null') || seedReservations;
reservations.forEach(item => { if (item.status === 'Unconfirmed') item.status = 'Cancelled'; }); // status removed with the grace period
let currentUser = JSON.parse(localStorage.getItem(STORAGE.user) || 'null') || null;
const seedAccounts = [
  { username: 'admin', password: 'admin123', name: 'Campus Administrator', role: 'Administrator', active: true },
  { username: 'maintenance', password: 'maint123', name: 'Maintenance Office', role: 'Maintenance', active: true },
  { username: 'msantos', password: 'faculty123', name: 'Maria Santos', role: 'Faculty', active: true },
  { username: 'dreyes', password: 'faculty123', name: 'Daniel Reyes', role: 'Faculty', active: true },
  { username: 'adelacruz', password: 'faculty123', name: 'Alex Dela Cruz', role: 'Faculty', active: true },
  { username: 'alim', password: 'faculty123', name: 'Andrea Lim', role: 'Faculty', active: true },
  { username: 'student', password: 'student123', name: 'Student Demo', role: 'Student', active: true }
];
let accounts = JSON.parse(localStorage.getItem(STORAGE.accounts) || 'null') || seedAccounts;
let notifications = JSON.parse(localStorage.getItem(STORAGE.notifications) || 'null') || [];
const accountFor = username => accounts.find(account => account.username.toLowerCase() === String(username).toLowerCase());
{ const saved = currentUser && accountFor(currentUser.username); currentUser = saved && saved.active ? { username: saved.username, name: saved.name, role: saved.role } : null; }

let calendarOffset = 0;
let editingRoomId = null;
let toastTimer;

const byId = id => document.getElementById(id);
const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const roomById = id => rooms.find(room => Number(room.id) === Number(id));
const statusClass = status => String(status).toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
const timeToMinutes = time => { const [hours, minutes] = String(time).split(':').map(Number); return hours * 60 + minutes; };
const formatDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const formatShortDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' }) : '—';
const formatTime = value => { if (!value) return '—'; const [h, m] = value.split(':').map(Number); const d = new Date(); d.setHours(h, m, 0, 0); return d.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' }); };
const roleDisplayName = role => role === 'Faculty' ? 'Faculty / Professor' : role === 'Student' ? 'Student (View Only)' : role;
const canReserve = () => ['Administrator', 'Faculty'].includes(currentUser?.role);
const canManageOwnReservations = () => currentUser?.role === 'Faculty';
const toHHMM = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const makeNotificationSchedule = () => Array.from({ length: 4 }, (_, i) => ({ week: i + 1, scheduledDate: dateOffset((i + 1) * 7), sent: false }));
const isOwn = item => item.requestor.toLowerCase() === (currentUser?.name || '').toLowerCase();
const seriesOf = item => item.seriesId ? reservations.filter(r => r.seriesId === item.seriesId) : [item];
let editingReservationId = null;
const mayConfirm = item => currentUser?.role === 'Administrator' || (currentUser?.role === 'Faculty' && isOwn(item));
const canEditReservation = item => ['Pending Approval', 'Approved'].includes(item.status) && item.date >= localDateKey() && (currentUser?.role === 'Administrator' || (currentUser?.role === 'Faculty' && isOwn(item) && !item.fixed));
const saveData = () => { localStorage.setItem(STORAGE.rooms, JSON.stringify(rooms)); localStorage.setItem(STORAGE.reservations, JSON.stringify(reservations)); localStorage.setItem(STORAGE.accounts, JSON.stringify(accounts)); localStorage.setItem(STORAGE.notifications, JSON.stringify(notifications)); };

function login(event) {
  if (event) event.preventDefault();
  const account = accountFor(byId('username').value.trim());
  const message = byId('loginMessage');
  if (!account || account.password !== byId('password').value) { message.textContent = 'Incorrect username or password.'; return; }
  if (!account.active) { message.textContent = 'This account is deactivated. Please contact an administrator.'; return; }
  currentUser = { username: account.username, name: account.name, role: account.role };
  localStorage.setItem(STORAGE.user, JSON.stringify(currentUser));
  message.textContent = '';
  enterApp();
}

function enterApp() {
  if (!currentUser) return;
  byId('loginPage').classList.add('hidden');
  byId('appPage').classList.remove('hidden');
  byId('topUser').textContent = roleDisplayName(currentUser.role);
  byId('welcomeUser').textContent = currentUser.name;
  document.querySelectorAll('.role-admin').forEach(el => el.classList.toggle('hidden', currentUser.role !== 'Administrator'));
  document.querySelectorAll('.role-faculty').forEach(el => el.classList.toggle('hidden', currentUser.role !== 'Faculty'));
  document.querySelectorAll('.role-review').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.role-maint').forEach(el => el.classList.toggle('hidden', currentUser.role !== 'Maintenance'));
  document.querySelectorAll('.role-reserve').forEach(el => el.classList.toggle('hidden', !canReserve()));
  populateRoomSelects();
  refreshDashboard();
  showPage('dashboard');
  const unread = myAlerts().length;
  if (unread) showToast(`You have ${unread} new ${unread === 1 ? 'notification' : 'notifications'} about your reservations.`);
}

function logout() {
  currentUser = null;
  localStorage.removeItem(STORAGE.user);
  byId('appPage').classList.add('hidden');
  byId('loginPage').classList.remove('hidden');
  byId('password').value = '';
  byId('sidebar').classList.remove('collapsed');
}

function toggleSidebar() { byId('sidebar').classList.toggle('collapsed'); }

function showPage(pageName) {
  const allowedRoles = { reports: ['Administrator'], accounts: ['Administrator'], maintenance: ['Maintenance'] }[pageName];
  const allowedPage = !allowedRoles || allowedRoles.includes(currentUser?.role);
  if (!allowedPage) { showToast('This page is not available for your role.'); return; }
  closeRoomDrawer();
  document.querySelectorAll('.content-page').forEach(page => page.classList.add('hidden'));
  byId(pageName)?.classList.remove('hidden');
  document.querySelectorAll('.nav-button').forEach(button => button.classList.toggle('active', button.dataset.page === pageName));
  if (window.innerWidth <= 900) byId('sidebar').classList.add('collapsed');
  if (pageName === 'dashboard') refreshDashboard();
  if (pageName === 'calendar') renderCalendar();
  if (pageName === 'reservations') renderReservations();
  if (pageName === 'facilities') renderRooms();
  if (pageName === 'reports') renderReports();
  if (pageName === 'accounts') renderAccounts();
  if (pageName === 'maintenance') renderMaintenance();
}

function getReservationConflict(candidate, excludeId = null) {
  const room = roomById(candidate.roomId);
  if (!room) return 'Selected room no longer exists.';
  if (room.status === 'Maintenance') return `${room.name} is marked for maintenance.`;
  if (Number(candidate.attendees) > Number(room.capacity)) return `Capacity exceeded: ${room.name} holds ${room.capacity}, but ${candidate.attendees} attendees were entered.`;
  const missingEquipment = (candidate.equipment || []).filter(item => !room.equipment.includes(item));
  if (missingEquipment.length) return `Equipment unavailable in ${room.name}: ${missingEquipment.join(', ')}.`;
  if (!candidate.date || !candidate.start || !candidate.end || timeToMinutes(candidate.end) <= timeToMinutes(candidate.start)) return 'Please select a valid date and an end time later than the start time.';
  if (candidate.date < localDateKey()) return 'Reservations cannot be made for a past date.';
  const overlap = reservations.find(item => item.id !== excludeId && Number(item.roomId) === Number(candidate.roomId) && item.date === candidate.date && item.status === 'Approved' && timeToMinutes(candidate.start) < timeToMinutes(item.end) && timeToMinutes(candidate.end) > timeToMinutes(item.start));
  if (overlap) return `Double-booking conflict with ${overlap.id} (${overlap.title}, ${overlap.start}–${overlap.end}).`;
  return '';
}

function getRoomStatus(room, date = dateOffset(0), time = new Date().toTimeString().slice(0, 5)) {
  if (room.status === 'Maintenance') return 'Maintenance';
  const active = reservations.find(item => Number(item.roomId) === Number(room.id) && item.date === date && item.status === 'Approved' && item.occupancyConfirmedAt && timeToMinutes(time) >= timeToMinutes(item.start) && timeToMinutes(time) < timeToMinutes(item.end));
  if (active) return 'Occupied';
  const reservedToday = reservations.some(item => Number(item.roomId) === Number(room.id) && item.date === date && item.status === 'Approved' && timeToMinutes(item.end) > timeToMinutes(time));
  return reservedToday ? 'Reserved' : 'Available';
}

function refreshDashboard() {
  const today = dateOffset(0);
  const available = rooms.filter(room => getRoomStatus(room, today) === 'Available').length;
  byId('statRooms').textContent = rooms.length;
  byId('statAvailable').textContent = available;
  byId('statPending').textContent = reservations.filter(item => item.status === 'Approved' && item.date >= today).length;
  byId('statConflicts').textContent = reservations.filter(item => item.status === 'Pending Approval').length;
  const upcoming = reservations.filter(item => item.status === 'Approved' && item.date >= today).sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`)).slice(0, 5);
  byId('upcomingBody').innerHTML = upcoming.map(item => { const ownCancelable = currentUser?.role === 'Faculty' && item.requestor.toLowerCase() === currentUser.name.toLowerCase() && item.date >= localDateKey() && !item.fixed; const cancelControl = ownCancelable ? ` <button class="small-action danger-action" onclick="cancelReservation('${item.id}')">Cancel</button>` : ''; return `<tr><td><strong>${safe(item.title)}</strong><small class="table-subtext">${safe(item.type)}</small></td><td>${safe(roomById(item.roomId)?.name || 'Room removed')}</td><td>${formatShortDate(item.date)}<small class="table-subtext">${formatTime(item.start)}–${formatTime(item.end)}</small></td><td><span class="status-badge ${statusClass(item.status)}">${safe(item.status)}</span>${cancelControl}${confirmControl(item)}</td></tr>`; }).join('');
  byId('upcomingEmpty').classList.toggle('hidden', upcoming.length > 0);
  renderFacultyNotifications();
  renderAlerts();
}

function renderFacultyNotifications() {
  const panel = byId('facultyNotificationsPanel');
  const listNode = byId('facultyNotificationsList');
  const emptyNode = byId('facultyNotificationsEmpty');
  const weeksLabel = byId('notificationWeeksLabel');
  if (!panel || !listNode || !emptyNode || !weeksLabel) return;

  const isFaculty = currentUser?.role === 'Faculty';
  panel.classList.toggle('hidden', !isFaculty);
  if (!isFaculty) return;

  const today = localDateKey();
  const ownApproved = reservations
    .filter(item => item.status === 'Approved' && item.requestor.toLowerCase() === currentUser.name.toLowerCase())
    .sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`))
    .filter((item, i, all) => !item.seriesId || all.findIndex(r => r.seriesId === item.seriesId) === i);

  const notifications = ownApproved.map(reservation => {
    const schedule = Array.isArray(reservation.notificationSchedule) && reservation.notificationSchedule.length
      ? reservation.notificationSchedule
      : makeNotificationSchedule();
    const remaining = schedule.filter(item => item.scheduledDate >= today);
    const nextNotification = remaining.length ? remaining[0].scheduledDate : '';
    return { reservation, remainingWeeks: remaining.length, nextNotification };
  }).filter(item => item.remainingWeeks > 0);

  const maxWeeksLeft = notifications.reduce((max, item) => Math.max(max, item.remainingWeeks), 0);
  if (maxWeeksLeft > 0) {
    weeksLabel.textContent = `Weekly assignment notifications scheduled for ${maxWeeksLeft} ${maxWeeksLeft === 1 ? 'week' : 'weeks'}`;
  } else {
    weeksLabel.textContent = 'No weekly notifications remaining';
  }

  listNode.innerHTML = notifications.map(({ reservation, nextNotification }) => {
    const roomName = roomById(reservation.roomId)?.name || 'Room removed';
    return `<article class="faculty-notification-item">
      <span class="faculty-notification-icon" aria-hidden="true">🔔</span>
      <div class="faculty-notification-copy">
        <strong>${safe(roomName)} is reserved for ${safe(formatDate(reservation.date))}, ${safe(formatTime(reservation.start))}–${safe(formatTime(reservation.end))}.</strong>
        <p>${safe(reservation.title)}${reservation.seriesId ? ' · repeats weekly' : ''}</p>
        <small>Next notification will be on ${safe(formatDate(nextNotification))}.</small>
      </div>
      <span class="status-badge approved">Approved</span>
    </article>`;
  }).join('');
  emptyNode.classList.toggle('hidden', notifications.length > 0);
}
function populateRoomSelects() {
  const current = byId('resRoom')?.value;
  const options = rooms.map(room => `<option value="${room.id}">${safe(room.name)} · ${room.capacity} seats${room.status === 'Maintenance' ? ' · Maintenance' : ''}</option>`).join('');
  if (byId('resRoom')) byId('resRoom').innerHTML = options;
  if (current && roomById(current)) byId('resRoom').value = current;
  if (byId('calendarRoomFilter')) {
    const filterCurrent = byId('calendarRoomFilter').value || 'all';
    byId('calendarRoomFilter').innerHTML = `<option value="all">All rooms</option>${rooms.map(room => `<option value="${room.id}">${safe(room.name)}</option>`).join('')}`;
    byId('calendarRoomFilter').value = filterCurrent;
  }
}

function renderReservations() {
  const search = (byId('reservationSearch')?.value || '').toLowerCase().trim();
  const status = byId('reservationStatusFilter')?.value || 'all';
  const role = currentUser?.role;
  const today = localDateKey();
  const rank = { 'Pending Approval': 0, Approved: 1, Cancelled: 2 };
  let list = reservations.filter(item => item.status in rank);
  if (role === 'Faculty') list = list.filter(isOwn);
  const awaiting = new Set(list.filter(item => item.status === 'Pending Approval').map(item => item.seriesId || item.id)).size;
  byId('reservationSubtitle').textContent = awaiting ? `${awaiting} ${awaiting === 1 ? 'request is' : 'requests are'} awaiting approval` : 'Requests, approved assignments, and cancellations';
  if (status !== 'all') list = list.filter(item => item.status === status);
  if (search) list = list.filter(item => `${item.title} ${roomById(item.roomId)?.name || ''} ${item.id} ${item.requestor}`.toLowerCase().includes(search));
  list.sort((a, b) => rank[a.status] - rank[b.status] || (a.status === 'Pending Approval' ? 1 : -1) * `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
  const seen = new Set();
  list = list.filter(item => { if (item.status !== 'Pending Approval' || !item.seriesId) return true; if (seen.has(item.seriesId)) return false; seen.add(item.seriesId); return true; });
  const btn = (label, fn, danger) => `<button class="small-action${danger ? ' danger-action' : ''}" onclick="${fn}">${label}</button>`;
  byId('reservationBody').innerHTML = list.map(item => {
    const pending = item.status === 'Pending Approval';
    const group = pending ? seriesOf(item).filter(r => r.status === 'Pending Approval') : [item];
    const multi = group.length > 1;
    const admin = role === 'Administrator';
    const mine = role === 'Faculty' && isOwn(item) && item.date >= today && !item.fixed;
    const remaining = item.seriesId ? seriesOf(item).filter(r => r.status !== 'Cancelled' && r.date >= today).length : 0;
    let actions = '';
    if (pending && admin) actions = btn(multi ? 'Approve all' : 'Approve', `decideReservation('${item.id}','Approved')`) + ' ' + btn(multi ? 'Reject all' : 'Reject', `decideReservation('${item.id}','Cancelled')`, true);
    else if (pending && mine) actions = btn(multi ? 'Cancel request' : 'Cancel', `cancelReservation('${item.id}',${multi})`, true);
    else if (item.status === 'Approved' && (admin || mine)) actions = btn('Cancel', `cancelReservation('${item.id}')`, true) + (remaining > 1 ? ' ' + btn('Cancel series', `cancelReservation('${item.id}',true)`, true) : '');
    else if (item.status === 'Cancelled' && admin) actions = btn('Restore', `decideReservation('${item.id}','Approved')`);
    if (item.status === 'Approved') actions = confirmControl(item) + ' ' + actions;
    if (!multi && canEditReservation(item)) actions = btn('Edit', `editReservation('${item.id}')`) + ' ' + actions;
    const seriesNote = item.seriesId ? `<small class="table-subtext">↻ Weekly · ${multi ? `${group.length} sessions` : `session ${item.seriesIndex} of ${item.seriesCount}`}</small>` : '';
    const when = multi ? `${formatDate(group[0].date)} – ${formatDate(group[group.length - 1].date)}` : formatDate(item.date);
    return `<tr><td><strong>${safe(item.id)}</strong></td><td>${safe(item.title)}<small class="table-subtext">${safe(item.type)} · ${item.attendees} attendees</small>${seriesNote}${item.fixed ? '<small class="table-subtext">🔒 Fixed schedule</small>' : ''}</td><td>${safe(roomById(item.roomId)?.name || 'Room removed')}</td><td>${when}</td><td>${formatTime(item.start)}–${formatTime(item.end)}</td><td>${safe(item.requestor)}</td><td><span class="status-badge ${statusClass(item.status)}">${safe(item.status)}</span></td>${canReserve() ? `<td>${actions}</td>` : ''}</tr>`;
  }).join('');
  byId('reservationsEmpty').classList.toggle('hidden', list.length > 0);
}

function decideReservation(id, decision) {
  if (currentUser?.role !== 'Administrator') { showToast('Only administrators can approve or reject reservations.'); return; }
  const item = reservations.find(reservation => reservation.id === id);
  if (!item) return;
  const targets = item.status === 'Pending Approval' ? seriesOf(item).filter(r => r.status === 'Pending Approval') : [item];
  const label = targets.length > 1 ? `${targets.length} sessions` : id;
  if (decision === 'Approved') {
    const blocked = targets.map(t => getReservationConflict(t, t.id)).filter(Boolean);
    if (blocked.length) { showToast(`Cannot approve: ${blocked[0]}${blocked.length > 1 ? ` (+${blocked.length - 1} more dates)` : ''}`); return; }
    targets.forEach(t => Object.assign(t, { status: 'Approved', approvedAt: new Date().toISOString(), releaseReason: '', notificationSchedule: makeNotificationSchedule() }));
    notifyApproved(targets);
    showToast(`${label} approved. Four weekly notifications are scheduled for the next month.`);
  } else {
    targets.forEach(t => Object.assign(t, { status: 'Cancelled', releaseReason: 'Reservation request rejected by administrator.' }));
    notifyCancelled(targets, 'rejected by an administrator');
    showToast(`${label} rejected.`);
  }
  saveData(); refreshAll();
}

function openReservationModal(roomId = null, date = null, start = null, end = null, attendees = null, editId = null) {
  if (!canReserve()) { showToast('Student accounts have view-only access.'); return; }
  byId('reservationForm').reset();
  byId('resDate').value = dateOffset(1);
  byId('resDate').min = localDateKey();
  byId('repeatOptions').classList.add('hidden');
  byId('resStart').value = '09:00';
  byId('resEnd').value = '10:00';
  byId('resAttendees').value = '30';
  byId('resRequestor').value = currentUser?.name || '';
  byId('resRequestor').readOnly = currentUser?.role !== 'Administrator';
  byId('reservationValidation').classList.add('hidden');
  byId('reservationMessage').textContent = '';
  populateRoomSelects();
  if (roomId) byId('resRoom').value = String(roomId);
  if (date) byId('resDate').value = date;
  if (start) byId('resStart').value = start;
  if (end) byId('resEnd').value = end;
  if (attendees) byId('resAttendees').value = attendees;
  editingReservationId = editId;
  const editing = editId && reservations.find(r => r.id === editId);
  if (editing) { byId('resTitle').value = editing.title; byId('resRequestor').value = editing.requestor; byId('resType').value = editing.type; document.querySelectorAll('input[name="equipment"]').forEach(box => { box.checked = (editing.equipment || []).includes(box.value); }); }
  byId('repeatBlock').classList.toggle('hidden', !!editing);
  byId('fixedBlock').style.display = editing ? 'none' : '';
  byId('reservationModalTitle').textContent = editing ? `Edit ${editId}` : 'Reserve a classroom or facility';
  byId('reservationSubmit').firstChild.textContent = editing ? 'Save changes ' : 'Reserve classroom ';
  byId('reservationModal').classList.remove('hidden');
  validateReservationForm();
}
function closeReservationModal() { byId('reservationModal').classList.add('hidden'); }

function getRepeatDates(date) {
  if (!byId('resRepeat').checked) return { dates: [date] };
  const days = [...document.querySelectorAll('input[name="repeatDay"]:checked')].map(input => Number(input.value));
  const until = byId('resUntil').value;
  if (!days.length || !until) return { dates: [], error: 'Choose the days to repeat on and a "Repeat until" date.' };
  if (until < date) return { dates: [], error: 'The "Repeat until" date must be on or after the start date.' };
  const day = new Date(`${date}T12:00:00`), end = new Date(`${until}T12:00:00`), dates = [];
  if ((end - day) / 864e5 > 126) return { dates: [], error: 'Weekly repeats can run for at most 18 weeks.' };
  for (; day <= end; day.setDate(day.getDate() + 1)) if (days.includes(day.getDay())) dates.push(localDateKey(day));
  return dates.length ? { dates } : { dates: [], error: 'None of the selected days fall before the end date.' };
}
function checkReservationForm() {
  const candidate = getFormReservation();
  const { dates, error } = getRepeatDates(candidate.date);
  if (error) return { candidate, dates, issue: error };
  const clashes = dates.map(date => ({ date, issue: getReservationConflict({ ...candidate, date }, editingReservationId) })).filter(item => item.issue);
  if (!clashes.length) return { candidate, dates, issue: '' };
  const issue = dates.length === 1 ? clashes[0].issue : `${clashes.length} of ${dates.length} dates have a conflict. ${clashes.slice(0, 3).map(item => `${formatShortDate(item.date)}: ${item.issue}`).join(' ')}${clashes.length > 3 ? ' …' : ''}`;
  return { candidate, dates, issue };
}
function validateReservationForm() {
  const { candidate, dates, issue } = checkReservationForm();
  renderRoomSchedule(candidate);
  const box = byId('reservationValidation');
  if (!candidate.title || !candidate.requestor || !candidate.date) { box.classList.add('hidden'); return; }
  box.classList.remove('hidden');
  box.className = `validation-box ${issue ? 'invalid' : 'valid'}`;
  box.textContent = issue ? `⚠ ${issue}` : `✓ No schedule conflict detected${dates.length > 1 ? ` on all ${dates.length} dates` : ''}. Capacity and requested equipment are compatible.`;
  return !issue;
}
function getFormReservation() {
  return {
    title: byId('resTitle').value.trim(), requestor: byId('resRequestor').value.trim(), roomId: Number(byId('resRoom').value),
    attendees: Number(byId('resAttendees').value), date: byId('resDate').value, start: byId('resStart').value, end: byId('resEnd').value,
    type: byId('resType').value, equipment: [...document.querySelectorAll('input[name="equipment"]:checked')].map(input => input.value)
  };
}
function submitReservation(event) {
  event.preventDefault();
  if (!canReserve()) { showToast('Student accounts cannot submit reservations.'); closeReservationModal(); return; }
  const { candidate, dates, issue } = checkReservationForm();
  if (issue) {
    byId('reservationValidation').className = 'validation-box invalid';
    byId('reservationValidation').textContent = `⚠ ${issue}`;
    byId('reservationMessage').textContent = 'Please fix the issue before submitting.';
    return;
  }
  if (editingReservationId) { saveReservationEdit(candidate); return; }
  const fixed = currentUser?.role === 'Administrator' && byId('resFixed').checked;
  const firstId = Math.max(1000, ...reservations.map(item => Number(String(item.id).replace('CR-', '')) || 0)) + 1;
  const seriesId = dates.length > 1 ? `SR-${Date.now().toString(36).toUpperCase()}` : null;
  const created = dates.map((date, index) => ({ ...candidate, date, id: `CR-${firstId + index}`, role: currentUser?.role || 'Faculty', status: fixed ? 'Approved' : 'Pending Approval', ...(fixed ? { fixed: true, approvedAt: new Date().toISOString() } : {}), submittedAt: new Date().toISOString(), conflict: '', occupancyConfirmedAt: null, releaseReason: '', notificationSchedule: fixed ? makeNotificationSchedule() : [], ...(seriesId ? { seriesId, seriesIndex: index + 1, seriesCount: dates.length } : {}) }));
  reservations.push(...created);
  if (fixed) notifyApproved(created);
  saveData(); closeReservationModal(); refreshAll();
  showToast(`${created.length > 1 ? `${created.length} weekly sessions` : created[0].id} ${fixed ? 'created as a fixed schedule and approved.' : 'submitted. The administrator must manually approve the room assignment.'}`);
}
function cancelReservation(id, wholeSeries = false) {
  const item = reservations.find(reservation => reservation.id === id);
  if (!item || item.status === 'Cancelled') return;
  const mayCancel = currentUser?.role === 'Administrator' || (currentUser?.role === 'Faculty' && isOwn(item) && ['Approved', 'Pending Approval'].includes(item.status) && item.date >= localDateKey() && !item.fixed);
  if (!mayCancel) { showToast('Only the requesting faculty member can cancel their own upcoming reservation. Fixed schedules can only be changed by an administrator.'); return; }
  const targets = wholeSeries ? seriesOf(item).filter(r => r.status !== 'Cancelled' && r.date >= localDateKey()) : [item];
  targets.forEach(t => Object.assign(t, { status: 'Cancelled', conflict: '', releaseReason: `Cancelled by ${currentUser.name}.` }));
  if (currentUser.role === 'Administrator') notifyCancelled(targets, 'cancelled by an administrator');
  saveData(); refreshAll();
  showToast(targets.length > 1 ? `${targets.length} sessions cancelled by ${currentUser.name}.` : `${id} was manually cancelled by ${currentUser.name}.`);
}

function renderCalendar() {
  const start = new Date(); start.setHours(12, 0, 0, 0); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + calendarOffset * 7);
  const days = Array.from({ length: 7 }, (_, index) => { const day = new Date(start); day.setDate(start.getDate() + index); return day; });
  const end = days[6];
  byId('calendarRange').textContent = `${days[0].toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const roomFilter = byId('calendarRoomFilter').value || 'all';
  const statusFilter = byId('calendarStatusFilter').value || 'all';
  const selectedRooms = rooms.filter(room => roomFilter === 'all' || Number(room.id) === Number(roomFilter));
  const dayHeader = `<div class="calendar-corner">ROOM / DATE</div>${days.map(day => `<div class="calendar-day-heading"><span>${day.toLocaleDateString('en-PH', { weekday: 'short' }).toUpperCase()}</span><strong>${day.getDate()}</strong></div>`).join('')}`;
  const rows = selectedRooms.map(room => `<button class="calendar-room-name" onclick="openRoomDrawer(${room.id})" title="View schedule"><strong>${safe(room.name)}</strong><small>${room.capacity} seats</small></button>${days.map(day => {
    const iso = day.toISOString().slice(0, 10);
    const status = getRoomStatus(room, iso, '12:00');
    const bookings = reservations.filter(item => Number(item.roomId) === Number(room.id) && item.date === iso && item.status === 'Approved').sort((a,b) => a.start.localeCompare(b.start));
    const visibleBookings = statusFilter === 'all' ? bookings : bookings.filter(item => item.status === statusFilter || status === statusFilter);
    if (statusFilter !== 'all' && statusFilter !== status && !visibleBookings.length) return canReserve() ? `<div class="calendar-cell empty-cell"><button onclick="openReservationModal(${room.id},'${iso}')" aria-label="Request ${safe(room.name)}">＋</button></div>` : '<div class="calendar-cell empty-cell"></div>';
    if (room.status === 'Maintenance' && statusFilter !== 'Reserved' && statusFilter !== 'Occupied') return `<div class="calendar-cell"><span class="calendar-event maintenance">Maintenance</span></div>`;
    if (visibleBookings.length) return `<div class="calendar-cell">${visibleBookings.map(item => `<button class="calendar-event ${statusClass(item.status === 'Approved' ? 'Reserved' : item.status)}" onclick="openRoomDrawer(${room.id},'${iso}')" title="${safe(item.title)} ${item.start}–${item.end}"><strong>${safe(item.title)}</strong><small>${formatTime(item.start)}–${formatTime(item.end)}</small></button>`).join('')}</div>`;
    const label = status === 'Available' ? 'Available' : status;
    if (status === 'Available' && !canReserve()) return `<div class="calendar-cell"><div class="calendar-event available"><strong>Available</strong><small>View only</small></div></div>`;
    if (status !== 'Available') return `<div class="calendar-cell"><button class="calendar-event ${statusClass(status)}" onclick="openRoomDrawer(${room.id},'${iso}')"><strong>${label}</strong><small>View schedule</small></button></div>`;
    return `<div class="calendar-cell"><button class="calendar-event available" onclick="openReservationModal(${room.id},'${iso}')"><strong>${label}</strong><small>Request room</small></button></div>`;
  }).join('')}`).join('');
  byId('calendarGrid').innerHTML = dayHeader + (rows || '<div class="empty-state">No classrooms registered.</div>');
}
function shiftCalendar(amount) { calendarOffset += amount; renderCalendar(); }
function resetCalendar() { calendarOffset = 0; renderCalendar(); }

function renderRooms() {
  const filter = byId('roomStatusFilter')?.value || 'all';
  const search = availabilityFilter(), when = search.timed ? [search.date, search.start] : [];
  const list = rooms.filter(room => (filter === 'all' || getRoomStatus(room, ...when) === filter) && (!search.active || search.test(room)));
  const sortMode = byId('roomSort')?.value || 'default';
  if (sortMode !== 'default') list.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) * (sortMode === 'za' ? -1 : 1));
  byId('availSummary').textContent = !search.active ? '' : search.timed ? `${list.length} of ${rooms.length} rooms are free for ${formatShortDate(search.date)}, ${formatTime(search.start)}–${formatTime(search.end)}.` : `${list.length} of ${rooms.length} rooms match. Add a date, start and end time to also check availability.`;
  byId('roomGrid').innerHTML = list.map(room => {
    const status = getRoomStatus(room, ...when);
    const reserveButton = canReserve() ? `<button class="primary-button" ${status === 'Maintenance' ? 'disabled' : ''} onclick="openReservationModal(${room.id}${search.timed ? `,'${search.date}','${search.start}','${search.end}',${search.capacity || 30}` : ''})">Reserve →</button>` : '';
    return `<article class="room-card" data-room="${room.id}"><div class="room-card-art ${statusClass(status)}"><span class="room-type-icon">${room.type === 'Laboratory' || room.type === 'Computer Lab' ? '⌘' : room.type === 'Auditorium' ? '▤' : '▣'}</span><span class="status-badge ${statusClass(status)}">${status}</span></div><div class="room-card-content"><p class="eyebrow">${safe(room.type).toUpperCase()}</p><h2>${safe(room.name)}</h2><p class="room-building">${safe(room.building)}</p><div class="room-metrics"><div><small>CAPACITY</small><strong>${room.capacity} <span>seats</span></strong></div><div><small>EQUIPMENT</small><strong>${room.equipment.length} <span>items</span></strong></div></div><div class="equipment-tags">${room.equipment.map(item => `<span>${safe(item)}</span>`).join('')}</div><div class="room-card-actions"><button class="secondary-button" onclick="openRoomDrawer(${room.id})">Schedule</button>${reserveButton}${currentUser?.role === 'Administrator' ? `<button class="small-action" onclick="editRoom(${room.id})">Edit</button><button class="small-action danger-action" onclick="deleteRoom(${room.id})">Delete</button>` : ''}</div></div></article>`;
  }).join('');
  if (!list.length) byId('roomGrid').innerHTML = '<p class="empty-state">No rooms match your search or status filter.</p>';
}
const DAY_START = 7 * 60, DAY_END = 21 * 60;
function roomDayScheduleHTML(roomId, date, req = null) {
  const room = roomById(roomId);
  if (!room) return '';
  if (room.status === 'Maintenance') return '<p class="empty-state">This room is under maintenance and cannot be booked.</p>';
  const bookings = reservations.filter(r => Number(r.roomId) === Number(roomId) && r.date === date && ['Approved', 'Pending Approval'].includes(r.status)).sort((a, b) => a.start.localeCompare(b.start));
  const free = []; let cursor = DAY_START;
  bookings.filter(b => b.status === 'Approved').forEach(b => { const s = timeToMinutes(b.start); if (s > cursor) free.push([cursor, s]); cursor = Math.max(cursor, timeToMinutes(b.end)); });
  if (cursor < DAY_END) free.push([cursor, DAY_END]);
  const clash = b => req && b.status === 'Approved' && b.id !== editingReservationId && timeToMinutes(req.start) < timeToMinutes(b.end) && timeToMinutes(req.end) > timeToMinutes(b.start);
  const booked = bookings.length ? `<ul class="slot-list">${bookings.map(b => `<li class="${clash(b) ? 'clash' : ''}"><strong>${formatTime(b.start)}–${formatTime(b.end)}</strong><span>${safe(b.title)}</span>${b.status === 'Pending Approval' ? '<em>Pending</em>' : ''}</li>`).join('')}</ul>` : '<p class="muted">No bookings on this day.</p>';
  const freeList = free.length ? `<ul class="slot-list free">${free.map(([s, e]) => { const text = `${formatTime(toHHMM(s))}–${formatTime(toHHMM(e))}`; return `<li>${req ? `<button type="button" class="free-slot" onclick="useFreeSlot('${toHHMM(s)}','${toHHMM(e)}')">${text}</button>` : `<strong>${text}</strong>`}</li>`; }).join('')}</ul>${req ? '<p class="muted">Select a free time to fill in the form.</p>' : ''}` : '<p class="muted">Fully booked from 7:00 AM to 9:00 PM.</p>';
  return `<h3>Booked</h3>${booked}<h3>Free</h3>${freeList}`;
}
function renderRoomSchedule(candidate) {
  const room = roomById(candidate.roomId), box = byId('roomSchedule');
  if (!room || !candidate.date) { box.innerHTML = ''; return; }
  box.innerHTML = `<h2>${safe(room.name)}</h2><p class="schedule-date">${safe(room.building)} · ${room.capacity} seats · ${formatShortDate(candidate.date)}</p>${roomDayScheduleHTML(room.id, candidate.date, candidate)}`;
}
function useFreeSlot(start, end) {
  const duration = timeToMinutes(byId('resEnd').value) - timeToMinutes(byId('resStart').value) || 60;
  byId('resStart').value = start;
  byId('resEnd').value = toHHMM(Math.min(timeToMinutes(end), timeToMinutes(start) + Math.max(30, duration)));
  validateReservationForm();
}
let drawerState = null;
function renderRoomDrawer() {
  const room = roomById(drawerState.roomId), { date } = drawerState;
  if (!room) return closeRoomDrawer();
  const reserve = canReserve() && room.status !== 'Maintenance' ? '<button class="primary-button full-width" onclick="reserveFromDrawer()">Reserve this room</button>' : '';
  byId('roomDrawerBody').innerHTML = `<p class="eyebrow">${safe(room.type).toUpperCase()}</p><h2>${safe(room.name)}</h2><p class="room-building">${safe(room.building)} · ${room.capacity} seats · ${getRoomStatus(room)} now</p><div class="equipment-tags">${room.equipment.map(item => `<span>${safe(item)}</span>`).join('')}</div><div class="drawer-day"><button class="icon-button" onclick="shiftDrawerDay(-1)" aria-label="Previous day">‹</button><strong>${formatShortDate(date)}</strong><button class="icon-button" onclick="shiftDrawerDay(1)" aria-label="Next day">›</button></div>${roomDayScheduleHTML(room.id, date)}${reserve}`;
}
function openRoomDrawer(id, date = dateOffset(0)) { drawerState = { roomId: id, date }; renderRoomDrawer(); byId('roomDrawer').classList.remove('hidden'); }
function closeRoomDrawer() { byId('roomDrawer')?.classList.add('hidden'); }
function shiftDrawerDay(amount) { const day = new Date(`${drawerState.date}T12:00:00`); day.setDate(day.getDate() + amount); drawerState.date = localDateKey(day); renderRoomDrawer(); }
function reserveFromDrawer() { const { roomId, date } = drawerState; closeRoomDrawer(); openReservationModal(roomId, date); }
function openRoomModal(room = null) {
  if (currentUser?.role !== 'Administrator') { showToast('Only administrators can manage the room inventory.'); return; }
  editingRoomId = room?.id || null;
  byId('roomForm').reset(); byId('roomMessage').textContent = '';
  byId('roomModalTitle').textContent = room ? 'Edit classroom' : 'Add classroom';
  if (room) {
    byId('roomName').value = room.name; byId('roomBuilding').value = room.building; byId('roomCapacity').value = room.capacity;
    byId('roomType').value = room.type; byId('roomEquipment').value = room.equipment.join(', ');
  }
  byId('roomModal').classList.remove('hidden');
}
function closeRoomModal() { byId('roomModal').classList.add('hidden'); }
function editRoom(id) { openRoomModal(roomById(id)); }
function deleteRoom(id) {
  if (currentUser?.role !== 'Administrator') { showToast('Only administrators can delete rooms.'); return; }
  const room = roomById(id);
  if (!room) return;
  const affected = upcomingInRoom(room);
  if (!confirm(`Delete ${room.name}?${affected.length ? ` Its ${affected.length} upcoming reservation${affected.length === 1 ? '' : 's'} will be cancelled and the requesters notified.` : ''} This cannot be undone.`)) return;
  const groups = new Map();
  affected.forEach(item => { const key = item.seriesId || item.id; groups.set(key, [...(groups.get(key) || []), item]); });
  groups.forEach(group => notifyCancelled(group, `cancelled because ${room.name} was removed`));
  affected.forEach(item => Object.assign(item, { status: 'Cancelled', releaseReason: `${room.name} was removed.` }));
  rooms.splice(rooms.indexOf(room), 1);
  saveData(); closeRoomDrawer(); populateRoomSelects(); refreshAll();
  showToast(`${room.name} was deleted.`);
}
function saveRoom(event) {
  event.preventDefault();
  if (currentUser?.role !== 'Administrator') { showToast('Only administrators can manage classroom records.'); return; }
  const room = { name: byId('roomName').value.trim(), building: byId('roomBuilding').value.trim(), capacity: Number(byId('roomCapacity').value), type: byId('roomType').value, status: editingRoomId ? roomById(editingRoomId).status : 'Available', equipment: byId('roomEquipment').value.split(',').map(value => value.trim()).filter(Boolean) };
  if (!room.name || !room.building || room.capacity < 1) { byId('roomMessage').textContent = 'Please complete the room details.'; return; }
  if (editingRoomId) Object.assign(roomById(editingRoomId), room);
  else { room.id = Math.max(0, ...rooms.map(item => Number(item.id)), ...reservations.map(item => Number(item.roomId) || 0)) + 1; rooms.push(room); }
  saveData(); closeRoomModal(); populateRoomSelects(); refreshAll(); showToast('Classroom inventory saved.');
}

function canConfirmOccupancy(item) {
  if (!item || item.status !== 'Approved' || item.occupancyConfirmedAt || item.date !== localDateKey()) return false;
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(item.start);
  const end = timeToMinutes(item.end);
  return minutesNow >= start && minutesNow < end;
}
function confirmControl(item) {
  if (item.status === 'Approved' && item.occupancyConfirmedAt) return '<small class="table-subtext">✓ Usage confirmed</small>';
  return canConfirmOccupancy(item) && mayConfirm(item) ? ` <button class="small-action" onclick="confirmOccupancy('${item.id}')">Confirm usage</button>` : '';
}
function editReservation(id) {
  const item = reservations.find(r => r.id === id);
  if (!item || !canEditReservation(item)) { showToast('You cannot edit this reservation.'); return; }
  openReservationModal(item.roomId, item.date, item.start, item.end, item.attendees, id);
}
function saveReservationEdit(candidate) {
  const item = reservations.find(r => r.id === editingReservationId);
  if (!item || !canEditReservation(item)) { showToast('You cannot edit this reservation.'); closeReservationModal(); return; }
  const admin = currentUser.role === 'Administrator', reapprove = !admin && item.status === 'Approved';
  Object.assign(item, { ...candidate, requestor: admin ? candidate.requestor : item.requestor, occupancyConfirmedAt: null, editedAt: new Date().toISOString(), editedBy: currentUser.name }, reapprove ? { status: 'Pending Approval', notificationSchedule: [] } : {});
  if (admin && !isOwn(item)) notify(item.requestor, `${describeGroup([item])} was updated by an administrator.`);
  saveData(); closeReservationModal(); refreshAll();
  showToast(reapprove ? `${item.id} updated and sent back to the administrator for re-approval.` : `${item.id} updated.`);
}
function availabilityFilter() {
  const date = byId('availDate').value, start = byId('availStart').value, end = byId('availEnd').value, capacity = Number(byId('availCapacity').value) || 0;
  const equipment = [...document.querySelectorAll('input[name="availEquip"]:checked')].map(box => box.value);
  const timed = !!(date && start && end && timeToMinutes(end) > timeToMinutes(start));
  const test = room => room.status !== 'Maintenance' && room.capacity >= capacity && equipment.every(item => room.equipment.includes(item)) && (!timed || !reservations.some(r => Number(r.roomId) === Number(room.id) && r.date === date && r.status === 'Approved' && timeToMinutes(start) < timeToMinutes(r.end) && timeToMinutes(end) > timeToMinutes(r.start)));
  return { active: !!(date || start || end || capacity || equipment.length), timed, date, start, end, capacity, test };
}
function clearAvailability() { byId('availabilitySearch').reset(); renderRooms(); }
function confirmOccupancy(id) {
  const item = reservations.find(reservation => reservation.id === id);
  if (!item || !['Administrator', 'Faculty'].includes(currentUser?.role)) { showToast('You do not have permission to confirm occupancy.'); return; }
  if (currentUser.role !== 'Administrator' && item.requestor.toLowerCase() !== currentUser.name.toLowerCase()) { showToast('Only the requesting faculty member or an administrator can confirm occupancy.'); return; }
  if (!canConfirmOccupancy(item)) { showToast('Usage can be confirmed only while the reservation is in progress.'); return; }
  item.occupancyConfirmedAt = new Date().toISOString();
  saveData(); refreshAll(); showToast(`${id}: temporary occupancy confirmed. The system does not physically verify room use.`);
}
function renderReports() {
  const total = reservations.length, approved = reservations.filter(item => item.status === 'Approved').length;
  const conflictCount = reservations.filter(item => item.status === 'Pending Approval').length;
  byId('reportTotal').textContent = total; byId('reportApproved').textContent = approved;
  byId('reportRate').textContent = total ? `${Math.round(approved / total * 100)}%` : '0%'; byId('reportConflicts').textContent = conflictCount;
  const statuses = ['Approved', 'Cancelled'];
  byId('statusReport').innerHTML = statuses.map(status => { const count = reservations.filter(item => item.status === status).length; const width = total ? count / total * 100 : 0; return `<div class="bar-row"><div><span>${status}</span><strong>${count}</strong></div><div class="bar-track"><span class="bar-fill ${statusClass(status)}" style="width:${width}%"></span></div></div>`; }).join('');
  byId('utilizationReport').innerHTML = rooms.map(room => { const count = reservations.filter(item => Number(item.roomId) === Number(room.id) && item.status === 'Approved').length; const max = Math.max(1, ...rooms.map(r => reservations.filter(item => Number(item.roomId) === Number(r.id) && item.status === 'Approved').length)); return `<div class="bar-row"><div><span>${safe(room.name)}</span><strong>${count} bookings</strong></div><div class="bar-track"><span class="bar-fill room-fill" style="width:${count / max * 100}%"></span></div></div>`; }).join('');
}
function downloadCsv(filename, rows) {
  const csv = rows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}
function exportReport() {
  if (currentUser?.role !== 'Administrator') { showToast('Only administrators can export reports.'); return; }
  const headers = ['Request ID','Activity','Requestor','Room','Building','Date','Start','End','Attendees','Type','Equipment','Status','Conflict'];
  const rows = reservations.map(item => [item.id, item.title, item.requestor, roomById(item.roomId)?.name || 'Room removed', roomById(item.roomId)?.building || '', item.date, item.start, item.end, item.attendees, item.type, (item.equipment || []).join('; '), item.status, item.conflict || '']);
  downloadCsv(`classroomed-reservations-${dateOffset(0)}.csv`, [headers, ...rows]); showToast('Reservation report exported as CSV.');
}

const myAlerts = () => notifications.filter(item => item.to.toLowerCase() === (currentUser?.name || '').toLowerCase());
function notify(to, text, kind = 'info') { notifications.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, to, text, kind, at: new Date().toISOString() }); }
function describeGroup(group) {
  const first = group[0], room = roomById(first.roomId)?.name || 'the room';
  return group.length > 1 ? `Your weekly request "${first.title}" in ${room} (${group.length} sessions, ${formatDate(first.date)} – ${formatDate(group[group.length - 1].date)})` : `Your request ${first.id} "${first.title}" in ${room} on ${formatDate(first.date)}, ${formatTime(first.start)}–${formatTime(first.end)}`;
}
function notifyCancelled(group, outcome) {
  if (!group[0] || isOwn(group[0])) return;
  notify(group[0].requestor, `${describeGroup(group)} was ${outcome}.`, outcome.startsWith('rejected') ? 'rejected' : 'cancelled');
}
function notifyApproved(group) { if (group[0] && !isOwn(group[0])) notify(group[0].requestor, `${describeGroup(group)} was approved.`, 'approved'); }
function renderAlerts() {
  const list = myAlerts(), badge = byId('alertCount');
  byId('alertsPanel').classList.toggle('hidden', !list.length);
  badge.textContent = list.length; badge.classList.toggle('hidden', !list.length);
  byId('alertsList').innerHTML = list.map(item => `<article class="faculty-notification-item"><span class="faculty-notification-icon alert-${item.kind || 'info'}" aria-hidden="true">${{ approved: '✓', rejected: '✕', cancelled: '⊘' }[item.kind] || '⚠'}</span><div class="faculty-notification-copy"><strong>${safe(item.text)}</strong><small>${new Date(item.at).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</small></div><button class="small-action" onclick="dismissAlert('${item.id}')">Dismiss</button></article>`).join('');
}
function dismissAlert(id) { notifications = notifications.filter(item => item.id !== id); saveData(); renderAlerts(); }
function clearAlerts() { const mine = new Set(myAlerts().map(item => item.id)); notifications = notifications.filter(item => !mine.has(item.id)); saveData(); renderAlerts(); }

const creatableRoles = () => ['Faculty', 'Student'];
const manageableAccount = account => creatableRoles().includes(account.role);
function renderAccounts() {
  const list = accounts.filter(manageableAccount).sort((a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name));
  byId('accountBody').innerHTML = list.map(account => `<tr><td><strong>${safe(account.name)}</strong></td><td>${safe(account.username)}</td><td>${roleDisplayName(account.role)}</td><td><span class="status-badge ${account.active ? 'approved' : 'cancelled'}">${account.active ? 'Active' : 'Deactivated'}</span></td><td>${manageableAccount(account) ? `<button class="small-action${account.active ? ' danger-action' : ''}" onclick="toggleAccount('${safe(account.username)}')">${account.active ? 'Deactivate' : 'Reactivate'}</button> <button class="small-action danger-action" onclick="deleteAccount('${safe(account.username)}')">Delete</button>` : ''}</td></tr>`).join('');
}
function openAccountModal() {
  if (currentUser?.role !== 'Administrator') { showToast('Only administrators can create accounts.'); return; }
  byId('accountForm').reset(); byId('accountMessage').textContent = '';
  byId('accRole').innerHTML = creatableRoles().map(role => `<option value="${role}">${roleDisplayName(role)}</option>`).join('');
  byId('accountModal').classList.remove('hidden');
}
function closeAccountModal() { byId('accountModal').classList.add('hidden'); }
function saveAccount(event) {
  event.preventDefault();
  if (currentUser?.role !== 'Administrator') return;
  const account = { name: byId('accName').value.trim(), username: byId('accUsername').value.trim(), password: byId('accPassword').value, role: byId('accRole').value, active: true };
  const fail = text => { byId('accountMessage').textContent = text; };
  if (!account.name) return fail('Enter a full name.');
  if (!creatableRoles().includes(account.role)) return fail('You cannot create accounts with that role.');
  if (!/^[a-z0-9._-]{3,40}$/i.test(account.username)) return fail('Usernames use 3–40 letters, numbers, dots, dashes, or underscores.');
  if (accountFor(account.username)) return fail('That username is already taken.');
  if (accounts.some(item => item.name.toLowerCase() === account.name.toLowerCase())) return fail('An account with this full name already exists.');
  if (account.password.length < 6) return fail('Use a temporary password of at least 6 characters.');
  accounts.push(account); saveData(); closeAccountModal(); renderAccounts();
  showToast(`${roleDisplayName(account.role)} account created for ${account.name}. Share the temporary password with them privately.`);
}
let bulkCreated = [];
const TEMP_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
const tempPassword = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), n => TEMP_CHARS[n % TEMP_CHARS.length]).join('');
function usernameFromName(name, taken) {
  const parts = name.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  let base = ((parts.length > 1 ? parts[0][0] : '') + (parts[parts.length - 1] || '')).slice(0, 30);
  if (base.length < 3) base += 'usr';
  let candidate = base, n = 2;
  while (taken.has(candidate)) candidate = base + n++;
  return candidate;
}
function parseBulk() {
  const allowed = creatableRoles(), fallback = byId('bulkRole').value;
  const taken = new Set(accounts.map(a => a.username.toLowerCase())), names = new Set(accounts.map(a => a.name.toLowerCase()));
  return byId('bulkText').value.split(/\r?\n/).map(line => line.trim()).filter(line => line && !/^(full )?name\s*[,\t]/i.test(line)).map(line => {
    const [name = '', user = '', roleText = '', password = ''] = line.split(/\t|,/).map(part => part.trim().replace(/^"|"$/g, ''));
    const role = allowed.find(r => (roleText || fallback).toLowerCase().startsWith(r.toLowerCase()));
    const row = { line, name, role, password, username: user || (name ? usernameFromName(name, taken) : ''), error: '' };
    if (!name) row.error = 'Missing full name.';
    else if (names.has(name.toLowerCase())) row.error = 'An account with this name already exists or is repeated.';
    else if (!role) row.error = `You cannot create the role "${roleText}".`;
    else if (!/^[a-z0-9._-]{3,40}$/i.test(row.username)) row.error = 'Username must be 3–40 letters, numbers, dots, dashes, or underscores.';
    else if (taken.has(row.username.toLowerCase())) row.error = `Username "${row.username}" is already taken.`;
    else if (password && password.length < 6) row.error = 'Password must be at least 6 characters.';
    if (!row.error) { taken.add(row.username.toLowerCase()); names.add(name.toLowerCase()); }
    return row;
  });
}
function previewBulk() {
  const rows = parseBulk(), ok = rows.filter(r => !r.error).length;
  byId('bulkPreview').classList.toggle('hidden', !rows.length);
  byId('bulkPreview').innerHTML = rows.length ? `<table><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Password</th><th>Check</th></tr></thead><tbody>${rows.map(r => `<tr><td>${safe(r.name)}</td><td>${safe(r.username)}</td><td>${r.role ? roleDisplayName(r.role) : '—'}</td><td>${r.password ? 'as entered' : 'auto'}</td><td class="${r.error ? 'bad' : 'good'}">${r.error ? safe(r.error) : '✓ Ready'}</td></tr>`).join('')}</tbody></table>` : '';
  byId('bulkCreate').disabled = !ok;
  byId('bulkCreate').textContent = ok ? `Create ${ok} ${ok === 1 ? 'account' : 'accounts'}${ok < rows.length ? ` (skip ${rows.length - ok})` : ''}` : 'Create accounts';
}
function openBulkModal() {
  if (currentUser?.role !== 'Administrator') { showToast('Only administrators can create accounts.'); return; }
  byId('bulkText').value = ''; byId('bulkFile').value = ''; byId('bulkResult').classList.add('hidden'); bulkCreated = [];
  byId('bulkRole').innerHTML = creatableRoles().map(role => `<option value="${role}">${roleDisplayName(role)}</option>`).join('');
  previewBulk(); byId('bulkModal').classList.remove('hidden');
}
function closeBulkModal() { byId('bulkModal').classList.add('hidden'); }
function createBulkAccounts() {
  if (currentUser?.role !== 'Administrator') return;
  const rows = parseBulk(), ok = rows.filter(r => !r.error);
  if (!ok.length) return;
  bulkCreated = ok.map(r => ({ name: r.name, username: r.username, role: r.role, password: r.password || tempPassword() }));
  bulkCreated.forEach(a => accounts.push({ ...a, active: true }));
  saveData(); renderAccounts();
  byId('bulkText').value = rows.filter(r => r.error).map(r => r.line).join('\n');
  byId('bulkResultNote').textContent = `${bulkCreated.length} ${bulkCreated.length === 1 ? 'account' : 'accounts'} created. Download the login details now and share them privately; any lines that failed are still in the box above so you can fix them.`;
  byId('bulkCredentials').innerHTML = `<table><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Temporary password</th></tr></thead><tbody>${bulkCreated.map(a => `<tr><td>${safe(a.name)}</td><td>${safe(a.username)}</td><td>${roleDisplayName(a.role)}</td><td><strong>${safe(a.password)}</strong></td></tr>`).join('')}</tbody></table>`;
  byId('bulkResult').classList.remove('hidden');
  previewBulk();
}
function downloadCredentials() { downloadCsv(`classroomed-new-accounts-${dateOffset(0)}.csv`, [['Full name', 'Username', 'Role', 'Temporary password'], ...bulkCreated.map(a => [a.name, a.username, a.role, a.password])]); }
function downloadBulkTemplate() { downloadCsv('classroomed-accounts-template.csv', [['Full name', 'Username', 'Role', 'Password'], ['Maria Reyes', '', 'Faculty', ''], ['Juan Dela Cruz', 'jdelacruz', 'Student', '']]); }
function deleteAccount(username) {
  const account = accountFor(username);
  if (!account || !manageableAccount(account) || currentUser?.role !== 'Administrator') { showToast('You cannot delete this account.'); return; }
  const owned = reservations.filter(item => item.requestor.toLowerCase() === account.name.toLowerCase() && ['Approved', 'Pending Approval'].includes(item.status) && item.date >= localDateKey());
  if (!confirm(`Delete ${account.name}'s account (${account.username})?${owned.length ? ` Their ${owned.length} upcoming reservation${owned.length === 1 ? '' : 's'} will be cancelled.` : ''} This cannot be undone.`)) return;
  owned.forEach(item => Object.assign(item, { status: 'Cancelled', releaseReason: 'The requester’s account was deleted.' }));
  accounts.splice(accounts.indexOf(account), 1);
  for (let i = notifications.length - 1; i >= 0; i--) if (String(notifications[i].to).toLowerCase() === account.name.toLowerCase()) notifications.splice(i, 1);
  saveData(); refreshAll(); renderAccounts();
  showToast(`${account.name}’s account was deleted.`);
}
function toggleAccount(username) {
  const account = accountFor(username);
  if (!account || !manageableAccount(account)) { showToast('You cannot change this account.'); return; }
  account.active = !account.active; saveData(); renderAccounts();
  showToast(`${account.name}'s account is now ${account.active ? 'active' : 'deactivated'}.`);
}

const upcomingInRoom = room => reservations.filter(item => Number(item.roomId) === Number(room.id) && ['Approved', 'Pending Approval'].includes(item.status) && item.date >= localDateKey());
function renderMaintenance() {
  byId('maintenanceBody').innerHTML = rooms.map(room => {
    const under = room.status === 'Maintenance';
    return `<tr><td><strong>${safe(room.name)}</strong></td><td>${safe(room.building)}</td><td><span class="status-badge ${under ? 'maintenance' : 'available'}">${under ? 'Under maintenance' : 'In service'}</span></td><td>${under ? '—' : upcomingInRoom(room).length}</td><td><button class="small-action${under ? '' : ' danger-action'}" onclick="setRoomMaintenance(${room.id}, ${!under})">${under ? 'Mark available' : 'Start maintenance'}</button></td></tr>`;
  }).join('');
}
function setRoomMaintenance(id, on) {
  if (currentUser?.role !== 'Maintenance') { showToast('Only maintenance staff can change a room’s maintenance status.'); return; }
  const room = roomById(id);
  if (!room) return;
  if (on) {
    const affected = upcomingInRoom(room);
    if (affected.length && !confirm(`${affected.length} upcoming reservation${affected.length === 1 ? '' : 's'} in ${room.name} will be cancelled and the requesters notified. Continue?`)) return;
    const groups = new Map();
    affected.forEach(item => { const key = item.seriesId || item.id; groups.set(key, [...(groups.get(key) || []), item]); });
    affected.forEach(item => Object.assign(item, { status: 'Cancelled', releaseReason: `${room.name} is under maintenance.` }));
    groups.forEach(group => notifyCancelled(group, `cancelled because ${room.name} is under maintenance`));
  }
  room.status = on ? 'Maintenance' : 'Available';
  saveData(); refreshAll(); renderMaintenance();
  showToast(`${room.name} is now ${on ? 'under maintenance' : 'available'}.`);
}

function refreshAll() { populateRoomSelects(); refreshDashboard(); renderReservations(); renderCalendar(); renderRooms(); renderReports(); }
function showToast(message) { const toast = byId('toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3800); }

window.addEventListener('DOMContentLoaded', () => {
  byId('loginForm').addEventListener('submit', login);
  byId('reservationForm').addEventListener('submit', submitReservation);
  byId('roomForm').addEventListener('submit', saveRoom);
  byId('accountForm').addEventListener('submit', saveAccount);
  ['resTitle','resRequestor','resRoom','resAttendees','resDate','resStart','resEnd','resUntil'].forEach(id => byId(id).addEventListener('input', validateReservationForm));
  document.querySelectorAll('input[name="equipment"]').forEach(input => input.addEventListener('change', validateReservationForm));
  byId('resRoom').addEventListener('change', validateReservationForm);
  document.querySelectorAll('#availabilitySearch input').forEach(input => input.addEventListener('input', renderRooms));
  ['bulkText', 'bulkRole'].forEach(id => byId(id).addEventListener('input', previewBulk));
  byId('bulkFile').addEventListener('change', async event => { const file = event.target.files[0]; if (file) { byId('bulkText').value = await file.text(); previewBulk(); } });
  byId('resRepeat').addEventListener('change', () => {
    const on = byId('resRepeat').checked, start = byId('resDate').value || dateOffset(1);
    byId('repeatOptions').classList.toggle('hidden', !on);
    if (on) {
      const chips = [...document.querySelectorAll('input[name="repeatDay"]')];
      if (!chips.some(chip => chip.checked)) chips.find(chip => Number(chip.value) === new Date(`${start}T12:00:00`).getDay()).checked = true;
      if (!byId('resUntil').value) { const until = new Date(`${start}T12:00:00`); until.setDate(until.getDate() + 28); byId('resUntil').value = localDateKey(until); }
    }
    validateReservationForm();
  });
  document.querySelectorAll('input[name="repeatDay"]').forEach(chip => chip.addEventListener('change', validateReservationForm));
  byId('roomGrid').addEventListener('click', event => { if (event.target.closest('button')) return; const card = event.target.closest('[data-room]'); if (card) openRoomDrawer(Number(card.dataset.room)); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { document.querySelectorAll('.modal').forEach(modal => modal.classList.add('hidden')); closeRoomDrawer(); } });
  document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) modal.classList.add('hidden'); }));
  populateRoomSelects(); saveData();
  const sessionAccount = currentUser && accountFor(currentUser.username);
  if (sessionAccount?.active) { currentUser = { username: sessionAccount.username, name: sessionAccount.name, role: sessionAccount.role }; enterApp(); }
  else { currentUser = null; localStorage.removeItem(STORAGE.user); }
  window.setInterval(() => { if (!currentUser) return; refreshDashboard(); renderReservations(); }, 60000);
});
