const USERS_KEY = 'hora_users';
const SESSION_KEY = 'hora_session';

function historyKey(email) { return `hora_history_${email}`; }

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch { return {}; }
}

async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw + 'hora_v1'));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Auth ────────────────────────────────────────────────────────

export async function authSignUp(email, password) {
  const users = getUsers();
  const key = email.toLowerCase().trim();
  if (users[key]) throw new Error('An account with this email already exists.');
  if (password.length < 6) throw new Error('Password must be at least 6 characters.');
  const hashed = await hashPassword(password);
  users[key] = { email: key, password: hashed, displayName: '', profile: null };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const session = { email: key, displayName: '' };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { session, profile: null };
}

export async function authSignIn(email, password) {
  const users = getUsers();
  const key = email.toLowerCase().trim();
  const user = users[key];
  if (!user) throw new Error('No account found with this email.');
  const hashed = await hashPassword(password);
  if (hashed !== user.password) throw new Error('Incorrect password. Please try again.');
  const session = { email: key, displayName: user.displayName || '' };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { session, profile: user.profile || null };
}

export function authSignOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

// ── User profile (name, birthday, focus) ────────────────────────

export function saveUserProfile(email, data) {
  const users = getUsers();
  const key = email.toLowerCase().trim();
  if (!users[key]) return;
  users[key].profile = { ...(users[key].profile || {}), ...data };
  if (data.displayName) users[key].displayName = data.displayName;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  // Keep session in sync
  const session = getCurrentUser();
  if (session && session.email === key) {
    if (data.displayName) session.displayName = data.displayName;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function getUserProfile(email) {
  const users = getUsers();
  return users[email.toLowerCase().trim()]?.profile || null;
}

export function updateDisplayName(email, displayName) {
  const name = displayName.trim();
  if (!name) return;
  saveUserProfile(email, { displayName: name });
}

// ── Prediction history ───────────────────────────────────────────

export function getHistory(email) {
  try { return JSON.parse(localStorage.getItem(historyKey(email))) || []; }
  catch { return []; }
}

export function saveRecord(email, record) {
  const list = getHistory(email);
  if (record.type === 'daily') {
    const alreadySaved = list.some(
      r => r.type === 'daily' && r.isoDate === record.isoDate && r.focus === record.focus
    );
    if (alreadySaved) return;
  }
  list.unshift({ ...record, id: Date.now() });
  localStorage.setItem(historyKey(email), JSON.stringify(list.slice(0, 100)));
}
